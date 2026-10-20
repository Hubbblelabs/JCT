import { NextRequest } from "next/server";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateEverything } from "@/lib/revalidate";

/**
 * Clear every cache the app owns, on demand.
 *
 * Every admin write already revalidates the pages it affects — restore and
 * reset included, which call `revalidateEverything` themselves — so nothing
 * done through the panel needs this. It is the operator's recovery path for
 * writes no route sees: a document edited directly in the database (mongosh,
 * Compass, a one-off script). Without it the only way to clear such a page is
 * to wait out its ISR window (up to 24h) or redeploy. Lives on the Backup &
 * restore screen, beside the other operator tools, rather than in the everyday
 * sidebar.
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
