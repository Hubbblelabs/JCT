"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code } from "lucide-react";
import { Accreditations } from "@/components/layout/Accreditations";

export function EngineeringHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#07111d] pt-20 lg:pt-0"
    >
      {/* Immersive Dark Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#081426] via-[#0b1830] to-[#050b15]" />
        <div className="absolute top-0 right-0 h-[50rem] w-[50rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-[#d4a024]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[40rem] w-[40rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-[#1d4ed8]/5 blur-[120px]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-12 md:px-6 lg:py-0">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Left Text Content */}
          <div className="flex flex-col items-start justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[15ch] font-serif text-5xl leading-[1.1] font-bold tracking-tight text-white md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]"
            >
              Where Engineers Build the Future.
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 10 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-4 right-10 hidden text-white/50 lg:right-0 lg:block xl:-right-8"
              >
                <Code size={42} strokeWidth={1.5} />
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-8 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
            >
              Learn AI, coding, and core engineering through hands-on labs and
              career-focused training.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <Link
                href="/admissions/apply"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#c1ff00] px-8 text-sm font-bold tracking-wide text-[#081323] transition-all hover:bg-[#aee600] active:scale-[0.98]"
                style={{ backgroundColor: "#d4a024", color: "#081323" }} // Adjusted to current theme but modeled after reference
              >
                APPLY NOW
              </Link>
              <Link
                href="#engineering-domains"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-white/20 bg-transparent px-8 text-sm font-bold tracking-wide text-white transition-all hover:bg-white/5 active:scale-[0.98]"
              >
                EXPLORE PROGRAMS
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex -space-x-3">
                {/* Simulated Avatars */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-[#1a2c47] bg-cover bg-center text-xs font-semibold text-white shadow-sm"
                  style={{
                    backgroundImage: "url('https://i.pravatar.cc/100?img=11')",
                  }}
                />
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-[#274060] bg-cover bg-center text-xs font-semibold text-white shadow-sm"
                  style={{
                    backgroundImage: "url('https://i.pravatar.cc/100?img=12')",
                  }}
                />
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-[#3a5a82] bg-cover bg-center text-xs font-semibold text-white shadow-sm"
                  style={{
                    backgroundImage: "url('https://i.pravatar.cc/100?img=33')",
                  }}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-black text-[10px] font-bold text-white shadow-sm">
                  10K+
                </div>
              </div>
              <p className="text-sm font-medium text-white/80">
                10,000+ students already joined us
              </p>
            </motion.div>
          </div>

          {/* Right Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex w-full justify-center lg:justify-end"
          >
            <div className="relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-[2rem] lg:max-w-none">
              <Image
                src="/site_assests/computer-img1.jpg.jpeg"
                alt="Engineering student at JCT"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            </div>
          </motion.div>
        </div>
        <div className="mt-12 pb-8 lg:mt-0 lg:pt-16">
          <Accreditations variant="hero" />
        </div>
      </div>
    </section>
  );
}
