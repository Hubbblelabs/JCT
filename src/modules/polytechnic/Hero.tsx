"use client";

import { motion } from "framer-motion";

import { CourseMuralBackground } from "@/components/ui/CourseMuralBackground";

/* ─── Animation helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export function Hero() {
  return (
    <section
      id="top"
      className="bg-polytechnic relative flex h-dvh flex-col justify-center overflow-hidden pb-50"
    >
      <CourseMuralBackground />
      <div className="relative z-10 container mx-auto mt-28 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8">
        {/* ─── Hero Header ─── */}
        <motion.div {...fadeUp(0)} className="max-w-4xl text-center">
          <h1 className="mb-6 font-serif text-5xl leading-tight font-bold text-white md:text-6xl lg:text-7xl">
            Practical Education,
            <br className="hidden md:block" /> Technical Excellence
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            The Art of Technical Mastery. The Science of Practical Skills. The
            Foundation of Industry-Ready Careers, Designed to Thrive.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
