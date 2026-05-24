import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import {
  requireRole,
  json,
  serverError,
  validateBody,
  forbidden,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { SiteConfigPutSchema, SITE_CONFIG_KEY_INSTITUTION } from "@/lib/validation";
import { revalidateForConfigKey } from "@/lib/revalidate";
import { extractR2Keys, deleteFromR2 } from "@/lib/r2";
import { hasMinRole } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const docs = await SiteConfig.find().sort({ config_key: 1 });
    return json(docs);
  } catch (e) {
    console.error("[site-config GET]", e);
    return serverError();
  }
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, SiteConfigPutSchema);
  if (!parsed.ok) return parsed.response;
  const { config_key, value } = parsed.data;

  const userRole = (session!.user as Record<string, unknown>).role as string;
  if (!hasMinRole(userRole, "admin")) {
    const userInstitution = (session!.user as Record<string, unknown>)
      .institution as string;
    const keyInstitution = SITE_CONFIG_KEY_INSTITUTION[config_key];
    if (!keyInstitution || keyInstitution !== userInstitution) {
      return forbidden();
    }
  }

  try {
    await connectDB();

    // Fetch the existing doc BEFORE overwriting so we can detect orphaned R2 keys.
    const existing = await SiteConfig.findOne({ config_key }).lean();
    const oldKeys = existing?.value ? [...extractR2Keys(existing.value)] : [];

    const doc = await SiteConfig.findOneAndUpdate(
      { config_key },
      {
        $set: {
          value,
          published_value: value,
          status: "published",
          updated_by: session!.user?.email,
        },
        $inc: { version: 1 },
      },
      { upsert: true, new: true },
    );

    // Delete any R2 objects (images or documents) that were present in the old
    // value but are no longer referenced by the new value. Non-fatal — a failed
    // R2 delete never blocks the save.
    const newKeys = new Set([...extractR2Keys(value)]);
    const orphaned = oldKeys.filter((k) => !newKeys.has(k));
    for (const key of orphaned) {
      deleteFromR2(key).catch((err) =>
        console.warn(`[site-config] R2 cleanup failed for "${key}":`, err),
      );
    }

    revalidateForConfigKey(config_key);
    await logAudit(
      "site-config",
      "updated",
      session!.user?.email ?? "",
      `Updated config: ${config_key}`,
    );
    return json(doc);
  } catch (e) {
    console.error("[site-config PUT]", e);
    return serverError();
  }
}
