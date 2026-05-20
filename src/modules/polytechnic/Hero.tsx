"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

const DEFAULT_HERO: HeroContent = {
  backgroundImages: [
    "/assets/polytechnic.webp",
    "/assets/lab4.webp",
    "/assets/jct-life8.webp",
  ],
  eyebrow: "AICTE Approved Diploma Programs",
  titleLine1: "Real World Skills.",
  titleLine2: "Future Ready Careers.",
  subtitle:
    "At JCT Polytechnic, we focus on hands-on training and workshops. Graduate with the exact technical skills that top manufacturing, IT, and engineering firms are actively hiring for today.",
  ctas: [
    {
      label: "Apply Now",
      href: "https://admissions.jct.ac.in",
      primary: true,
    },
  ],
  intervalMs: 6000,
};

type HeroCta = { label: string; href: string; primary: boolean };

type HeroContent = {
  backgroundImages: string[];
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctas: HeroCta[];
  intervalMs: number;
};

function normalizeHero(raw: unknown): HeroContent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const backgroundImages = Array.isArray(r.backgroundImages)
    ? r.backgroundImages.filter(
        (s): s is string => typeof s === "string" && s.length > 0,
      )
    : [];
  if (backgroundImages.length === 0) return null;
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
    backgroundImages,
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : DEFAULT_HERO.eyebrow,
    titleLine1:
      typeof r.titleLine1 === "string" ? r.titleLine1 : DEFAULT_HERO.titleLine1,
    titleLine2:
      typeof r.titleLine2 === "string" ? r.titleLine2 : DEFAULT_HERO.titleLine2,
    subtitle:
      typeof r.subtitle === "string" ? r.subtitle : DEFAULT_HERO.subtitle,
    ctas: ctas.length > 0 ? ctas : DEFAULT_HERO.ctas,
    intervalMs:
      typeof r.intervalMs === "number" && r.intervalMs > 0
        ? r.intervalMs
        : DEFAULT_HERO.intervalMs,
  };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export function Hero() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=polytechnicHero")
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

  useEffect(() => {
    if (hero.backgroundImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % hero.backgroundImages.length);
    }, hero.intervalMs);
    return () => clearInterval(timer);
  }, [hero.backgroundImages.length, hero.intervalMs]);

  return (
    <section className="bg-polytechnic-dark relative flex h-dvh min-h-150 flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIdx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src={
                getImageUrl(hero.backgroundImages[currentIdx]) ??
                hero.backgroundImages[currentIdx]
              }
              alt={`Polytechnic campus background ${currentIdx + 1}`}
              fill
              priority={currentIdx === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="from-polytechnic-dark/95 via-polytechnic-dark/70 absolute inset-0 bg-linear-to-r to-transparent" />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto mt-20 flex flex-col justify-center px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl">
          {hero.eyebrow && (
            <motion.div {...fadeUp(0)}>
              <span className="border-polytechnic-light/40 bg-polytechnic-light/20 text-polytechnic-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                {hero.eyebrow}
              </span>
            </motion.div>
          )}

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 font-serif text-5xl leading-[1.05] font-bold text-white md:text-6xl lg:text-7xl"
          >
            {hero.titleLine1}
            {hero.titleLine2 && (
              <>
                <br />
                <span className="font-normal text-white/70 italic">
                  {hero.titleLine2}
                </span>
              </>
            )}
          </motion.h1>

          {hero.subtitle && (
            <motion.p
              {...fadeUp(0.2)}
              className="mb-10 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            >
              {hero.subtitle}
            </motion.p>
          )}

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {hero.ctas.map((cta) => {
              const isExternal = cta.href.startsWith("http");
              return (
                <Link
                  key={cta.label}
                  href={cta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Button
                    size="lg"
                    className={
                      cta.primary
                        ? "bg-polytechnic-light hover:text-polytechnic-dark h-14 rounded-full px-8 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-white active:scale-95 sm:w-auto"
                        : "h-14 rounded-full border border-white/30 bg-transparent px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10 active:scale-95 sm:w-auto"
                    }
                  >
                    {cta.label}{" "}
                    {cta.primary && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>

      {hero.backgroundImages.length > 1 && (
        <div className="absolute right-0 bottom-10 left-0 z-20 flex justify-center gap-3">
          {hero.backgroundImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIdx
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
