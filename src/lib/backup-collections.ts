/**
 * Which Mongo collections a site backup carries, beyond `siteconfigs`.
 *
 * Backups used to cover site config and storage assets only, which silently left out
 * every content collection — placements, programs, testimonials and the rest —
 * so a "full" archive could not actually rebuild the site.
 */
export interface BackupCollection {
  /** Mongo collection name; also the file name under `collections/`. */
  name: string;
  /** Label shown in the admin preview. */
  label: string;
  /**
   * Unique fields other than `_id`. Restore upserts by `_id`, and falls back to
   * this key when a different document already owns the same unique value —
   * without it, restoring into a drifted database dies on E11000.
   */
  naturalKey: string[];
}

export const BACKUP_COLLECTIONS: BackupCollection[] = [
  // Must match Program's unique index, which is {institution, slug} — slug
  // alone stopped being unique when program slugs became per-institution.
  // A slug-only fallback could overwrite Engineering's "computer-science"
  // with Polytechnic's during a restore collision.
  { name: "programs", label: "Programs", naturalKey: ["institution", "slug"] },
  { name: "pages", label: "Pages", naturalKey: ["institution", "slug"] },
  {
    name: "placements",
    label: "Placements",
    naturalKey: ["institution", "year"],
  },
  { name: "testimonials", label: "Testimonials", naturalKey: [] },
  { name: "recruiters", label: "Recruiters", naturalKey: ["name"] },
  { name: "events", label: "Events", naturalKey: ["slug"] },
];

/**
 * Never exported.
 *  - `users` holds bcrypt password hashes; an archive gets downloaded to a
 *    laptop and emailed around, so credentials must not ride along.
 *  - `auditlogs` is an append-only trail with a TTL index — a record of what
 *    happened, not content to reinstate.
 */
export const EXCLUDED_COLLECTIONS = ["users", "auditlogs"] as const;

export function isBackupCollection(name: unknown): name is string {
  return (
    typeof name === "string" && BACKUP_COLLECTIONS.some((c) => c.name === name)
  );
}

export function backupCollection(name: string): BackupCollection | undefined {
  return BACKUP_COLLECTIONS.find((c) => c.name === name);
}

/**
 * Top-level fields stored as BSON dates. JSON has no date type, so these are
 * written as ISO strings and revived on restore — miss one and Mongo ends up
 * holding a string where the schema expects a Date, which breaks sorting and
 * any range query on it.
 */
export const DATE_FIELDS = [
  "created_at",
  "updated_at",
  "published_at",
  "event_date",
] as const;

/** ISO-8601 as produced by `Date.prototype.toISOString`. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** Mongo document shape as it travels through JSON. */
export type PlainDoc = Record<string, unknown>;

/**
 * Mongo document -> JSON-safe object: `_id` becomes a hex string and dates
 * become ISO strings. Only touches the top level; nested content is Mixed and
 * must round-trip byte-for-byte.
 */
export function serializeDoc(doc: PlainDoc): PlainDoc {
  const out: PlainDoc = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key === "_id") {
      out._id = String(value);
    } else if (value instanceof Date) {
      out[key] = value.toISOString();
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Inverse of `serializeDoc`, minus `_id` (the caller needs that separately to
 * build the upsert filter). Only known date fields are revived, so a content
 * string that merely looks like a timestamp is left alone.
 */
export function reviveDoc(doc: PlainDoc): PlainDoc {
  const out: PlainDoc = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key === "_id") continue;
    if (
      (DATE_FIELDS as readonly string[]).includes(key) &&
      typeof value === "string" &&
      ISO_DATE.test(value)
    ) {
      out[key] = new Date(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
