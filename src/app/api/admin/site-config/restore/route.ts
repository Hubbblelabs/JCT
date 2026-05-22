import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  isKnownSiteConfigKey,
  SITE_CONFIG_SCHEMAS,
  type SiteConfigKey,
} from "@/lib/validation/siteConfig";
import { revalidateTargets } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "super_admin");
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !Array.isArray((body as Record<string, unknown>).configs)
  ) {
    return badRequest('Expected { "configs": [...] }');
  }

  const configs = (body as { configs: unknown[] }).configs;
  const errs: string[] = [];
  const valid: Array<{
    config_key: SiteConfigKey;
    value: unknown;
    published_value: unknown;
    status: string;
  }> = [];

  for (const item of configs) {
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
    const parsed = schema.safeParse(entry.value);
    if (!parsed.success) {
      errs.push(
        `${key}: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
      );
      continue;
    }

    valid.push({
      config_key: key,
      value: parsed.data,
      published_value:
        entry.published_value !== undefined
          ? entry.published_value
          : parsed.data,
      status: entry.status === "published" ? "published" : "draft",
    });
  }

  if (errs.length > 0 && valid.length === 0) {
    return json({ error: "Validation errors", details: errs }, 422);
  }

  try {
    await connectDB();

    for (const cfg of valid) {
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
    }

    revalidateTargets("all-institutions");

    await logAudit(
      "site-config",
      "restored",
      session!.user?.email ?? "",
      `Restored ${valid.length} config entries from backup`,
    );

    return json({
      restored: valid.length,
      skipped: errs.length,
      warnings: errs.length > 0 ? errs : undefined,
    });
  } catch (e) {
    console.error("[site-config/restore]", e);
    return serverError();
  }
}
