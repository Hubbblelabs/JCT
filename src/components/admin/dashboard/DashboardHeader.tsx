"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Clock,
  History,
  Pencil,
  Plus,
  Send,
  Trash2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QUICK_ACTIONS } from "./registry";
import { fullDate, greetingFor, timeAgo } from "./time";
import { Avatar, TrackedLink, moveMenuFocus, useDismiss } from "./ui";
import type { ActivityItem, DashboardUser, IconType } from "./types";

/* ── Action icon mapping (shared with ActivityFeed) ──── */

export function actionVisual(action: string): {
  icon: IconType;
  className: string;
} {
  const a = action.toLowerCase();
  if (a.includes("creat"))
    return { icon: Plus, className: "bg-emerald-50 text-emerald-600" };
  if (a.includes("delet"))
    return { icon: Trash2, className: "bg-red-50 text-red-600" };
  if (a.includes("publish"))
    return { icon: Send, className: "bg-violet-50 text-violet-600" };
  if (a.includes("restor") || a.includes("reset"))
    return { icon: History, className: "bg-amber-50 text-amber-600" };
  if (a.includes("updat"))
    return { icon: Pencil, className: "bg-blue-50 text-blue-600" };
  return { icon: Clock, className: "bg-gray-100 text-gray-500" };
}

/* ── Notification bell ───────────────────────────────── */

const SEEN_KEY = "jct-admin-notifications-seen";

function NotificationBell({ items }: { items: ActivityItem[] }) {
  const [open, setOpen] = useState(false);
  const [unseen, setUnseen] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);

  useEffect(() => {
    try {
      const seen = Number(window.localStorage.getItem(SEEN_KEY) ?? 0);
      setUnseen(
        items.filter((i) => new Date(i.createdAt).getTime() > seen).length,
      );
    } catch {
      // localStorage unavailable — badge simply stays hidden
    }
  }, [items]);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        try {
          window.localStorage.setItem(SEEN_KEY, String(Date.now()));
        } catch {
          // ignore
        }
        setUnseen(0);
      }
      return next;
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={
          unseen > 0 ? `Notifications, ${unseen} new` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative grid h-10 w-10 place-items-center rounded-lg border border-(--dash-border) bg-(--dash-card) text-(--dash-muted) shadow-xs transition-colors hover:bg-(--dash-hover) hover:text-(--dash-fg)"
      >
        <Bell size={17} />
        {unseen > 0 && (
          <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unseen > 9 ? "9+" : unseen}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Recent notifications"
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-(--dash-border) bg-(--dash-card) shadow-lg sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-(--dash-border) px-4 py-3">
            <p className="text-sm font-semibold text-(--dash-fg)">
              Notifications
            </p>
            <span className="text-[11px] text-(--dash-subtle)">
              From the audit log
            </span>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-(--dash-muted)">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-(--dash-border) overflow-y-auto">
              {items.slice(0, 8).map((item) => {
                const visual = actionVisual(item.action);
                return (
                  <li key={item.id} className="flex gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                        visual.className,
                      )}
                    >
                      <visual.icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[13px] leading-snug text-(--dash-fg)">
                        {item.summary || `${item.action} ${item.entityType}`}
                      </p>
                      <p
                        className="mt-0.5 flex items-center gap-1.5 text-[11px] text-(--dash-subtle)"
                        suppressHydrationWarning
                      >
                        <Avatar seed={item.userEmail} size="sm" />
                        {item.userEmail.split("@")[0]} ·{" "}
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-(--dash-border) bg-(--dash-hover)/60 px-4 py-2.5">
            <TrackedLink
              href="/admin/audit"
              label="Audit Log"
              className="text-xs font-medium text-(--dash-muted) transition-colors hover:text-(--dash-fg)"
            >
              View full audit log →
            </TrackedLink>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Quick actions menu ──────────────────────────────── */

function QuickActionsMenu() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-(--dash-navy) px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#1a2a42]"
      >
        <Zap size={15} />
        Quick actions
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Quick actions"
          onKeyDown={(e) => moveMenuFocus(e, menuRef.current)}
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-(--dash-border) bg-(--dash-card) p-1.5 shadow-lg"
        >
          {QUICK_ACTIONS.map((action) => (
            <TrackedLink
              key={action.href}
              href={action.href}
              label={action.label}
              role="menuitem"
              onClickCapture={close}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-(--dash-hover)"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--dash-hover) text-(--dash-muted)">
                <action.icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-(--dash-fg)">
                  {action.label}
                </span>
                <span className="block truncate text-[11px] text-(--dash-subtle)">
                  {action.description}
                </span>
              </span>
            </TrackedLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────── */

export function DashboardHeader({
  user,
  activity,
}: {
  user: DashboardUser;
  activity: ActivityItem[];
}) {
  const now = new Date();
  const firstName = (user.name || "Admin").split(" ")[0];
  const lastUpdated = activity[0]?.createdAt;

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wider text-(--dash-subtle) uppercase">
          Dashboard
        </p>
        <h1
          className="mt-1 text-2xl font-bold tracking-tight text-(--dash-fg) sm:text-3xl"
          suppressHydrationWarning
        >
          {greetingFor(now)}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-(--dash-muted)">
          Manage all JCT institutions from one place.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p
            className="text-sm font-medium text-(--dash-fg)"
            suppressHydrationWarning
          >
            {fullDate(now)}
          </p>
          <p
            className="mt-0.5 text-xs text-(--dash-muted)"
            suppressHydrationWarning
          >
            {lastUpdated
              ? `Last updated ${timeAgo(lastUpdated)}`
              : "No changes recorded yet"}
          </p>
        </div>
        <NotificationBell items={activity} />
        <QuickActionsMenu />
      </div>
    </header>
  );
}
