import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { deleteFromR2 } from "@/lib/r2";
import { requireRole, json, notFound, serverError, validateBody } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { ImageAssetPatchSchema } from "@/lib/validation";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await ImageAsset.findById(id);
    if (!doc) return notFound();

    try {
      await deleteFromR2(doc.storage_key);
    } catch {}

    await doc.deleteOne();
    await logAudit("image", "deleted", session!.user?.email ?? "", `Deleted ${doc.filename}`);
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, ImageAssetPatchSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const update: Record<string, unknown> = {};
    if (body.alt_text !== undefined) update.alt_text = body.alt_text;
    if (body.category !== undefined) update.category = body.category;
    if (body.filename !== undefined) update.filename = body.filename;

    const doc = await ImageAsset.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    if (!doc) return notFound();
    await logAudit("image", "updated", session!.user?.email ?? "", `Updated image metadata ${doc.filename}`);
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
