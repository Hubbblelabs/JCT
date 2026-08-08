import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { DocumentAsset } from "@/lib/models";
import { deleteObject } from "@/lib/storage";
import {
  requireRole,
  json,
  notFound,
  serverError,
  invalidId,
} from "@/lib/api-helpers";
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
    const badId = invalidId(id);
    if (badId) return badId;
    const doc = await DocumentAsset.findById(id);
    if (!doc) return notFound("Document not found");

    // Delete from storage first (non-fatal if it fails — DB record removal is the
    // authoritative step; the stored object will be unreachable anyway).
    try {
      await deleteObject(doc.storage_key);
    } catch (storageErr) {
      console.warn(
        "[documents/delete] storage deletion failed (non-fatal):",
        storageErr,
      );
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
