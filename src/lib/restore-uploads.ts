import { createWriteStream } from "fs";
import { mkdir, readdir, rm, stat, truncate } from "fs/promises";
import { createHash, randomUUID } from "crypto";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

import { backupDir, freeBytes } from "@/lib/backup-jobs";

/**
 * Resumable staging for the restore archive.
 *
 * The archive is currently ~7.5 GB, which a browser on a typical uplink pushes
 * in well over an hour. Sending it as one request body means one TCP connection
 * held open for that entire time, and `XMLHttpRequest` cannot resume: a Wi-Fi
 * roam, a laptop sleep, a NAT table eviction or an ISP re-dial ends it, the
 * handler sees `ECONNRESET`, and the operator starts again from zero. That is
 * not a timeout to be raised — the server had already accepted 7 GB when the
 * last attempt died — it is a transfer with no recovery.
 *
 * So the upload is broken into ordinary small requests that append to a file
 * on the backup volume. A dropped chunk costs seconds, the client asks how many
 * bytes landed and carries on from there, and a page reload can pick the same
 * session back up. Only once the whole archive is staged does the restore run.
 *
 * Sessions live under `<BACKUP_DIR>/uploads/`, which is a bind-mounted host
 * volume in production — deliberately not the container's overlay filesystem,
 * and not `os.tmpdir()`, because several gigabytes do not belong on a writable
 * layer that a rebuild discards.
 */

/** Same 64 GB sanity backstop the single-shot restore path applies. */
export const MAX_UPLOAD_BYTES = 64 * 1024 * 1024 * 1024;

/**
 * Abandoned sessions are swept after this long. Generous on purpose: an
 * operator who loses a link overnight should still find their partial upload
 * in the morning rather than a fresh 7.5 GB climb.
 */
const UPLOAD_TTL_MS = 48 * 60 * 60 * 1000;

/** Refuse a chunk that would leave the volume with less headroom than this. */
const MIN_FREE_BYTES = 2 * 1024 * 1024 * 1024;

const UPLOAD_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const isUploadId = (id: unknown): id is string =>
  typeof id === "string" && UPLOAD_ID.test(id);

function uploadsDir(): string {
  return path.join(backupDir(), "uploads");
}

/**
 * The id is validated as a UUID before it ever reaches here, so this cannot be
 * steered outside the directory — but the join is kept in one place so there is
 * a single thing to audit.
 */
export function uploadPath(id: string): string {
  return path.join(uploadsDir(), `${id}.part`);
}

export async function createUpload(): Promise<string> {
  await mkdir(uploadsDir(), { recursive: true });
  const id = randomUUID();
  // Create the file immediately so `receivedBytes` can distinguish "session
  // exists, nothing sent yet" from "no such session" without extra state.
  await pipeline(Readable.from([]), createWriteStream(uploadPath(id)));
  return id;
}

/** Bytes staged so far, or null if there is no such session. */
export async function receivedBytes(id: string): Promise<number | null> {
  try {
    return (await stat(uploadPath(id))).size;
  } catch {
    return null;
  }
}

export type AppendResult =
  | { ok: true; received: number }
  | {
      ok: false;
      reason: "missing" | "offset" | "too-large" | "no-space" | "busy";
      received: number;
    }
  | { ok: false; reason: "checksum"; received: number; got: string };

/** A hex SHA-256, as the client sends it. */
const SHA256_HEX = /^[0-9a-f]{64}$/;

export const isChunkDigest = (v: unknown): v is string =>
  typeof v === "string" && SHA256_HEX.test(v);

/**
 * Sessions with an append currently in flight.
 *
 * Without this, a chunk whose client gave up mid-request keeps writing on the
 * server: the browser sees the abort, re-reads `received`, and fires the next
 * chunk while the dead request's stream is still draining into the same file.
 * Two appenders then interleave at write-buffer granularity, so the archive
 * ends up the right *length* with a region of wrong bytes in the middle — a
 * ZIP whose central directory reads perfectly while individual entries fail
 * with `FILE_ENDED`. A second append is refused outright; the client waits and
 * asks again rather than racing.
 */
const appending = new Set<string>();

/**
 * Append one chunk at `offset`.
 *
 * The offset must equal the file's current size. That is what makes a retry
 * safe: a chunk whose response was lost can be replayed, and the mismatch tells
 * the client to re-read `received` and resume from the truth rather than
 * writing a hole or a duplicate into the middle of a ZIP.
 *
 * Writes are positional (`r+` at `offset`) rather than `a`, and the file is
 * truncated back to `offset` both before the write and on any failure. An
 * append that dies mid-chunk therefore leaves the session exactly where it
 * started instead of a ragged tail the client has to discover by polling.
 *
 * `digest`, when given, is the chunk's SHA-256. It is checked against what
 * actually landed and a mismatch rolls the write back, so a corrupted chunk is
 * caught here — at the point it can still be re-sent — rather than hours later
 * when the restore cannot parse an entry.
 */
export async function appendChunk(
  id: string,
  offset: number,
  body: ReadableStream<Uint8Array>,
  digest?: string,
): Promise<AppendResult> {
  if (appending.has(id)) {
    return {
      ok: false,
      reason: "busy",
      received: (await receivedBytes(id)) ?? 0,
    };
  }

  const current = await receivedBytes(id);
  if (current === null) return { ok: false, reason: "missing", received: 0 };
  if (offset !== current) {
    return { ok: false, reason: "offset", received: current };
  }

  const free = await freeBytes();
  if (free !== null && free < MIN_FREE_BYTES) {
    return { ok: false, reason: "no-space", received: current };
  }

  appending.add(id);
  const file = uploadPath(id);
  const rollback = () =>
    truncate(file, offset).catch((err) =>
      console.error("[restore/upload] rollback failed", err),
    );

  try {
    // Nothing should exist past `offset`, but an earlier crash between the
    // write and its rollback would leave some; start from a known state.
    await truncate(file, offset);

    let written = 0;
    const hash = digest ? createHash("sha256") : null;
    const source = Readable.fromWeb(
      body as Parameters<typeof Readable.fromWeb>[0],
    );

    try {
      await pipeline(
        source,
        async function* (chunks: AsyncIterable<Buffer>) {
          for await (const chunk of chunks) {
            written += chunk.length;
            if (offset + written > MAX_UPLOAD_BYTES) {
              throw new Error("too-large");
            }
            hash?.update(chunk);
            yield chunk;
          }
        },
        createWriteStream(file, { flags: "r+", start: offset }),
      );
    } catch (err) {
      await rollback();
      if (err instanceof Error && err.message === "too-large") {
        return { ok: false, reason: "too-large", received: offset };
      }
      throw err;
    }

    if (hash) {
      const got = hash.digest("hex");
      if (got !== digest) {
        await rollback();
        return { ok: false, reason: "checksum", received: offset, got };
      }
    }

    return { ok: true, received: offset + written };
  } finally {
    appending.delete(id);
  }
}

export async function discardUpload(id: string): Promise<void> {
  await rm(uploadPath(id), { force: true });
}

/**
 * Drop sessions nobody came back for. Called opportunistically when a new
 * session is created and after a restore finishes, in the same
 * best-effort-and-never-throws spirit as `pruneJobs`.
 */
export async function pruneUploads(): Promise<void> {
  try {
    const now = Date.now();
    for (const name of await readdir(uploadsDir())) {
      if (!name.endsWith(".part")) continue;
      const full = path.join(uploadsDir(), name);
      try {
        const info = await stat(full);
        if (now - info.mtimeMs > UPLOAD_TTL_MS) await rm(full, { force: true });
      } catch {
        // Raced with another sweep or a discard; nothing to do.
      }
    }
  } catch {
    // The directory may not exist yet. Not worth reporting.
  }
}
