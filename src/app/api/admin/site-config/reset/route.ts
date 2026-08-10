import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import {
  requireRole,
  json,
  badRequest,
  validationError,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateEverything } from "@/lib/revalidate";
import { ResetOptionsSchema } from "@/lib/validation";
import { sweepAssets, wipeContent, type ResetReport } from "@/lib/reset";

/**
 * A reset walks the whole bucket and issues one delete per object. On this site
 * that is well over a thousand round trips, which the platform default does not
 * cover.
 */
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  /**
   * Reset has always been POSTed with no body, and still may be: an absent or
   * empty body means the historical scope — site config plus every asset no
   * surviving document references. `validateBody` is not usable here because
   * it treats an empty body as malformed JSON.
   */
  let body: unknown = {};
  try {
    const raw = await req.text();
    if (raw.trim()) body = JSON.parse(raw);
  } catch {
    return badRequest("Request body must be valid JSON");
  }
  const parsed = ResetOptionsSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);

  const resetContent = parsed.data.content === true;
  const purgeAll = parsed.data.assets === true;

  try {
    await connectDB();

    // Config first, content second, assets last. The asset sweep's reference
    // scan reads the database, so anything deleted after it would still be
    // found holding its storage keys and would spare them.
    const configs = await SiteConfig.deleteMany({});
    const content = resetContent ? await wipeContent() : null;
    const assets = await sweepAssets({ purgeAll });

    /**
     * Not `revalidateTargets` — a reset can empty `Program`, `Page` and
     * `Event`, whose public routes are dynamic segments no target covers.
     * Leaving those cached serves detail pages for content that no longer
     * exists. This is exactly the case `revalidateEverything` is for.
     */
    revalidateEverything();

    const report: ResetReport = {
      configs: configs.deletedCount,
      content,
      assets,
    };

    const parts = [`${report.configs} configs`];
    if (content) {
      parts.push(...Object.entries(content).map(([name, n]) => `${n} ${name}`));
    }
    parts.push(
      `${assets.objects_deleted} objects deleted from storage (${assets.untracked_deleted} untracked)`,
      `${assets.rows_deleted} asset rows`,
      `${assets.assets_kept} assets kept`,
    );
    if (!assets.storage_configured) parts.push("storage not configured");
    else if (!assets.storage_listed) parts.push("bucket could not be listed");
    if (assets.objects_failed > 0)
      parts.push(`${assets.objects_failed} storage failures`);

    await logAudit(
      "site-config",
      "reset",
      session!.user?.email ?? "",
      `${purgeAll ? "Full purge" : "Full reset"} — ${parts.join(", ")}`,
    );

    return json(report);
  } catch (e) {
    console.error("[site-config/reset]", e);
    return serverError();
  }
}
