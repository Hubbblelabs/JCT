import "server-only";
import { deleteFromR2 } from "@/lib/r2";
import { ImageAsset, DocumentAsset } from "@/lib/models";

/**
 * Fire-and-forget cleanup of stored assets referenced by deleted/replaced
 * content. Removes BOTH the R2 object and its tracking row (ImageAsset /
 * DocumentAsset) — deleting only the blob leaves the admin media library
 * full of entries pointing at objects that no longer exist.
 *
 * Never throws and never blocks the caller's response; failures are logged.
 * Callers must already hold an open DB connection (connectDB()).
 */
export function cleanupStorageKeys(
  keys: Iterable<string>,
  context: string,
): void {
  for (const key of keys) {
    // Only act on keys this app generates.
    if (!key.startsWith("images/") && !key.startsWith("documents/")) continue;

    deleteFromR2(key).catch((err) =>
      console.warn(`[${context}] R2 cleanup failed for "${key}":`, err),
    );

    const Model = key.startsWith("images/") ? ImageAsset : DocumentAsset;
    Model.deleteOne({ storage_key: key }).catch((err: unknown) =>
      console.warn(`[${context}] asset row cleanup failed for "${key}":`, err),
    );
  }
}
