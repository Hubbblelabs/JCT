"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site";
import { getImageUrl } from "@/lib/utils";

type HeroCta = { label: string; href: string; primary: boolean };

type HeroConfig = {
  backgroundImages: string[];
  title: string;
  subtitle: string;
  ctas: HeroCta[];
  badgeText: string;
  counsellingCode: string;
};

const DEFAULT_HERO: HeroConfig = {
  backgroundImages: ["/assets/campus1.webp"],
  title: "Where Engineers Build the Future.",
  subtitle:
    "Learn AI, coding, and core engineering through hands-on labs and career-focused training.",
  ctas: [
    {
      label: "APPLY NOW",
      href: "https://admissions.jct.ac.in",
      primary: true,
    },
    { label: "EXPLORE PROGRAMS", href: "#programs", primary: false },
  ],
  badgeText: "An Autonomous Institution",
  counsellingCode: siteConfig.counsellingCode,
};

function normalizeHero(raw: unknown): HeroConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const backgroundImages = Array.isArray(r.backgroundImages)
    ? r.backgroundImages.filter(
        (s): s is string => typeof s === "string" && s.length > 0,
      )
    : [];
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
  const title = typeof r.title === "string" && r.title ? r.title : null;
  if (!title || backgroundImages.length === 0) return null;
  return {
    backgroundImages,
    title,
    subtitle: typeof r.subtitle === "string" ? r.subtitle : "",
    ctas: ctas.length > 0 ? ctas : DEFAULT_HERO.ctas,
    badgeText:
      typeof r.badgeText === "string" && r.badgeText
        ? r.badgeText
        : DEFAULT_HERO.badgeText,
    counsellingCode:
      typeof r.counsellingCode === "string" && r.counsellingCode
        ? r.counsellingCode
        : DEFAULT_HERO.counsellingCode,
  };
}

export function EngineeringHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [hero, setHero] = useState<HeroConfig>(DEFAULT_HERO);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=engineeringHero")
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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const bg = hero.backgroundImages[0] ?? DEFAULT_HERO.backgroundImages[0];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#07111d] pt-20 lg:pt-24"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <Image
          src={getImageUrl(bg) ?? bg}
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
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative font-serif text-5xl leading-[1.1] font-bold tracking-tight text-white md:text-6xl lg:text-[5rem] xl:text-[6rem]"
            >
              {hero.title}
            </motion.h1>

            {hero.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-xl"
              >
                {hero.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
            >
              {hero.ctas.map((cta) => {
                const isExternal = cta.href.startsWith("http");
                return (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={
                      cta.primary
                        ? "inline-flex h-14 items-center justify-center rounded-xl px-8 text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
                        : "inline-flex h-14 items-center justify-center rounded-xl border border-white/20 bg-transparent px-8 text-sm font-bold tracking-wide text-white transition-all hover:bg-white/5 active:scale-[0.98]"
                    }
                    style={
                      cta.primary
                        ? { backgroundColor: "#d4a024", color: "#081323" }
                        : undefined
                    }
                  >
                    {cta.label}
                  </Link>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-sm md:flex-row md:rounded-full"
            >
              <span className="font-bold tracking-[0.1em] text-[#d4a024] uppercase">
                {hero.badgeText}
              </span>
              <span className="mx-2 hidden text-white/30 md:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-[0.15em] text-white uppercase">
                  Counselling Code:
                </span>
                <span className="text-lg font-extrabold text-[#d4a024]">
                  {hero.counsellingCode}
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
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/accreditations/naac.webp"
                    alt="NAAC"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/accreditations/nba.webp"
                    alt="NBA"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/accreditations/aicte.webp"
                    alt="AICTE"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/accreditations/anna.webp"
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
