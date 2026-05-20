"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Award, Users, BookOpen, ArrowRight } from "lucide-react";
import { heroStats as fallbackHeroStats } from "@/data/arts-science";
import { ArtsAndScienceHeroBg } from "./ArtsAndScienceHeroBg";

type HeroStat = {
  value: string;
  label: string;
  accent: boolean;
};

type HeroCta = { label: string; href: string; primary: boolean };

type HeroContent = {
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  subtitle: string;
  ctas: HeroCta[];
};

const DEFAULT_HERO: HeroContent = {
  titleLine1: "Good Education",
  titleHighlight: "for",
  titleLine2: "A Better Future",
  subtitle:
    "We offer a quality education that provides not only lessons but also real experience in every field. Embrace the future with our immersive, industry-aligned programs.",
  ctas: [
    {
      label: "Apply Now",
      href: "https://admissions.jct.ac.in/",
      primary: true,
    },
  ],
};

function normalizeStats(raw: unknown): HeroStat[] {
  if (!Array.isArray(raw)) return [];
  const out: HeroStat[] = [];
  for (const entry of raw) {
    const r = (entry ?? {}) as Record<string, unknown>;
    const value = typeof r.value === "string" ? r.value : null;
    const label = typeof r.label === "string" ? r.label : null;
    if (!value || !label) continue;
    out.push({
      value,
      label,
      accent: Boolean(r.accent),
    });
  }
  return out;
}

function normalizeHero(raw: unknown): HeroContent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const titleLine1 = typeof r.titleLine1 === "string" ? r.titleLine1 : null;
  if (!titleLine1) return null;
  const ctas = Array.isArray(r.ctas)
    ? r.ctas
        .map((c) => {
          const o = (c ?? {}) as Record<string, unknown>;
          const label = typeof o.label === "string" ? o.label : null;
          const href = typeof o.href === "string" ? o.href : null;
          if (!label || !href) return null;
          return { label, href, primary: Boolean(o.primary) } satisfies HeroCta;
        })
        .filter((x): x is HeroCta => x !== null)
    : [];
  return {
    titleLine1,
    titleHighlight:
      typeof r.titleHighlight === "string" ? r.titleHighlight : "",
    titleLine2: typeof r.titleLine2 === "string" ? r.titleLine2 : "",
    subtitle: typeof r.subtitle === "string" ? r.subtitle : "",
    ctas: ctas.length > 0 ? ctas : DEFAULT_HERO.ctas,
  };
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const numericString = value.replace(/[^0-9.]/g, "");
  const prefix = value.startsWith("+") ? "+" : "";
  const suffix = value.replace(/^[+0-9.,]+/, "");
  const finalNum = parseFloat(numericString.replace(/,/g, "")) || 0;
  const isFormatted = value.includes(",");

  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const display = useTransform(spring, (current) => {
    let formatted = Math.floor(current).toString();
    if (isFormatted) {
      formatted = Math.floor(current).toLocaleString("en-IN");
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
  const [heroStats, setHeroStats] = useState<HeroStat[]>(
    fallbackHeroStats as HeroStat[],
  );
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=artsScienceHeroStats")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizeStats(res.data);
          if (next.length > 0) setHeroStats(next);
        }
      })
      .catch(() => {});
    fetch("/api/public/site-config?key=artsScienceHero")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizeHero(res.data);
          if (next) setHero(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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
      className="group/section relative flex min-h-screen flex-col overflow-hidden bg-[#060d19]"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 origin-top overflow-hidden">
        <ArtsAndScienceHeroBg />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="bg-arts-science-accent/20 absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px] opacity-14 mix-blend-soft-light" />

        {/* Spotlight dots layer tracking the mouse */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="bg-arts-science-accent absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(112deg,rgba(4,13,30,0.92)_8%,rgba(5,15,35,0.76)_46%,rgba(7,20,42,0.58)_100%)]" />

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
      <div className="relative z-10 container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 pt-20 pb-4 text-center sm:gap-8 sm:pt-32 sm:pb-16 md:gap-10 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex max-w-4xl flex-col items-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mb-2 font-sans text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-white drop-shadow-[0_12px_24px_rgba(2,10,24,0.55)] sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Good Education
            <br />
            <span className="text-arts-science-accent font-extrabold">
              for{" "}
            </span>
            A Better Future
          </motion.h1>

          {hero.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
              className="mb-4 max-w-2xl text-sm leading-relaxed font-medium text-white/78 drop-shadow-[0_8px_20px_rgba(2,10,24,0.42)] sm:mb-6 sm:text-base md:text-lg"
            >
              {hero.subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.22,
                },
              },
            }}
            className="mb-6 flex w-full max-w-md flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 md:mb-10"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Link
                href="https://admissions.jct.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-arts-science-accent hover:bg-arts-science-accent-dark inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 font-sans text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:h-12 sm:w-auto sm:min-w-44 sm:px-7 sm:text-base"
              >
                Apply Now
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.35,
                },
              },
            }}
            className="grid w-full grid-cols-2 justify-center gap-x-4 gap-y-6 border-t border-white/26 pt-6 sm:flex sm:flex-wrap sm:gap-6 sm:pt-8 md:gap-10 md:pt-10 lg:gap-16"
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.02,
                  ease: "easeOut",
                }}
                className="flex min-w-fit flex-col items-center text-center"
              >
                <span
                  className={`text-2xl font-extrabold tracking-tight drop-shadow-[0_8px_18px_rgba(2,10,24,0.5)] sm:text-3xl md:text-4xl ${
                    stat.accent ? "text-arts-science-accent" : "text-white"
                  }`}
                >
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="mt-1 text-xs font-semibold tracking-[0.18em] text-white/72 uppercase sm:mt-2 sm:text-sm">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 mt-4 w-full border-t border-white/10 bg-[#0a111a] sm:mt-12 md:mt-16"
      >
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-6 divide-y divide-white/10 sm:gap-8 md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 md:py-0 lg:px-8">
              <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3">
                <Award
                  size={18}
                  className="text-arts-science-accent sm:h-5 sm:w-5"
                />
                <h3 className="font-sans text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">
                  Quality
                </h3>
              </div>
              <p className="text-xs leading-relaxed font-medium text-white/82 sm:text-sm">
                Experience a world-class education and unlock your potential at
                our university
              </p>
            </div>

            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 md:py-0 lg:px-8">
              <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3">
                <Users
                  size={18}
                  className="text-arts-science-accent sm:h-5 sm:w-5"
                />
                <h3 className="font-sans text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">
                  Leadership
                </h3>
              </div>
              <p className="text-xs leading-relaxed font-medium text-white/82 sm:text-sm">
                Guided by visionary leadership, inspires growth, and shapes
                future leaders
              </p>
            </div>

            <div className="flex flex-col items-center px-3 py-4 text-center sm:px-4 md:px-6 md:py-0 lg:px-8">
              <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3">
                <BookOpen
                  size={18}
                  className="text-arts-science-accent sm:h-5 sm:w-5"
                />
                <h3 className="font-sans text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">
                  Experience
                </h3>
              </div>
              <p className="text-xs leading-relaxed font-medium text-white/82 sm:text-sm">
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
