"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";

const categories = ["All", "Labs", "Sports", "Events", "Clubs"] as const;

const photos = [
  // --- All / Curated items (The original 5) ---
  {
    src: "/site_assests/computer-img1.jpg.jpeg",
    caption: "Advanced Computer Lab",
    category: "Labs",
    isAll: true,
  },
  {
    src: "/jct-life/sports3.webp",
    caption: "Annual Sports Day",
    category: "Sports",
    isAll: true,
  },
  {
    src: "/jct-life/sports2.webp",
    caption: "Inter-College Basketball",
    category: "Sports",
    isAll: true,
  },
  {
    src: "/site_assests/MGL5086-1.webp",
    caption: "Robotics Club Workshop",
    category: "Clubs",
    isAll: true,
  },
  {
    src: "/site_assests/facility-bg.jpg.jpeg",
    caption: "Campus Green Walkway",
    category: "Events",
    isAll: true,
  },

  // --- Additional Labs ---
  {
    src: "/site_assests/bio-lab-img.jpg.jpeg",
    caption: "Bio-Technology Research",
    category: "Labs",
  },
  {
    src: "/site_assests/eee-img.jpg.jpeg",
    caption: "Electrical Engineering Lab",
    category: "Labs",
  },
  {
    src: "/site_assests/mech-img.jpg.jpeg",
    caption: "Mechanical Workshop",
    category: "Labs",
  },
  {
    src: "/site_assests/p-c-img.jpg.jpeg",
    caption: "Petrochemical Lab",
    category: "Labs",
  },

  // --- Additional Sports ---
  {
    src: "/jct-life/sports4.webp",
    caption: "Football Championship",
    category: "Sports",
  },
  {
    src: "/jct-life/sports3.webp",
    caption: "Cricket Tournament",
    category: "Sports",
  },
  {
    src: "/jct-life/sports1.webp",
    caption: "Athletics Meet",
    category: "Sports",
  },

  // --- Additional Events ---
  {
    src: "/site_assests/video-img-1.webp",
    caption: "Cultural Fest Highlights",
    category: "Events",
  },
  {
    src: "/site_assests/IMG_20220915_123024_174-scaled.jpg.jpeg",
    caption: "Guest Lecture Series",
    category: "Events",
  },
  {
    src: "/site_assests/WhatsApp-Image-2024-11-29-at-3.06.58-PM.jpeg",
    caption: "Technical Symposium",
    category: "Events",
  },
  {
    src: "/site_assests/WhatsApp-Image-2024-12-09-at-10.54.24-AM.jpeg",
    caption: "Graduation Ceremony",
    category: "Events",
  },

  // --- Additional Clubs ---
  {
    src: "/site_assests/life-img-1.jpg.jpeg",
    caption: "Photography Club Outing",
    category: "Clubs",
  },
  {
    src: "/site_assests/WhatsApp-Image-2024-12-09-at-10.54.24-AM.jpeg",
    caption: "Coding Club Hackathon",
    category: "Clubs",
  },
  {
    src: "/site_assests/WhatsApp-Image-2024-11-29-at-2.36.24-PM.jpeg",
    caption: "Arts & Music Performance",
    category: "Clubs",
  },
  {
    src: "/site_assests/future-banner.webp",
    caption: "Innovation & Startup Cell",
    category: "Clubs",
  },
];

export function CampusLife() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof categories)[number]>("All");
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const filtered =
    activeFilter === "All"
      ? photos.filter((p) => "isAll" in p && (p as any).isAll)
      : photos.filter((p) => p.category === activeFilter);

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="campus-life"
      className="section-padding bg-navy noise-overlay relative overflow-hidden"
    >
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <X size={24} />
              </button>
              <iframe
                src="https://www.youtube.com/embed/RBzA0cneWRA?autoplay=1"
                title="JCT Campus Tour"
                className="h-full w-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsVideoOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
              className={`group relative cursor-pointer overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} aspect-4/3 ${!showAllPhotos && i >= 4 ? "hidden md:block" : ""}`}
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
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-14"
        >
          <button
            onClick={() => setIsVideoOpen(true)}
            className="group inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 font-sans text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
          >
            Take a Virtual Campus Tour
          </button>
        </motion.div>
      </div>
    </section>
  );
}
