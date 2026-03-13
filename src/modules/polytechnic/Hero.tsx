"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Wrench } from "lucide-react";
import { heroStats } from "@/data/polytechnic";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#1A237E] md:min-h-screen">
      {/* Background image + overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop"
          alt="JCT Polytechnic workshop"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1A237E]/95 via-[#1A237E]/80 to-[#1A237E]/50" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #FFB300 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-36 pb-20 md:px-6 md:pt-40 lg:pt-44">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd166]/60 bg-[#FFB300]/20 px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#ffd166] uppercase backdrop-blur-md md:text-xs">
                <Wrench size={12} />
                AICTE Approved · Diploma Programs
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 font-sans text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Developing{" "}
              <span className="text-[#FFB300]">Quality</span>{" "}
              Professionals
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-10 max-w-lg text-lg leading-relaxed font-light text-white/85"
            >
              Emerge as a leading Institute for Quality and Skill embedded
              Diploma Education. Workshop-driven training that puts you in
              industry-ready condition from day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="#programs"
                className="group inline-flex h-14 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] to-[#FFB300] px-8 font-bold text-[#1A237E] shadow-[0_12px_28px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
              >
                Explore Programs
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="https://www.youtube.com/@jctpolytechnic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full border-2 border-white/50 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                </span>
                Watch our story
              </a>
            </motion.div>
          </motion.div>

          {/* Right — Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:mt-0"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all hover:bg-white/15"
              >
                <span
                  className={`mb-1 block font-sans text-2xl font-black tracking-tight md:mb-2 md:text-4xl ${
                    stat.accent ? "text-[#FFB300]" : "text-white"
                  }`}
                >
                  {stat.value}
                </span>
                <p className="text-[10px] font-bold tracking-wider text-white/75 uppercase md:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
