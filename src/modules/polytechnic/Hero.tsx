"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Wrench } from "lucide-react";
import { heroStats } from "@/data/polytechnic";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#1A237E] pt-32 pb-20 md:min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop"
          alt="JCT Polytechnic workshop"
          fill
          sizes="100vw"
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#1A237E]/95 via-[#1A237E]/80 to-[#1A237E]" />
        
        {/* Decorative circles */}
        <div className="absolute top-1/4 -left-64 h-[500px] w-[500px] rounded-full bg-[#FFB300]/10 blur-[120px]" />
        <div className="absolute top-3/4 -right-64 h-[600px] w-[600px] rounded-full bg-[#1A237E] brightness-150 blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd166]/40 bg-[#1A237E]/80 px-5 py-2 text-xs font-bold tracking-widest text-[#FFB300] uppercase shadow-inner backdrop-blur-md">
              <Wrench size={14} className="text-[#ffd166]" />
              AICTE Approved Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-sans text-5xl font-black leading-tight tracking-tight text-white md:text-7xl lg:text-8xl flex flex-col items-center"
          >
            <span>Empowering</span>
            <span className="text-[#FFB300] bg-clip-text text-transparent bg-linear-to-r from-[#FFB300] to-[#ffd166]">
              Future Innovators
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-white/80 md:text-xl"
          >
            Emerge as a leading Institute for Quality and Skill embedded
            Diploma Education. Workshop-driven training that puts you in
            industry-ready condition from day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Link
              href="#programs"
              className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#FFB300] px-8 text-base font-bold text-[#1A237E] transition-all hover:scale-105 hover:bg-[#ffd166] hover:shadow-[0_0_40px_rgba(255,179,0,0.4)] sm:w-auto"
            >
              <span className="relative z-10">Explore Our Programs</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://www.youtube.com/@jctpolytechnic"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 sm:w-auto"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[#FFB300] group-hover:text-[#1A237E]">
                <Play className="ml-1 h-4 w-4 fill-current" />
              </div>
              Watch Video
            </a>
          </motion.div>
        </motion.div>

        {/* Stats Section moved to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A237E]/40 p-6 text-center shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-[#FFB300]/30 hover:bg-[#1A237E]/60"
            >
              <div className="absolute inset-x-0 -bottom-2 h-1/2 bg-gradient-to-t from-[#FFB300]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <span
                  className={`block font-sans text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl ${
                    stat.accent ? "text-[#FFB300]" : "text-white"
                  }`}
                >
                  {stat.value}
                </span>
                <p className="mt-2 text-xs font-bold tracking-widest text-[#ffd166]/80 uppercase lg:text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
