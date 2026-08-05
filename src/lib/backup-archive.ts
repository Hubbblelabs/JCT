import { Readable, type Writable } from "stream";
import { ZipArchive, type Archiver } from "archiver";
import mongoose from "mongoose";
import type { mongo } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { getR2Bytes, getR2Stream, isR2Configured } from "@/lib/r2";
import { BACKUP_COLLECTIONS, serializeDoc } from "@/lib/backup-collections";
import {
  listBackupObjects,
  type AssetObject,
  type AssetSource,
  IMAGE_PREFIX,
  DOCUMENT_PREFIX,
} from "@/lib/backup-assets";
import type { BackupJobReport } from "@/lib/backup-jobs";

/**
 * Building a backup archive, decoupled from any HTTP response.
 *
 * Nothing here streams to a client — the archive is written to a `Writable`
 * (a file, in practice) with no backpressure from the network. That is the
 * whole point: with no client gating the pace, assets can be fetched from R2
 * many at a time instead of strictly one after another.
 */

/**
 * Objects at or below this size are fetched *to completion* into memory, many
 * at once. Above it they are streamed one at a time when their turn comes.
 *
 * The split exists because an open-but-unread response body is an idle socket.
 * Prefetching by opening streams therefore trades request latency for the risk
 * of a socket timing out before the archive reaches it — which is why the old
 * streaming exporter capped its lookahead at 8 MB and stayed effectively
 * serial. Reading a small object fully frees its socket at once, so buffering
 * is safe to do in parallel; a large object is worth a dedicated turn anyway,
 * since its transfer time dwarfs the request latency being hidden.
 */
const SMALL_ASSET_BYTES = 4 * 1024 * 1024;
/** Concurrent small-object fetches. Below the SDK agent's 50-socket pool. */
const FETCH_CONCURRENCY = 12;
/** Ceiling on buffered-but-not-yet-archived bytes, so memory stays bounded. */
const FETCH_BUDGET_BYTES = 192 * 1024 * 1024;

export interface BackupPlan {
  configs: Array<Record<string, unknown>>;
  images: Array<Record<string, unknown>>;
  docs: Array<Record<string, unknown>>;
  objects: AssetObject[];
  includeImages: boolean;
  includeDocs: boolean;
  assetsUnavailable: boolean;
  assetBytes: number;
}

/**
 * Everything the archive needs, gathered before a single byte is written.
 *
 * Kept separate from the write so the caller can reject an export it cannot
 * complete — no disk space, R2 unreachable — while a real HTTP status code can
 * still be returned.
 */
export async function planBackup(opts: {
  wantImages: boolean;
  wantDocs: boolean;
}): Promise<BackupPlan> {
  const r2 = isR2Configured();
  // Asset inclusion is on by default, so an unconfigured-R2 deployment would
  // hit this on the primary "Download Backup" action. Failing the whole export
  // there leaves the operator with no backup at all, which is strictly worse
  // than a database-only one — so degrade and report instead.
  const assetsUnavailable = (opts.wantImages || opts.wantDocs) && !r2;
  const includeImages = opts.wantImages && r2;
  const includeDocs = opts.wantDocs && r2;

  await connectDB();
  const configs = (await SiteConfig.find()
    .sort({ config_key: 1 })
    .lean()) as unknown as Array<Record<string, unknown>>;

  const sources: AssetSource[] = [];
  let images: Array<Record<string, unknown>> = [];
  let docs: Array<Record<string, unknown>> = [];

  if (includeImages) {
    images = (await ImageAsset.find().lean()) as Array<Record<string, unknown>>;
    sources.push({
      prefix: IMAGE_PREFIX,
      dbKeys: images.map((img) => img.storage_key as string),
    });
  }
  if (includeDocs) {
    docs = (await DocumentAsset.find().lean()) as Array<
      Record<string, unknown>
    >;
    sources.push({
      prefix: DOCUMENT_PREFIX,
      dbKeys: docs.map((doc) => doc.storage_key as string),
    });
  }

  const objects = sources.length > 0 ? await listBackupObjects(sources) : [];

  return {
    configs,
    images,
    docs,
    objects,
    includeImages,
    includeDocs,
    assetsUnavailable,
    assetBytes: objects.reduce((sum, o) => sum + o.size, 0),
  };
}

/** Attach the listener BEFORE appending: archiver processes entries serially,
 * so with one append outstanding the next `entry` event is necessarily ours. */
function appendEntry(
  archive: Archiver,
  source: Readable | Buffer | string,
  name: string,
  store: boolean,
): Promise<void> {
  const done = new Promise<void>((resolve, reject) => {
    const onEntry = () => {
      archive.off("error", onError);
      resolve();
    };
    const onError = (err: Error) => {
      archive.off("entry", onEntry);
      reject(err);
    };
    archive.once("entry", onEntry);
    archive.once("error", onError);
  });
  archive.append(source, { name, store });
  return done;
}

const appendJson = (archive: Archiver, name: string, value: unknown) =>
  appendEntry(archive, JSON.stringify(value, null, 2), name, false);

/**
 * Append a collection as a JSON array WITHOUT buffering it.
 *
 * `find({}).toArray()` plus `JSON.stringify(rows, null, 2)` held the whole
 * collection twice — once as documents, once as an indented string — which,
 * past V8's ~512 MB string cap, throws `RangeError: Invalid string length` and
 * ships a truncated ZIP. `programs` and `pages` carry two Mixed rich-content
 * blobs each, so they are exactly the collections that get there first.
 *
 * Returns the document count, so the manifest (written after this loop) still
 * records it.
 */
async function appendCollection(
  archive: Archiver,
  name: string,
  cursor: mongo.FindCursor<Record<string, unknown>>,
): Promise<number> {
  let count = 0;
  async function* chunks(): AsyncGenerator<string> {
    yield "[";
    for await (const doc of cursor) {
      yield (count === 0 ? "\n" : ",\n") + JSON.stringify(serializeDoc(doc));
      count += 1;
    }
    yield "\n]\n";
  }
  await appendEntry(archive, Readable.from(chunks()), name, false);
  return count;
}

/** A small object read fully into memory, or a large one deferred to its turn. */
type Fetched =
  | { key: string; kind: "buffer"; body: Buffer }
  | { key: string; kind: "deferred" }
  | { key: string; kind: "unreadable" };

async function fetchSmall(
  obj: AssetObject,
  signal?: AbortSignal,
): Promise<Fetched> {
  try {
    return {
      key: obj.key,
      kind: "buffer",
      body: await getR2Bytes(obj.key, signal),
    };
  } catch (err) {
    // A dead storage key must not abort the archive — it is reported instead.
    console.warn(`[backup] Skipping ${obj.key}:`, err);
    return { key: obj.key, kind: "unreadable" };
  }
}

/**
 * Pipe every object into the archive.
 *
 * Small objects are fetched concurrently ahead of the write cursor; large ones
 * are streamed strictly in turn. Entries are still *appended* in plan order —
 * archiver is serial by nature — but the network work that used to happen
 * between appends now overlaps with them, which is where the speed comes from.
 */
async function archiveAssets(
  archive: Archiver,
  objects: AssetObject[],
  signal?: AbortSignal,
): Promise<string[]> {
  const unreadable: string[] = [];
  const queue: Array<Promise<Fetched>> = [];
  let next = 0;
  let queuedBytes = 0;
  const sizeOf = new Map(objects.map((o) => [o.key, o.size]));

  const fill = () => {
    while (queue.length < FETCH_CONCURRENCY && next < objects.length) {
      const obj = objects[next]!;
      const small = obj.size > 0 && obj.size <= SMALL_ASSET_BYTES;
      if (
        small &&
        queue.length > 0 &&
        queuedBytes + obj.size > FETCH_BUDGET_BYTES
      ) {
        break;
      }
      next++;
      if (small) {
        queuedBytes += obj.size;
        queue.push(fetchSmall(obj, signal));
      } else {
        // Large, or a DB-only key R2 never listed (size 0) whose real size is
        // unknown — either way, handled when the write cursor reaches it.
        queue.push(Promise.resolve({ key: obj.key, kind: "deferred" }));
      }
    }
  };

  fill();
  while (queue.length > 0) {
    if (signal?.aborted) break;
    const item = await queue.shift()!;
    if (item.kind === "buffer") queuedBytes -= sizeOf.get(item.key) ?? 0;
    fill();

    if (item.kind === "unreadable") {
      unreadable.push(item.key);
      continue;
    }
    // Stored under the full storage key so restore can rebuild it verbatim.
    // Already-compressed bytes — re-deflating burns CPU for nothing.
    if (item.kind === "buffer") {
      await appendEntry(archive, item.body, item.key, true);
      continue;
    }
    let stream: Readable;
    try {
      stream = await getR2Stream(item.key, signal);
    } catch (err) {
      console.warn(`[backup] Skipping ${item.key}:`, err);
      unreadable.push(item.key);
      continue;
    }
    await appendEntry(archive, stream, item.key, true);
  }
  return unreadable;
}

export interface BuildProgress {
  bytes: number;
  entriesDone: number;
  entriesTotal: number;
}

/**
 * Write the planned archive into `out`. Resolves once the ZIP is complete and
 * flushed; rejects if any part of it could not be written, in which case the
 * caller must discard the partial file rather than serve it.
 */
export async function writeBackupArchive(
  plan: BackupPlan,
  out: Writable,
  meta: { exportedAt: string; exportedBy: string },
  onProgress?: (p: BuildProgress) => void,
  signal?: AbortSignal,
): Promise<BackupJobReport> {
  const archive = new ZipArchive({ zlib: { level: 6 } });

  // Entry total is only an estimate for the progress bar: config + collections
  // + manifest + report + per-asset entries.
  const entriesTotal = plan.objects.length + BACKUP_COLLECTIONS.length + 4;
  if (onProgress) {
    archive.on("entry", () => {
      onProgress({
        bytes: archive.pointer(),
        entriesDone: 0,
        entriesTotal,
      });
    });
    // `entry` fires once per file, which is far too coarse for a multi-gigabyte
    // asset. `progress` fires as source bytes are consumed, so the byte count
    // keeps moving inside a single large entry.
    archive.on("progress", (p: { entries: { processed: number } }) => {
      onProgress({
        bytes: archive.pointer(),
        entriesDone: p.entries.processed,
        entriesTotal,
      });
    });
  }

  const finished = new Promise<void>((resolve, reject) => {
    out.on("error", reject);
    out.on("close", resolve);
    archive.on("error", reject);
    archive.on("warning", (err: Error) => {
      // ENOENT-class warnings are non-fatal by archiver's contract, but an
      // archive that silently lost an entry is exactly what this route must
      // not produce — so they are surfaced, not swallowed.
      console.warn("[backup] archiver warning:", err);
    });
  });
  // `finished` is only awaited at the very end, but it can reject long before
  // that — a disk error during any append rejects it while control is parked on
  // that append's own promise. An unheld rejection is fatal in Node, so mark it
  // handled now. The `await` below still throws: attaching a catch produces a
  // new promise and leaves this one's rejection intact.
  void finished.catch(() => {});
  archive.pipe(out);

  await appendJson(archive, "site-config.json", {
    version: "2.0",
    exported_at: meta.exportedAt,
    exported_by: meta.exportedBy,
    configs: plan.configs.map((doc) => ({
      config_key: doc.config_key,
      value: doc.value,
      published_value: doc.published_value ?? null,
      status: doc.status,
      version: doc.version,
      published_at: doc.published_at ?? null,
    })),
  });

  // Read content collections through the native driver rather than the
  // Mongoose models: `recruiters` still exists as a collection after its model
  // was removed, and a backup must not silently skip it.
  const collectionCounts: Record<string, number> = {};
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connection");
  for (const col of BACKUP_COLLECTIONS) {
    try {
      collectionCounts[col.name] = await appendCollection(
        archive,
        `collections/${col.name}.json`,
        db.collection(col.name).find({}),
      );
    } catch (err) {
      // MUST NOT fall back to an empty array. An archive cannot distinguish
      // "this collection was empty" from "we failed to read it", and a
      // replace-mode restore treats an empty collection file as an instruction
      // to delete every document in that collection. Writing `[]` here would
      // turn a transient read error into silent, total data loss the next time
      // this archive is restored — so the whole archive is aborted instead.
      console.error(`[backup] Could not read collection ${col.name}:`, err);
      throw err;
    }
  }

  // Asset metadata precedes the binaries on purpose: a streaming restore reads
  // entries in order, and needs the media-library rows in hand before the files
  // they describe arrive.
  if (plan.includeImages) {
    await appendJson(
      archive,
      "images/_metadata.json",
      plan.images.map((img) => ({
        filename: img.filename,
        storage_key: img.storage_key,
        alt_text: img.alt_text,
        category: img.category,
        institution: img.institution,
        file_size: img.file_size,
        mime_type: img.mime_type,
        width: img.width,
        height: img.height,
        ratio_type: img.ratio_type,
        aspect_ratio: img.aspect_ratio,
        uploaded_by: img.uploaded_by,
      })),
    );
  }
  if (plan.includeDocs) {
    await appendJson(
      archive,
      "documents/_metadata.json",
      plan.docs.map((doc) => ({
        filename: doc.filename,
        storage_key: doc.storage_key,
        mime_type: doc.mime_type,
        file_size: doc.file_size,
        uploaded_by: doc.uploaded_by,
      })),
    );
  }

  await appendJson(archive, "manifest.json", {
    // 4.1 is the first version in which an empty `collections/<name>.json`
    // reliably means "this collection was empty" rather than possibly "the read
    // failed" — earlier versions wrote `[]` on a read error. Restore uses this
    // to decide whether an empty file may prune a collection in replace mode.
    version: "4.1",
    exported_at: meta.exportedAt,
    exported_by: meta.exportedBy,
    config_entries: plan.configs.length,
    collections: collectionCounts,
    assets: { files: plan.objects.length, bytes: plan.assetBytes },
    // Recorded so a restore operator can tell "this archive has no assets
    // because none were requested" from "because R2 was down".
    assets_unavailable: plan.assetsUnavailable || undefined,
  });

  const unreadable = await archiveAssets(archive, plan.objects, signal);
  if (signal?.aborted) throw new Error("Backup cancelled");

  const report: BackupJobReport = {
    assets_expected: plan.objects.length,
    assets_archived: plan.objects.length - unreadable.length,
    unreadable,
  };

  // Written last because it can only be known last. An operator holding the
  // archive can still tell exactly what did not make it in.
  await appendJson(archive, "_report.json", {
    exported_at: meta.exportedAt,
    ...report,
  });

  await archive.finalize();
  await finished;
  return report;
}
