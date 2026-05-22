import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { deleteFromR2 } from "@/lib/r2";
import { requireRole, json, notFound, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await DocumentAsset.findById(id);
    if (!doc) return notFound("Document not found");

    // Delete from R2 first (non-fatal if it fails — DB record removal is the
    // authoritative step; the R2 object will be unreachable anyway).
    try {
      await deleteFromR2(doc.storage_key);
    } catch (r2Err) {
      console.warn("[documents/delete] R2 deletion failed (non-fatal):", r2Err);
    }

    await doc.deleteOne();
    await logAudit(
      "document",
      "deleted",
      session!.user?.email ?? "",
      `Deleted ${doc.filename} (key: ${doc.storage_key})`,
    );

    return json({ message: "Deleted" });
  } catch (e) {
    console.error("[documents/[id] DELETE]", e);
    return serverError();
  }
}
