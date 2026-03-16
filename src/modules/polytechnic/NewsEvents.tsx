"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Tag } from "lucide-react";
import { newsUpdates, campusEvents } from "@/data/polytechnic";

export function NewsEvents() {
  return (
    <section className="bg-[#F8F9FA] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* ── News ── */}
        <div className="mb-24">
          <div className="mb-12">
            <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#1A237E] uppercase">
              News &amp; Events
            </h2>
            <h3 className="font-sans text-4xl leading-tight font-bold text-[#1A237E] md:text-5xl">
              Latest Updates
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {newsUpdates.slice(0, 3).map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex h-full cursor-pointer flex-col"
              >
                <div className="mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-stone-400 uppercase">
                  <Calendar className="h-3.5 w-3.5" /> {news.date}
                </div>
                <h4 className="line-clamp-3 font-sans text-lg leading-relaxed font-bold text-[#1A237E]">
                  {news.title}
                </h4>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/institutions/polytechnic/news"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] to-[#FFB300] px-8 font-bold text-[#1A237E] shadow-[0_10px_24px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
            >
              Read All News
            </Link>
          </div>
        </div>

        {/* ── Events ── */}
        <div className="mx-auto max-w-4xl border-t border-stone-200 pt-24">
          <h3 className="mb-12 text-center font-sans text-3xl font-bold text-[#1A237E] md:text-4xl">
            Upcoming Events
          </h3>

          <div className="flex flex-col divide-y divide-stone-200 border-y border-stone-200">
            {campusEvents.map((event, index) => (
              <div
                key={index}
                className="-mx-4 flex flex-col items-start justify-between gap-4 px-4 py-6 transition-colors hover:bg-white sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <h4 className="mb-3 font-sans text-xl font-bold text-[#1A237E] md:text-2xl">
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
                <Link
                  href="/institutions/polytechnic/events"
                  className="group flex shrink-0 items-center font-semibold text-[#1A237E] hover:underline"
                >
                  View event{" "}
                  <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
