"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = ["All", "Labs", "Sports", "Events", "Clubs"] as const;

const photos = [
  {
    src: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800&auto=format&fit=crop",
    caption: "Advanced Computer Lab",
    category: "Labs",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600&auto=format&fit=crop",
    caption: "Annual Sports Day",
    category: "Sports",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop",
    caption: "Cultural Fest — Kaleidoscope",
    category: "Events",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    caption: "Robotics Club Workshop",
    category: "Clubs",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    caption: "Campus Green Walkway",
    category: "Events",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=600&auto=format&fit=crop",
    caption: "Electronics & Comm. Lab",
    category: "Labs",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop",
    caption: "Inter-College Basketball",
    category: "Sports",
    span: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?q=80&w=600&auto=format&fit=crop",
    caption: "Coding Club Meetup",
    category: "Clubs",
    span: "",
  },
];

export function CampusLife() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof categories)[number]>("All");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const filtered =
    activeFilter === "All"
      ? photos
      : photos.filter((p) => p.category === activeFilter);

  return (
    <section
      id="campus-life"
      className="section-padding bg-navy relative overflow-hidden noise-overlay"
    >
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[200px] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-14 gap-4 md:gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
            >
              Campus Experience
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-tight"
            >
              Life at <span className="gradient-text">JCT</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide md:flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all duration-300 shrink-0 ${activeFilter === cat ? "bg-gold text-navy" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.caption}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer ${photo.span} aspect-[4/3] ${!showAllPhotos && i >= 4 ? "hidden md:block" : ""}`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 md:p-5">
                <div className="flex items-center gap-2">
                  <Camera size={14} className="text-gold" />
                  <span className="text-white text-sm font-sans font-medium">
                    {photo.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Show More */}
        {!showAllPhotos && filtered.length > 4 && (
          <div className="md:hidden text-center mt-6">
            <button
              onClick={() => setShowAllPhotos(true)}
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-white/70 hover:text-white transition-colors px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30"
            >
              View All Photos <ArrowRight size={14} />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-14"
        >
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 h-12 px-7 bg-white/5 border border-white/15 text-white font-sans font-semibold rounded-full hover:bg-white/10 hover:border-white/25 transition-all text-sm"
          >
            Take a Virtual Campus Tour <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
