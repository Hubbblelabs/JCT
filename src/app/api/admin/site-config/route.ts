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
import {
  SiteConfigPutSchema,
  SITE_CONFIG_KEY_INSTITUTION,
} from "@/lib/validation";
import { revalidateForConfigKey } from "@/lib/revalidate";
import { extractR2Keys } from "@/lib/r2";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";
import { hasMinRole } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const docs = await SiteConfig.find().sort({ config_key: 1 });

    // Editors may read global keys and their own college's keys, but not
    // other colleges' drafts.
    const userRole = (session!.user as Record<string, unknown>).role as string;
    if (!hasMinRole(userRole, "admin")) {
      const userInstitution = (session!.user as Record<string, unknown>)
        .institution as string;
      const keyInstitution = SITE_CONFIG_KEY_INSTITUTION as Record<
        string,
        string | undefined
      >;
      return json(
        docs.filter((d) => {
          const inst = keyInstitution[d.config_key];
          return !inst || inst === userInstitution;
        }),
      );
    }

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

    // Delete any stored assets (R2 object + tracking row) that were present
    // in the old value but are no longer referenced by the new value.
    // Non-fatal — a failed cleanup never blocks the save.
    const newKeys = new Set([...extractR2Keys(value)]);
    cleanupStorageKeys(
      oldKeys.filter((k) => !newKeys.has(k)),
      "site-config",
    );

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
