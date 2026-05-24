import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, serverError, badRequest } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { getR2AsBuffer, isR2Configured } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const url = new URL(req.url);
  const includeImages = url.searchParams.get("includeImages") === "1";
  const includeDocs = url.searchParams.get("includeDocs") === "1";

  if ((includeImages || includeDocs) && !isR2Configured()) {
    return badRequest(
      "R2 storage is not configured — cannot include images or documents in backup",
    );
  }

  try {
    await connectDB();
    const zip = new JSZip();

    // 1. Site config (always included)
    const configs = await SiteConfig.find().sort({ config_key: 1 }).lean();
    const configData = {
      version: "2.0",
      exported_at: new Date().toISOString(),
      exported_by: session!.user?.email,
      configs: configs.map((doc) => ({
        config_key: doc.config_key,
        value: doc.value,
        published_value: doc.published_value ?? null,
        status: doc.status,
        version: doc.version,
        published_at: doc.published_at ?? null,
      })),
    };
    zip.file("site-config.json", JSON.stringify(configData, null, 2));

    // 2. Images
    if (includeImages) {
      const images = await ImageAsset.find().lean();
      const metadata = images.map((img) => ({
        filename: img.filename,
        storage_key: img.storage_key,
        alt_text: img.alt_text,
        category: img.category,
        institution: img.institution,
        file_size: img.file_size,
        mime_type: img.mime_type,
        width: img.width,
        height: img.height,
        uploaded_by: img.uploaded_by,
      }));
      zip.file("images/_metadata.json", JSON.stringify(metadata, null, 2));

      for (const img of images) {
        try {
          const { buffer } = await getR2AsBuffer(img.storage_key);
          const filename = img.storage_key.replace(/^images\//, "");
          zip.file(`images/${filename}`, buffer);
        } catch (err) {
          console.warn(`[backup] Skipping image ${img.storage_key}:`, err);
        }
      }
    }

    // 3. Documents
    if (includeDocs) {
      const docs = await DocumentAsset.find().lean();
      const metadata = docs.map((doc) => ({
        filename: doc.filename,
        storage_key: doc.storage_key,
        mime_type: doc.mime_type,
        file_size: doc.file_size,
        uploaded_by: doc.uploaded_by,
      }));
      zip.file("documents/_metadata.json", JSON.stringify(metadata, null, 2));

      for (const doc of docs) {
        try {
          const { buffer } = await getR2AsBuffer(doc.storage_key);
          const filename = doc.storage_key.replace(/^documents\//, "");
          zip.file(`documents/${filename}`, buffer);
        } catch (err) {
          console.warn(`[backup] Skipping document ${doc.storage_key}:`, err);
        }
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const parts = [`${configs.length} config entries`];
    if (includeImages) parts.push("images");
    if (includeDocs) parts.push("documents");
    await logAudit(
      "site-config",
      "exported",
      session!.user?.email ?? "",
      `Exported backup: ${parts.join(", ")}`,
    );

    const filename = `jct-backup-${new Date().toISOString().slice(0, 10)}.zip`;
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("[site-config/backup]", e);
    return serverError();
  }
}
