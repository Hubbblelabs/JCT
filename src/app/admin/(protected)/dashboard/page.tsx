import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import { ClipboardList, Send } from "lucide-react";
import { firstNavHref } from "@/lib/admin-nav";
import { PageShell } from "@/components/admin/kit/PageShell";
import {
  Banner,
  EmptyState,
  SectionLabel,
} from "@/components/admin/kit/primitives";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    await connectDB();

    const logs = await AuditLog.find().sort({ created_at: -1 }).limit(8).lean();

    return { logs: logs as Record<string, unknown>[], ok: true };
  } catch (err) {
    // A dead database used to render as an empty activity list, which reads as
    // "nothing has happened" rather than "we could not reach the DB".
    console.error("[admin/dashboard] activity failed", err);
    return { logs: [] as Record<string, unknown>[], ok: false };
  }
}

export default async function DashboardPage() {
  const session = await auth();

  // App Router renders layout and page in parallel, so the `redirect()` in
  // (protected)/layout.tsx does NOT stop this segment — without this check the
  // page went on to query Mongo and flushed real rows into the RSC payload
  // of an unauthenticated 200. The layout guard is defence in depth, not a gate.
  if (!session?.user) redirect("/admin/login");

  const role = (session?.user as Record<string, unknown>)?.role as string;
  if (role === "editor") {
    const institution = (session?.user as Record<string, unknown>)
      ?.institution as string;
    // Editors have no dashboard. Send them to the first page their scope can
    // open — resolved from the nav registry, so a stale institution value
    // lands somewhere real instead of on a section they cannot view.
    redirect(firstNavHref(role, institution));
  }

  const d = await getDashboardData();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <PageShell
      title={`Welcome back, ${firstName}`}
      description="The latest content changes across the three colleges."
    >
      {!d.ok && (
        <div className="mb-5">
          <Banner tone="danger" title="Could not reach the database">
            Recent activity could not be loaded. Content is not lost — the admin
            just cannot read it right now. Check the database connection before
            editing anything.
          </Banner>
        </div>
      )}

      {/* Activity */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Recent activity</SectionLabel>
          <Link
            href="/admin/audit"
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <ClipboardList size={13} />
            Full audit log
          </Link>
        </div>
        <div className="admin-card admin-card--flush">
          {d.logs.length === 0 ? (
            <EmptyState
              icon={<Send size={20} />}
              title="No activity yet"
              body="Every content change made in this panel is recorded here."
            />
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table admin-table--stack">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Action</th>
                    <th>By</th>
                    <th>Summary</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {d.logs.map((log) => (
                    <tr key={String(log._id)}>
                      <td data-label="Type">
                        <span className="admin-badge admin-badge-gray capitalize">
                          {String(log.entity_type)}
                        </span>
                      </td>
                      <td data-label="Action" className="capitalize">
                        {String(log.action)}
                      </td>
                      <td
                        data-label="By"
                        className="text-[var(--admin-text-muted)]"
                      >
                        {String(log.user_email)}
                      </td>
                      <td
                        data-label="Summary"
                        className="text-[var(--admin-text-secondary)]"
                      >
                        {String(log.summary)}
                      </td>
                      <td
                        data-label="When"
                        className="text-[length:var(--admin-text-sm)] text-[var(--admin-text-faint)]"
                      >
                        {new Date(log.created_at as string).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
