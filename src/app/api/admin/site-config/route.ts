import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import {
  requireRole,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { SiteConfigPutSchema } from "@/lib/validation";
import { revalidateForConfigKey } from "@/lib/revalidate";
import { extractR2Keys, deleteFromR2 } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
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
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const parsed = await validateBody(req, SiteConfigPutSchema);
  if (!parsed.ok) return parsed.response;
  const { config_key, value } = parsed.data;

  try {
    await connectDB();

    // Fetch the existing doc BEFORE overwriting so we can detect orphaned
    // document keys. Images are not cleaned here — they live in ImageAsset and
    // have their own delete lifecycle.
    const existing = await SiteConfig.findOne({ config_key }).lean();
    const oldDocKeys = existing?.value
      ? [...extractR2Keys(existing.value)].filter((k) =>
          k.startsWith("documents/"),
        )
      : [];

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

    // Delete any document R2 objects that were present in the old value but are
    // no longer referenced by the new value. Non-fatal — a failed R2 delete
    // never blocks the save.
    const newDocKeys = new Set(
      [...extractR2Keys(value)].filter((k) => k.startsWith("documents/")),
    );
    const orphaned = oldDocKeys.filter((k) => !newDocKeys.has(k));
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
