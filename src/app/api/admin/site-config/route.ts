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
import { extractStorageKeys } from "@/lib/storage";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";
import { hasMinRole } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  // A single key can be asked for by name — that is how the live-page editors
  // load the *draft* they are about to edit, which the public endpoint will
  // never hand out.
  const key = req.nextUrl.searchParams.get("key");

  try {
    await connectDB();
    const docs = await SiteConfig.find(key ? { config_key: key } : {}).sort({
      config_key: 1,
    });

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
  // Absent means publish — see the schema note.
  const publish = parsed.data.publish !== false;

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

    // Fetch the existing doc BEFORE overwriting so we can detect orphaned storage keys.
    //
    // The union of BOTH sides matters. Draft saves deliberately skip cleanup
    // (see below), so by the time a publish arrives `existing.value` is already
    // the draft that dropped the old key — diffing against the draft alone
    // finds nothing and every asset replaced via "Save draft" then "Save &
    // publish" (the normal authoring path) leaks forever. `published_value`
    // still holds it, so seed from both.
    const existing = await SiteConfig.findOne({ config_key }).lean();
    const oldKeySet = new Set<string>();
    if (existing?.value) extractStorageKeys(existing.value, oldKeySet);
    if (existing?.published_value)
      extractStorageKeys(existing.published_value, oldKeySet);
    const oldKeys = [...oldKeySet];

    const doc = await SiteConfig.findOneAndUpdate(
      { config_key },
      {
        $set: publish
          ? {
              value,
              published_value: value,
              status: "published",
              updated_by: session!.user?.email,
            }
          : // Draft save: the live page keeps serving `published_value`
            // untouched, and `status` records that a newer draft is waiting.
            {
              value,
              status: "draft",
              updated_by: session!.user?.email,
            },
        $inc: { version: 1 },
      },
      { upsert: true, returnDocument: "after" },
    );

    // Delete any stored assets (stored object + tracking row) that were present
    // in the old value but are no longer referenced by the new value.
    // Non-fatal — a failed cleanup never blocks the save.
    //
    // Only on publish: on a draft save the dropped asset may still be
    // referenced by `published_value`, and deleting it would break the live
    // page for a change that has not gone live.
    if (publish) {
      const newKeys = new Set([...extractStorageKeys(value)]);
      cleanupStorageKeys(
        oldKeys.filter((k) => !newKeys.has(k)),
        "site-config",
      );
      revalidateForConfigKey(config_key);
    }

    await logAudit(
      "site-config",
      publish ? "updated" : "draft-saved",
      session!.user?.email ?? "",
      publish
        ? `Updated config: ${config_key}`
        : `Saved draft for config: ${config_key}`,
    );
    return json(doc);
  } catch (e) {
    console.error("[site-config PUT]", e);
    return serverError();
  }
}
