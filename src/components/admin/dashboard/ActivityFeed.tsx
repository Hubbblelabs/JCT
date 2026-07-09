"use client";

import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { actionVisual } from "./DashboardHeader";
import { timeAgo } from "./time";
import { Avatar, Badge, Card, CardHeader, EmptyState } from "./ui";
import type { ActivityItem } from "./types";
import type { BadgeTone } from "./ui";

const ENTITY_TONES: Record<string, BadgeTone> = {
  program: "indigo",
  page: "sky",
  placement: "amber",
  testimonial: "pink",
  recruiter: "violet",
  event: "teal",
  user: "blue",
  image: "emerald",
  document: "emerald",
  "site-config": "gray",
};

function entityTone(entityType: string): BadgeTone {
  return ENTITY_TONES[entityType.toLowerCase()] ?? "gray";
}

export function ActivityFeed({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader
        title="Recent activity"
        icon={History}
        count={items.length > 0 ? items.length : undefined}
        action={{ label: "View all", href: "/admin/audit" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          hint="Changes made anywhere in the CMS will appear here as a timeline."
          cta={{ label: "Open audit log", href: "/admin/audit" }}
        />
      ) : (
        <ul className="max-h-[28rem] flex-1 divide-y divide-(--dash-border) overflow-y-auto">
          {items.map((item) => {
            const visual = actionVisual(item.action);
            const userName = item.userEmail.split("@")[0] || "unknown";
            return (
              <li
                key={item.id}
                className="flex gap-3.5 px-5 py-3.5 transition-colors hover:bg-(--dash-hover)/60"
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    visual.className,
                  )}
                  aria-hidden
                >
                  <visual.icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-snug font-medium text-(--dash-fg)">
                    {item.summary || `${item.action} ${item.entityType}`}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge tone={entityTone(item.entityType)}>
                      <span className="capitalize">{item.entityType}</span>
                    </Badge>
                    <span className="inline-flex items-center gap-1.5 text-xs text-(--dash-muted)">
                      <Avatar seed={item.userEmail} size="sm" />
                      {userName}
                    </span>
                    <span className="text-xs text-(--dash-subtle) capitalize">
                      {item.action}
                    </span>
                  </div>
                </div>
                <time
                  dateTime={item.createdAt}
                  className="mt-1 shrink-0 text-xs whitespace-nowrap text-(--dash-subtle)"
                  suppressHydrationWarning
                >
                  {timeAgo(item.createdAt)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
