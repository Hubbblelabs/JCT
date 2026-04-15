"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type AccreditationsProps = {
  variant?: "default" | "hero";
};

const logos = [
  {
    src: "/naac.png",
    name: "NAAC Accredited",
    note: "Quality benchmark in higher education",
  },
  {
    src: "/nba.png",
    name: "NBA Accredited",
    note: "Outcome-based program excellence",
  },
  {
    src: "/iso.png",
    name: "ISO 9001:2015",
    note: "Certified process quality systems",
  },
  {
    src: "/ugc.png",
    name: "UGC Recognized",
    note: "Nationally recognized institution",
  },
  {
    src: "/aicte.png",
    name: "AICTE Approved",
    note: "Technical education regulatory approval",
  },
  {
    src: "/anna.png",
    name: "Anna University",
    note: "Affiliated academic framework",
  },
  {
    src: "/dote.png",
    name: "DOTE Approved",
    note: "State diploma education compliance",
  },
  {
    src: "/bharathiar_university.png",
    name: "Bharathiar University",
    note: "Affiliated arts and science programs",
  },
];

const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2] as const;

function getWrappedIndex(index: number, length: number) {
  return (index + length) % length;
}

export function Accreditations({ variant = "default" }: AccreditationsProps) {
  const isHero = variant === "hero";
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetBase, setOffsetBase] = useState(92);

  useEffect(() => {
    const handleResize = () => setOffsetBase(window.innerWidth < 640 ? 64 : 92);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % logos.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  const activeLogo = logos[activeIndex];

  return (
    <section
      className={`relative overflow-hidden ${isHero ? "py-1" : "bg-white/95 py-4 shadow-inner"}`}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLogo.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="mb-2 text-center"
          >
            <p
              className={`font-sans text-sm font-semibold ${
                isHero ? "text-white" : "text-[#0f2039]"
              }`}
            >
              {activeLogo.name}
            </p>
            <p
              className={`mt-0.5 text-xs ${
                isHero ? "text-white/75" : "text-slate-600"
              }`}
            >
              {activeLogo.note}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="relative flex h-18 w-full items-center justify-center overflow-hidden sm:h-22">
          {VISIBLE_OFFSETS.map((offset) => {
            const wrappedIndex = getWrappedIndex(
              activeIndex + offset,
              logos.length,
            );
            const logo = logos[wrappedIndex];
            const isActive = offset === 0;

            return (
              <motion.div
                key={logo.name}
                animate={{
                  x: offset * offsetBase,
                  scale: isActive ? 1.1 : 0.92,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 26,
                  mass: 0.85,
                }}
                className="absolute left-1/2 flex h-18 w-18 -translate-x-1/2 items-center justify-center sm:h-20 sm:w-20"
                aria-hidden={!isActive}
                style={{ zIndex: 10 - Math.abs(offset) }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-full border transition-all ${
                    isActive
                      ? isHero
                        ? "h-16 w-16 border-[#d4a024]/85 bg-[#f3f7ff]/98 ring-2 ring-[#d4a024]/58 sm:h-18 sm:w-18"
                        : "h-16 w-16 border-[#d4a024]/80 bg-white ring-2 ring-[#d4a024]/45 sm:h-18 sm:w-18"
                      : isHero
                        ? "h-10 w-10 border-[#c2d5ef]/38 bg-[#7f98ba]/38 sm:h-14 sm:w-14"
                        : "h-10 w-10 border-slate-200 bg-white sm:h-14 sm:w-14"
                  }`}
                >
                  <div className="relative h-[70%] w-[70%]">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      className="object-contain"
                      sizes="72px"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
