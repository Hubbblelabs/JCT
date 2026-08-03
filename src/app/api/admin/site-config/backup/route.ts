import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { ZipArchive, type Archiver } from "archiver";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, serverError, badRequest } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";
import { getR2Stream, isR2Configured } from "@/lib/r2";
import { BACKUP_COLLECTIONS, serializeDoc } from "@/lib/backup-collections";
import {
  listBackupObjects,
  type AssetObject,
  type AssetSource,
  IMAGE_PREFIX,
  DOCUMENT_PREFIX,
} from "@/lib/backup-assets";

/**
 * A whole backup — site config, content collections, and every asset byte — as
 * one streamed ZIP.
 *
 * Nothing is buffered. Entries are appended to a live archive that is already
 * being written to the response socket, and each R2 object is piped straight
 * through as the client drains it. Server memory stays flat at a few MB no
 * matter how large the bucket is, which is what makes a multi-gigabyte archive
 * possible at all: the earlier implementation built the entire ZIP as a Buffer
 * first and died on memory long before it ever produced a file.
 *
 * The response has no Content-Length — the size is unknowable until the last
 * byte — so it travels chunked. The browser's own download manager writes it to
 * disk incrementally; the client must NOT read it via `response.blob()`, which
 * would re-create the same problem in the tab's heap.
 */

/**
 * How many R2 objects to open ahead of the one being archived. Prefetching
 * hides per-object request latency, which otherwise dominates a bucket of many
 * small files — but a prefetched stream is an *open socket waiting to be read*,
 * and the archive only advances as fast as the client drains it. Queue a large
 * object and its socket can sit idle for minutes on a slow link and time out
 * mid-append, which destroys the archive.
 *
 * So the queue is bounded by bytes as well as count: only small objects are
 * opened ahead, and anything large is fetched strictly when its turn comes.
 */
const ASSET_PREFETCH = 4;
const ASSET_PREFETCH_BYTES = 8 * 1024 * 1024;

/** Attach the listener BEFORE appending: archiver processes entries serially,
 * so with one append outstanding the next `entry` event is necessarily ours. */
function appendEntry(
  archive: Archiver,
  source: Readable | string,
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

type OpenedAsset =
  { key: string; stream: Readable } | { key: string; stream: null };

async function openAsset(
  key: string,
  signal?: AbortSignal,
): Promise<OpenedAsset> {
  try {
    return { key, stream: await getR2Stream(key, signal) };
  } catch (err) {
    // A dead storage key must not abort the archive — it is reported instead.
    console.warn(`[backup] Skipping ${key}:`, err);
    return { key, stream: null };
  }
}

/** Pipe every object into the archive, at most one in flight, a few queued. */
async function streamAssets(
  archive: Archiver,
  objects: AssetObject[],
  signal?: AbortSignal,
): Promise<string[]> {
  const unreadable: string[] = [];
  const queue: Array<Promise<OpenedAsset>> = [];
  let next = 0;
  let queuedBytes = 0;

  const fill = () => {
    while (queue.length < ASSET_PREFETCH && next < objects.length) {
      const obj = objects[next]!;
      // Never open a large object early — see ASSET_PREFETCH_BYTES. The first
      // slot is exempt so the loop always has something to work on.
      if (queue.length > 0 && queuedBytes + obj.size > ASSET_PREFETCH_BYTES) {
        break;
      }
      next++;
      queuedBytes += obj.size;
      queue.push(openAsset(obj.key, signal));
    }
  };
  const sizeOf = new Map(objects.map((o) => [o.key, o.size]));

  fill();
  while (queue.length > 0) {
    const asset = await queue.shift()!;
    queuedBytes -= sizeOf.get(asset.key) ?? 0;
    fill();
    if (!asset.stream) {
      unreadable.push(asset.key);
      continue;
    }
    // Stored under the full storage key so restore can rebuild it verbatim.
    // Already-compressed bytes — re-deflating burns CPU for nothing.
    await appendEntry(archive, asset.stream, asset.key, true);
  }
  return unreadable;
}

/**
 * The client probes before navigating, so the object listing would otherwise be
 * walked twice per export — 1,700+ objects across paginated LIST calls. The
 * probe's result is parked here for the download that immediately follows.
 * Single-instance assumption, same as the public API cache.
 */
const listingCache = new Map<string, { at: number; objects: AssetObject[] }>();
const LISTING_TTL_MS = 60_000;

async function listWithCache(
  cacheKey: string,
  sources: AssetSource[],
): Promise<AssetObject[]> {
  const hit = listingCache.get(cacheKey);
  if (hit && Date.now() - hit.at < LISTING_TTL_MS) return hit.objects;

  const objects = await listBackupObjects(sources);
  listingCache.clear();
  listingCache.set(cacheKey, { at: Date.now(), objects });
  return objects;
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const url = new URL(req.url);
  const includeImages = url.searchParams.get("includeImages") === "1";
  const includeDocs = url.searchParams.get("includeDocs") === "1";

  if ((includeImages || includeDocs) && !isR2Configured()) {
    return badRequest(
      "R2 storage is not configured — cannot include images or documents in backup",
    );
  }

  // Everything that can fail with a real status code happens before the first
  // byte ships. Once the archive is streaming, the status is already 200 and a
  // later failure can only be reported inside the archive itself.
  let configs: Awaited<ReturnType<typeof SiteConfig.find>>;
  let objects: AssetObject[] = [];
  let images: Array<Record<string, unknown>> = [];
  let docs: Array<Record<string, unknown>> = [];
  try {
    await connectDB();
    configs = await SiteConfig.find().sort({ config_key: 1 }).lean();

    const sources: AssetSource[] = [];
    if (includeImages) {
      images = (await ImageAsset.find().lean()) as Array<
        Record<string, unknown>
      >;
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
    if (sources.length > 0) {
      objects = await listWithCache(
        `${includeImages ? "i" : ""}${includeDocs ? "d" : ""}`,
        sources,
      );
    }
  } catch (e) {
    console.error("[site-config/backup]", e);
    return serverError();
  }

  // The download itself is a plain browser navigation, which cannot surface an
  // error banner — a failed request would just replace the page with JSON. So
  // the client asks for the same work up front and only navigates once it knows
  // the export will succeed.
  if (url.searchParams.get("probe") === "1") {
    return NextResponse.json({
      config_entries: configs.length,
      asset_files: objects.length,
      asset_bytes: objects.reduce((sum, o) => sum + o.size, 0),
    });
  }

  const exportedAt = new Date().toISOString();
  const exportedBy = session!.user?.email ?? "";
  const archive = new ZipArchive({ zlib: { level: 6 } });

  // Without a listener an archiver error is an unhandled 'error' event, which
  // takes the process down rather than just the response.
  archive.on("error", (err: Error) => {
    console.error("[site-config/backup] archive stream:", err);
    archive.destroy();
  });
  // A cancelled download must stop the R2 reads behind it.
  req.signal.addEventListener("abort", () => archive.destroy());

  void (async () => {
    try {
      await appendJson(archive, "site-config.json", {
        version: "2.0",
        exported_at: exportedAt,
        exported_by: exportedBy,
        configs: configs.map((doc) => ({
          config_key: doc.config_key,
          value: doc.value,
          published_value: doc.published_value ?? null,
          status: doc.status,
          version: doc.version,
          published_at: doc.published_at ?? null,
        })),
      });

      // Read content collections through the native driver rather than the
      // Mongoose models: `recruiters` still exists as a collection after its
      // model was removed, and a backup must not silently skip it.
      const collectionCounts: Record<string, number> = {};
      const db = mongoose.connection.db;
      for (const col of BACKUP_COLLECTIONS) {
        let rows: Record<string, unknown>[] = [];
        try {
          rows = db ? await db.collection(col.name).find({}).toArray() : [];
        } catch (err) {
          console.warn(`[backup] Could not read collection ${col.name}:`, err);
        }
        collectionCounts[col.name] = rows.length;
        await appendJson(
          archive,
          `collections/${col.name}.json`,
          rows.map(serializeDoc),
        );
      }

      // Asset metadata precedes the binaries on purpose: a streaming restore
      // reads entries in order, and needs the media-library rows in hand before
      // the files they describe arrive.
      if (includeImages) {
        await appendJson(
          archive,
          "images/_metadata.json",
          images.map((img) => ({
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
      if (includeDocs) {
        await appendJson(
          archive,
          "documents/_metadata.json",
          docs.map((doc) => ({
            filename: doc.filename,
            storage_key: doc.storage_key,
            mime_type: doc.mime_type,
            file_size: doc.file_size,
            uploaded_by: doc.uploaded_by,
          })),
        );
      }

      await appendJson(archive, "manifest.json", {
        version: "4.0",
        exported_at: exportedAt,
        exported_by: exportedBy,
        config_entries: configs.length,
        collections: collectionCounts,
        assets: {
          files: objects.length,
          bytes: objects.reduce((sum, o) => sum + o.size, 0),
        },
      });

      const unreadable = await streamAssets(archive, objects, req.signal);

      // Written last because it can only be known last. An operator holding the
      // archive can still tell exactly what did not make it in.
      await appendJson(archive, "_report.json", {
        exported_at: exportedAt,
        assets_expected: objects.length,
        assets_archived: objects.length - unreadable.length,
        unreadable,
      });

      await archive.finalize();
    } catch (err) {
      console.error("[site-config/backup] while streaming:", err);
      archive.destroy();
    }
  })();

  await logAudit(
    "site-config",
    "exported",
    exportedBy,
    `Started backup export: ${configs.length} config entries, ${objects.length} asset files`,
  );

  const filename = `jct-backup-${exportedAt.slice(0, 10)}.zip`;
  return new NextResponse(
    Readable.toWeb(archive) as unknown as ReadableStream<Uint8Array>,
    {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        // Tell nginx not to buffer the response; buffering would reintroduce
        // the whole-archive-in-memory problem one hop further out.
        "X-Accel-Buffering": "no",
      },
    },
  );
}
