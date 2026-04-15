"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CAROUSEL_IMAGES = [
  "/site_assests/polytechnic.jpeg", // Academic Campus
  "/site_assests/mech-img.jpg.jpeg", // Laboratory/Engineering
  "/site_assests/future-banner.webp", // Structural/Minimal
];

/* ─── Animation helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-polytechnic-dark relative flex h-dvh min-h-150 flex-col justify-center overflow-hidden">
      {/* ─── Background Carousel ─── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src={CAROUSEL_IMAGES[currentIdx]}
              alt={`Polytechnic campus background ${currentIdx + 1}`}
              fill
              priority={currentIdx === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Deep green & black gradient overlay for contrast */}
        <div className="from-polytechnic-dark/95 via-polytechnic-dark/70 absolute inset-0 bg-linear-to-r to-transparent" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

        {/* Subtle grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto mt-20 flex flex-col justify-center px-4 md:px-6 lg:px-8">
        {/* ─── Content ─── */}
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0)}>
            <span className="border-polytechnic-light/40 bg-polytechnic-light/20 text-polytechnic-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              AICTE Approved Diploma Programs
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 font-serif text-5xl leading-[1.05] font-bold text-white md:text-6xl lg:text-7xl"
          >
            Real World Skills.
            <br />
            <span className="font-normal text-white/70 italic">
              Future Ready Careers.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mb-10 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            At JCT Polytechnic, we focus on hands-on training and workshops.
            Graduate with the exact technical skills that top manufacturing, IT,
            and engineering firms are actively hiring for today.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="bg-polytechnic-light hover:text-polytechnic-dark h-14 rounded-full px-8 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-white active:scale-95 sm:w-auto"
            >
              Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="#admissions">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
              >
                Admission Info
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── Carousel Indicators ─── */}
      <div className="absolute right-0 bottom-10 left-0 z-20 flex justify-center gap-3">
        {CAROUSEL_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIdx
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
