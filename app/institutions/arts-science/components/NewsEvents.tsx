"use client";

import { motion } from "framer-motion";
import { newsUpdates, campusEvents } from "../data";
import { ArrowRight, ChevronRight, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function NewsEvents() {
  return (
    <section className="py-20 md:py-32 bg-[#edeff2]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* News Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] leading-tight">
                Updates
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsUpdates.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="w-full aspect-video bg-stone-200 mb-6 overflow-hidden rounded-md">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase tracking-wider mb-4">
                  <Calendar className="w-4 h-4" /> {news.date}
                </div>
                <h3 className="text-xl font-bold font-sans text-[#800020] leading-relaxed group-hover:text-[#800020] transition-colors line-clamp-3">
                  {news.title}
                </h3>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
             <Button className="h-14 px-8 bg-[#D4AF37] border-none text-[#800020] hover:bg-[#b8962e] font-bold rounded-none shadow-md">
              View all news
            </Button>
          </div>
        </div>

        {/* Events Section */}
        <div className="max-w-4xl mx-auto border-t border-stone-300 pt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#800020] mb-12">
              Upcoming events
            </h2>

            <div className="flex flex-col gap-4 text-left border-y border-stone-300 divide-y divide-stone-300">
              {campusEvents.map((event, index) => (
                <div key={index} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-white/50 transition-colors px-4 -mx-4">
                  <div className="flex-1">
                    <h4 className="text-xl md:text-2xl font-bold text-[#800020] font-sans mb-3">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 font-light">
                      <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {event.category}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {event.date}</span>
                    </div>
                  </div>
                  <a href="#" className="flex items-center text-[#800020] font-semibold hover:underline group shrink-0">
                    View event <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center text-center">
              <Button className="h-14 px-8 bg-[#D4AF37] border-none text-[#800020] hover:bg-[#b8962e] font-bold rounded-none shadow-md">
                View all events
              </Button>
            </div>
        </div>

      </div>
    </section>
  );
}
