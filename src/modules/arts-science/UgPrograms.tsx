"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ugPrograms } from "@/data/arts-science";
import React from "react";

export function UgPrograms() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section 
      className="group/section relative overflow-hidden bg-slate-50 py-20 md:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Background Textures & Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute inset-0 bg-slate-200 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px]" />
        
        {/* Spotlight dots layer tracking the mouse */}
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`
          }}
        >
          <div className="absolute inset-0 bg-arts-science [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px]" />
        </div>
      </div>
      <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-arts-science/5 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-navy/5 blur-[100px]" />

      <div className="container relative mx-auto px-4 md:px-8">
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-arts-science/20 bg-arts-science/5 px-4 py-2 text-arts-science mb-6 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-arts-science animate-pulse" />
            <h2 className="text-xs font-bold tracking-widest uppercase">
              Undergraduate Programs
            </h2>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-6xl"
          >
            Study what moves you forward
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl text-lg leading-relaxed font-light md:text-xl"
          >
            Choose from diverse academic pathways designed to prepare you for
            meaningful careers in your field of choice. Discover your potential
            in a vibrant learning environment.
          </motion.p>
        </div>

        <div 
          className="group/carousel relative mb-20 flex w-full overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <style>{`
            @keyframes marquee {
              to { transform: translateX(-50%); }
            }
          `}</style>
          <div 
            className="relative z-10 flex w-max items-stretch gap-6 pr-6 hover:[animation-play-state:paused] md:gap-8 md:pr-8"
            style={{ animation: 'marquee 60s linear infinite' }}
          >
            {[...ugPrograms, ...ugPrograms, ...ugPrograms, ...ugPrograms].map((prog, index) => (
              <motion.div
                key={`${prog.slug}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % ugPrograms.length) * 0.1 }}
                className="group/card relative flex min-h-[420px] w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-arts-science/30 hover:bg-white hover:shadow-2xl hover:shadow-arts-science/10 md:w-[380px]"
              >
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/90 via-white/80 to-slate-50/70 opacity-100 transition-opacity duration-300 group-hover/card:opacity-0" />
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-arts-science/5 via-white/95 to-white/90 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                
                <Link
                  href={`/institutions/arts-science/departments/${prog.slug}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {prog.name} details</span>
                </Link>

                <div className="relative z-0 mb-8 flex flex-1 flex-col">
                  <div className="bg-slate-100 text-slate-600 group-hover:bg-arts-science mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-colors duration-500 group-hover:text-white group-hover:shadow-arts-science/30">
                    <prog.icon size={32} strokeWidth={1.5} className="transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-navy mb-4 font-serif text-2xl leading-snug font-bold">
                    {prog.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                    {prog.desc}
                  </p>
                </div>

                <div className="relative z-0 border-slate-200 text-slate-500 group-hover:text-arts-science mt-auto flex shrink-0 items-center justify-between border-t pt-5 font-medium transition-colors duration-300">
                  <span className="text-sm uppercase tracking-wider">Explore Program</span>
                  <span className="bg-slate-100 group-hover:bg-arts-science/10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <Link
            href="/institutions/arts-science/courses"
            className="group relative overflow-hidden rounded-full bg-navy px-10 py-4 font-semibold text-white shadow-xl shadow-navy/20 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Browse all programs
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-arts-science to-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
