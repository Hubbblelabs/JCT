"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

export function ArtsAndScienceHeroBg({
  images,
  intervalMs = 5500,
}: {
  images?: string[];
  intervalMs?: number;
}) {
  const slides = images && images.length > 0 ? images : [];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  const idx = currentIdx % slides.length;
  const src = slides[idx];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#081018]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${src}-${idx}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.12, y: 8 }}
          animate={{ opacity: 1, scale: 1.04, y: 0 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={getImageUrl(src) ?? src}
            alt={`Arts and Science campus background ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover object-center brightness-[0.9] contrast-[1.18] saturate-[1.12]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/0" />
      <div className="absolute inset-0 bg-linear-to-t from-black/0 via-transparent to-black/0" />

      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
