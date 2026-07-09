"use client";

import { m } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  FileEdit,
  GraduationCap,
  MessageSquare,
  Minus,
  Send,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackedLink } from "./ui";
import type { DashboardStats, IconType } from "./types";

type Trend = {
  icon: IconType;
  text: string;
  className: string;
};

function weeklyTrend(count: number): Trend {
  if (count > 0) {
    return {
      icon: TrendingUp,
      text: `${count} this week`,
      className: "bg-emerald-50 text-emerald-700",
    };
  }
  return {
    icon: Minus,
    text: "No changes",
    className: "bg-gray-100 text-gray-500",
  };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export function StatCards({
  stats,
  weekly,
}: {
  stats: DashboardStats;
  weekly: Record<string, number>;
}) {
  const cards: Array<{
    label: string;
    value: number;
    icon: IconType;
    href: string;
    iconClass: string;
    trend: Trend;
  }> = [
    {
      label: "Active Programs",
      value: stats.programs,
      icon: GraduationCap,
      href: "/admin/programs",
      iconClass: "bg-indigo-50 text-indigo-600 ring-indigo-100",
      trend: weeklyTrend(weekly.program ?? 0),
    },
    {
      label: "Published Programs",
      value: stats.published,
      icon: Send,
      href: "/admin/programs",
      iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      trend:
        stats.drafts > 0
          ? {
              icon: FileEdit,
              text: `${stats.drafts} draft${stats.drafts === 1 ? "" : "s"}`,
              className: "bg-amber-50 text-amber-700",
            }
          : {
              icon: CheckCircle2,
              text: "All live",
              className: "bg-emerald-50 text-emerald-700",
            },
    },
    {
      label: "Placement Records",
      value: stats.placements,
      icon: Briefcase,
      href: "/admin/placements",
      iconClass: "bg-amber-50 text-amber-600 ring-amber-100",
      trend: weeklyTrend(weekly.placement ?? 0),
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      href: "/admin/testimonials",
      iconClass: "bg-rose-50 text-rose-600 ring-rose-100",
      trend: weeklyTrend(weekly.testimonial ?? 0),
    },
  ];

  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <m.div key={card.label} variants={item}>
          <TrackedLink
            href={card.href}
            label={card.label}
            className="group block rounded-xl border border-(--dash-border) bg-(--dash-card) p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg ring-1 ring-inset",
                  card.iconClass,
                )}
              >
                <card.icon size={20} />
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  card.trend.className,
                )}
                title="Audit-logged changes in the last 7 days"
              >
                <card.trend.icon size={12} />
                {card.trend.text}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-(--dash-fg) tabular-nums">
                  {card.value}
                </p>
                <p className="mt-1 text-[13px] text-(--dash-muted)">
                  {card.label}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                aria-hidden
                className="mb-1 text-(--dash-subtle) opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </TrackedLink>
        </m.div>
      ))}
    </m.div>
  );
}
