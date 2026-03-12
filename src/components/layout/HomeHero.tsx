"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

const stats = [
  { value: 15, suffix: "+", label: "Years" },
  { value: 12000, suffix: "+", label: "Alumni" },
  { value: 96, suffix: "%", label: "Placements" },
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-svh w-full flex-col overflow-hidden"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
          alt="JCT Campus"
          fill
          priority
          className="scale-110 object-cover"
          sizes="100vw"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="bg-navy absolute inset-0"
        />
        <div className="from-navy via-navy/80 absolute inset-0 bg-linear-to-r to-transparent" />
        <div className="from-navy absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
      </motion.div>

      {/* Content wrapper taking exactly screen height with safe padding */}
      <div className="relative z-10 container mx-auto flex flex-1 flex-col justify-between px-4 pt-[90px] pb-5 md:px-6 md:pt-[100px] md:pb-6">
        {/* Main Text Center Box (flex-1 to push bottom bar down, justify-center to center itself) */}
        <div className="flex max-w-4xl flex-1 flex-col justify-center py-2 md:py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <span className="text-gold inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-sans text-[10px] font-bold tracking-[0.15em] uppercase backdrop-blur-sm md:px-4 md:py-2 md:text-xs">
              <span className="bg-gold h-1.5 w-1.5 animate-pulse rounded-full" />
              Est. 2009 · Coimbatore, Tamil Nadu
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
            className="mb-3 font-serif text-[2.25rem] leading-[1.05] tracking-tight text-white sm:text-5xl md:mb-5 md:text-5xl lg:text-7xl"
          >
            Three Colleges.
            <br className="hidden md:block" />
            <span className="gradient-text ml-1 font-light italic md:ml-0">
              One Commitment to Your Success.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-5 max-w-2xl font-sans text-sm leading-relaxed text-white/50 md:mb-7 md:text-base lg:text-lg"
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

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid w-full shrink-0 grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-4 md:gap-6 md:pt-6"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="font-sans text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[2.25rem]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-0.5 block font-sans text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase md:mt-1 md:text-[11px]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
