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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0d1421]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <Image
            src={CAROUSEL_IMAGES[currentIdx]}
            alt={`Arts and Science campus background ${currentIdx + 1}`}
            fill
            priority={currentIdx === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.22),transparent_32%),linear-gradient(90deg,rgba(10,16,28,0.86)_0%,rgba(10,16,28,0.55)_42%,rgba(10,16,28,0.35)_100%)]" />
      <div className="absolute inset-0 bg-black/18 mix-blend-multiply" />
      <div className="absolute top-0 right-0 h-[32rem] w-[32rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-400/15 blur-[110px]" />
      <div className="absolute bottom-0 left-0 h-[28rem] w-[28rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-[120px]" />

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
