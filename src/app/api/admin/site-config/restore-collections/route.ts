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
 * through to Mongo unchecked.
 */
export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  let payload: { collection?: unknown; docs?: unknown };
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

  const spec = backupCollection(name)!;

  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) return serverError("No database connection");
    const col = db.collection(name);

    let restored = 0;
    const errors: string[] = [];

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

      try {
        await col.replaceOne({ _id: id }, body, { upsert: true });
        restored++;
      } catch (err) {
        // A different document already holds this unique value (the archive
        // and the live DB disagree on _id). Update that document in place
        // instead of failing the whole restore.
        if (isDuplicateKeyError(err) && spec.naturalKey.length > 0) {
          const filter: Record<string, unknown> = {};
          for (const field of spec.naturalKey) filter[field] = body[field];
          try {
            const res = await col.replaceOne(filter, body);
            if (res.matchedCount > 0) {
              restored++;
              continue;
            }
          } catch (err2) {
            console.error(`[restore-collections] ${name} fallback:`, err2);
          }
        }
        errors.push(`${name} ${String(doc._id)}: ${String(err)}`);
      }
    }

    revalidateTargets("home", "all-institutions");

    return json({
      collection: name,
      restored,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error("[site-config/restore-collections]", e);
    return serverError();
  }
}
