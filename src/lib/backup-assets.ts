import { listObjects } from "@/lib/storage";

/**
 * Enumerating the asset half of a backup.
 *
 * This is metadata only — object bytes never pass through here. The backup
 * route streams each object straight from storage into the archive as the client
 * drains it, so the only thing that has to be known up front is *which* keys
 * exist.
 */

export const IMAGE_PREFIX = "images/";
export const DOCUMENT_PREFIX = "documents/";

export interface AssetObject {
  key: string;
  size: number;
}

export interface AssetSource {
  prefix: string;
  /** Storage keys the DB tracks, so a broken row still surfaces in the plan. */
  dbKeys: string[];
}

/**
 * Every storage key worth archiving under a prefix: the union of what storage
 * actually holds and what the DB claims to track. DB-only keys are kept on
 * purpose so a broken row surfaces as an "unreadable" entry in the archive's
 * report rather than vanishing from it.
 */
async function collectObjects(source: AssetSource): Promise<AssetObject[]> {
  const sizes = new Map<string, number>();
  try {
    for (const obj of await listObjects(source.prefix)) {
      // Reserved manifest names are written from the DB, never copied from storage.
      if (obj.key.endsWith("/_metadata.json")) continue;
      sizes.set(obj.key, obj.size);
    }
  } catch (err) {
    console.error(
      `[backup] Could not list storage prefix ${source.prefix}:`,
      err,
    );
  }
  for (const key of source.dbKeys) {
    if (typeof key !== "string" || !key.startsWith(source.prefix)) continue;
    // Size 0 marks a key storage never listed — it streams as unreadable.
    if (!sizes.has(key)) sizes.set(key, 0);
  }
  return [...sizes.entries()]
    .map(([key, size]) => ({ key, size }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** Every object the backup will stream, in a stable order. */
export async function listBackupObjects(
  sources: AssetSource[],
): Promise<AssetObject[]> {
  const all: AssetObject[] = [];
  for (const source of sources) {
    all.push(...(await collectObjects(source)));
  }
  return all;
}
