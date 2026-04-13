"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

const slides = [
  {
    id: 0,
    label: "Engineering College",
    subtitle: "// JCT Flagship Campus",
    thumb: "/site_assests/engineering.jpeg",
    bgImage: "/site_assests/land-ban.webp",
  },
  {
    id: 1,
    label: "Arts & Science",
    subtitle: "// Liberal Arts Campus",
    thumb: "/site_assests/home-slide.webp",
    bgImage: "/site_assests/home-slide.webp",
  },
  {
    id: 2,
    label: "Polytechnic College",
    subtitle: "// Technical Education",
    thumb: "/site_assests/polytechnic.jpeg",
    bgImage: "/site_assests/future-banner.webp",
  },
];

const stats = [
  { value: 16, suffix: "+", label: "Years" },
  { value: 12000, suffix: "+", label: "Alumni" },
  { value: 92, suffix: "%", label: "Placements" },
  { value: 500, suffix: "+", label: "Recruiters" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let start = 0;
        const duration = 2000;
        const inc = value / (duration / 16);
        const timer = setInterval(() => {
          start += inc;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const display =
    count >= 10000 ? `${(count / 1000).toFixed(0)}K` : count.toLocaleString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function HomeHero() {
  const heroRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.38, 0.65]);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const intervalTime = window.innerWidth < 768 ? 3000 : 5000;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-svh w-full flex-col overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background – swaps with each slide */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[activeSlide].bgImage}
              alt={slides[activeSlide].label}
              fill
              priority
              className="scale-110 object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[#3f485a] mix-blend-multiply"
        />
        <div className="from-[#2d3442]/75 via-[#3b4559]/30 absolute inset-0 bg-linear-to-r to-transparent" />
        <div className="from-[#2e3545]/65 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex min-h-svh flex-1 flex-col justify-between px-4 pt-24 pb-4 sm:pt-28 md:px-6 md:pt-32 md:pb-5">
        {/* Main content area */}
        <div className="flex max-w-4xl flex-1 flex-col justify-center py-1 sm:py-2 md:py-4">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 hidden md:mb-7 md:block"
          >
            <span className="inline-flex items-center rounded-md border border-white/20 bg-black/20 px-3 py-1.5 font-sans text-xs font-medium text-white/85 backdrop-blur-sm md:px-4 md:py-2">
              Established 2009 • Coimbatore, Tamil Nadu
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-7 text-center font-sans text-[34px] leading-[1.1] font-bold tracking-tight text-white drop-shadow-lg sm:text-[40px] md:mb-4 md:text-left md:font-serif md:text-5xl lg:text-6xl"
          >
            <span className="block md:inline">Three Colleges.</span>
            <span className="block md:hidden">One Commitment</span>
            <span className="mt-0 block md:hidden">to Your Success.</span>
            <span className="gradient-text ml-1 hidden font-light italic md:ml-0 md:inline">
              One Commitment to Your Success.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-5 max-w-2xl font-sans text-sm leading-relaxed text-white/78 md:mb-5 md:text-base lg:text-lg"
          >
            JCT Institutions is a group of three colleges in Coimbatore—{" "}
            <span className="font-medium text-white">Engineering</span>,{" "}
            <span className="font-medium text-white">Arts & Science</span>, and{" "}
            <span className="font-medium text-white">Polytechnic</span>—united
            by a shared belief that education should build both knowledge and
            real-world competence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="#admissions"
              className="bg-gold text-navy hover:bg-gold-light shadow-gold/20 inline-flex h-11 items-center gap-2 rounded-full px-6 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 md:h-13 md:px-7"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919361488801"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-6 font-sans text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/5 md:h-13 md:px-7"
            >
              <Phone size={14} /> Enquire Now
            </a>
          </motion.div>
        </div>

        {/* Bottom bar – stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex w-full justify-center border-t border-white/10 pt-5 md:pt-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 md:gap-x-20 md:gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-sans text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1 block font-sans text-[11px] font-bold tracking-[0.18em] text-white/50 uppercase md:mt-2 md:text-xs">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Removed Mini carousel */}
        </motion.div>
      </div>
    </section>
  );
}
