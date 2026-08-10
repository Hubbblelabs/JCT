import "server-only";
import type { Model } from "mongoose";
import {
  ImageAsset,
  DocumentAsset,
  Program,
  Page,
  Event,
  Placement,
  Testimonial,
} from "@/lib/models";
import { deleteObject, listObjects, isStorageConfigured } from "@/lib/storage";
import { IMAGE_PREFIX, DOCUMENT_PREFIX } from "@/lib/backup-assets";
import { stillReferencedKeys } from "@/lib/asset-cleanup";

/**
 * The destructive half of `POST /api/admin/site-config/reset`.
 *
 * Split out of the route because the asset sweep is the part with the
 * invariants worth stating in one place: the bucket is the source of truth for
 * what storage holds, and a tracking row may only be deleted once its object
 * is provably gone.
 */

/**
 * Collections a content reset removes. `User` and `AuditLog` are deliberately
 * absent — wiping users would lock the admin out of the panel they just used,
 * and the audit trail is a record of what happened, including this reset.
 */
const RESET_CONTENT_MODELS: Array<{ name: string; model: Model<unknown> }> = (
  [
    ["programs", Program],
    ["pages", Page],
    ["events", Event],
    ["placements", Placement],
    ["testimonials", Testimonial],
  ] as const
).map(([name, model]) => ({
  name,
  model: model as unknown as Model<unknown>,
}));

/**
 * Deletes issued at once. Storage deletes are latency-bound round trips, and a
 * reset on this site issues over a thousand of them — strictly serial, that is
 * a thousand sequential RTTs for work the store handles concurrently without
 * complaint.
 */
const DELETE_CONCURRENCY = 16;

/**
 * Keys per `$in`. The query document is capped at 16 MB, so a single
 * `deleteMany` over every key stops working at a bucket size this site will
 * plausibly reach.
 */
const ID_CHUNK = 500;

export interface AssetSweepReport {
  /** False when no object store is configured; the sweep then does nothing. */
  storage_configured: boolean;
  /**
   * Whether the bucket could be enumerated. False means the sweep fell back to
   * the tracked keys alone and untracked objects were not reclaimed this run.
   */
  storage_listed: boolean;
  objects_deleted: number;
  /** Of `objects_deleted`, those the database had no tracking row for. */
  untracked_deleted: number;
  objects_failed: number;
  rows_deleted: number;
  assets_kept: number;
}

export interface ResetReport {
  configs: number;
  /** Per-collection delete counts, or null when content was not reset. */
  content: Record<string, number> | null;
  assets: AssetSweepReport;
}

/** Run `fn` over `items` with at most `limit` in flight. */
async function eachLimit<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      for (let i = cursor++; i < items.length; i = cursor++) {
        await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
}

/** Delete every content document a reset covers, newest concern first. */
export async function wipeContent(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const { name, model } of RESET_CONTENT_MODELS) {
    const res = await model.deleteMany({});
    out[name] = res.deletedCount ?? 0;
  }
  return out;
}

/**
 * Reclaim stored objects and their tracking rows.
 *
 * Call this AFTER every delete the reset performs — the reference scan reads
 * the database, so a document deleted afterwards would still be found holding
 * its keys and spare them.
 *
 * With `purgeAll`, the reference scan is skipped and everything under
 * `images/` and `documents/` goes. That is only safe when the content that
 * referenced those keys is being deleted in the same reset; the caller owns
 * that decision, and the Settings page spells the consequence out.
 */
export async function sweepAssets(opts: {
  purgeAll: boolean;
}): Promise<AssetSweepReport> {
  const report: AssetSweepReport = {
    storage_configured: isStorageConfigured(),
    storage_listed: false,
    objects_deleted: 0,
    untracked_deleted: 0,
    objects_failed: 0,
    rows_deleted: 0,
    assets_kept: 0,
  };

  const [imageRows, docRows] = await Promise.all([
    ImageAsset.find().select("storage_key").lean(),
    DocumentAsset.find().select("storage_key").lean(),
  ]);
  const rowKeys = new Set<string>(
    [...imageRows, ...docRows]
      .map((r) => (r as { storage_key?: unknown }).storage_key)
      .filter((k): k is string => typeof k === "string" && k.length > 0),
  );

  if (!report.storage_configured) {
    // Dropping the rows here would strand every object: nothing in this process
    // can reach a store it has no configuration for, and the row is the only
    // record that the object exists at all. Keep both, and report why.
    report.assets_kept = rowKeys.size;
    return report;
  }

  /**
   * The bucket — not `imageassets`/`documentassets` — is what actually holds
   * objects, and the two drift. Untracked objects arrive by three routes that
   * all exist today: files seeded or uploaded by hand, `restoreAsset` putting
   * an archive entry's bytes back when it carried no metadata row, and a
   * presigned PUT whose `/api/admin/documents/confirm` never landed (the
   * object is in the bucket before confirm can reject it). Enumerating only
   * the database left every one of those in storage permanently — invisible to
   * this route, and to every reset after it.
   */
  let bucketKeys: Set<string> | null = null;
  try {
    const listed = await Promise.all([
      listObjects(IMAGE_PREFIX),
      listObjects(DOCUMENT_PREFIX),
    ]);
    bucketKeys = new Set(listed.flat().map((o) => o.key));
    report.storage_listed = true;
  } catch (err) {
    console.warn(
      "[reset] could not enumerate the bucket; falling back to tracked keys only:",
      err,
    );
  }

  const candidates = new Set<string>(rowKeys);
  if (bucketKeys) for (const key of bucketKeys) candidates.add(key);

  const referenced = opts.purgeAll
    ? new Set<string>()
    : await stillReferencedKeys(candidates);
  report.assets_kept = referenced.size;

  const deletable = [...candidates].filter((key) => !referenced.has(key));
  /** Keys whose object is provably gone — the only rows safe to delete. */
  const removed: string[] = [];

  await eachLimit(deletable, DELETE_CONCURRENCY, async (key) => {
    // A tracked key the bucket never listed is a dead row: there is no object
    // to delete, and the row itself is the thing to clean up.
    if (bucketKeys && !bucketKeys.has(key)) {
      removed.push(key);
      return;
    }
    try {
      await deleteObject(key);
      report.objects_deleted++;
      if (!rowKeys.has(key)) report.untracked_deleted++;
      removed.push(key);
    } catch (err) {
      /**
       * Keep the tracking row. Deleting it on a failed object delete is what
       * turned every transient storage error into a permanently orphaned
       * object: the row was the only thing that would have brought the key
       * back into a later sweep, and without it the object is unreachable
       * from the database forever. Now the key survives to be retried.
       */
      console.warn(`[reset] storage delete failed for ${key}:`, err);
      report.objects_failed++;
    }
  });

  const removedRows = removed.filter((key) => rowKeys.has(key));
  for (let i = 0; i < removedRows.length; i += ID_CHUNK) {
    const chunk = removedRows.slice(i, i + ID_CHUNK);
    const [img, doc] = await Promise.all([
      ImageAsset.deleteMany({ storage_key: { $in: chunk } }),
      DocumentAsset.deleteMany({ storage_key: { $in: chunk } }),
    ]);
    report.rows_deleted += (img.deletedCount ?? 0) + (doc.deletedCount ?? 0);
  }

  return report;
}
