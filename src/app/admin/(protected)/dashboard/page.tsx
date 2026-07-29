import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Program, Page, Placement, Testimonial, AuditLog } from "@/lib/models";
import {
  Briefcase,
  ClipboardList,
  FileEdit,
  GraduationCap,
  MessageSquare,
  Send,
  UploadCloud,
} from "lucide-react";
import { hubHref, sectionItems, visibleSections } from "@/lib/admin-nav";
import { PageShell } from "@/components/admin/kit/PageShell";
import {
  Banner,
  EmptyState,
  PublishBadge,
  SectionLabel,
} from "@/components/admin/kit/primitives";

export const dynamic = "force-dynamic";

/** A published record whose draft has moved on since it last went live. */
type PendingRow = {
  id: string;
  title: string;
  kind: "Program" | "Page";
  href: string;
  updatedAt: Date;
};

async function getDashboardData() {
  try {
    await connectDB();

    // "Published, but edited since" is the question the old dashboard could
    // not answer — it counted programs and testimonials, which never change
    // and so told an editor nothing actionable. Work sitting in draft that
    // someone believes is already live is the actual failure mode here.
    const pendingFilter = {
      status: "published" as const,
      $expr: { $gt: ["$updated_at", "$published_at"] },
    };

    const [
      programs,
      publishedPrograms,
      draftPrograms,
      pages,
      publishedPages,
      placements,
      testimonials,
      pendingPrograms,
      pendingPages,
      logs,
    ] = await Promise.all([
      Program.countDocuments({ is_active: true }),
      Program.countDocuments({ status: "published" }),
      Program.countDocuments({ status: "draft" }),
      Page.countDocuments({}),
      Page.countDocuments({ status: "published" }),
      Placement.countDocuments({ is_active: true }),
      Testimonial.countDocuments({ is_active: true }),
      Program.find(pendingFilter)
        .select("name slug updated_at")
        .sort({ updated_at: -1 })
        .limit(8)
        .lean(),
      Page.find(pendingFilter)
        .select("title slug institution updated_at")
        .sort({ updated_at: -1 })
        .limit(8)
        .lean(),
      AuditLog.find().sort({ created_at: -1 }).limit(8).lean(),
    ]);

    const pending: PendingRow[] = [
      ...(pendingPrograms as Record<string, unknown>[]).map((p) => ({
        id: String(p._id),
        title: String(p.name),
        kind: "Program" as const,
        href: `/admin/programs/${String(p._id)}`,
        updatedAt: p.updated_at as Date,
      })),
      ...(pendingPages as unknown as Record<string, unknown>[]).map((p) => ({
        id: String(p._id),
        title: String(p.title),
        kind: "Page" as const,
        href: `/admin/pages/${String(p._id)}`,
        updatedAt: p.updated_at as Date,
      })),
    ]
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
      .slice(0, 8);

    return {
      programs,
      publishedPrograms,
      draftPrograms,
      pages,
      publishedPages,
      placements,
      testimonials,
      pending,
      logs: logs as Record<string, unknown>[],
      ok: true,
    };
  } catch (err) {
    // A dead database used to render as a dashboard full of zeroes, which
    // reads as "you have no content" rather than "we could not reach the DB".
    console.error("[admin/dashboard] stats failed", err);
    return {
      programs: 0,
      publishedPrograms: 0,
      draftPrograms: 0,
      pages: 0,
      publishedPages: 0,
      placements: 0,
      testimonials: 0,
      pending: [] as PendingRow[],
      logs: [] as Record<string, unknown>[],
      ok: false,
    };
  }
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}) {
  return (
    <Link href={href} className="admin-card admin-card--interactive">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--admin-radius)] bg-[var(--admin-neutral-bg)] text-[var(--admin-text-secondary)]">
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-[length:var(--admin-text-2xl)] leading-none font-bold text-[var(--admin-text)]">
            {value}
          </p>
          <p className="mt-1 text-[length:var(--admin-text-base)] font-medium text-[var(--admin-text-secondary)]">
            {label}
          </p>
          {sub && <p className="admin-help">{sub}</p>}
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  // App Router renders layout and page in parallel, so the `redirect()` in
  // (protected)/layout.tsx does NOT stop this segment — without this check the
  // page went on to query Mongo and flushed real counts into the RSC payload
  // of an unauthenticated 200. The layout guard is defence in depth, not a gate.
  if (!session?.user) redirect("/admin/login");

  const role = (session?.user as Record<string, unknown>)?.role as string;
  if (role === "editor") {
    const institution = (session?.user as Record<string, unknown>)
      ?.institution as string;
    redirect(`/admin/hub/${institution || "engineering"}`);
  }

  const d = await getDashboardData();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <PageShell
      title={`Welcome back, ${firstName}`}
      description="What needs attention across the three colleges, and where to find everything else."
    >
      {!d.ok && (
        <div className="mb-5">
          <Banner tone="danger" title="Could not reach the database">
            The numbers below are not real. Content is not lost — the admin just
            cannot read it right now. Check the database connection before
            editing anything.
          </Banner>
        </div>
      )}

      {/* Unpublished changes — the one thing worth surfacing above the fold.
          Everything else on this page is reference material. */}
      <section className="mb-6">
        <SectionLabel>Needs publishing</SectionLabel>
        <div className="admin-card admin-card--flush">
          {d.pending.length === 0 ? (
            <EmptyState
              icon={<UploadCloud size={20} />}
              title="Everything is published"
              body="No program or page has edits waiting to go live."
            />
          ) : (
            <>
              <div className="admin-bulk-bar">
                <span>
                  {d.pending.length}{" "}
                  {d.pending.length === 1 ? "item has" : "items have"} edits that
                  are not on the public site yet
                </span>
              </div>
              <ul>
                {d.pending.map((row) => (
                  <li
                    key={row.id}
                    className="border-b border-[var(--admin-border-subtle)] last:border-0"
                  >
                    <Link
                      href={row.href}
                      className="flex items-center gap-3 px-4 py-3 no-underline hover:bg-[var(--admin-sunken)]"
                    >
                      <PublishBadge status="draft" />
                      <span className="min-w-0 flex-1 truncate font-medium text-[var(--admin-text)]">
                        {row.title}
                      </span>
                      <span className="hidden text-[length:var(--admin-text-sm)] text-[var(--admin-text-muted)] sm:inline">
                        {row.kind}
                      </span>
                      <span className="text-[length:var(--admin-text-sm)] text-[var(--admin-text-faint)]">
                        {new Date(row.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Counts */}
      <section className="mb-6">
        <SectionLabel>At a glance</SectionLabel>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Programs"
            value={d.programs}
            sub={`${d.publishedPrograms} published · ${d.draftPrograms} draft`}
            icon={GraduationCap}
            href="/admin/programs"
          />
          <StatCard
            label="Dynamic pages"
            value={d.pages}
            sub={`${d.publishedPages} published`}
            icon={FileEdit}
            href="/admin/pages"
          />
          <StatCard
            label="Placement records"
            value={d.placements}
            sub="Visible on the public site"
            icon={Briefcase}
            href="/admin/placements"
          />
          <StatCard
            label="Testimonials"
            value={d.testimonials}
            sub="Visible on the public site"
            icon={MessageSquare}
            href="/admin/testimonials"
          />
        </div>
      </section>

      {/* Sections */}
      <section className="mb-6">
        <SectionLabel>Manage content</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSections(role ?? "admin", "all").map((s) => (
            <Link
              key={s.id}
              href={hubHref(s.id)}
              className="admin-card admin-card--interactive"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--admin-radius)] bg-[var(--admin-neutral-bg)] text-[var(--admin-text-secondary)]">
                  <s.icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--admin-text)]">
                    {s.label}
                  </p>
                  <p className="admin-help">{s.description}</p>
                  <p className="admin-help mt-1 font-medium">
                    {sectionItems(s, role ?? "admin").length} pages
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
