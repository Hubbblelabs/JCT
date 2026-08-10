import { NextRequest } from "next/server";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateEverything } from "@/lib/revalidate";

/**
 * Clear every cache the app owns, on demand.
 *
 * Every admin write already revalidates the pages it affects, so this is not
 * part of the normal editing flow — it is the recovery path for the cases where
 * that mapping is wrong or bypassed: a restored backup that wrote documents
 * straight into Mongo, a SiteConfig key with no `SITE_CONFIG_KEY_TARGETS` entry,
 * a page edited directly in the database. Without it the only way to clear a
 * stale public page was to wait out the 1h ISR window or restart the container.
 *
 * Admin-only: this makes every public page re-render on its next visit, which
 * is a real (if brief) load spike on the database.
 */
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    revalidateEverything();
  } catch (e) {
    console.error("[admin/cache] reset:", e);
    return serverError("Could not clear the cache");
  }

  await logAudit(
    "cache",
    "reset",
    session!.user?.email ?? "",
    "Cleared the public API cache and marked every page for revalidation",
  );

  return json({ cleared: true });
}
