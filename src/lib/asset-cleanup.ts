import "server-only";
import type { Model } from "mongoose";
import { deleteObject, extractStorageKeys } from "@/lib/storage";
import {
  ImageAsset,
  DocumentAsset,
  SiteConfig,
  Program,
  Page,
  Event,
  Blog,
  Placement,
  Testimonial,
} from "@/lib/models";

/**
 * Every collection that can hold an `images/…` or `documents/…` storage key.
 * Scanned before a delete to prove the key really is unreferenced.
 *
 * No projection: rich content lives in Mixed fields under several different
 * names (Program.content, Page.content, Event.gallery, Placement.top_recruiters,
 * …), and a projection that misses one silently reintroduces the bug this scan
 * exists to prevent.
 */
const REFERENCE_MODELS = [
  SiteConfig,
  Program,
  Page,
  Event,
  Blog,
  Placement,
  Testimonial,
] as unknown as Model<unknown>[];

/**
 * Of `candidates`, return the subset some surviving document still references.
 *
 * Runs after the caller's write, so the scan sees post-update state: a key the
 * edit dropped is genuinely absent, while a key another document shares is
 * found and spared. Streams a cursor and stops as soon as every candidate is
 * accounted for, so the common case (nothing shared) is the only full pass.
 */
export async function stillReferencedKeys(
  candidates: Set<string>,
): Promise<Set<string>> {
  const found = new Set<string>();
  for (const model of REFERENCE_MODELS) {
    if (found.size === candidates.size) break;
    const cursor = model.find({}).lean().cursor();
    try {
      for await (const doc of cursor) {
        for (const key of extractStorageKeys(doc)) {
          if (candidates.has(key)) found.add(key);
        }
        if (found.size === candidates.size) break;
      }
    } finally {
      await cursor.close();
    }
  }
  return found;
}

/**
 * Fire-and-forget cleanup of stored assets referenced by deleted/replaced
 * content. Removes BOTH the stored object and its tracking row (ImageAsset /
 * DocumentAsset) — deleting only the blob leaves the admin media library
 * full of entries pointing at objects that no longer exist.
 *
 * A key is only deleted once no surviving document references it. Storage keys
 * are NOT one-to-one with documents: the "Also apply to" control in the Life at
 * JCT editor deliberately writes the same keys under four SiteConfig entries,
 * and any editor can reuse an asset by pasting its key. Without the scan,
 * dropping the asset from one of those references deletes the blob out from
 * under the other three.
 *
 * Call this AFTER the write that removed the reference — the scan reads the
 * database, so a pre-write call would find the key still in use and skip it.
 *
 * Never throws and never blocks the caller's response; failures are logged.
 * Callers must already hold an open DB connection (connectDB()).
 */
export function cleanupStorageKeys(
  keys: Iterable<string>,
  context: string,
): void {
  const candidates = new Set<string>();
  for (const key of keys) {
    // Only act on keys this app generates.
    if (key.startsWith("images/") || key.startsWith("documents/")) {
      candidates.add(key);
    }
  }
  if (candidates.size === 0) return;

  void (async () => {
    let referenced: Set<string>;
    try {
      referenced = await stillReferencedKeys(candidates);
    } catch (err) {
      // Fail closed: an unreadable reference scan means we cannot prove the
      // key is orphaned, and keeping an unused blob is cheaper than deleting
      // one a live page still renders.
      console.warn(
        `[${context}] reference scan failed; skipping cleanup of ${candidates.size} key(s):`,
        err,
      );
      return;
    }

    for (const key of candidates) {
      if (referenced.has(key)) {
        console.info(
          `[${context}] keeping "${key}" — still referenced by other content`,
        );
        continue;
      }

      deleteObject(key).catch((err) =>
        console.warn(`[${context}] storage cleanup failed for "${key}":`, err),
      );

      const Model = key.startsWith("images/") ? ImageAsset : DocumentAsset;
      Model.deleteOne({ storage_key: key }).catch((err: unknown) =>
        console.warn(
          `[${context}] asset row cleanup failed for "${key}":`,
          err,
        ),
      );
    }
  })();
}
