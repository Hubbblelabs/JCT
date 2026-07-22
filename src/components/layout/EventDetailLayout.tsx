"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import type { PublicEventDetail } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";

// Column counts per gallery size. Every tile keeps a fixed aspect ratio and
// crops with object-cover, so mixed-shape uploads still line up on a grid.
const GALLERY_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export function EventDetailLayout({ event }: { event: PublicEventDetail }) {
  const gallery = event.gallery ?? [];
  const cols = GALLERY_COLS[gallery.length] ?? "grid-cols-2 md:grid-cols-4";
  // A lone photo reads as a banner; two or more read better as uniform cards.
  const tileAspect = gallery.length === 1 ? "aspect-video" : "aspect-[4/3]";

  return (
    <article className="bg-surface py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/events"
            className="text-accent mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-bold tracking-wide underline-offset-4 hover:underline"
          >
            <ArrowLeft size={15} />
            All events
          </Link>

          {event.image && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-3xl md:h-96">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
              />
              {event.category && (
                <span className="bg-accent text-accent-foreground absolute top-5 left-5 rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                  {event.category}
                </span>
              )}
            </div>
          )}

          {!event.image && event.category && (
            <span className="bg-accent text-accent-foreground mb-4 inline-block rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
              {event.category}
            </span>
          )}

          <h1 className="text-foreground mb-4 font-serif text-3xl leading-tight italic md:text-4xl">
            {event.title}
          </h1>

          <div className="text-muted-foreground border-border mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-6 font-sans text-sm">
            {event.date && (
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} className="text-accent" />
                {formatEventDate(event.date)}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-accent" />
                {event.location}
              </span>
            )}
          </div>

          {event.excerpt && (
            <p className="text-foreground/80 mb-6 font-sans text-lg leading-relaxed">
              {event.excerpt}
            </p>
          )}

          {event.descriptionHtml && (
            <div
              className="text-foreground/90 [&_a]:text-accent [&_blockquote]:border-accent [&_blockquote]:text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_hr]:border-border [&_td]:border-border [&_th]:border-border [&_th]:bg-muted font-sans text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:italic [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:italic [&_hr]:my-8 [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_table]:mb-4 [&_table]:w-full [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
              // Pre-sanitized server-side in getPublicEventBySlug (sanitizeHtml).
              dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
            />
          )}

          {gallery.length > 0 && (
            <section className="border-border mt-10 border-t pt-8">
              <h2 className="text-foreground mb-5 font-serif text-2xl italic">
                Gallery
              </h2>
              <div className={`grid gap-4 ${cols}`}>
                {gallery.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className={`bg-muted relative ${tileAspect} w-full overflow-hidden rounded-2xl`}
                  >
                    <Image
                      src={src}
                      alt={`${event.title} — photo ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </article>
  );
}
