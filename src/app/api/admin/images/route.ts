import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { deleteObject } from "@/lib/storage";
import {
  requireRole,
  enforceAssetScope,
  institutionReadFilter,
  json,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const institution = searchParams.get("institution");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (institution) filter.institution = institution;

    // Scope AFTER the client filter so it always wins, matching every other
    // admin list GET. Without it, `?institution=engineering` handed an editor
    // scoped to another college the full metadata — filenames, alt text,
    // uploader emails and storage_keys, all directly fetchable — for assets
    // the write paths on this same collection already refuse to touch.
    // `includeShared` mirrors enforceAssetScope: the "all" pool is shared.
    const docs = await ImageAsset.find({
      ...filter,
      ...institutionReadFilter(session, { includeShared: true }),
    })
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
 * Deletes an image asset by its storage key.
 *
 * NOT called from the admin UI. `ImageUploadInput.handleRemove` only cancels a
 * `pending:` placeholder and clears local state; reclamation for an
 * already-uploaded key happens server-side in the save route's orphan diff.
 * This endpoint exists for manual/administrative use — the comment here used
 * to claim the gallery-removal flow called it, which sent an auditor looking
 * for a client-side cleanup path that has never existed.
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

    const scope = enforceAssetScope(session, doc.institution);
    if (scope) return scope;

    try {
      await deleteObject(key);
    } catch (storageErr) {
      console.warn(
        "[images DELETE] storage deletion failed (non-fatal):",
        storageErr,
      );
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
