"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { homeHeroContent } from "@/data/home";
import { Accreditations } from "@/components/layout/Accreditations";

const BACKGROUND_MOTIONS = [
  {
    initial: { opacity: 0, x: -22, scale: 1.06 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 14, scale: 1.02 },
  },
  {
    initial: { opacity: 0, y: 14, scale: 1.05 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 1.015 },
  },
  {
    initial: { opacity: 0, x: 18, scale: 1.045 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -12, scale: 1.02 },
  },
] as const;

export function HomeHero() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouchScreen(media.matches);

    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentBackgroundIndex(
        (currentIndex) =>
          (currentIndex + 1) % homeHeroContent.backgroundImages.length,
      );
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    homeHeroContent.backgroundImages.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  function isCardExpanded(index: number) {
    return isTouchScreen ? expandedCard === index : hoveredCard === index;
  }

  function toggleCard(index: number) {
    if (!isTouchScreen) {
      return;
    }
    setExpandedCard((prev) => (prev === index ? null : index));
  }

  return (
    <section className="relative flex min-h-[102svh] w-full flex-col justify-center overflow-hidden pt-18 pb-24 lg:pt-22 lg:pb-16">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={homeHeroContent.backgroundImages[currentBackgroundIndex]}
            className="absolute inset-0"
            initial={{
              ...BACKGROUND_MOTIONS[
                currentBackgroundIndex % BACKGROUND_MOTIONS.length
              ].initial,
              filter: "blur(10px)",
            }}
            animate={{
              ...BACKGROUND_MOTIONS[
                currentBackgroundIndex % BACKGROUND_MOTIONS.length
              ].animate,
              filter: "blur(0px)",
            }}
            exit={{
              ...BACKGROUND_MOTIONS[
                currentBackgroundIndex % BACKGROUND_MOTIONS.length
              ].exit,
              filter: "blur(5px)",
            }}
            transition={{
              duration: 1.05,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.85, ease: "easeInOut" },
            }}
          >
            <Image
              src={homeHeroContent.backgroundImages[currentBackgroundIndex]}
              alt="JCT campus"
              fill
              priority={currentBackgroundIndex === 0}
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Radial Gradient Noise Overlay - Masks transition artifacts */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 35% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Primary overlay */}
      <div className="absolute inset-0 bg-[#081a34]/20" />

      {/* Gradient overlay with refined opacity */}
      <div className="absolute inset-0 bg-linear-to-r from-[#081327]/50 via-[#081327]/24 to-[#081327]/10" />

      <div className="relative z-10 mx-auto grid w-full max-w-352 grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-10 xl:gap-16">
        {/* Left Content */}
        <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="max-w-3xl font-sans text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {homeHeroContent.titleLines.map((line, index) => (
              <motion.span
                key={line}
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.08 * index,
                  ease: "easeOut",
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            {homeHeroContent.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href.startsWith("#") ? "/admissions" : cta.href}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 sm:text-base ${
                  cta.primary
                    ? "bg-gold text-navy hover:bg-gold-light shadow-black/20"
                    : "border border-white/30 bg-transparent text-white backdrop-blur-sm hover:bg-white/10"
                }`}
              >
                {cta.label}
                {cta.primary && (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Cards Box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-md flex-col items-center gap-4 sm:max-w-xl lg:max-w-none lg:translate-x-8 lg:items-end xl:translate-x-10"
        >
          <div className="flex w-full flex-col items-center gap-4 lg:items-end">
            {homeHeroContent.cards.map((card, index) => {
              const expanded = isCardExpanded(index);

              return (
                <motion.article
                  key={card.title}
                  onHoverStart={() => {
                    if (!isTouchScreen) {
                      setHoveredCard(index);
                    }
                  }}
                  onHoverEnd={() => {
                    if (!isTouchScreen) {
                      setHoveredCard(null);
                    }
                  }}
                  onClick={() => toggleCard(index)}
                  onKeyDown={(event) => {
                    if (!isTouchScreen) {
                      return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleCard(index);
                    }
                  }}
                  tabIndex={isTouchScreen ? 0 : -1}
                  className={`w-full cursor-default overflow-hidden rounded-xl border border-[#f2d89a]/55 bg-[#ffffff]/92 shadow-md transition-all duration-300 ease-out sm:w-[24rem] sm:rounded-2xl ${expanded ? "px-5 py-4 shadow-lg" : "px-4 py-3 hover:shadow-lg"}`}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="min-w-0">
                    <h3 className="font-sans text-[1.1rem] leading-tight font-bold tracking-tight text-[#0a1628]">
                      {card.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-1 font-bold text-[#d4a024]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {card.ctaLabel}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          key="expanded-content"
                          initial={{ height: 0, opacity: 0, y: 4 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: 4 }}
                          transition={{ duration: 0.26, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2.5 text-[13px] leading-snug text-slate-600">
                            {card.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[#d4a024]">|</span>
                            <span className="font-semibold text-slate-600">
                              {card.highlights}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-3 left-0 z-20 md:bottom-4">
        <div className="mx-auto w-full max-w-352 px-4 md:px-8 lg:px-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-full">
              <Accreditations variant="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
