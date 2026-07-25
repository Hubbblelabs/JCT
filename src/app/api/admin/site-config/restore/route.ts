import { NextRequest } from "next/server";
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

interface RestorePayload {
  configs?: unknown[];
  imageMeta?: unknown[];
  docMeta?: unknown[];
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  let payload: RestorePayload;
  try {
    payload = (await req.json()) as RestorePayload;
  } catch {
    return badRequest("Invalid request body");
  }

  if (!Array.isArray(payload.configs)) {
    return badRequest("Invalid backup payload — missing configs array");
  }

  const rawConfigs = payload.configs;

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
    let publishedValue: unknown = parsedValue.data;
    // A draft-only config exports `published_value: null`; that is expected,
    // not a schema failure, so don't warn about it.
    if (entry.published_value !== undefined && entry.published_value !== null) {
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
      revalidateForConfigKey(cfg.config_key);
    }
    revalidateTargets("all-institutions");

    // Restore image metadata (DB records only — binaries assumed still in R2)
    let imagesRestored = 0;
    const warnings: string[] = [...errs];

    const imageMeta = Array.isArray(payload.imageMeta)
      ? (payload.imageMeta as unknown[])
      : [];
    for (const raw of imageMeta) {
      const meta = raw as ImageMeta;
      try {
        if (
          typeof meta.storage_key !== "string" ||
          !meta.storage_key.startsWith("images/")
        ) {
          warnings.push(
            `Rejected image with invalid storage_key: ${String(meta.storage_key)}`,
          );
          continue;
        }
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

    // Restore document metadata (DB records only)
    let docsRestored = 0;

    const docMeta = Array.isArray(payload.docMeta)
      ? (payload.docMeta as unknown[])
      : [];
    for (const raw of docMeta) {
      const meta = raw as DocMeta;
      try {
        if (
          typeof meta.storage_key !== "string" ||
          !meta.storage_key.startsWith("documents/")
        ) {
          warnings.push(
            `Rejected document with invalid storage_key: ${String(meta.storage_key)}`,
          );
          continue;
        }
        await DocumentAsset.findOneAndUpdate(
          { storage_key: meta.storage_key },
          {
            $set: {
              filename: meta.filename,
              storage_key: meta.storage_key,
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
