import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import { ChevronRight, ClipboardList, Send } from "lucide-react";
import { firstNavHref } from "@/lib/admin-nav";
import { PageShell } from "@/components/admin/kit/PageShell";
import { Banner, EmptyState } from "@/components/admin/kit/primitives";

export const dynamic = "force-dynamic";

/** How many entries the feed shows before pointing at the full audit log. */
const ACTIVITY_LIMIT = 20;

async function getRecentActivity() {
  try {
    await connectDB();
    const logs = await AuditLog.find()
      .sort({ created_at: -1 })
      .limit(ACTIVITY_LIMIT)
      .lean();
    return { ok: true, logs: logs as Record<string, unknown>[] };
  } catch (err) {
    // A dead database used to render as an empty activity list, which reads as
    // "nothing has happened" rather than "we could not reach the DB".
    console.error("[admin/dashboard] data failed", err);
    return { ok: false, logs: [] as Record<string, unknown>[] };
  }
}

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

  const d = await getRecentActivity();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <PageShell
      title={`${greeting()}, ${firstName}`}
      description="What changed recently across the three colleges."
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
