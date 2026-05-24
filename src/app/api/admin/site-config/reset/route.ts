import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateTargets } from "@/lib/revalidate";
import { deleteFromR2, isR2Configured } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();

    // ── R2 cleanup ───────────────────────────────────────────────────────────
    let imagesDeleted = 0;
    let docsDeleted = 0;
    let r2Failures = 0;

    if (isR2Configured()) {
      const images = await ImageAsset.find().select("storage_key").lean();
      for (const img of images) {
        try {
          await deleteFromR2(img.storage_key);
          imagesDeleted++;
        } catch (err) {
          console.warn(`[reset] R2 delete failed for ${img.storage_key}:`, err);
          r2Failures++;
        }
      }

      const docs = await DocumentAsset.find().select("storage_key").lean();
      for (const doc of docs) {
        try {
          await deleteFromR2(doc.storage_key);
          docsDeleted++;
        } catch (err) {
          console.warn(`[reset] R2 delete failed for ${doc.storage_key}:`, err);
          r2Failures++;
        }
      }
    }

    // ── DB wipe ──────────────────────────────────────────────────────────────
    await ImageAsset.deleteMany({});
    await DocumentAsset.deleteMany({});
    const result = await SiteConfig.deleteMany({});

    revalidateTargets("all-institutions");

    await logAudit(
      "site-config",
      "reset",
      session!.user?.email ?? "",
      `Full reset — ${result.deletedCount} configs, ${imagesDeleted} images, ${docsDeleted} documents deleted from R2${r2Failures > 0 ? ` (${r2Failures} R2 failures)` : ""}`,
    );

    return json({
      deleted: result.deletedCount,
      images_deleted: imagesDeleted,
      documents_deleted: docsDeleted,
      r2_failures: r2Failures,
    });
  } catch (e) {
    console.error("[site-config/reset]", e);
    return serverError();
  }
}
