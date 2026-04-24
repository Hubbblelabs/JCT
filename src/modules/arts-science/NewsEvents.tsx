"use client";

import { motion } from "framer-motion";
import { newsUpdates, campusEvents } from "@/data/arts-science";
import { ChevronRight, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsEvents() {
  return (
    <section className="bg-arts-science-muted py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* News Section */}
        <div className="mb-24">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-arts-science-dark font-sans text-4xl leading-tight font-bold md:text-5xl">
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
                <h3 className="text-arts-science-dark group-hover:text-arts-science-dark line-clamp-3 font-sans text-xl leading-relaxed font-bold transition-colors">
                  {news.title}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button className="from-arts-science-accent h-14 rounded-full border border-orange-400/70 bg-linear-to-r to-orange-600 px-8 font-bold text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-110">
              View all news
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
