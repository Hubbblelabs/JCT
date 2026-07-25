import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, serverError, badRequest } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { getR2AsBuffer, isR2Configured } from "@/lib/r2";

// Each R2 GET costs ~1-2s round-trip. Fetching a few hundred assets serially
// takes minutes and the request dies at the reverse proxy before the ZIP is
// ever written, so pull them through a bounded pool instead.
const R2_FETCH_CONCURRENCY = 12;
const R2_FETCH_TIMEOUT_MS = 20_000;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      for (let i = cursor++; i < items.length; i = cursor++) {
        results[i] = await fn(items[i]!);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

/**
 * Fetch one asset's bytes, or null when it is missing/unreadable. A single
 * dead storage key must not abort the whole backup, and must not be able to
 * stall a pool slot indefinitely.
 */
async function fetchAsset(
  storageKey: string,
): Promise<{ storageKey: string; buffer: Buffer } | null> {
  try {
    const { buffer } = await Promise.race([
      getR2AsBuffer(storageKey),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("R2 fetch timed out")),
          R2_FETCH_TIMEOUT_MS,
        ),
      ),
    ]);
    return { storageKey, buffer };
  } catch (err) {
    console.warn(`[backup] Skipping asset ${storageKey}:`, err);
    return null;
  }
}

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
    let imagesSkipped = 0;
    let docsSkipped = 0;

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
    zip.file("site-config.json", JSON.stringify(configData, null, 2), {
      compression: "DEFLATE",
    });

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
      zip.file("images/_metadata.json", JSON.stringify(metadata, null, 2), {
        compression: "DEFLATE",
      });

      const fetched = await mapWithConcurrency(
        images.map((img) => img.storage_key as string),
        R2_FETCH_CONCURRENCY,
        fetchAsset,
      );
      for (const asset of fetched) {
        if (!asset) {
          imagesSkipped++;
          continue;
        }
        const filename = asset.storageKey.replace(/^images\//, "");
        // Images are already compressed — re-deflating burns CPU for nothing.
        zip.file(`images/${filename}`, asset.buffer, { compression: "STORE" });
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
      zip.file("documents/_metadata.json", JSON.stringify(metadata, null, 2), {
        compression: "DEFLATE",
      });

      const fetched = await mapWithConcurrency(
        docs.map((doc) => doc.storage_key as string),
        R2_FETCH_CONCURRENCY,
        fetchAsset,
      );
      for (const asset of fetched) {
        if (!asset) {
          docsSkipped++;
          continue;
        }
        const filename = asset.storageKey.replace(/^documents\//, "");
        zip.file(`documents/${filename}`, asset.buffer, {
          compression: "STORE",
        });
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const parts = [`${configs.length} config entries`];
    if (includeImages)
      parts.push(
        imagesSkipped > 0 ? `images (${imagesSkipped} unreadable)` : "images",
      );
    if (includeDocs)
      parts.push(
        docsSkipped > 0 ? `documents (${docsSkipped} unreadable)` : "documents",
      );
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
