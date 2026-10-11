"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  ArrowRight,
  PlayCircle,
  Search,
  X,
} from "lucide-react";
import type { PublicEventCard } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { EventsFeaturedCarousel } from "./EventsFeaturedCarousel";

/** Cards per page — a multiple of the 3-column grid so rows stay full. */
const PAGE_SIZE = 9;
/** Slides in the carousel when nothing is pinned. */
const LATEST_SLIDES = 5;
/** Cap on pinned slides, so pinning many doesn't make a slow carousel. */
const MAX_FEATURED = 8;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function yearMonth(iso: string): { year: number; month: number } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth() };
}

/**
 * A News & Events listing (site-wide or one college's): a slim title, the
 * featured carousel, then every event as a card — searchable and filterable by
 * year and month, nine to a page.
 */
export function EventsPageLayout({
  events,
  title = "News & Events",
  subtitle,
}: {
  /** Active events, newest first. */
  events: PublicEventCard[];
  title?: string;
  subtitle?: string;
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  // Only scroll back to the grid on a real page change, never on first paint.
  const paged = useRef(false);

  // Pinned events lead the carousel; with none pinned it shows the latest.
  const slides = useMemo(() => {
    const pinned = events.filter((e) => e.featured).slice(0, MAX_FEATURED);
    return pinned.length > 0 ? pinned : events.slice(0, LATEST_SLIDES);
  }, [events]);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const e of events) {
      const ym = yearMonth(e.date);
      if (ym) set.add(ym.year);
    }
    return [...set].sort((a, b) => b - a);
  }, [events]);

  const monthsInYear = useMemo(() => {
    const set = new Set<number>();
    for (const e of events) {
      const ym = yearMonth(e.date);
      if (ym && (year === null || ym.year === year)) set.add(ym.month);
    }
    return [...set].sort((a, b) => a - b);
  }, [events, year]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const ym = yearMonth(e.date);
      if (year !== null && ym?.year !== year) return false;
      if (month !== null && ym?.month !== month) return false;
      if (!q) return true;
      return [e.title, e.excerpt, e.category, e.location]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [events, query, year, month]);

  const filtering = query.trim() !== "" || year !== null || month !== null;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Filtering (or an event being unpublished) can shrink the list under the
  // current page while this component stays mounted.
  const current = Math.min(page, pageCount);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  useEffect(() => {
    if (!paged.current) return;
    const top =
      (gridRef.current?.getBoundingClientRect().top ?? 0) +
      window.scrollY -
      120;
    window.scrollTo({ top, behavior: "smooth" });
  }, [current]);

  const goTo = (next: number) => {
    paged.current = true;
    setPage(next);
  };

  const clearFilters = () => {
    setQuery("");
    setYear(null);
    setMonth(null);
    setPage(1);
  };

  return (
    // Top padding clears the fixed navbar.
    <section className="bg-surface pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-foreground font-serif text-3xl font-bold md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2 font-sans text-base">
              {subtitle}
            </p>
          )}
        </header>

        {slides.length > 0 && !filtering && (
          <div className="mb-10">
            <EventsFeaturedCarousel events={slides} />
          </div>
        )}

        {events.length > 0 && (
          <div
            ref={gridRef}
            className="border-border bg-background mb-8 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center"
          >
            <label className="relative flex-1">
              <span className="sr-only">Search news and events</span>
              <Search
                size={16}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search news and events…"
                className="border-border bg-surface focus:border-accent w-full rounded-xl border py-2.5 pr-3 pl-9 font-sans text-sm outline-none"
              />
            </label>
            <div className="flex gap-3">
              <select
                aria-label="Year"
                value={year ?? ""}
                onChange={(e) => {
                  setYear(e.target.value ? Number(e.target.value) : null);
                  setMonth(null);
                  setPage(1);
                }}
                className="border-border bg-surface focus:border-accent flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm outline-none sm:flex-none"
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                aria-label="Month"
                value={month ?? ""}
                onChange={(e) => {
                  setMonth(e.target.value ? Number(e.target.value) : null);
                  setPage(1);
                }}
                className="border-border bg-surface focus:border-accent flex-1 rounded-xl border px-3 py-2.5 font-sans text-sm outline-none sm:flex-none"
              >
                <option value="">All months</option>
                {monthsInYear.map((m) => (
                  <option key={m} value={m}>
                    {MONTHS[m]}
                  </option>
                ))}
              </select>
            </div>
            {filtering && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-accent inline-flex items-center justify-center gap-1 px-2 font-sans text-sm font-bold"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        )}

        {filtering && (
          <p
            className="text-muted-foreground mb-4 font-sans text-sm"
            aria-live="polite"
          >
            {filtered.length === 0
              ? "No news or events match."
              : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
          </p>
        )}

        {events.length === 0 ? (
          <div className="border-border bg-background rounded-2xl border py-20 text-center">
            <p className="text-muted-foreground font-sans text-base">
              No events have been published yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event, i) => (
              <motion.article
                key={event._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i % 3, 2) * 0.08 }}
                className="group border-border bg-background shadow-card hover:shadow-elevated flex flex-col overflow-hidden rounded-2xl border transition-shadow"
              >
                <Link
                  href={`/events/${event.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="bg-muted relative h-52 w-full overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
                    )}
                    {event.category && (
                      <span className="bg-accent text-accent-foreground absolute top-4 left-4 rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        {event.category}
                      </span>
                    )}
                    {event.hasVideo && (
                      <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold text-white">
                        <PlayCircle size={13} /> Video
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs">
                      {event.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-accent" />
                          {formatEventDate(event.date)}
                        </span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-accent" />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-foreground mb-2 font-serif text-xl leading-snug italic">
                      {event.title}
                    </h3>
                    {event.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 font-sans text-sm leading-relaxed">
                        {event.excerpt}
                      </p>
                    )}

                    <span className="text-accent mt-auto inline-flex items-center gap-1.5 font-sans text-sm font-bold tracking-wide">
                      Read more
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <>
            <Pagination
              page={current}
              pageCount={pageCount}
              onChange={goTo}
              label="Events pagination"
            />
            {pageCount > 1 && (
              <p className="text-muted-foreground mt-4 text-center font-sans text-xs">
                Showing {(current - 1) * PAGE_SIZE + 1}–
                {(current - 1) * PAGE_SIZE + visible.length} of{" "}
                {filtered.length} entries
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
