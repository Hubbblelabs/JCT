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
      className="relative min-h-screen flex items-center overflow-hidden pt-[100px] md:pt-[120px]"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-20 z-0">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
          alt="JCT Campus"
          fill
          priority
          className="object-cover scale-110"
          sizes="100vw"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-navy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-sans font-bold tracking-[0.15em] uppercase text-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[0.95] tracking-tight mb-6"
          >
            Three Institutions.
            <br />
            <span className="gradient-text italic font-light">One Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed font-sans mb-8"
          >
            Empowering the next generation through world-class education in{" "}
            <span className="text-white font-medium">Engineering</span>,{" "}
            <span className="text-white font-medium">Arts & Science</span>, and{" "}
            <span className="text-white font-medium">Polytechnic</span> studies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="#admissions"
              className="h-13 px-7 bg-gold text-navy font-sans font-bold text-sm rounded-full hover:bg-gold-light transition-all inline-flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg shadow-gold/20"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919361488801"
              className="h-13 px-7 border border-white/15 text-white font-sans font-semibold text-sm rounded-full hover:bg-white/5 transition-all inline-flex items-center gap-2 backdrop-blur-sm"
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
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-white/10"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-3xl md:text-4xl font-sans font-black text-white tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="block text-xs font-sans font-semibold text-white/30 uppercase tracking-[0.15em] mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
