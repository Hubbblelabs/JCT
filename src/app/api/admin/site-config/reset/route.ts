import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateTargets } from "@/lib/revalidate";
import { deleteFromR2, isR2Configured } from "@/lib/r2";
import { stillReferencedKeys } from "@/lib/asset-cleanup";

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();

    // Wipe the config first so the reference scan below sees the post-reset
    // state — otherwise every asset a SiteConfig entry mentions would look
    // "still in use" and nothing would be reclaimed.
    const result = await SiteConfig.deleteMany({});

    // ── Asset cleanup ────────────────────────────────────────────────────────
    // Reset clears SiteConfig, NOT the content collections. Program, Page,
    // Event, Placement and Testimonial documents survive with their
    // `images/…` / `documents/…` references intact, so deleting every asset
    // unconditionally left program hero images, event covers, recruiter logos
    // and testimonial avatars pointing at objects that no longer exist. Only
    // assets nothing surviving references are removed.
    const images = await ImageAsset.find().select("storage_key").lean();
    const docs = await DocumentAsset.find().select("storage_key").lean();
    const allKeys = new Set<string>([
      ...images.map((i) => i.storage_key),
      ...docs.map((d) => d.storage_key),
    ]);
    const referenced = await stillReferencedKeys(allKeys);

    let imagesDeleted = 0;
    let docsDeleted = 0;
    let r2Failures = 0;

    const removable = (key: string) => !referenced.has(key);

    if (isR2Configured()) {
      for (const img of images) {
        if (!removable(img.storage_key)) continue;
        try {
          await deleteFromR2(img.storage_key);
          imagesDeleted++;
        } catch (err) {
          console.warn(`[reset] R2 delete failed for ${img.storage_key}:`, err);
          r2Failures++;
        }
      }

      for (const doc of docs) {
        if (!removable(doc.storage_key)) continue;
        try {
          await deleteFromR2(doc.storage_key);
          docsDeleted++;
        } catch (err) {
          console.warn(`[reset] R2 delete failed for ${doc.storage_key}:`, err);
          r2Failures++;
        }
      }
    }

    // Drop only the tracking rows whose objects were actually removed, so the
    // media library keeps advertising the assets surviving content still uses.
    const keptKeys = [...referenced];
    await ImageAsset.deleteMany({ storage_key: { $nin: keptKeys } });
    await DocumentAsset.deleteMany({ storage_key: { $nin: keptKeys } });

    // "all-institutions" does not include /campus-life, /about-us,
    // /accreditations or /events — those live under "home", and all of them
    // server-render SiteConfig values this route just deleted.
    revalidateTargets("home", "all-institutions");

    await logAudit(
      "site-config",
      "reset",
      session!.user?.email ?? "",
      `Full reset — ${result.deletedCount} configs, ${imagesDeleted} images, ${docsDeleted} documents deleted from R2, ${keptKeys.length} assets kept (still referenced by content)${r2Failures > 0 ? ` (${r2Failures} R2 failures)` : ""}`,
    );

    return json({
      deleted: result.deletedCount,
      images_deleted: imagesDeleted,
      documents_deleted: docsDeleted,
      assets_kept: keptKeys.length,
      r2_failures: r2Failures,
    });
  } catch (e) {
    console.error("[site-config/reset]", e);
    return serverError();
  }
}
