"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site";

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
      className="relative flex min-h-screen items-center overflow-hidden bg-[#07111d] pt-20 lg:pt-24"
    >
      {/* Immersive Dark Background with Image */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <Image
          src="/site_assests/facility-bg.jpg.jpeg"
          alt="JCT Engineering Campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#07111d]/80 via-[#07111d]/45 to-[#07111d]/0" />
        <div className="absolute top-0 right-0 h-[50rem] w-[50rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-[#d4a024]/10 mix-blend-screen blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[40rem] w-[40rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-[#1d4ed8]/10 mix-blend-screen blur-[120px]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-6 md:px-6 lg:py-0">
        <div className="flex flex-col items-center justify-center gap-12 pt-8 pb-12 text-center lg:gap-16 lg:pt-4">
          {/* Centered Text Content */}
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative font-serif text-5xl leading-[1.1] font-bold tracking-tight text-white md:text-6xl lg:text-[5rem] xl:text-[6rem]"
            >
              Where Engineers Build the Future.
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 10 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-6 -right-12 hidden text-white/50 lg:block"
              ></motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-xl"
            >
              Learn AI, coding, and core engineering through hands-on labs and
              career-focused training.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
            >
              <Link
                href="/admissions/apply"
                className="inline-flex h-14 items-center justify-center rounded-xl px-8 text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-8 flex flex-col md:flex-row items-center gap-2 rounded-2xl md:rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-sm"
            >
              <span className="font-bold text-[#d4a024] tracking-[0.1em] uppercase">
                An Autonomous Institution
              </span>
              <span className="hidden md:inline mx-2 text-white/30">|</span>
              <div className="flex items-center gap-2">
                <span className="tracking-[0.15em] text-white font-bold uppercase">
                  Counselling Code:
                </span>
                <span className="font-extrabold text-[#d4a024] text-lg">
                  {siteConfig.counsellingCode}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex -space-x-3">
                {/* Accreditation Stack */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/naac.png"
                    alt="NAAC"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/nba.png"
                    alt="NBA"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/aicte.png"
                    alt="AICTE"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/anna.png"
                    alt="Anna University"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-black text-[10px] font-bold text-white shadow-sm">
                  #1
                </div>
              </div>
              <p className="text-sm font-medium text-white/80">
                Top accreditations & approvals
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
