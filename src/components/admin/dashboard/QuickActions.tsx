"use client";

import { ArrowUpRight } from "lucide-react";
import { QUICK_ACTIONS } from "./registry";
import { TrackedLink } from "./ui";

export function QuickActions() {
  return (
    <section id="quick-actions" aria-labelledby="quick-actions-title">
      <h2
        id="quick-actions-title"
        className="text-sm font-semibold tracking-tight text-(--dash-fg)"
      >
        Quick actions
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) => (
          <TrackedLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="group flex items-center gap-4 rounded-xl border border-(--dash-border) bg-(--dash-card) p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-(--dash-border-strong) hover:shadow-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-(--dash-navy)/[0.06] text-(--dash-navy) ring-1 ring-(--dash-navy)/10 transition-colors ring-inset group-hover:bg-(--dash-navy) group-hover:text-white">
              <action.icon size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-(--dash-fg)">
                {action.label}
              </span>
              <span className="mt-0.5 block truncate text-xs text-(--dash-muted)">
                {action.description}
              </span>
            </span>
            <ArrowUpRight
              size={16}
              aria-hidden
              className="shrink-0 text-(--dash-subtle) opacity-0 transition-opacity group-hover:opacity-100"
            />
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
