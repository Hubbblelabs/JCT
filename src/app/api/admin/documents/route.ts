import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { deleteFromR2 } from "@/lib/r2";
import {
  requireRole,
  json,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const docs = await DocumentAsset.find().sort({ created_at: -1 }).limit(200);
    return json(docs);
  } catch (e) {
    console.error("[documents GET]", e);
    return serverError();
  }
}

/**
 * DELETE /api/admin/documents?storage_key=<key>
 *
 * Deletes a document asset by its R2 storage key.
 *
 * NOT called from the admin UI — see the matching note on the images route.
 * Replacing a PDF in an editor is reclaimed server-side by the save route's
 * orphan diff; this endpoint is for manual/administrative use.
 */
export async function DELETE(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const key = new URL(req.url).searchParams.get("storage_key");
  if (!key) return badRequest("storage_key query param is required");

  try {
    await connectDB();
    const doc = await DocumentAsset.findOne({ storage_key: key });
    if (!doc) return notFound("Document asset not found");

    try {
      await deleteFromR2(key);
    } catch (r2Err) {
      console.warn("[documents DELETE] R2 deletion failed (non-fatal):", r2Err);
    }

    await doc.deleteOne();
    await logAudit(
      "document",
      "deleted",
      session!.user?.email ?? "",
      `Deleted by storage key: ${key}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error("[documents DELETE by key]", e);
    return serverError();
  }
}
