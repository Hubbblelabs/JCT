"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ─── Animation helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export function Hero() {
  return (
    <section className="bg-polytechnic flex min-h-svh flex-col pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto flex flex-1 flex-col justify-center px-4 md:px-6 lg:px-8">
        {/* ─── Hero Header ─── */}
        <motion.div {...fadeUp(0)} className="mb-10 text-center md:mb-14">
          <h1 className="mb-4 font-serif text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
            Practical Education,
            <br className="hidden md:block" /> Technical Excellence
          </h1>
          <p className="mx-auto max-w-lg text-sm text-white/60 md:text-base">
            The Art of Technical Mastery. The Science of Practical Skills. The
            Foundation of Industry-Ready Careers, Designed to Thrive.
          </p>
        </motion.div>

        {/* ─── Leaf-Shaped Hero Image ─── */}
        <motion.div
          {...fadeUp(0.15)}
          className="relative mx-auto mb-16 max-w-3xl md:mb-20"
        >
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: "9999px 9999px 0 0" }}
          >
            <div className="relative h-72 w-full md:h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop"
                alt="JCT Polytechnic workshop students"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
          {/* Corner cutouts that reveal the dark background */}
          <div className="bg-polytechnic-dark absolute bottom-0 left-0 h-20 w-20 rounded-tr-full md:h-28 md:w-28" />
          <div className="bg-polytechnic-dark absolute right-0 bottom-0 h-20 w-20 rounded-tl-full md:h-28 md:w-28" />
        </motion.div>
      </div>
    </section>
  );
}
