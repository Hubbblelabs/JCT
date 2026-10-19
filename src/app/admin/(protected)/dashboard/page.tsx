import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { AuditLog, Event, Page, Program, SiteConfig, User } from "@/lib/models";
import {
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe,
  LayoutTemplate,
  Newspaper,
  PartyPopper,
  Send,
  Users,
} from "lucide-react";
import { firstNavHref } from "@/lib/admin-nav";
import { describeConfigKey } from "@/lib/admin-config-links";
import { PageShell } from "@/components/admin/kit/PageShell";
import { Banner, EmptyState } from "@/components/admin/kit/primitives";

export const dynamic = "force-dynamic";

/** How many waiting drafts of each kind the list shows before "and N more". */
const PENDING_LIMIT = 6;

type Pending = {
  key: string;
  title: string;
  sub: string;
  href: string | null;
  icon: "program" | "page" | "section";
};

async function getDashboardData() {
  try {
    await connectDB();

    const [
      logs,
      programsTotal,
      programsLive,
      pagesTotal,
      pagesLive,
      eventsVisible,
      usersActive,
      draftPrograms,
      draftPages,
      draftConfigs,
      draftConfigCount,
    ] = await Promise.all([
      AuditLog.find().sort({ created_at: -1 }).limit(8).lean(),
      Program.countDocuments({ status: { $ne: "archived" } }),
      Program.countDocuments({ status: "published" }),
      Page.countDocuments({ status: { $ne: "archived" } }),
      Page.countDocuments({ status: "published" }),
      Event.countDocuments({ is_active: true }),
      User.countDocuments({ is_active: true }),
      Program.find({ status: "draft" })
        .sort({ updated_at: -1 })
        .limit(PENDING_LIMIT)
        .select("name institution updated_at")
        .lean(),
      Page.find({ status: "draft" })
        .sort({ updated_at: -1 })
        .limit(PENDING_LIMIT)
        .select("title institution updated_at")
        .lean(),
      SiteConfig.find({ status: "draft" })
        .sort({ updated_at: -1 })
        .limit(PENDING_LIMIT)
        .select("config_key updated_at updated_by")
        .lean(),
      SiteConfig.countDocuments({ status: "draft" }),
    ]);

    const draftProgramCount = programsTotal - programsLive;
    const draftPageCount = pagesTotal - pagesLive;

    const pending: Pending[] = [
      ...draftConfigs.map((c) => {
        const d = describeConfigKey(String(c.config_key));
        return {
          key: `cfg-${c.config_key}`,
          title: d.label,
          sub: `Section · saved ${relativeTime(c.updated_at as Date)}${
            c.updated_by ? ` by ${c.updated_by}` : ""
          }`,
          href: d.href,
          icon: "section" as const,
        };
      }),
      ...draftPrograms.map((p) => ({
        key: `prog-${p._id}`,
        title: String(p.name || "Untitled program"),
        sub: `Program · ${COLLEGE[String(p.institution)] ?? p.institution} · ${relativeTime(p.updated_at as Date)}`,
        href: `/admin/programs/${p._id}?college=${p.institution}`,
        icon: "program" as const,
      })),
      ...draftPages.map((p) => ({
        key: `page-${p._id}`,
        title: String(p.title || "Untitled page"),
        sub: `Page · ${COLLEGE[String(p.institution)] ?? p.institution} · ${relativeTime(p.updated_at as Date)}`,
        href: `/admin/pages/${p._id}`,
        icon: "page" as const,
      })),
    ];

    return {
      ok: true,
      logs: logs as Record<string, unknown>[],
      stats: {
        programsTotal,
        programsLive,
        draftProgramCount,
        pagesTotal,
        pagesLive,
        draftPageCount,
        eventsVisible,
        usersActive,
      },
      pending,
      pendingTotal: draftConfigCount + draftProgramCount + draftPageCount,
    };
  } catch (err) {
    // A dead database used to render as an empty activity list, which reads as
    // "nothing has happened" rather than "we could not reach the DB".
    console.error("[admin/dashboard] data failed", err);
    return {
      ok: false,
      logs: [] as Record<string, unknown>[],
      stats: null,
      pending: [] as Pending[],
      pendingTotal: 0,
    };
  }
}

const COLLEGE: Record<string, string> = {
  main: "Main website",
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

const RTF = new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" });

/** "3 hours ago", "yesterday" — the feed is read for recency, not for dates. */
function relativeTime(value: Date | string | undefined): string {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((then - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return RTF.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return RTF.format(Math.round(seconds / 3600), "hour");
  if (abs < 86400 * 30) return RTF.format(Math.round(seconds / 86400), "day");
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function greeting(): string {
  // The panel is used in Coimbatore; the server may not be.
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function initials(email: string): string {
  const name = email.replace(/@.*$/, "");
  const parts = name.split(/[._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

const ACTION_BADGE: Record<string, string> = {
  created: "admin-badge-green",
  published: "admin-badge-published",
  deleted: "admin-badge-red",
  reset: "admin-badge-red",
};

const QUICK_LINKS: {
  college: string;
  label: string;
  links: { label: string; href: string }[];
}[] = [
  {
    college: "main",
    label: "Main website",
    links: [
      { label: "Hero", href: "/admin/main/page-content?section=hero" },
      { label: "Navbar", href: "/admin/main/page-content?section=navbar" },
      {
        label: "Entry popup",
        href: "/admin/main/page-content?section=pamphlet",
      },
      { label: "Campus life", href: "/admin/campus-life" },
      { label: "Footer", href: "/admin/global/page-content?section=footer" },
    ],
  },
  ...(["engineering", "arts-science", "polytechnic"] as const).map((c) => ({
    college: c,
    label: COLLEGE[c],
    links: [
      { label: "Landing page", href: `/admin/page-content?college=${c}` },
      { label: "Programs", href: `/admin/programs?college=${c}` },
      { label: "News & events", href: `/admin/events?college=${c}` },
      { label: "About us", href: `/admin/about?college=${c}` },
      { label: "Placements", href: `/admin/placements-page?college=${c}` },
    ],
  })),
];

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
  const s = d.stats;

  return (
    <PageShell
      title={`${greeting()}, ${firstName}`}
      description="What is live, what is waiting to be published, and what changed recently across the three colleges."
      actions={
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-outline"
        >
          <ExternalLink size={14} />
          View public site
        </a>
      }
    >
      {!d.ok && (
        <div className="mb-5">
          <Banner tone="danger" title="Could not reach the database">
            The dashboard could not be loaded. Content is not lost — the admin
            just cannot read it right now. Check the database connection before
            editing anything.
          </Banner>
        </div>
      )}

      {s && (
        <div className="admin-stat-grid">
          <StatCard
            href="/admin/programs"
            label="Programs"
            value={s.programsTotal}
            icon={<GraduationCap size={18} />}
            meta={
              <>
                <span>{s.programsLive} live</span>
                {s.draftProgramCount > 0 && (
                  <span className="admin-badge admin-badge-draft">
                    {s.draftProgramCount} draft
                  </span>
                )}
              </>
            }
          />
          <StatCard
            href="/admin/pages"
            label="Dynamic pages"
            value={s.pagesTotal}
            tone="info"
            icon={<FileText size={18} />}
            meta={
              <>
                <span>{s.pagesLive} live</span>
                {s.draftPageCount > 0 && (
                  <span className="admin-badge admin-badge-draft">
                    {s.draftPageCount} draft
                  </span>
                )}
              </>
            }
          />
          <StatCard
            href="/admin/events?scope=main"
            label="News & events"
            value={s.eventsVisible}
            tone="success"
            icon={<Newspaper size={18} />}
            meta={<span>visible on the site</span>}
          />
          <StatCard
            href="/admin/users"
            label="People with access"
            value={s.usersActive}
            tone="neutral"
            icon={<Users size={18} />}
            meta={<span>active accounts</span>}
          />
        </div>
      )}

      <div className="admin-dash-grid">
        {/* Waiting to be published */}
        <section
          className="admin-card admin-card--flush"
          aria-labelledby="dash-pending"
        >
          <div className="admin-panel-head">
            <h2 id="dash-pending" className="admin-panel-title">
              <Send size={15} className="text-[var(--admin-draft)]" />
              Waiting to be published
              {d.pendingTotal > 0 && (
                <span className="admin-panel-count">{d.pendingTotal}</span>
              )}
            </h2>
          </div>
          {d.pending.length === 0 ? (
            <EmptyState
              icon={<PartyPopper size={20} />}
              title="Everything is live"
              body="No section, program or page has a saved draft that is not on the public site yet."
            />
          ) : (
            <>
              <ul className="admin-list">
                {d.pending.map((p) => (
                  <li key={p.key}>
                    <PendingRow item={p} />
                  </li>
                ))}
              </ul>
              {d.pendingTotal > d.pending.length && (
                <p className="admin-help px-5 pb-4">
                  And {d.pendingTotal - d.pending.length} more. Open a section
                  from the sidebar and choose <strong>Publish</strong> to put
                  its draft live.
                </p>
              )}
            </>
          )}
        </section>

        {/* Quick links */}
        <section
          className="admin-card admin-card--flush"
          aria-labelledby="dash-quick"
        >
          <div className="admin-panel-head">
            <h2 id="dash-quick" className="admin-panel-title">
              <LayoutTemplate
                size={15}
                className="text-[var(--admin-gold-deep)]"
              />
              Jump to
            </h2>
          </div>
          {QUICK_LINKS.map((q) => (
            <div key={q.college} className="admin-quick-college">
              <p className="admin-quick-college-name">
                {q.college === "main" ? (
                  <Globe size={14} className="text-[var(--admin-text-muted)]" />
                ) : (
                  <GraduationCap
                    size={14}
                    className="text-[var(--admin-text-muted)]"
                  />
                )}
                {q.label}
              </p>
              <div className="admin-quick-links">
                {q.links.map((l) => (
                  <Link key={l.href} href={l.href} className="admin-chip-link">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Activity */}
      <section
        className="admin-card admin-card--flush"
        aria-labelledby="dash-activity"
      >
        <div className="admin-panel-head">
          <h2 id="dash-activity" className="admin-panel-title">
            <ClipboardList
              size={15}
              className="text-[var(--admin-text-muted)]"
            />
            Recent activity
          </h2>
          <Link
            href="/admin/audit"
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            Full audit log
            <ChevronRight size={13} />
          </Link>
        </div>
        {d.logs.length === 0 ? (
          <EmptyState
            icon={<Send size={20} />}
            title="No activity yet"
            body="Every content change made in this panel is recorded here."
          />
        ) : (
          <ul className="admin-feed">
            {d.logs.map((log) => {
              const action = String(log.action);
              const email = String(log.user_email ?? "");
              return (
                <li key={String(log._id)} className="admin-feed-item">
                  <span
                    className="admin-avatar admin-feed-avatar"
                    aria-hidden="true"
                  >
                    {initials(email)}
                  </span>
                  <div className="admin-feed-body">
                    <p className="admin-feed-summary">{String(log.summary)}</p>
                    <p className="admin-feed-meta">
                      <span
                        className={`admin-badge capitalize ${
                          ACTION_BADGE[action] ?? "admin-badge-gray"
                        }`}
                      >
                        {action}
                      </span>
                      <span className="capitalize">
                        {String(log.entity_type)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{email}</span>
                    </p>
                  </div>
                  <time
                    className="admin-feed-when"
                    dateTime={new Date(log.created_at as string).toISOString()}
                    title={new Date(log.created_at as string).toLocaleString(
                      "en-IN",
                    )}
                  >
                    {relativeTime(log.created_at as string)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}

function StatCard({
  href,
  label,
  value,
  icon,
  meta,
  tone,
}: {
  href: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  meta: React.ReactNode;
  tone?: "info" | "success" | "neutral";
}) {
  return (
    <Link href={href} className="admin-card admin-card--interactive admin-stat">
      <span className="admin-stat-head">
        <span className="admin-stat-label">{label}</span>
        <span className="admin-stat-icon" data-tone={tone}>
          {icon}
        </span>
      </span>
      <span className="admin-stat-value">{value.toLocaleString("en-IN")}</span>
      <span className="admin-stat-meta">{meta}</span>
    </Link>
  );
}

const PENDING_ICON = {
  program: GraduationCap,
  page: FileText,
  section: LayoutTemplate,
} as const;

function PendingRow({ item }: { item: Pending }) {
  const Icon = PENDING_ICON[item.icon];
  const body = (
    <>
      <span className="admin-list-icon">
        <Icon size={15} />
      </span>
      <span className="admin-list-text">
        <span className="admin-list-title">{item.title}</span>
        <span className="admin-list-sub">{item.sub}</span>
      </span>
      <span className="admin-badge admin-badge-draft">Draft</span>
      {item.href && <ChevronRight size={15} className="admin-list-chevron" />}
    </>
  );
  return item.href ? (
    <Link href={item.href} className="admin-list-row">
      {body}
    </Link>
  ) : (
    <div className="admin-list-row">{body}</div>
  );
}
