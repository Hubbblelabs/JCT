"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { useSiteConfig } from "@/lib/use-site-config";

type HeroCta = { label: string; href: string; primary: boolean };
type Accreditation = { name: string; logo: string };

type HeroConfig = {
  backgroundImages: string[];
  title: string;
  subtitle: string;
  ctas: HeroCta[];
  badgeText: string;
  counsellingLabel: string;
  counsellingCode: string;
  accreditations: Accreditation[];
  accreditationsCaption: string;
  intervalMs: number;
};

function normalizeHero(raw: unknown): HeroConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : "");

  const backgroundImages = Array.isArray(r.backgroundImages)
    ? r.backgroundImages.filter(
        (s): s is string => typeof s === "string" && s.trim().length > 0,
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
  const accreditations = Array.isArray(r.accreditations)
    ? r.accreditations
        .map((a) => {
          const o = (a ?? {}) as Record<string, unknown>;
          const logo = typeof o.logo === "string" ? o.logo : "";
          if (!logo) return null;
          return {
            name: typeof o.name === "string" ? o.name : "",
            logo,
          } satisfies Accreditation;
        })
        .filter((x): x is Accreditation => x !== null)
    : [];

  return {
    backgroundImages,
    title: str("title"),
    subtitle: str("subtitle"),
    ctas,
    badgeText: str("badgeText"),
    counsellingLabel: str("counsellingLabel"),
    counsellingCode: str("counsellingCode"),
    accreditations,
    accreditationsCaption: str("accreditationsCaption"),
    intervalMs:
      typeof r.intervalMs === "number" && r.intervalMs > 0
        ? r.intervalMs
        : 6000,
  };
}

export function EngineeringHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { data, loading } = useSiteConfig("engineeringHero");
  const hero = useMemo(() => normalizeHero(data), [data]);
  const [bgIndex, setBgIndex] = useState(0);

  const backgroundImages = useMemo(
    () => hero?.backgroundImages ?? [],
    [hero],
  );
  const intervalMs = hero?.intervalMs ?? 6000;

  useEffect(() => {
    const len = backgroundImages.length;
    if (len < 2) return;
    const timer = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % len);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [backgroundImages.length, intervalMs]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const safeIndex = backgroundImages.length
    ? bgIndex % backgroundImages.length
    : 0;
  const rawBg = backgroundImages[safeIndex] ?? "";
  const bg = rawBg ? (getImageUrl(rawBg) ?? rawBg) : "";

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-busy={loading}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#07111d] pt-20 lg:pt-24"
    >
      {!loading && hero && (
        <>
          <motion.div
            style={{ y: backgroundY }}
            className="pointer-events-none absolute inset-0"
          >
            <AnimatePresence mode="sync">
              {bg && (
                <motion.div
                  key={bg}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={bg}
                    alt="JCT Engineering Campus"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center opacity-40"
                  />
                </motion.div>
              )}
            </AnimatePresence>

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

                {(hero.badgeText || hero.counsellingCode) && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.24 }}
                    className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-sm md:flex-row md:rounded-full"
                  >
                    {hero.badgeText && (
                      <span className="font-bold tracking-[0.1em] text-[#d4a024] uppercase">
                        {hero.badgeText}
                      </span>
                    )}
                    {hero.badgeText && hero.counsellingCode && (
                      <span className="mx-2 hidden text-white/30 md:inline">
                        |
                      </span>
                    )}
                    {hero.counsellingCode && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-[0.15em] text-white uppercase">
                          {hero.counsellingLabel}
                        </span>
                        <span className="text-lg font-extrabold text-[#d4a024]">
                          {hero.counsellingCode}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {hero.accreditations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.24 }}
                    className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex -space-x-3">
                      {hero.accreditations.map((acc, i) => (
                        <div
                          key={`${acc.name}-${i}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111d] bg-white p-1.5 shadow-sm"
                        >
                          <Image
                            src={getImageUrl(acc.logo) ?? acc.logo}
                            alt={acc.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    {hero.accreditationsCaption && (
                      <p className="text-sm font-medium text-white/80">
                        {hero.accreditationsCaption}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
