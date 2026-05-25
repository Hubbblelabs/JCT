import { NextRequest } from "next/server";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { getPresignedPutUrl } from "@/lib/r2";

const ALLOWED_MIME = ["application/pdf"] as const;
const MAX_SIZE = 25 * 1024 * 1024;

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    const body = (await req.json()) as {
      filename?: string;
      size?: number;
      mime_type?: string;
    };
    const { filename, size, mime_type } = body;

    if (!filename) return badRequest("filename required");
    if (
      !mime_type ||
      !ALLOWED_MIME.includes(mime_type as (typeof ALLOWED_MIME)[number])
    ) {
      return badRequest(
        `Invalid file type "${mime_type}". Only PDF files are accepted.`,
      );
    }
    if (!size || size > MAX_SIZE) {
      return badRequest("File too large. Max is 25 MB.");
    }

    const safeName = filename
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `documents/${Date.now()}-${safeName}`;
    const presignedUrl = await getPresignedPutUrl(
      storageKey,
      "application/pdf",
    );

    return json({ presigned_url: presignedUrl, storage_key: storageKey, safe_name: safeName });
  } catch (e) {
    console.error("[documents/presign]", e);
    return serverError();
  }
}
