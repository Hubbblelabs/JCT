"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PlayCircle,
} from "lucide-react";
import type { PublicEventCard } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";

const INTERVAL_MS = 6500;

/**
 * The slides at the top of a News & Events page: the events an editor pinned
 * as featured, or the latest ones when nothing is pinned. Advances on its own,
 * pauses while hovered or focused.
 */
export function EventsFeaturedCarousel({
  events,
}: {
  events: PublicEventCard[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = events.length;
  const current = events[Math.min(index, count - 1)];

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => go(1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count, go]);

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured news and events"
      className="border-border bg-background shadow-card relative overflow-hidden rounded-3xl border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr]"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
        >
          <Link
            href={`/events/${current.slug}`}
            className="bg-muted group relative block aspect-video overflow-hidden md:aspect-auto md:min-h-80"
            tabIndex={-1}
            aria-hidden="true"
          >
            {current.image ? (
              <Image
                src={current.image}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
            )}
            {current.hasVideo && (
              <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white">
                <PlayCircle size={14} /> Video
              </span>
            )}
          </Link>

          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            {current.category && (
              <span className="bg-accent text-accent-foreground self-start rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                {current.category}
              </span>
            )}
            <h2 className="text-foreground font-serif text-2xl leading-snug italic md:text-3xl">
              <Link
                href={`/events/${current.slug}`}
                className="hover:underline hover:underline-offset-4"
              >
                {current.title}
              </Link>
            </h2>
            <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 font-sans text-sm">
              {current.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-accent" />
                  {formatEventDate(current.date)}
                </span>
              )}
              {current.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-accent" />
                  {current.location}
                </span>
              )}
            </div>
            {current.excerpt && (
              <p className="text-muted-foreground line-clamp-3 font-sans text-base leading-relaxed">
                {current.excerpt}
              </p>
            )}
            <Link
              href={`/events/${current.slug}`}
              className="text-accent inline-flex items-center gap-1.5 self-start font-sans text-sm font-bold tracking-wide"
            >
              Read more <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <div className="absolute top-1/2 left-3 hidden -translate-y-1/2 md:block">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <div className="absolute right-3 bottom-4 flex items-center gap-3 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white md:flex"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-center gap-2 pb-5">
            {events.map((e, i) => (
              <button
                key={e._id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${e.title}`}
                aria-current={i === index || undefined}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "bg-accent w-6" : "bg-border w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
