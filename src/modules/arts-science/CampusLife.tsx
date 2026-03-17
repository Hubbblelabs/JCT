"use client";

import { motion } from "framer-motion";
import { DragScroll } from "@/components/ui/DragScroll";

const campusImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop",
];

export function CampusLife() {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-arts-science-dark mb-6 text-sm font-bold tracking-[0.2em] uppercase">
            Campus life
          </h2>
          <h3 className="text-arts-science-dark mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl">
            See where learning happens beyond the classroom
          </h3>
        </div>

        <DragScroll className="relative flex h-[400px] w-full snap-x snap-mandatory gap-4 scroll-smooth pb-8 md:h-[500px] md:gap-6">
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

        {/* Carousel Pagination Dots Placeholder */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {campusImages.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-arts-science-dark" : "bg-stone-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
