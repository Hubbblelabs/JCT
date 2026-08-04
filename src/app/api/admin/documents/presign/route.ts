import { NextRequest } from "next/server";
import {
  requireRole,
  json,
  serverError,
  validateBody,
  enforceUploadRateLimit,
} from "@/lib/api-helpers";
import { DocumentPresignSchema } from "@/lib/validation";
import { getPresignedPutUrl } from "@/lib/r2";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const limited = enforceUploadRateLimit(req, session!.user?.email ?? "");
  if (limited) return limited;

  // Structured 422 on a bad body, like every other admin write route — the
  // previous `as` cast turned a non-string filename into a 500.
  const parsed = await validateBody(req, DocumentPresignSchema);
  if (!parsed.ok) return parsed.response;
  const { filename, size } = parsed.data;

  try {
    const safeName = filename
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `documents/${Date.now()}-${safeName}`;
    // Pin the byte count into the signature so the actual upload can't exceed
    // the size we validated above (the limit is otherwise unenforceable).
    const presignedUrl = await getPresignedPutUrl(
      storageKey,
      "application/pdf",
      300,
      size,
    );

    return json({
      presigned_url: presignedUrl,
      storage_key: storageKey,
      safe_name: safeName,
    });
  } catch (e) {
    console.error("[documents/presign]", e);
    return serverError();
  }
}
