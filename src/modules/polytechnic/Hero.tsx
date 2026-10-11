"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { useSiteConfig } from "@/lib/use-site-config";
import { readHeroOverlay } from "@/lib/hero-overlay";
import { HeroOverlay } from "@/components/ui/HeroOverlay";

type HeroCta = { label: string; href: string; primary: boolean };
type HeroStat = { value: string; label: string; accent: boolean };
type HeroLogo = { name: string; logo: string };

type HeroContent = {
  backgroundImages: string[];
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctas: HeroCta[];
  /** Empty when switched off. */
  stats: HeroStat[];
  /** Empty when switched off. */
  logos: HeroLogo[];
  logosCaption: string;
  intervalMs: number;
  /** Admin-set darkness (%), or null for the original gradients. */
  overlay: number | null;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function normalizeHero(raw: unknown): HeroContent | null {
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
  return {
    backgroundImages,
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : "",
    titleLine1: typeof r.titleLine1 === "string" ? r.titleLine1 : "",
    titleLine2: typeof r.titleLine2 === "string" ? r.titleLine2 : "",
    subtitle: typeof r.subtitle === "string" ? r.subtitle : "",
    ctas,
    stats:
      r.showStats === false || !Array.isArray(r.stats)
        ? []
        : r.stats
            .map((x) => {
              const o = (x ?? {}) as Record<string, unknown>;
              return {
                value: str(o.value),
                label: str(o.label),
                accent: o.accent === true,
              };
            })
            .filter((x) => x.value || x.label),
    logos:
      r.showAccreditations === false || !Array.isArray(r.accreditations)
        ? []
        : r.accreditations
            .map((x) => {
              const o = (x ?? {}) as Record<string, unknown>;
              return { name: str(o.name), logo: str(o.logo) };
            })
            .filter((x) => x.logo),
    logosCaption: str(r.accreditationsCaption),
    intervalMs:
      typeof r.intervalMs === "number" && r.intervalMs > 0
        ? r.intervalMs
        : 6000,
    overlay: readHeroOverlay(r.overlayOpacity),
  };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

export function Hero() {
  const { data, loading } = useSiteConfig("polytechnicHero");
  const hero = normalizeHero(data);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!hero || hero.backgroundImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % hero.backgroundImages.length);
    }, hero.intervalMs);
    return () => clearInterval(timer);
  }, [hero]);

  if (loading) {
    return (
      <section className="bg-polytechnic-dark flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white/70" />
      </section>
    );
  }

  if (!hero) return null;

  return (
    // The same frame as the Engineering and Arts & Science heroes: a full-
    // height photo carousel with the headline, buttons, stat row and logo
    // strip centred over it.
    <section className="bg-polytechnic-dark relative flex min-h-dvh flex-col justify-center overflow-hidden pt-28 pb-24 md:pt-32">
      <div className="absolute inset-0 z-0">
        {hero.backgroundImages.length > 0 && (
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
        )}

        {hero.overlay !== null ? (
          <HeroOverlay opacity={hero.overlay} color="#2e3441" />
        ) : (
          <>
            {/* Even top-to-bottom shading for the centred text. */}
            <div className="from-polytechnic-dark/85 via-polytechnic-dark/60 to-polytechnic-dark/90 absolute inset-0 bg-linear-to-b" />
            <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          </>
        )}

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto flex flex-col items-center px-4 text-center md:px-6 lg:px-8">
        <div className="flex max-w-4xl flex-col items-center">
          {hero.eyebrow && (
            <motion.div {...fadeUp(0)}>
              <span className="border-polytechnic-light/40 bg-polytechnic-light/20 text-polytechnic-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                {hero.eyebrow}
              </span>
            </motion.div>
          )}

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 font-serif text-5xl leading-[1.05] font-bold text-white md:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {hero.titleLine1}
            {hero.titleLine2 && (
              <>
                <br />
                <span className="font-normal text-white/75 italic">
                  {hero.titleLine2}
                </span>
              </>
            )}
          </motion.h1>

          {hero.subtitle && (
            <motion.p
              {...fadeUp(0.2)}
              className="mb-10 max-w-2xl text-base leading-relaxed text-white/80 md:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          )}

          {hero.ctas.length > 0 && (
            <motion.div
              {...fadeUp(0.3)}
              className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
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
          )}

          {hero.stats.length > 0 && (
            <motion.dl
              {...fadeUp(0.4)}
              className="mt-12 grid w-full grid-cols-2 justify-center gap-x-4 gap-y-6 border-t border-white/25 pt-8 sm:flex sm:flex-wrap sm:gap-10 md:mt-14 lg:gap-16"
            >
              {hero.stats.map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className="flex min-w-fit flex-col items-center text-center"
                >
                  {/* Label first for assistive tech; shown under the number. */}
                  <dt className="order-last mt-1 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase sm:text-sm">
                    {stat.label}
                  </dt>
                  <dd
                    className={`text-3xl font-extrabold tracking-tight md:text-4xl ${
                      stat.accent ? "text-polytechnic-muted" : "text-white"
                    }`}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}

          {hero.logos.length > 0 && (
            <motion.div
              {...fadeUp(0.5)}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <div className="flex -space-x-3">
                {hero.logos.map((acc, i) => (
                  <div
                    key={`${acc.name}-${i}`}
                    title={acc.name || undefined}
                    className="border-polytechnic-dark flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white p-1.5 shadow-sm"
                  >
                    <Image
                      src={getImageUrl(acc.logo) ?? acc.logo}
                      alt={acc.name || "Accreditation"}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
              {hero.logosCaption && (
                <p className="text-sm font-medium text-white/80">
                  {hero.logosCaption}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {hero.backgroundImages.length > 1 && (
        <div className="absolute right-0 bottom-8 left-0 z-20 flex justify-center gap-3">
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
