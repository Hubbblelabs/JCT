import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import {
  backupCollection,
  isBackupCollection,
  reviveDoc,
  type PlainDoc,
} from "@/lib/backup-collections";
import { RESTORE_SCHEMAS, describeIssues } from "@/lib/validation/restore";
import { revalidateTargets } from "@/lib/revalidate";

export const maxDuration = 120;

/** Mongo's duplicate-key error. */
const DUPLICATE_KEY = 11000;

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === DUPLICATE_KEY
  );
}

function toObjectId(value: unknown): mongoose.Types.ObjectId | null {
  if (typeof value !== "string") return null;
  return mongoose.Types.ObjectId.isValid(value)
    ? new mongoose.Types.ObjectId(value)
    : null;
}

/**
 * Restores content collections (programs, placements, pages, …) from a backup
 * archive. The client sends one chunk per request because the full content set
 * runs past a reverse proxy's default body limit.
 *
 * Only collections named in the backup registry are writable here — the
 * collection name arrives from a user-supplied ZIP, so it is never passed
 * through to Mongo unchecked. Every document is validated against its schema
 * before it is written (see `RESTORE_SCHEMAS`); the native driver bypasses
 * Mongoose, so without that check a drifted archive silently corrupts data.
 *
 * `pruneToIds` implements **replace** mode. Upserts alone never remove
 * anything, so a plain restore is an additive merge: documents created after
 * the backup survive it, and the post-restore database does not match the
 * archive — which is exactly wrong for the likeliest use case (undoing a bad
 * import). The client sends the full `_id` list for the collection on the final
 * chunk, and everything outside it is deleted. Sending it per-chunk would
 * delete the documents carried by the other chunks, so it must arrive once,
 * last, and after every chunk has been written.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  let payload: { collection?: unknown; docs?: unknown; pruneToIds?: unknown };
  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return badRequest("Invalid request body");
  }

  const name = payload.collection;
  if (!isBackupCollection(name)) {
    return badRequest(`Unknown collection: ${String(name)}`);
  }
  if (!Array.isArray(payload.docs)) {
    return badRequest("Missing docs array");
  }
  if (payload.pruneToIds !== undefined && !Array.isArray(payload.pruneToIds)) {
    return badRequest("pruneToIds must be an array");
  }

  const spec = backupCollection(name)!;
  const schema = RESTORE_SCHEMAS[name];
  if (!schema) {
    // A registry entry with no schema would silently fall back to the old
    // unvalidated behaviour, which is the bug this guard exists to prevent.
    return serverError(`No restore schema registered for ${name}`);
  }

  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) return serverError("No database connection");
    const col = db.collection(name);

    let restored = 0;
    let rejected = 0;
    const errors: string[] = [];
    // The `_id` each document actually landed on. Usually the archive's, but
    // the natural-key fallback below writes to whichever document already owns
    // the unique value. Replace mode prunes against these, not against the
    // archive's ids — otherwise it would delete the very rows it just restored.
    const writtenIds: string[] = [];

    for (const raw of payload.docs as unknown[]) {
      if (typeof raw !== "object" || raw === null) {
        errors.push(`${name}: entry is not an object`);
        continue;
      }
      const doc = raw as PlainDoc;
      const id = toObjectId(doc._id);
      if (!id) {
        errors.push(`${name}: entry has no valid _id`);
        continue;
      }
      const body = reviveDoc(doc);

      // Validate before writing, and discard the parsed output — the original
      // document is what gets stored, so Zod can't strip or default-inject
      // fields on the way through.
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        rejected++;
        errors.push(
          `${name} ${String(doc._id)}: rejected — ${describeIssues(parsed.error)}`,
        );
        continue;
      }

      try {
        await col.replaceOne({ _id: id }, body, { upsert: true });
        restored++;
        writtenIds.push(String(id));
      } catch (err) {
        // A different document already holds this unique value (the archive
        // and the live DB disagree on _id). Update that document in place
        // instead of failing the whole restore.
        if (isDuplicateKeyError(err) && spec.naturalKey.length > 0) {
          const filter: Record<string, unknown> = {};
          for (const field of spec.naturalKey) filter[field] = body[field];
          try {
            // findOneAndReplace rather than replaceOne so we learn which _id
            // the content actually landed on — replace mode needs it.
            const hit = await col.findOneAndReplace(filter, body, {
              returnDocument: "after",
              projection: { _id: 1 },
            });
            if (hit?._id) {
              restored++;
              writtenIds.push(String(hit._id));
              continue;
            }
          } catch (err2) {
            console.error(`[restore-collections] ${name} fallback:`, err2);
          }
        }
        errors.push(`${name} ${String(doc._id)}: ${String(err)}`);
      }
    }

    // Replace mode: drop anything the archive didn't put back. Runs only on
    // the final call for this collection, where `pruneToIds` is every id the
    // earlier chunks reported writing — plus this chunk's own.
    let pruned = 0;
    if (Array.isArray(payload.pruneToIds)) {
      const keep = [...(payload.pruneToIds as unknown[]), ...writtenIds]
        .map(toObjectId)
        .filter((v): v is mongoose.Types.ObjectId => v !== null);
      const res = await col.deleteMany({ _id: { $nin: keep } });
      pruned = res.deletedCount ?? 0;
      if (pruned > 0) {
        console.warn(
          `[restore-collections] ${name}: replace mode removed ${pruned} document(s) absent from the archive`,
        );
      }
    }

    revalidateTargets("home", "all-institutions");

    return json({
      collection: name,
      restored,
      rejected,
      pruned,
      writtenIds,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error("[site-config/restore-collections]", e);
    return serverError();
  }
}
