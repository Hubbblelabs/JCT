"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Award, Users, BookOpen, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroStats } from "@/data/arts-science";
import { ArtsAndScienceHeroBg } from "./ArtsAndScienceHeroBg";

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const numericString = value.replace(/[^0-9.]/g, '');
  const prefix = value.startsWith('+') ? '+' : '';
  const suffix = value.replace(/^[+0-9.,]+/, '');
  const finalNum = parseFloat(numericString.replace(/,/g, '')) || 0;
  const isFormatted = value.includes(',');

  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const display = useTransform(spring, (current) => {
    let formatted = Math.floor(current).toString();
    if (isFormatted) {
      formatted = Math.floor(current).toLocaleString('en-IN');
    }
    return prefix + formatted + suffix;
  });

  useEffect(() => {
    if (inView) {
      spring.set(finalNum);
    }
  }, [inView, spring, finalNum]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function Hero() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section 
      id="hero" 
      className="group/section relative flex min-h-screen flex-col overflow-hidden bg-arts-science-muted"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 pointer-events-none origin-top overflow-hidden">
        <ArtsAndScienceHeroBg />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute inset-0 bg-orange-200 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px] mix-blend-multiply opacity-20" />
        
        {/* Spotlight dots layer tracking the mouse */}
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`
          }}
        >
          <div className="absolute inset-0 bg-arts-science-accent [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px]" />
        </div>
      </div>

      {/* Announcement Banner */}
      {/* <div className="relative z-10 flex items-center justify-center gap-2 bg-arts-science px-3 py-2 text-center text-xs sm:text-sm text-white">
        <span className="bg-arts-science-accent rounded px-2 py-0.5 text-xs font-semibold text-white">
          NEW
        </span>
        <span>
          Admissions open for 2025–26 — Apply early and secure your seat.
        </span>
      </div> */}

      {/* Hero Content */}
      <div className="container relative z-10 mx-auto flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:gap-8 sm:py-16 md:gap-10 md:py-20 lg:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", staggerChildren: 0.1 }}
          className="flex max-w-4xl flex-col items-center"
        >
          <h1 className="mb-4 font-serif text-4xl leading-tight font-bold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Good Education
            <br />
            <span className="text-arts-science-accent font-bold">for </span>
            A Better Future
          </h1>

          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
            We offer a quality education that provides not only lessons but also
            real experience in every field. Embrace the future with our
            immersive, industry-aligned programs.
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col gap-3 w-full sm:flex-wrap sm:flex-row sm:justify-center sm:gap-4 md:mb-10 md:gap-4">
            <Link
              href="/admissions"
              className={cn(
                buttonVariants({ size: "lg" }),
                "flex-1 sm:flex-none bg-arts-science-accent hover:bg-arts-science h-12 sm:h-14 gap-2 px-6 sm:px-8 font-medium text-white rounded-full text-sm sm:text-base transition-colors",
              )}
            >
              Apply Now <ArrowRight size={16} className="hidden sm:inline" />
            </Link>
            <Link
              href="#programs"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex-1 sm:flex-none h-12 sm:h-14 border-gray-300 px-6 sm:px-8 font-medium text-gray-700 hover:bg-gray-100 rounded-full text-sm sm:text-base",
              )}
            >
              Explore Programs
            </Link>
          </div>

          {/* Stats Row */}
          <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-16 border-t border-slate-200/50 pt-6 sm:pt-8 md:pt-10">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center min-w-fit">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.accent ? "text-arts-science-accent" : "text-gray-900"}`}
                >
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 mt-1 sm:mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 bg-arts-science border-arts-science-light/20 mt-10 sm:mt-12 md:mt-16 w-full border-t"
      >
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 divide-y divide-white/20 md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 lg:px-8 md:py-0">
              <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <Award size={18} className="text-arts-science-accent sm:w-5 sm:h-5" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-white md:text-xl">
                  Quality
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-light text-white/80">
                Experience a world-class education and unlock your potential at
                our university
              </p>
            </div>

            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 lg:px-8 md:py-0">
              <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <Users size={18} className="text-arts-science-accent sm:w-5 sm:h-5" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-white md:text-xl">
                  Leadership
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-light text-white/80">
                Guided by visionary leadership, inspires growth, and shapes
                future leaders
              </p>
            </div>

            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 lg:px-8 md:py-0">
              <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <BookOpen size={18} className="text-arts-science-accent sm:w-5 sm:h-5" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-white md:text-xl">
                  Experience
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-light text-white/80">
                Embark on a transformative journey of personal and professional
                growth
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
