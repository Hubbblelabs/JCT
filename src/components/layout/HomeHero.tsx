"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Users,
  GraduationCap,
  BadgeDollarSign,
} from "lucide-react";
import { homeHeroContent } from "@/data/home";
import { Accreditations } from "@/components/layout/Accreditations";

function getTrustIcon(iconName: string) {
  switch (iconName) {
    case "laurel":
      return <Award className="h-5 w-5" />;
    case "users":
      return <Users className="h-5 w-5" />;
    case "cap":
      return <GraduationCap className="h-5 w-5" />;
    case "growth":
      return <BadgeDollarSign className="h-5 w-5" />;
    default:
      return <Award className="h-5 w-5" />;
  }
}

export function HomeHero() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
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
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden pt-21 pb-44 lg:pt-26 lg:pb-32">
      <Image
        src={homeHeroContent.backgroundImage}
        alt="JCT campus"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#081a34]/22" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0a1628]/45 via-[#0a1628]/22 to-transparent" />

      {/* Top Trust Highlights Pill */}
      <div className="relative z-10 mx-auto mt-2 w-fit max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/20 bg-[#7f9ec7]/35 px-4 py-1.5 shadow-[0_10px_30px_rgba(4,10,24,0.2)] sm:max-w-[calc(100%-2.5rem)] sm:rounded-full sm:px-6 sm:py-1.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] font-semibold text-white sm:text-base md:gap-x-8">
          {homeHeroContent.trustHighlights.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2 md:gap-3">
              {i > 0 && (
                <span className="hidden text-white/40 md:inline-block">|</span>
              )}
              <span className="text-white/80">{getTrustIcon(stat.icon)}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-352 flex-1 grid-cols-1 items-center gap-10 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-10 lg:py-14 xl:gap-16">
        {/* Left Content */}
        <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl font-sans text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            {homeHeroContent.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            {homeHeroContent.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
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
          className="mx-auto flex w-full max-w-md flex-col items-center gap-4 sm:max-w-xl lg:max-w-none lg:items-end lg:translate-x-8 xl:translate-x-10"
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
                  className={`w-full cursor-default overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-out sm:w-[24rem] sm:rounded-2xl ${expanded ? "px-5 py-4 shadow-lg" : "px-4 py-3 hover:shadow-lg"}`}
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

      <div className="absolute right-0 bottom-4 left-0 z-20 md:bottom-6">
        <Accreditations variant="hero" />
      </div>
    </section>
  );
}
