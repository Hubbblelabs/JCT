"use client";

// Dashboard widgets — pure UI groupings over data the server component
// already loads. No new APIs; every link targets an existing admin page.

import NextImage from "next/image";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  Database,
  HardDrive,
  Image as ImageIcon,
  Layers,
  MapPin,
  MessageSquare,
  Quote,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INSTITUTION_LABELS } from "./registry";
import { eventDateParts, timeAgo } from "./time";
import { Avatar, Badge, Card, CardHeader, EmptyState } from "./ui";
import type {
  DashboardStats,
  EventItem,
  IconType,
  PlacementItem,
  TestimonialItem,
  UploadItem,
} from "./types";

function institutionLabel(id: string): string {
  return INSTITUTION_LABELS[id] ?? id;
}

/* ── System status ───────────────────────────────────── */

type StatusTone = "ok" | "warn" | "bad" | "neutral";

const DOT_TONES: Record<StatusTone, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
  neutral: "bg-gray-300",
};

function StatusRow({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: IconType;
  label: string;
  value: string;
  tone?: StatusTone;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <Icon size={15} className="shrink-0 text-(--dash-subtle)" aria-hidden />
      <span className="flex-1 text-[13px] text-(--dash-muted)">{label}</span>
      <span className="inline-flex items-center gap-2 text-[13px] font-medium text-(--dash-fg)">
        {value}
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 rounded-full", DOT_TONES[tone])}
        />
      </span>
    </li>
  );
}

export function SystemStatus({
  dbOk,
  storage,
  stats,
  lastActivity,
}: {
  dbOk: boolean;
  storage: "r2" | "local";
  stats: DashboardStats;
  lastActivity?: string;
}) {
  return (
    <Card>
      <CardHeader
        title="System status"
        icon={dbOk ? CheckCircle2 : XCircle}
        action={{ label: "Settings", href: "/admin/settings" }}
      />
      <ul className="divide-y divide-(--dash-border)">
        <StatusRow
          icon={Database}
          label="Database"
          value={dbOk ? "Connected" : "Unreachable"}
          tone={dbOk ? "ok" : "bad"}
        />
        <StatusRow
          icon={HardDrive}
          label="Media storage"
          value={storage === "r2" ? "Cloudflare R2" : "Local fallback"}
          tone={storage === "r2" ? "ok" : "warn"}
        />
        <StatusRow
          icon={Layers}
          label="Program content"
          value={`${stats.published} live · ${stats.drafts} draft${stats.drafts === 1 ? "" : "s"}`}
          tone={stats.drafts > 0 ? "warn" : "ok"}
        />
        <StatusRow
          icon={ImageIcon}
          label="Media library"
          value={`${stats.images} image${stats.images === 1 ? "" : "s"}`}
        />
        <StatusRow
          icon={CalendarDays}
          label="Active events"
          value={String(stats.events)}
        />
        <li
          className="flex items-center gap-3 px-5 py-3"
          suppressHydrationWarning
        >
          <Clock size={15} className="shrink-0 text-(--dash-subtle)" />
          <span className="flex-1 text-[13px] text-(--dash-muted)">
            Last change
          </span>
          <span className="text-[13px] font-medium text-(--dash-fg)">
            {lastActivity ? timeAgo(lastActivity) : "—"}
          </span>
        </li>
      </ul>
    </Card>
  );
}

/* ── Recent placements ───────────────────────────────── */

export function RecentPlacements({ items }: { items: PlacementItem[] }) {
  return (
    <Card>
      <CardHeader
        title="Recent placements"
        icon={Briefcase}
        action={{ label: "View all", href: "/admin/placements" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No placement records"
          hint="Year-wise placement statistics will show up here."
          cta={{ label: "Add placement record", href: "/admin/placements" }}
        />
      ) : (
        <ul className="divide-y divide-(--dash-border)">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-(--dash-hover)/60"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium text-(--dash-fg)">
                  {p.year}
                  {p.isCurrent && <Badge tone="emerald">Current</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-(--dash-muted)">
                  {institutionLabel(p.institution)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-(--dash-fg) tabular-nums">
                  {p.studentsPlaced} placed
                </p>
                <p className="mt-0.5 text-xs text-(--dash-muted) tabular-nums">
                  {p.placementPercentage}%
                  {p.highestPackage ? ` · ${p.highestPackage} high` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Recent events ───────────────────────────────────── */

export function RecentEvents({ items }: { items: EventItem[] }) {
  return (
    <Card>
      <CardHeader
        title="Recent events"
        icon={CalendarDays}
        action={{ label: "View all", href: "/admin/events" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No recent events"
          hint="News and campus events you publish will appear here."
          cta={{ label: "Create your first event", href: "/admin/events" }}
        />
      ) : (
        <ul className="divide-y divide-(--dash-border)">
          {items.map((event) => {
            const { day, month } = eventDateParts(event.eventDate);
            return (
              <li
                key={event.id}
                className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-(--dash-hover)/60"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-(--dash-hover) ring-1 ring-(--dash-border) ring-inset"
                >
                  <span className="text-sm leading-none font-semibold text-(--dash-fg) tabular-nums">
                    {day}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium text-(--dash-subtle) uppercase">
                    {month}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-(--dash-fg)">
                    {event.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-(--dash-muted)">
                    <Badge tone="teal">{event.category}</Badge>
                    <span className="truncate">
                      {institutionLabel(event.institution)}
                      {event.location && (
                        <>
                          {" · "}
                          <MapPin size={11} className="inline" />{" "}
                          {event.location}
                        </>
                      )}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ── Recent uploads ──────────────────────────────────── */

export function RecentUploads({ items }: { items: UploadItem[] }) {
  return (
    <Card>
      <CardHeader title="Recent uploads" icon={ImageIcon} />
      {items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No uploads yet"
          hint="Images uploaded through any editor land here automatically."
          cta={{
            label: "Open content editors",
            href: "/admin/page-content?college=engineering",
          }}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 p-4">
          {items.map((upload) => (
            <li key={upload.id} className="min-w-0">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-(--dash-hover) ring-1 ring-(--dash-border) ring-inset">
                <NextImage
                  src={upload.url}
                  alt={upload.altText || upload.filename}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <p className="mt-1.5 truncate text-xs font-medium text-(--dash-fg)">
                {upload.filename}
              </p>
              <p
                className="text-[11px] text-(--dash-subtle) capitalize"
                suppressHydrationWarning
              >
                {upload.category} · {timeAgo(upload.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ── Latest testimonials ─────────────────────────────── */

export function LatestTestimonials({ items }: { items: TestimonialItem[] }) {
  return (
    <Card>
      <CardHeader
        title="Latest testimonials"
        icon={MessageSquare}
        action={{ label: "View all", href: "/admin/testimonials" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          hint="Alumni and student voices you add will preview here."
          cta={{ label: "Add testimonial", href: "/admin/testimonials" }}
        />
      ) : (
        <ul className="divide-y divide-(--dash-border)">
          {items.map((t) => (
            <li
              key={t.id}
              className="px-5 py-3.5 transition-colors hover:bg-(--dash-hover)/60"
            >
              <div className="flex items-center gap-2.5">
                {t.avatar ? (
                  <NextImage
                    src={t.avatar}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-(--dash-border)"
                  />
                ) : (
                  <Avatar seed={t.name} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-(--dash-fg)">
                    {t.name}
                  </p>
                  <p className="truncate text-[11px] text-(--dash-muted)">
                    {[t.batch, institutionLabel(t.institution)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Badge tone="pink">{t.category}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-(--dash-muted)">
                “{t.quote}”
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
