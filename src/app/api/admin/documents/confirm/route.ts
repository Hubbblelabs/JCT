import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { deleteFromR2, headR2Object, r2PublicUrl } from "@/lib/r2";
import {
  requireRole,
  enforceUploadRateLimit,
  json,
  badRequest,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { DocumentConfirmSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const limited = enforceUploadRateLimit(req, session!.user?.email ?? "");
  if (limited) return limited;

  // Schema-validated, like every other admin write route. The `documents/`
  // prefix check lives in the schema: without it an editor could register a
  // DocumentAsset pointing at any object in the bucket.
  const parsed = await validateBody(req, DocumentConfirmSchema);
  if (!parsed.ok) return parsed.response;
  const { storage_key, filename, mime_type } = parsed.data;

  try {
    // The client-supplied size/mime are advisory — confirm against the
    // actual uploaded object. This also rejects confirms for keys that were
    // presigned but never uploaded.
    const head = await headR2Object(storage_key);
    if (!head || head.size === 0) {
      return badRequest("Upload not found in storage — upload the file first");
    }

    const publicUrl = r2PublicUrl(storage_key);

    try {
      await connectDB();

      // A storage key is single-use: double-registering would create two
      // DocumentAsset rows whose deletes pull the object out from under
      // each other.
      const existing = await DocumentAsset.findOne({ storage_key }).lean();
      if (existing) {
        return badRequest("This upload is already registered");
      }

      await DocumentAsset.create({
        filename,
        storage_key,
        url: publicUrl,
        mime_type: head.contentType || mime_type || "application/pdf",
        file_size: head.size,
        uploaded_by: session!.user?.email ?? "",
      });
    } catch (dbErr) {
      console.error(
        "[documents/confirm] DB write failed — rolling back R2",
        dbErr,
      );
      try {
        await deleteFromR2(storage_key);
      } catch {
        /* non-fatal */
      }
      return serverError();
    }

    await logAudit(
      "document",
      "uploaded",
      session!.user?.email ?? "",
      `Uploaded ${filename}`,
    );

    return json(
      {
        url: publicUrl,
        storage_key,
        filename,
        size: head.size,
        mime_type: head.contentType || mime_type,
      },
      201,
    );
  } catch (e) {
    console.error("[documents/confirm]", e);
    return serverError();
  }
}
