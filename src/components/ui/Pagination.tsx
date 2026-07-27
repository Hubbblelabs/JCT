"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Page numbers to render, with `null` standing for an ellipsis gap. The first
 * and last page are always present so the ends of the range stay reachable in
 * one click no matter how long the list is.
 */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | null)[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);

  if (from > 2) out.push(null);
  for (let p = from; p <= to; p++) out.push(p);
  if (to < total - 1) out.push(null);

  out.push(total);
  return out;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  label = "Pagination",
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Accessible name for the nav landmark — set it when a page has several. */
  label?: string;
}) {
  if (pageCount <= 1) return null;

  const btn =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 font-sans text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label={label}
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${btn} border-border text-navy bg-white hover:bg-stone-50`}
      >
        <ChevronLeft size={16} />
      </button>

      {pageWindow(page, pageCount).map((p, i) =>
        p === null ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="text-muted-foreground px-1 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`${btn} ${
              p === page
                ? "border-navy bg-navy text-white"
                : "border-border text-navy bg-white hover:bg-stone-50"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        className={`${btn} border-border text-navy bg-white hover:bg-stone-50`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
