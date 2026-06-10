import { NextRequest } from "next/server";
import JSZip from "jszip";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig, ImageAsset, DocumentAsset } from "@/lib/models";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  isKnownSiteConfigKey,
  SITE_CONFIG_SCHEMAS,
  type SiteConfigKey,
} from "@/lib/validation/siteConfig";
import { revalidateTargets, revalidateForConfigKey } from "@/lib/revalidate";
import { uploadToR2 } from "@/lib/r2";

interface ImageMeta {
  filename: string;
  storage_key: string;
  alt_text: string;
  category: string;
  institution: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  uploaded_by: string;
}

interface DocMeta {
  filename: string;
  storage_key: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string;
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return badRequest("Request must be multipart/form-data");
  }

  const file = formData.get("file") as File | null;
  if (!file) return badRequest("No file provided");
  if (!file.name.toLowerCase().endsWith(".zip"))
    return badRequest("Backup file must be a .zip archive");

  let zip: JSZip;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    zip = await JSZip.loadAsync(buffer);
  } catch {
    return badRequest("Invalid ZIP file — could not parse backup archive");
  }

  // ── 1. Parse site-config.json ──────────────────────────────────────────────
  const configFile = zip.file("site-config.json");
  if (!configFile)
    return badRequest("Invalid backup — missing site-config.json");

  let rawConfigs: unknown[];
  try {
    const text = await configFile.async("string");
    const parsed = JSON.parse(text) as { configs?: unknown[] };
    if (!Array.isArray(parsed.configs)) throw new Error();
    rawConfigs = parsed.configs;
  } catch {
    return badRequest("Invalid backup — site-config.json is malformed");
  }

  const errs: string[] = [];
  const validConfigs: Array<{
    config_key: SiteConfigKey;
    value: unknown;
    published_value: unknown;
    status: string;
  }> = [];

  for (const item of rawConfigs) {
    if (typeof item !== "object" || item === null) {
      errs.push("Each config entry must be an object");
      continue;
    }
    const entry = item as Record<string, unknown>;
    const key = entry.config_key as string;
    if (!isKnownSiteConfigKey(key)) {
      errs.push(`Unknown config_key: "${key}" — skipped`);
      continue;
    }
    const schema = SITE_CONFIG_SCHEMAS[key];
    const parsedValue = schema.safeParse(entry.value);
    if (!parsedValue.success) {
      errs.push(
        `${key}: ${parsedValue.error.issues.map((i: { message: string }) => i.message).join(", ")}`,
      );
      continue;
    }
    // published_value used to be stored verbatim. That bypassed schema
    // validation and let a tampered backup inject anything into the public
    // payload. Re-validate against the same schema; on failure, fall back
    // to the validated `value`.
    let publishedValue: unknown = parsedValue.data;
    if (entry.published_value !== undefined) {
      const parsedPublished = schema.safeParse(entry.published_value);
      if (parsedPublished.success) {
        publishedValue = parsedPublished.data;
      } else {
        errs.push(
          `${key}.published_value: rejected by schema, reverting to draft value`,
        );
      }
    }
    validConfigs.push({
      config_key: key,
      value: parsedValue.data,
      published_value: publishedValue,
      status: entry.status === "published" ? "published" : "draft",
    });
  }

  if (errs.length > 0 && validConfigs.length === 0) {
    return json({ error: "Validation errors", details: errs }, 422);
  }

  try {
    await connectDB();

    // ── Restore SiteConfig ───────────────────────────────────────────────────
    for (const cfg of validConfigs) {
      await SiteConfig.findOneAndUpdate(
        { config_key: cfg.config_key },
        {
          $set: {
            value: cfg.value,
            published_value: cfg.published_value,
            status: cfg.status,
            updated_by: session!.user?.email,
          },
          $inc: { version: 1 },
        },
        { upsert: true },
      );
      // Per-key revalidation: covers paths "all-institutions" misses
      // (e.g. /campus-life) and clears the public API cache.
      revalidateForConfigKey(cfg.config_key);
    }
    revalidateTargets("all-institutions");

    // ── Restore images ───────────────────────────────────────────────────────
    let imagesRestored = 0;
    const warnings: string[] = [...errs];

    const imageMetaFile = zip.file("images/_metadata.json");
    if (imageMetaFile) {
      let imageMeta: ImageMeta[] = [];
      try {
        imageMeta = JSON.parse(
          await imageMetaFile.async("string"),
        ) as ImageMeta[];
      } catch {
        warnings.push("Could not parse images/_metadata.json — images skipped");
      }

      for (const meta of imageMeta) {
        try {
          // Never let a crafted backup write outside the images/ namespace.
          if (typeof meta.storage_key !== "string" || !meta.storage_key.startsWith("images/")) {
            warnings.push(`Rejected image with invalid storage_key: ${String(meta.storage_key)}`);
            continue;
          }
          const filename = meta.storage_key.replace(/^images\//, "");
          const imgFile = zip.file(`images/${filename}`);
          if (!imgFile) {
            warnings.push(`Image file missing in archive: ${filename}`);
            continue;
          }
          const buffer = Buffer.from(await imgFile.async("arraybuffer"));
          await uploadToR2(
            meta.storage_key,
            buffer,
            meta.mime_type || "image/webp",
          );
          await ImageAsset.findOneAndUpdate(
            { storage_key: meta.storage_key },
            {
              $set: {
                filename: meta.filename,
                storage_key: meta.storage_key,
                url: meta.storage_key,
                alt_text: meta.alt_text || "",
                category: meta.category || "other",
                institution: meta.institution || "all",
                file_size: meta.file_size || 0,
                mime_type: meta.mime_type || "image/webp",
                width: meta.width,
                height: meta.height,
                uploaded_by: meta.uploaded_by || session!.user?.email || "",
              },
            },
            { upsert: true },
          );
          imagesRestored++;
        } catch (err) {
          warnings.push(
            `Failed to restore image ${meta.storage_key}: ${String(err)}`,
          );
        }
      }
    }

    // ── Restore documents ────────────────────────────────────────────────────
    let docsRestored = 0;

    const docMetaFile = zip.file("documents/_metadata.json");
    if (docMetaFile) {
      let docMeta: DocMeta[] = [];
      try {
        docMeta = JSON.parse(await docMetaFile.async("string")) as DocMeta[];
      } catch {
        warnings.push(
          "Could not parse documents/_metadata.json — documents skipped",
        );
      }

      for (const meta of docMeta) {
        try {
          // Never let a crafted backup write outside the documents/ namespace.
          if (typeof meta.storage_key !== "string" || !meta.storage_key.startsWith("documents/")) {
            warnings.push(`Rejected document with invalid storage_key: ${String(meta.storage_key)}`);
            continue;
          }
          const filename = meta.storage_key.replace(/^documents\//, "");
          const docFile = zip.file(`documents/${filename}`);
          if (!docFile) {
            warnings.push(`Document file missing in archive: ${filename}`);
            continue;
          }
          const buffer = Buffer.from(await docFile.async("arraybuffer"));
          const publicUrl = await uploadToR2(
            meta.storage_key,
            buffer,
            meta.mime_type || "application/pdf",
          );
          await DocumentAsset.findOneAndUpdate(
            { storage_key: meta.storage_key },
            {
              $set: {
                filename: meta.filename,
                storage_key: meta.storage_key,
                url: publicUrl,
                mime_type: meta.mime_type || "application/pdf",
                file_size: meta.file_size || 0,
                uploaded_by: meta.uploaded_by || session!.user?.email || "",
              },
            },
            { upsert: true },
          );
          docsRestored++;
        } catch (err) {
          warnings.push(
            `Failed to restore document ${meta.storage_key}: ${String(err)}`,
          );
        }
      }
    }

    await logAudit(
      "site-config",
      "restored",
      session!.user?.email ?? "",
      `Restored backup: ${validConfigs.length} configs, ${imagesRestored} images, ${docsRestored} documents`,
    );

    return json({
      restored: validConfigs.length,
      skipped: errs.length,
      images_restored: imagesRestored,
      documents_restored: docsRestored,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (e) {
    console.error("[site-config/restore]", e);
    return serverError();
  }
}
