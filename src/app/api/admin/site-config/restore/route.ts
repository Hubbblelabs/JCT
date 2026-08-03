import { NextRequest, NextResponse } from "next/server";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import unzipper from "unzipper";
import { connectDB } from "@/lib/mongodb";
import { requireRole, badRequest } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { isBackupCollection } from "@/lib/backup-collections";
import { revalidateTargets } from "@/lib/revalidate";
import { isR2Configured } from "@/lib/r2";
import {
  restoreConfigs,
  restoreCollectionDocs,
  restoreAsset,
  indexMetaByKey,
  isSafeStorageKey,
  MAX_JSON_BYTES,
} from "@/lib/restore";

/**
 * Restore from a single backup archive.
 *
 * The archive is spooled to a temp file and then read through its **central
 * directory**, not parsed as it arrives. That detail is load-bearing.
 *
 * A streaming parse looked cheaper, but every asset the backup writes is a
 * streamed ZIP entry, and a streamed entry carries a data descriptor: its local
 * header stores zero for the CRC and both sizes. A streaming reader therefore
 * cannot know where an entry ends and falls back to scanning the raw bytes for
 * the `PK\x07\x08` descriptor signature. Asset bytes are high-entropy, so that
 * sequence occurs by chance roughly once per 4 GiB — at which point the file is
 * silently truncated, the parser desynchronises, and every entry after it is
 * lost. On a bucket the size of this one that is the expected outcome, not an
 * edge case. The central directory holds the real sizes, so reading from it
 * removes the guesswork entirely.
 *
 * Memory stays flat regardless: the spool streams to disk, JSON manifests are
 * the only things parsed whole (see `MAX_JSON_BYTES`), and each asset is piped
 * from the archive straight into a multipart upload. The cost is disk — roughly
 * the archive's own size, released in `finally`.
 *
 * The response is NDJSON rather than a single JSON object: a multi-gigabyte
 * restore runs for minutes, and a silent connection is one a reverse proxy will
 * eventually close. Emitting a progress line keeps bytes moving and gives the
 * admin UI something real to show. The final line carries `done`.
 */

/**
 * Sanity backstop on the spooled archive. Not a real limit — it exists so a
 * malformed or hostile upload cannot fill the disk indefinitely.
 */
const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024 * 1024;

/** Emit progress every N assets, and every N bytes while spooling. */
const ASSET_PROGRESS_EVERY = 10;
const SPOOL_PROGRESS_BYTES = 32 * 1024 * 1024;

/**
 * First archive manifest version in which an empty `collections/<name>.json`
 * reliably means the collection really was empty. Earlier archives could
 * write `[]` when a collection read failed during backup, so an empty file
 * from one of those could just as easily mean "the read failed" — and
 * replace mode acting on that would delete every live document in the
 * collection. See the matching comment in the backup route.
 */
const EMPTY_PRUNE_MIN_VERSION = 4.1;

/** Entry surface used here; the shipped types predate the installed version. */
interface CentralEntry {
  path: string;
  type: "File" | "Directory";
  uncompressedSize: number;
  stream(): Readable;
  buffer(): Promise<Buffer>;
}

async function readJson(entry: CentralEntry): Promise<unknown> {
  if (entry.uncompressedSize > MAX_JSON_BYTES) return null;
  try {
    return JSON.parse((await entry.buffer()).toString("utf8"));
  } catch {
    return null;
  }
}

/**
 * Write the request body to a temp file, reporting progress as it lands.
 * Counting happens in a Transform so `pipeline` keeps ownership of
 * backpressure and teardown — the upload is gigabytes and a hand-rolled
 * pause/resume here would be the easiest place to lose bytes.
 */
async function spool(
  body: ReadableStream<Uint8Array>,
  dest: string,
  onProgress: (bytes: number) => void,
): Promise<number> {
  let received = 0;
  let lastReported = 0;

  const count = new Transform({
    transform(chunk: Buffer, _enc, cb) {
      received += chunk.length;
      if (received > MAX_ARCHIVE_BYTES) {
        cb(new Error("Archive exceeds the maximum accepted size"));
        return;
      }
      if (received - lastReported >= SPOOL_PROGRESS_BYTES) {
        lastReported = received;
        onProgress(received);
      }
      cb(null, chunk);
    },
  });

  await pipeline(
    Readable.fromWeb(body as unknown as Parameters<typeof Readable.fromWeb>[0]),
    count,
    createWriteStream(dest),
  );
  return received;
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;
  if (!req.body)
    return badRequest("Expected a ZIP archive as the request body");

  await connectDB();

  const mode = req.nextUrl.searchParams.get("mode") === "replace" ? "replace" : "merge";
  const userEmail = session!.user?.email ?? "";
  const encoder = new TextEncoder();
  const reqBody = req.body;

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      const warnings: string[] = [];
      let configsRestored = 0;
      let collectionDocs = 0;
      let assetsRestored = 0;

      let dir: string | null = null;
      try {
        dir = await mkdtemp(path.join(tmpdir(), "jct-restore-"));
        const archivePath = path.join(dir, "backup.zip");

        emit({ stage: "upload", bytes: 0 });
        const received = await spool(reqBody, archivePath, (bytes) =>
          emit({ stage: "upload", bytes }),
        );
        emit({ stage: "upload", bytes: received, complete: true });

        const central = (await unzipper.Open.file(archivePath)) as unknown as {
          files: CentralEntry[];
        };
        const files = central.files.filter((f) => f.type !== "Directory");

        // Entries are dispatched by name rather than in archive order, so a
        // reordered or hand-built archive still restores correctly — asset
        // metadata in particular must be in hand before the binaries it
        // describes.
        const byPath = new Map(files.map((f) => [f.path, f]));

        const configEntry = byPath.get("site-config.json");
        if (!configEntry) {
          emit({
            done: true,
            error: "Invalid backup — the archive has no site-config.json",
          });
          return;
        }
        const parsedConfig = (await readJson(configEntry)) as {
          configs?: unknown[];
        } | null;
        if (!Array.isArray(parsedConfig?.configs)) {
          emit({
            done: true,
            error: "Invalid backup — site-config.json has no configs array",
          });
          return;
        }
        const configResult = await restoreConfigs(
          parsedConfig.configs,
          userEmail,
        );
        configsRestored = configResult.restored;
        warnings.push(...configResult.warnings);
        emit({ stage: "config", restored: configsRestored });

        const manifestEntry = byPath.get("manifest.json");
        const manifest = manifestEntry
          ? ((await readJson(manifestEntry)) as { version?: unknown } | null)
          : null;
        const archiveVersion = Number.parseFloat(String(manifest?.version ?? ""));
        const canPruneEmpty =
          Number.isFinite(archiveVersion) &&
          archiveVersion >= EMPTY_PRUNE_MIN_VERSION;

        let collectionsRejected = 0;
        let collectionsPruned = 0;
        for (const entry of files) {
          if (
            !entry.path.startsWith("collections/") ||
            !entry.path.endsWith(".json")
          ) {
            continue;
          }
          const name = entry.path.slice("collections/".length, -".json".length);
          if (!isBackupCollection(name)) continue;
          const docs = await readJson(entry);
          if (!Array.isArray(docs)) continue;
          if (docs.length === 0 && mode !== "replace") continue;
          // An empty archive file in replace mode means "delete everything in
          // this collection" — only trust that from an archive new enough to
          // guarantee an empty file isn't a swallowed read error.
          if (docs.length === 0 && mode === "replace" && !canPruneEmpty) {
            warnings.push(
              `${name}: kept existing documents — this archive (format ${archiveVersion || "unknown"}) records the collection as empty, but archives before ${EMPTY_PRUNE_MIN_VERSION} also wrote an empty file when the backup could not read the collection. Refusing to delete on that basis.`,
            );
            continue;
          }
          const result = await restoreCollectionDocs(name, docs, mode);
          collectionDocs += result.restored;
          collectionsRejected += result.rejected;
          collectionsPruned += result.pruned;
          warnings.push(...result.errors);
          emit({
            stage: "collection",
            name,
            restored: result.restored,
            rejected: result.rejected,
            pruned: result.pruned,
          });
        }

        const imageMetaEntry = byPath.get("images/_metadata.json");
        const docMetaEntry = byPath.get("documents/_metadata.json");
        const imageMeta = imageMetaEntry
          ? indexMetaByKey(await readJson(imageMetaEntry))
          : {};
        const docMeta = docMetaEntry
          ? indexMetaByKey(await readJson(docMetaEntry))
          : {};

        const assets = files.filter((f) => isSafeStorageKey(f.path));
        // R2 is checked lazily: an archive with no assets restores fine
        // without storage configured.
        if (assets.length > 0 && !isR2Configured()) {
          warnings.push(
            `${assets.length} asset file(s) skipped — R2 storage is not configured`,
          );
        } else {
          for (const entry of assets) {
            const meta = entry.path.startsWith("images/")
              ? imageMeta[entry.path]
              : docMeta[entry.path];
            const err = await restoreAsset(
              entry.path,
              () => entry.stream(),
              entry.uncompressedSize,
              meta,
              userEmail,
            );
            if (err) {
              warnings.push(err);
              continue;
            }
            assetsRestored++;
            if (assetsRestored % ASSET_PROGRESS_EVERY === 0) {
              emit({
                stage: "assets",
                restored: assetsRestored,
                total: assets.length,
              });
            }
          }
        }

        revalidateTargets("home", "all-institutions");
        await logAudit(
          "site-config",
          "restored",
          userEmail,
          `Restored backup: ${configsRestored} configs, ${collectionDocs} content documents, ${assetsRestored} asset files`,
        );

        emit({
          done: true,
          configs: configsRestored,
          skipped: configResult.skipped,
          collections: collectionDocs,
          rejected: collectionsRejected,
          pruned: collectionsPruned,
          assets: assetsRestored,
          warnings,
        });
      } catch (e) {
        console.error("[site-config/restore]", e);
        // The common failure is the client hanging up mid-upload, which also
        // tears down this response — enqueueing onto it would throw a second,
        // less useful error over the first.
        try {
          emit({
            done: true,
            error: "Restore failed while reading the archive",
            // Whatever landed before the failure stays applied; say so rather
            // than letting the operator assume nothing changed.
            partial: {
              configs: configsRestored,
              collections: collectionDocs,
              assets: assetsRestored,
            },
            warnings,
          });
        } catch {
          // Response already gone; the console.error above is the record.
        }
      } finally {
        if (dir) {
          await rm(dir, { recursive: true, force: true }).catch((err) =>
            console.error("[site-config/restore] temp cleanup:", err),
          );
        }
        try {
          controller.close();
        } catch {
          // Already closed by the client disconnecting.
        }
      }
    },
  });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
