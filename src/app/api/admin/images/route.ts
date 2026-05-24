import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
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
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const institution = searchParams.get("institution");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (institution) filter.institution = institution;

    const docs = await ImageAsset.find(filter)
      .sort({ created_at: -1 })
      .limit(500);
    return json(docs);
  } catch (e) {
    console.error("[images GET]", e);
    return serverError();
  }
}

/**
 * DELETE /api/admin/images?storage_key=<key>
 *
 * Deletes an image asset by its R2 storage key. Used by the admin UI when an
 * uploaded image is removed or replaced without going through the [id] route
 * (e.g. image removed from a photo gallery slot or replaced via file picker).
 */
export async function DELETE(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const key = new URL(req.url).searchParams.get("storage_key");
  if (!key) return badRequest("storage_key query param is required");

  try {
    await connectDB();
    const doc = await ImageAsset.findOne({ storage_key: key });
    if (!doc) return notFound("Image asset not found");

    try {
      await deleteFromR2(key);
    } catch (r2Err) {
      console.warn("[images DELETE] R2 deletion failed (non-fatal):", r2Err);
    }

    await doc.deleteOne();
    await logAudit(
      "image",
      "deleted",
      session!.user?.email ?? "",
      `Deleted by storage key: ${key}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error("[images DELETE by key]", e);
    return serverError();
  }
}
