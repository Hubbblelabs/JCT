"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const CAROUSEL_IMAGES = [
  "/site_assests/banner.jpg.jpeg",
  "/site_assests/banner2.jpeg",
  "/site_assests/hostel-1.jpeg",
];

export function ArtsAndScienceHeroBg() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#081018]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.12, y: 8 }}
          animate={{ opacity: 1, scale: 1.04, y: 0 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={CAROUSEL_IMAGES[currentIdx]}
            alt={`Arts and Science campus background ${currentIdx + 1}`}
            fill
            priority={currentIdx === 0}
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
          backgroundImage: "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
