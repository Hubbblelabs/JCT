"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowRight, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useSiteConfig } from "@/lib/use-site-config";

type Photo = {
  src: string;
  caption: string;
  category: string;
  isAll?: boolean;
};

type LifeAtJctConfig = {
  categories: string[];
  photos: Photo[];
  videoUrl: string;
};

function normalizeLifeAtJct(raw: unknown): LifeAtJctConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const photos: Photo[] = Array.isArray(r.photos)
    ? r.photos
        .map((p): Photo | null => {
          const o = (p ?? {}) as Record<string, unknown>;
          const src = typeof o.src === "string" ? o.src : null;
          const caption = typeof o.caption === "string" ? o.caption : "";
          const category = typeof o.category === "string" ? o.category : "";
          if (!src) return null;
          return { src, caption, category, isAll: Boolean(o.isAll) };
        })
        .filter((x): x is Photo => x !== null)
    : [];
  if (photos.length === 0) return null;

  const rawCategories = Array.isArray(r.categories)
    ? r.categories.filter(
        (c): c is string => typeof c === "string" && c.length > 0,
      )
    : [];
  const categories =
    rawCategories.length > 0
      ? rawCategories
      : ["All", ...new Set(photos.map((p) => p.category).filter(Boolean))];

  return {
    categories,
    photos,
    videoUrl: typeof r.videoUrl === "string" ? r.videoUrl.trim() : "",
  };
}

export function CampusLife() {
  const { data, loading } = useSiteConfig("lifeAtJct");
  const config = normalizeLifeAtJct(data);

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const categories = useMemo(() => config?.categories ?? [], [config]);
  const photos = useMemo(() => config?.photos ?? [], [config]);
  const videoUrl = config?.videoUrl ?? "";

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeFilter)) {
      setActiveFilter(categories[0]);
    }
  }, [categories, activeFilter]);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? photos.filter((p) => p.isAll)
        : photos.filter((p) => p.category === activeFilter),
    [photos, activeFilter],
  );

  if (loading) {
    return (
      <section
        aria-busy="true"
        id="campus-life"
        className="section-padding bg-navy"
      >
        <div className="container mx-auto h-96 px-4 md:px-6" />
      </section>
    );
  }

  if (!config) return null;

  return (
    <section
      id="campus-life"
      className="section-padding bg-navy noise-overlay relative overflow-hidden"
    >
      <AnimatePresence>
        {isVideoOpen && videoUrl && (
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
                src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
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
              key={`${photo.caption}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""} aspect-4/3 ${!showAllPhotos && i >= 4 ? "hidden md:block" : ""}`}
            >
              <Image
                src={getImageUrl(photo.src) ?? photo.src}
                alt={photo.caption}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
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
          {videoUrl && (
            <button
              onClick={() => setIsVideoOpen(true)}
              className="group inline-flex h-12 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 font-sans text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              Take a Virtual Campus Tour
            </button>
          )}
          <Link
            href="/campus-life"
            className="group border-gold/30 bg-gold/10 text-gold hover:border-gold/50 hover:bg-gold/20 inline-flex h-12 items-center gap-3 rounded-full border px-8 font-sans text-sm font-semibold transition-all"
          >
            Explore Campus Life <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
