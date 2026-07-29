import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, serverError, badRequest } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import mongoose from "mongoose";
import { getR2AsBuffer, isR2Configured, listR2Objects } from "@/lib/r2";
import { BACKUP_COLLECTIONS, serializeDoc } from "@/lib/backup-collections";

// Each R2 GET costs ~1-2s round-trip. Fetching a few hundred assets serially
// takes minutes and the request dies at the reverse proxy before the ZIP is
// ever written, so pull them through a bounded pool instead.
const R2_FETCH_CONCURRENCY = 12;
// Generous enough for multi-megabyte PDFs on a slow link; short enough that a
// genuinely stuck object can't hold a pool slot for the whole request.
const R2_FETCH_TIMEOUT_MS = 90_000;

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

/**
 * Every storage key worth archiving under a prefix: the union of what R2
 * actually holds and what the DB claims to track. DB-only keys are kept in the
 * list on purpose so a broken row surfaces as an "unreadable" count rather
 * than vanishing from the report.
 */
async function collectAssetKeys(
  prefix: string,
  dbKeys: string[],
): Promise<string[]> {
  const keys = new Set<string>();
  try {
    for (const obj of await listR2Objects(prefix)) {
      // Reserved manifest names are written from the DB, never copied from R2.
      if (obj.key.endsWith("/_metadata.json")) continue;
      keys.add(obj.key);
    }
  } catch (err) {
    console.error(`[backup] Could not list R2 prefix ${prefix}:`, err);
  }
  for (const key of dbKeys) {
    if (typeof key === "string" && key.startsWith(prefix)) keys.add(key);
  }
  return [...keys].sort();
}

// Pulling several hundred objects out of R2 outlasts the default limit.
export const maxDuration = 300;

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

    // 1b. Content collections. Read through the native driver rather than the
    // Mongoose models: `recruiters` still exists as a collection after its
    // model was removed, and a backup must not silently skip it.
    const collectionCounts: Record<string, number> = {};
    const db = mongoose.connection.db;
    for (const col of BACKUP_COLLECTIONS) {
      let docs: Record<string, unknown>[] = [];
      try {
        docs = db
          ? await db.collection(col.name).find({}).toArray()
          : [];
      } catch (err) {
        console.warn(`[backup] Could not read collection ${col.name}:`, err);
      }
      collectionCounts[col.name] = docs.length;
      zip.file(
        `collections/${col.name}.json`,
        JSON.stringify(docs.map(serializeDoc), null, 2),
        { compression: "DEFLATE" },
      );
    }

    // 2. Images
    let imagesArchived = 0;
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
        ratio_type: img.ratio_type,
        aspect_ratio: img.aspect_ratio,
        uploaded_by: img.uploaded_by,
      }));
      zip.file("images/_metadata.json", JSON.stringify(metadata, null, 2), {
        compression: "DEFLATE",
      });

      // Archive what the bucket actually holds, not just what the media
      // library tracks: seeded files (images/programs/…, images/hod/…) have no
      // ImageAsset row and were being left out of every backup.
      const keys = await collectAssetKeys(
        "images/",
        images.map((img) => img.storage_key as string),
      );
      const fetched = await mapWithConcurrency(
        keys,
        R2_FETCH_CONCURRENCY,
        fetchAsset,
      );
      for (const asset of fetched) {
        if (!asset) {
          imagesSkipped++;
          continue;
        }
        // Store under the full storage key so restore can rebuild it verbatim.
        // Already-compressed bytes — re-deflating burns CPU for nothing.
        zip.file(asset.storageKey, asset.buffer, { compression: "STORE" });
        imagesArchived++;
      }
    }

    // 3. Documents
    let docsArchived = 0;
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

      const keys = await collectAssetKeys(
        "documents/",
        docs.map((doc) => doc.storage_key as string),
      );
      const fetched = await mapWithConcurrency(
        keys,
        R2_FETCH_CONCURRENCY,
        fetchAsset,
      );
      for (const asset of fetched) {
        if (!asset) {
          docsSkipped++;
          continue;
        }
        zip.file(asset.storageKey, asset.buffer, { compression: "STORE" });
        docsArchived++;
      }
    }

    // 4. Manifest — lets restore (and the operator) verify coverage without
    // re-deriving it from the ZIP's directory listing.
    zip.file(
      "manifest.json",
      JSON.stringify(
        {
          version: "2.1",
          exported_at: configData.exported_at,
          exported_by: configData.exported_by,
          config_entries: configs.length,
          collections: collectionCounts,
          images: { archived: imagesArchived, unreadable: imagesSkipped },
          documents: { archived: docsArchived, unreadable: docsSkipped },
        },
        null,
        2,
      ),
      { compression: "DEFLATE" },
    );

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const parts = [`${configs.length} config entries`];
    const contentTotal = Object.values(collectionCounts).reduce(
      (a, b) => a + b,
      0,
    );
    if (contentTotal > 0) parts.push(`${contentTotal} content documents`);
    if (includeImages)
      parts.push(
        `${imagesArchived} images${imagesSkipped > 0 ? ` (${imagesSkipped} unreadable)` : ""}`,
      );
    if (includeDocs)
      parts.push(
        `${docsArchived} documents${docsSkipped > 0 ? ` (${docsSkipped} unreadable)` : ""}`,
      );
    await logAudit(
      "site-config",
      "exported",
      session!.user?.email ?? "",
      `Exported backup: ${parts.join(", ")}`,
    );

    // Timestamped to the minute, not just the date. With a date-only name two
    // backups on the same day silently overwrite each other in the operator's
    // downloads folder — and the one that survives is the one taken *after*
    // whatever went wrong.
    const stamp = new Date()
      .toISOString()
      .replace(/[:-]/g, "")
      .replace(/\.\d{3}Z$/, "Z")
      .slice(0, 13); // YYYYMMDDTHHmm
    const filename = `jct-backup-${stamp}Z.zip`;
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
