"use client";

// "Continue editing" — recently visited admin pages, remembered client-side
// by dashboard links (see recent-pages.ts). Renders nothing until mounted
// (localStorage is browser-only) and hides itself entirely when empty.

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { iconForHref } from "./registry";
import { readRecentPages, type RecentPage } from "./recent-pages";
import { TrackedLink } from "./ui";

export function RecentShortcuts() {
  const [pages, setPages] = useState<RecentPage[] | null>(null);

  useEffect(() => {
    setPages(readRecentPages());
  }, []);

  if (!pages || pages.length === 0) return null;

  return (
    <section aria-labelledby="continue-editing-title">
      <h2
        id="continue-editing-title"
        className="text-sm font-semibold tracking-tight text-(--dash-fg)"
      >
        Continue editing
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {pages.slice(0, 6).map((page) => {
          const Icon = iconForHref(page.href) ?? ArrowUpRight;
          return (
            <TrackedLink
              key={page.href}
              href={page.href}
              label={page.label}
              className="inline-flex items-center gap-2 rounded-full border border-(--dash-border) bg-(--dash-card) py-1.5 pr-4 pl-2.5 text-[13px] font-medium text-(--dash-muted) shadow-xs transition-colors hover:border-(--dash-border-strong) hover:text-(--dash-fg)"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-(--dash-hover) text-(--dash-subtle)">
                <Icon size={12} />
              </span>
              {page.label}
            </TrackedLink>
          );
        })}
      </div>
    </section>
  );
}
