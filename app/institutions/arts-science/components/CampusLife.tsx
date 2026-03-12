"use client";

import { motion } from "framer-motion";
import { DragScroll } from "@/app/components/ui/DragScroll";

const campusImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800&auto=format&fit=crop"
];

export function CampusLife() {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#800020] mb-6">
            Campus life
          </h2>
          <h3 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] leading-tight mb-6">
            See where learning happens beyond the classroom
          </h3>
        </div>

        <DragScroll className="flex gap-4 md:gap-6 pb-8 snap-x snap-mandatory scroll-smooth relative w-full h-[400px] md:h-[500px]">
          {campusImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-stone-100 min-w-[85vw] md:min-w-[60vw] max-w-[85vw] md:max-w-[60vw] h-full snap-center shrink-0 relative overflow-hidden"
              draggable={false}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Campus Life ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          ))}
        </DragScroll>

        {/* Carousel Pagination Dots Placeholder */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {campusImages.map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-[#800020]' : 'bg-stone-300'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
