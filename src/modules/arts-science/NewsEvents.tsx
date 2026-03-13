"use client";

import { motion } from "framer-motion";
import { newsUpdates, campusEvents } from "@/data/arts-science";
import { ChevronRight, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsEvents() {
  return (
    <section className="bg-[#edeff2] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* News Section */}
        <div className="mb-24">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="font-sans text-4xl leading-tight font-bold text-[#800020] md:text-5xl">
                Updates
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {newsUpdates.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex h-full cursor-pointer flex-col"
              >
                <div className="mb-6 aspect-video w-full overflow-hidden rounded-md bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
                  <Calendar className="h-4 w-4" /> {news.date}
                </div>
                <h3 className="line-clamp-3 font-sans text-xl leading-relaxed font-bold text-[#800020] transition-colors group-hover:text-[#800020]">
                  {news.title}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button className="h-14 rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-bold text-[#70001b] shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95">
              View all news
            </Button>
          </div>
        </div>

        {/* Events Section */}
        <div className="mx-auto max-w-4xl border-t border-stone-300 pt-24 text-center">
          <h2 className="mb-12 font-sans text-3xl font-bold text-[#800020] md:text-4xl">
            Upcoming events
          </h2>

          <div className="flex flex-col gap-4 divide-y divide-stone-300 border-y border-stone-300 text-left">
            {campusEvents.map((event, index) => (
              <div
                key={index}
                className="-mx-4 flex flex-col items-start justify-between gap-6 px-4 py-6 transition-colors hover:bg-white/50 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <h4 className="mb-3 font-sans text-xl font-bold text-[#800020] md:text-2xl">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-light text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" /> {event.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {event.time}
                    </span>
                  </div>
                </div>
                <a
                  href="/arts-science/events"
                  className="group flex shrink-0 items-center font-semibold text-[#800020] hover:underline"
                >
                  View event{" "}
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center text-center">
            <Button className="h-14 rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-bold text-[#70001b] shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95">
              View all events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
