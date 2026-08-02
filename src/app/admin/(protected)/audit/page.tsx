export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import { hasMinRole } from "@/lib/permissions";
import { PageShell } from "@/components/admin/kit/PageShell";
import { Banner } from "@/components/admin/kit/primitives";
import { AuditLogTable, type AuditRow } from "@/components/admin/AuditLogTable";
import { AUDIT_PAGE_SIZE } from "@/lib/audit";

/**
 * Only the newest page is rendered on the server. The trail grows without
 * bound between purges, and reading all of it to draw one screen was the
 * slowest query in the panel — older pages are fetched from
 * `/api/admin/audit` as the reader walks back through them.
 */
async function getLogs(): Promise<{
  rows: AuditRow[];
  hasMore: boolean;
  ok: boolean;
}> {
  try {
    await connectDB();
    // One extra row decides whether there is an older page to fetch.
    const docs = (await AuditLog.find()
      .sort({ created_at: -1 })
      .limit(AUDIT_PAGE_SIZE + 1)
      .lean()) as unknown as Record<string, unknown>[];
    const hasMore = docs.length > AUDIT_PAGE_SIZE;
    return {
      ok: true,
      hasMore,
      rows: (hasMore ? docs.slice(0, AUDIT_PAGE_SIZE) : docs).map((d) => ({
        id: String(d._id),
        entityType: String(d.entity_type ?? ""),
        action: String(d.action ?? ""),
        userEmail: String(d.user_email ?? ""),
        summary: String(d.summary ?? ""),
        createdAt: new Date(d.created_at as string).toISOString(),
      })),
    };
  } catch (err) {
    console.error("[admin/audit] load failed", err);
    return { ok: false, hasMore: false, rows: [] };
  }
}

export default async function AuditPage() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown> | undefined)?.role as
    string | undefined;
  // Checked here, before the query, rather than relying on the layout's
  // redirect — layout and page render in parallel, so a layout-only guard
  // still lets this segment read the audit trail and stream it.
  if (!session?.user) redirect("/admin/login");
  if (!hasMinRole(role ?? "", "admin")) {
    redirect("/admin/dashboard");
  }

  const { rows, hasMore, ok } = await getLogs();

  return (
    <PageShell
      title="Audit log"
      description="Every content change made in this panel, newest first. Entries are kept for one year."
    >
      {!ok && (
        <div className="mb-4">
          <Banner tone="danger" title="Could not read the audit log">
            The database could not be reached. This is a display problem — no
            history has been lost.
          </Banner>
        </div>
      )}
      <AuditLogTable initialRows={rows} initialHasMore={hasMore} />
    </PageShell>
  );
}
