"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { PublicEventCard } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";

export function EventsPageLayout({ events }: { events: PublicEventCard[] }) {
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        {events.length === 0 ? (
          <div className="border-border bg-background rounded-2xl border py-20 text-center">
            <p className="text-muted-foreground font-sans text-base">
              No events have been published yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <motion.article
                key={event._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i % 3, 2) * 0.08 }}
                className="group border-border bg-background flex flex-col overflow-hidden rounded-2xl border shadow-card transition-shadow hover:shadow-elevated"
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
      </div>
    </section>
  );
}
