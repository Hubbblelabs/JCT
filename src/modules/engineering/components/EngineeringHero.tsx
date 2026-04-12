"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";

export function EngineeringHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="bg-navy relative flex min-h-[90vh] items-center overflow-hidden md:min-h-screen"
    >
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/assets/engineering-landing4.png"
          alt="Engineering campus"
          fill
          sizes="100vw"
          className="object-cover opacity-65"
          priority
        />
        <div className="from-navy/65 via-navy/45 to-navy/20 absolute inset-0 bg-linear-to-r" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 md:px-6 md:pt-40 lg:pt-44">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <span className="border-engineering-light/30 bg-engineering/20 text-engineering-light inline-block rounded-full border px-4 py-1 text-xs md:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                JCT College of Engineering & Technology
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white"
            >
              Engineer the <br />
              Future <span className="text-engineering-light">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 max-w-lg text-base md:text-lg leading-relaxed text-white/80"
            >
              An{" "}
              <span className="text-engineering-muted font-semibold">
                autonomous
              </span>{" "}
              institution affiliated to Anna University. 11 UG and 4 PG
              programs, industry-grade labs, and a placement record that
              speaks for itself.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-4 py-1.5 backdrop-blur-md">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs font-extrabold tracking-wider text-amber-300 uppercase">
                  Autonomous
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <Sparkles size={14} className="text-engineering-muted" />
                <span className="text-xs font-bold tracking-wider text-white/90">
                  Counselling Code:{" "}
                  <span className="text-engineering-muted font-extrabold">
                    {siteConfig.counsellingCode}
                  </span>{" "}
                  | Mobile:{" "}
                  <span className="text-engineering-muted font-extrabold">
                    {siteConfig.contact.phone}
                  </span>
                </span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="bg-engineering hover:bg-engineering-light shadow-engineering/20 h-12 w-full rounded-xl px-8 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto md:h-14"
              >
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto md:h-14"
              >
                View Placements
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:mt-0"
          >
            {[
              { val: "11", label: "UG Programs", accent: true },
              { val: "3", label: "PG Programs", accent: false },
              { val: "2769", label: "Counselling Code", accent: false },
              { val: "92%", label: "Placement Rate", accent: true },
            ].map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl border p-4 backdrop-blur-md md:p-6 ${s.accent ? "border-engineering-light/30 bg-engineering/20" : "border-white/10 bg-white/5"}`}
              >
                <span
                  className={`mb-1 block font-sans text-2xl font-black md:mb-2 md:text-4xl ${s.accent ? "text-engineering-muted" : "text-white"}`}
                >
                  {s.val}
                </span>
                <span className="text-xs font-bold tracking-wider text-white/70 uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}