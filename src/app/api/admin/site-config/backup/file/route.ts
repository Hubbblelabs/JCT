import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { requireRole, badRequest, notFound } from "@/lib/api-helpers";
import { accelPrefix, archivePath, getJob } from "@/lib/backup-jobs";

/**
 * Serve a finished backup archive as an ordinary file download.
 *
 * The archive already exists on disk by the time anything here runs, which is
 * what lets this be a *plain* file response — with a real `Content-Length` and
 * byte-range support. Three things follow that the previous build-as-you-send
 * exporter could not offer:
 *
 *  - the browser shows true progress and a real ETA instead of "unknown size";
 *  - a dropped connection resumes from where it stopped rather than restarting
 *    a multi-gigabyte transfer, and download managers can open several ranges
 *    in parallel instead of being held to one sequential stream;
 *  - closing the tab no longer destroys the archive — it is already built.
 */

/** Parse a single-range `Range` header. Multi-range is legal HTTP but rare;
 * ignoring it just serves the whole file, which is always correct. */
function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | null | "unsatisfiable" {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return null;

  let start: number;
  let end: number;
  if (!rawStart) {
    // `bytes=-N` — the final N bytes.
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) return "unsatisfiable";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : size - 1;
  }
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "unsatisfiable";
  if (start > end || start >= size) return "unsatisfiable";
  return { start, end: Math.min(end, size - 1) };
}

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const jobId = new URL(req.url).searchParams.get("jobId");
  if (!jobId) return badRequest("jobId is required");

  const job = await getJob(jobId);
  if (!job) return notFound("No such backup job");
  if (job.state === "building") {
    return badRequest("That backup is still being built");
  }
  if (job.state === "failed") {
    return badRequest(job.error ?? "That backup failed to build");
  }

  const path = archivePath(jobId);
  let size: number;
  try {
    size = (await stat(path)).size;
  } catch {
    // The sidecar outlived its archive — pruned, or the volume was cleared.
    return notFound("That backup archive is no longer on the server");
  }

  const disposition = `attachment; filename="${job.filename}"`;

  // When nginx is configured to serve the archive directly, hand it off: the
  // bytes then go disk → socket via sendfile() with nginx's own range handling,
  // and Node is out of the data path entirely.
  const accel = accelPrefix();
  if (accel) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Accel-Redirect": `${accel}/${jobId}.zip`,
        "Content-Type": "application/zip",
        "Content-Disposition": disposition,
        "Cache-Control": "no-store",
      },
    });
  }

  const range = parseRange(req.headers.get("range"), size);
  if (range === "unsatisfiable") {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const base = {
    "Content-Type": "application/zip",
    "Content-Disposition": disposition,
    "Cache-Control": "no-store",
    // Advertised so clients know they may resume; without it a browser will
    // silently restart a failed multi-gigabyte download from zero.
    "Accept-Ranges": "bytes",
    // The response is a file read, not a generated stream — but nginx
    // buffering a multi-gigabyte body to its own disk first would add a full
    // extra copy before the client sees anything.
    "X-Accel-Buffering": "no",
  };

  const stream = range
    ? createReadStream(path, { start: range.start, end: range.end })
    : createReadStream(path);
  // A cancelled download must close the file handle behind it.
  req.signal.addEventListener("abort", () => stream.destroy());

  const body = Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>;

  if (range) {
    return new NextResponse(body, {
      status: 206,
      headers: {
        ...base,
        "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
        "Content-Length": String(range.end - range.start + 1),
      },
    });
  }
  return new NextResponse(body, {
    status: 200,
    headers: { ...base, "Content-Length": String(size) },
  });
}
