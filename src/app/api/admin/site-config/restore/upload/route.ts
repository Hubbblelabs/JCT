import { NextRequest } from "next/server";

import { requireRole, badRequest, json, serverError } from "@/lib/api-helpers";
import {
  appendChunk,
  createUpload,
  discardUpload,
  isUploadId,
  pruneUploads,
  receivedBytes,
} from "@/lib/restore-uploads";

/**
 * Staging endpoint for a resumable restore upload.
 *
 * `POST` opens a session, `PATCH` appends a chunk at a byte offset, `GET`
 * reports how much has landed, `DELETE` throws the session away. The archive
 * itself is handed to `POST /api/admin/site-config/restore?uploadId=…` once it
 * is completely staged.
 *
 * See src/lib/restore-uploads.ts for why the single-shot body was not enough.
 *
 * Access: this sits under the `site-config/restore` subtree, which `proxy.ts`
 * excludes from its matcher so a large body is never cloned and truncated.
 * Every handler therefore calls `requireRole` itself, exactly as the restore
 * route does — the exclusion removes the body clone, not the gate.
 */

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    // Opportunistic, same as pruneJobs: an abandoned session should not need an
    // operator to notice it.
    await pruneUploads();
    const uploadId = await createUpload();
    return json({ uploadId, received: 0 }, 201);
  } catch (e) {
    console.error("[restore/upload] create failed", e);
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const uploadId = req.nextUrl.searchParams.get("uploadId");
  if (!isUploadId(uploadId)) return badRequest("Invalid uploadId");

  try {
    const received = await receivedBytes(uploadId);
    if (received === null) return badRequest("No such upload session");
    return json({ uploadId, received });
  } catch (e) {
    console.error("[restore/upload] status failed", e);
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const uploadId = searchParams.get("uploadId");
  if (!isUploadId(uploadId)) return badRequest("Invalid uploadId");

  const offset = Number(searchParams.get("offset"));
  if (!Number.isSafeInteger(offset) || offset < 0) {
    return badRequest("Invalid offset");
  }
  if (!req.body)
    return badRequest("Expected a chunk of the archive as the body");

  try {
    const result = await appendChunk(uploadId, offset, req.body);
    if (result.ok) return json({ uploadId, received: result.received });

    // 409 on a mismatch rather than 400: the client's job is to re-read
    // `received` and continue from there, not to give up. The current size
    // rides along so it can do that without a second round trip.
    if (result.reason === "offset") {
      return json(
        {
          error: "Offset does not match the staged archive",
          received: result.received,
        },
        409,
      );
    }
    if (result.reason === "missing")
      return badRequest("No such upload session");
    if (result.reason === "no-space") {
      return json(
        { error: "Not enough free disk space to stage the archive" },
        507,
      );
    }
    return badRequest("Archive exceeds the maximum accepted size");
  } catch (e) {
    console.error("[restore/upload] append failed", e);
    return serverError();
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const uploadId = req.nextUrl.searchParams.get("uploadId");
  if (!isUploadId(uploadId)) return badRequest("Invalid uploadId");

  try {
    await discardUpload(uploadId);
    return json({ ok: true });
  } catch (e) {
    console.error("[restore/upload] discard failed", e);
    return serverError();
  }
}
