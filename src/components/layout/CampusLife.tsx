"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = ["All", "Labs", "Sports", "Events", "Clubs"] as const;

const photos = [
  {
    src: "/site_assests/computer-img1.jpg.jpeg",
    caption: "Advanced Computer Lab",
    category: "Labs",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/site_assests/banner3.jpg.jpeg",
    caption: "Annual Sports Day",
    category: "Sports",
    span: "",
  },
  {
    src: "/site_assests/8.jpg.jpeg",
    caption: "Inter-College Basketball",
    category: "Sports",
    span: "",
  },
  {
    src: "/site_assests/MGL5086-1.webp",
    caption: "Robotics Club Workshop",
    category: "Clubs",
    span: "",
  },
  {
    src: "/site_assests/facility-bg.jpg.jpeg",
    caption: "Campus Green Walkway",
    category: "Events",
    span: "",
  }
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
      className="section-padding bg-navy noise-overlay relative overflow-hidden"
    >
      <div className="bg-gold/3 pointer-events-none absolute top-0 left-1/3 h-125 w-125 rounded-full blur-[200px]" />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mb-6 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              Campus Experience
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl"
            >
              Life at <span className="gradient-text">JCT</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto md:flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`shrink-0 rounded-full px-4 py-2 font-sans text-xs font-semibold transition-all duration-300 ${activeFilter === cat ? "bg-gold text-navy" : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.caption}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl ${photo.span} aspect-4/3 ${!showAllPhotos && i >= 4 ? "hidden md:block" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/10 to-transparent p-3 transition-opacity duration-300 md:p-5 md:opacity-0 md:group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <Camera size={14} className="text-gold" />
                  <span className="font-sans text-sm font-medium text-white">
                    {photo.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Show More */}
        {!showAllPhotos && filtered.length > 4 && (
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => setShowAllPhotos(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-sans text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              View All Photos <ArrowRight size={14} />
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center md:mt-14"
        >
          <Link
            href="#contact"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 font-sans text-sm font-semibold text-white transition-all hover:border-white/25 hover:bg-white/10"
          >
            Take a Virtual Campus Tour <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
