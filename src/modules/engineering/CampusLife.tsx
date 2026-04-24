"use client";

import { useState, type UIEvent } from "react";
import { motion } from "framer-motion";
import { DragScroll } from "@/components/ui/DragScroll";

const campusImages = [
  "/site_assests/banner3.jpg.jpeg",
  "/site_assests/banner6.jpeg",
  "/site_assests/facility-bg.jpg.jpeg",
  "/site_assests/MGL5086-1.webp",
  "/site_assests/19.jpeg",
];

export function CampusLife() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    
    const index = Math.round((scrollLeft / maxScroll) * (campusImages.length - 1));
    setActiveIndex(Math.min(Math.max(index, 0), campusImages.length - 1));
  };

  return (
    <section id="life" className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-sm font-bold tracking-[0.2em] uppercase text-engineering">
            Campus life
          </h2>
          <h3 className="mb-6 font-sans text-4xl leading-tight font-bold text-navy md:text-5xl">
            See where learning happens beyond the classroom
          </h3>
        </div>

        <DragScroll 
          className="scrollbar-hide relative flex h-100 w-full snap-x snap-mandatory gap-4 scroll-smooth md:h-125 md:gap-6"
          onScroll={handleScroll}
        >
          {campusImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative h-full max-w-[85vw] min-w-[85vw] shrink-0 snap-center overflow-hidden bg-stone-100 md:max-w-[60vw] md:min-w-[60vw]"
              draggable={false}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Campus Life ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          ))}
        </DragScroll>

        <div className="mt-4 flex items-center justify-center gap-2">
          {campusImages.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === activeIndex ? "bg-engineering" : "bg-engineering/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
