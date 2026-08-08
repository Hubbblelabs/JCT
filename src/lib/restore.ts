import mongoose from "mongoose";
import type { Readable } from "stream";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { uploadObjectStream, extractStorageKeys } from "@/lib/storage";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";
import {
  backupCollection,
  reviveDoc,
  type PlainDoc,
} from "@/lib/backup-collections";
import {
  isKnownSiteConfigKey,
  SITE_CONFIG_SCHEMAS,
  type SiteConfigKey,
} from "@/lib/validation/siteConfig";
import { RESTORE_SCHEMAS, describeIssues } from "@/lib/validation/restore";
import { revalidateForConfigKey } from "@/lib/revalidate";

/**
 * The write half of a restore, split out of the route so it can be driven one
 * archive entry at a time as the upload streams in.
 */

/** Guards the legacy-key passthrough against junk or injection-shaped keys. */
const SAFE_LEGACY_KEY = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;

/**
 * Ceiling on a JSON manifest, which genuinely has to be parsed whole. Asset
 * binaries have no ceiling — they are piped from the spooled archive straight
 * into a multipart upload and never sit in memory. An earlier 100MB cap applied
 * to assets too, which silently dropped the largest NAAC PDFs from every
 * restore while the backup happily archived them.
 */
export const MAX_JSON_BYTES = 64 * 1024 * 1024;

/**
 * Site config entries. Each is validated against the registry schema, but the
 * ORIGINAL value is stored rather than Zod's output: Zod strips undeclared keys
 * and injects `.default()`s, which made a backup→restore round-trip lossy (it
 * silently dropped fields like `mainNavbar.items[].inMore`). The parse is a
 * safety gate only.
 */
export async function restoreConfigs(
  rawConfigs: unknown[],
  userEmail: string,
): Promise<{ restored: number; skipped: number; warnings: string[] }> {
  const warnings: string[] = [];
  const valid: Array<{
    config_key: string;
    value: unknown;
    published_value: unknown;
    status: string;
    version: number | null;
    published_at: Date | null;
  }> = [];

  /** A backup carries the document's own version; keep it rather than inventing
   * a new one, so a restored install reports the same state it was captured in. */
  const versionOf = (entry: Record<string, unknown>): number | null =>
    typeof entry.version === "number" && Number.isFinite(entry.version)
      ? entry.version
      : null;

  const publishedAtOf = (entry: Record<string, unknown>): Date | null => {
    if (typeof entry.published_at !== "string") return null;
    const d = new Date(entry.published_at);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  for (const item of rawConfigs) {
    if (typeof item !== "object" || item === null) {
      warnings.push("Each config entry must be an object");
      continue;
    }
    const entry = item as Record<string, unknown>;
    const key = entry.config_key as string;

    if (!isKnownSiteConfigKey(key)) {
      // Keys outside the registry are still real stored settings — e.g.
      // `recruitersSection`, which the seed route reads as a migration source.
      // Dropping them made a restore lossy, so carry them across verbatim and
      // report them. Nothing renders them: public reads resolve keys through
      // the registry, and the normal write path still rejects unknowns.
      if (!SAFE_LEGACY_KEY.test(key ?? "")) {
        warnings.push(`Malformed config_key: "${String(key)}" — skipped`);
        continue;
      }
      valid.push({
        config_key: key,
        value: entry.value,
        published_value: entry.published_value ?? entry.value,
        status: entry.status === "published" ? "published" : "draft",
        version: versionOf(entry),
        published_at: publishedAtOf(entry),
      });
      warnings.push(
        `"${key}" is not in the config registry — restored as-is (legacy key)`,
      );
      continue;
    }

    const schema = SITE_CONFIG_SCHEMAS[key];
    const parsed = schema.safeParse(entry.value);
    if (!parsed.success) {
      warnings.push(
        `${key}: ${parsed.error.issues.map((i: { message: string }) => i.message).join(", ")}`,
      );
      continue;
    }

    let publishedValue: unknown = entry.value;
    // A draft-only config exports `published_value: null`; that is expected,
    // not a schema failure, so don't warn about it.
    if (entry.published_value !== undefined && entry.published_value !== null) {
      if (schema.safeParse(entry.published_value).success) {
        publishedValue = entry.published_value;
      } else {
        warnings.push(
          `${key}.published_value: rejected by schema, reverting to draft value`,
        );
      }
    }

    valid.push({
      config_key: key,
      value: entry.value,
      published_value: publishedValue,
      status: entry.status === "published" ? "published" : "draft",
      version: versionOf(entry),
      published_at: publishedAtOf(entry),
    });
  }

  for (const cfg of valid) {
    // The archived version and publish timestamp are restored when the backup
    // carried them; only an archive that lacks them falls back to bumping, so a
    // restored install reports the state it was captured in rather than one
    // revision past it.
    const set: Record<string, unknown> = {
      value: cfg.value,
      published_value: cfg.published_value,
      status: cfg.status,
      updated_by: userEmail,
    };
    if (cfg.version !== null) set.version = cfg.version;
    if (cfg.published_at) set.published_at = cfg.published_at;

    await SiteConfig.findOneAndUpdate(
      { config_key: cfg.config_key },
      cfg.version !== null
        ? { $set: set }
        : { $set: set, $inc: { version: 1 } },
      { upsert: true },
    );
    // Only registry keys have revalidation targets mapped; legacy keys rely on
    // the blanket revalidate the caller runs at the end.
    if (isKnownSiteConfigKey(cfg.config_key)) {
      revalidateForConfigKey(cfg.config_key as SiteConfigKey);
    }
  }

  return {
    restored: valid.length,
    skipped: rawConfigs.length - valid.length,
    warnings,
  };
}

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

/** How a restore treats documents that exist now but aren't in the archive. */
export type RestoreMode = "merge" | "replace";

/**
 * One content collection (programs, placements, pages, …). The collection name
 * arrives from a user-supplied ZIP, so the caller must have matched it against
 * the backup registry before calling — it is never passed to Mongo unchecked.
 *
 * Every document is validated against `RESTORE_SCHEMAS` before it is written —
 * this goes through the native driver, which bypasses Mongoose's own
 * validation entirely. The *original* document is what gets stored, not Zod's
 * parsed output, so the schema is a safety gate only and never strips or
 * defaults fields on the way through (see `RESTORE_SCHEMAS`'s own comment).
 *
 * `mode: "replace"` deletes every document in the collection that this call
 * didn't just write — it is the caller's job to skip that when the restore
 * for this collection didn't run clean, since pruning against a partial
 * `writtenIds` set would delete live data the archive does contain.
 */
export async function restoreCollectionDocs(
  name: string,
  docs: unknown[],
  mode: RestoreMode = "merge",
): Promise<{
  restored: number;
  rejected: number;
  pruned: number;
  errors: string[];
}> {
  const spec = backupCollection(name);
  if (!spec) {
    return {
      restored: 0,
      rejected: 0,
      pruned: 0,
      errors: [`Unknown collection: ${name}`],
    };
  }
  const schema = RESTORE_SCHEMAS[name];
  if (!schema) {
    // A registry entry with no schema would silently fall back to unvalidated
    // writes, which is the bug this guard exists to prevent.
    return {
      restored: 0,
      rejected: 0,
      pruned: 0,
      errors: [`No restore schema registered for ${name}`],
    };
  }

  const db = mongoose.connection.db;
  if (!db) {
    return {
      restored: 0,
      rejected: 0,
      pruned: 0,
      errors: ["No database connection"],
    };
  }
  const col = db.collection(name);

  let restored = 0;
  let rejected = 0;
  const errors: string[] = [];
  const writtenIds: mongoose.Types.ObjectId[] = [];

  for (const raw of docs) {
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
      writtenIds.push(id);
    } catch (err) {
      // A different document already holds this unique value (the archive and
      // the live DB disagree on _id). Update that document in place rather
      // than failing the whole restore.
      if (isDuplicateKeyError(err) && spec.naturalKey.length > 0) {
        const filter: Record<string, unknown> = {};
        for (const field of spec.naturalKey) filter[field] = body[field];
        try {
          // findOneAndReplace rather than replaceOne so the actual landing
          // _id is known — replace mode needs it to avoid pruning the row it
          // just wrote.
          const hit = await col.findOneAndReplace(filter, body, {
            returnDocument: "after",
            projection: { _id: 1 },
          });
          if (hit?._id) {
            restored++;
            writtenIds.push(hit._id as mongoose.Types.ObjectId);
            continue;
          }
        } catch (err2) {
          console.error(`[restore] ${name} fallback:`, err2);
        }
      }
      errors.push(`${name} ${String(doc._id)}: ${String(err)}`);
    }
  }

  let pruned = 0;
  if (mode === "replace" && rejected === 0 && errors.length === 0) {
    // Collect the doomed documents' storage keys BEFORE deleting them.
    // `deleteMany` on the raw driver bypasses every model hook, so without
    // this the pruned documents' images/PDFs (Program.content, Page.content,
    // Event.image + gallery, Placement recruiter logos, Testimonial avatars)
    // stayed in storage and in the media library with nothing referencing them and
    // no UI able to reach them. Note the asymmetry this fixes: `restoreAsset`
    // happily pushes archive bytes back in, so a restore could only ever grow
    // the bucket.
    const doomed = await col
      .find({ _id: { $nin: writtenIds } })
      .toArray()
      .catch((err) => {
        console.warn(`[restore] ${name}: could not read docs to prune:`, err);
        return [] as PlainDoc[];
      });
    const doomedKeys = new Set<string>();
    for (const doc of doomed) extractStorageKeys(doc, doomedKeys);

    const res = await col.deleteMany({ _id: { $nin: writtenIds } });
    pruned = res.deletedCount ?? 0;
    if (pruned > 0) {
      console.warn(
        `[restore] ${name}: replace mode removed ${pruned} document(s) absent from the archive`,
      );
    }
    // cleanupStorageKeys re-checks every key against the surviving documents
    // (this collection included, since the delete has already happened), so a
    // key the restored rows still use is kept.
    if (doomedKeys.size > 0) {
      cleanupStorageKeys(doomedKeys, `restore/${name}`);
    }
  }

  return { restored, rejected, pruned, errors };
}

/**
 * Storage keys come out of a user-supplied ZIP, so they are untrusted input
 * even though only an admin can reach this route. Anything that isn't a plain
 * `images/…` or `documents/…` path is rejected outright — without this, a
 * crafted archive could place objects anywhere in the bucket.
 */
export function isSafeStorageKey(key: unknown): key is string {
  if (typeof key !== "string" || key.length === 0 || key.length > 512) {
    return false;
  }
  if (!key.startsWith("images/") && !key.startsWith("documents/")) return false;
  if (key.includes("..") || key.includes("\\") || key.includes("//")) {
    return false;
  }
  if (key.endsWith("/")) return false;
  // Reserved manifest names are regenerated by the backup route, never uploaded.
  if (key.endsWith("/_metadata.json")) return false;
  return true;
}

/** SVG is never accepted on the normal upload path; don't let restore be a hole. */
function isRejectedType(key: string, mime: string): boolean {
  return mime === "image/svg+xml" || /\.svgz?$/i.test(key);
}

const MIME_BY_EXT: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  avif: "image/avif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
  csv: "text/csv",
};

/**
 * Content-Type has to come from the key's extension when the archive carries no
 * metadata for it. Defaulting by prefix alone would stamp `image/webp` onto
 * every untracked `.jpeg`/`.png`, and storage serves that header straight to
 * browsers.
 */
function mimeForKey(key: string, metaMime: unknown): string {
  if (typeof metaMime === "string" && metaMime.length > 0) return metaMime;
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  if (MIME_BY_EXT[ext]) return MIME_BY_EXT[ext];
  return key.startsWith("images/") ? "image/webp" : "application/octet-stream";
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

// Mirrors the ImageAsset schema enum — an out-of-range value from a
// hand-edited archive would otherwise fail Mongoose validation mid-restore.
const IMAGE_CATEGORIES = [
  "department",
  "faculty",
  "hero",
  "campus",
  "program",
  "recruiter",
  "testimonial",
  "other",
];

function category(v: unknown): string {
  return typeof v === "string" && IMAGE_CATEGORIES.includes(v) ? v : "other";
}

/**
 * Push one asset's bytes back into storage and re-create its tracking row. The bytes
 * arrive as a stream and leave as a multipart upload, so nothing proportional
 * to the file size is ever held. Returns an error string on failure rather than
 * throwing — one bad file must not abandon the rest of the restore.
 */
export async function restoreAsset(
  key: string,
  // A factory, not a stream: the rejection paths below must not leave an opened
  // read stream dangling on a file descriptor nobody drains.
  open: () => Readable,
  size: number,
  meta: Record<string, unknown> | undefined,
  userEmail: string,
): Promise<string | null> {
  if (!isSafeStorageKey(key)) return `${key}: unsafe storage key`;

  const isImage = key.startsWith("images/");
  const mime = mimeForKey(key, meta?.mime_type);
  if (isRejectedType(key, mime)) return `${key}: SVG is not permitted`;

  try {
    const url = await uploadObjectStream(key, open(), mime);

    // No metadata means the archive held a file that never had a tracking row
    // (seeded assets under images/programs/…, images/hod/…). Put the bytes back
    // but don't invent a media-library entry the original install didn't have.
    if (!meta) return null;

    if (isImage) {
      await ImageAsset.findOneAndUpdate(
        { storage_key: key },
        {
          $set: {
            filename: str(meta.filename, key.split("/").pop() ?? key),
            storage_key: key,
            url,
            alt_text: str(meta.alt_text),
            category: category(meta.category),
            institution: str(meta.institution, "all"),
            file_size: num(meta.file_size, size),
            mime_type: mime,
            ...(typeof meta.width === "number" ? { width: meta.width } : {}),
            ...(typeof meta.height === "number" ? { height: meta.height } : {}),
            ...(typeof meta.ratio_type === "string"
              ? { ratio_type: meta.ratio_type }
              : {}),
            ...(typeof meta.aspect_ratio === "string"
              ? { aspect_ratio: meta.aspect_ratio }
              : {}),
            uploaded_by: str(meta.uploaded_by, userEmail),
          },
        },
        { upsert: true },
      );
    } else {
      await DocumentAsset.findOneAndUpdate(
        { storage_key: key },
        {
          $set: {
            filename: str(meta.filename, key.split("/").pop() ?? key),
            storage_key: key,
            url,
            mime_type: mime,
            file_size: num(meta.file_size, size),
            uploaded_by: str(meta.uploaded_by, userEmail),
          },
        },
        { upsert: true },
      );
    }
    return null;
  } catch (err) {
    console.error(`[restore] ${key}:`, err);
    return `${key}: ${String(err)}`;
  }
}

/** Index an archive's `_metadata.json` array by storage key. */
export function indexMetaByKey(
  meta: unknown,
): Record<string, Record<string, unknown>> {
  const map: Record<string, Record<string, unknown>> = {};
  if (!Array.isArray(meta)) return map;
  for (const raw of meta) {
    const m = raw as Record<string, unknown>;
    if (typeof m?.storage_key === "string") map[m.storage_key] = m;
  }
  return map;
}
