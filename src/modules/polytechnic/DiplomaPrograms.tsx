"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { diplomaPrograms } from "@/data/polytechnic";
import {
  PolyButtonLink,
  PolySection,
  PolySectionHeader,
} from "@/modules/polytechnic/PolyUI";

export function DiplomaPrograms() {
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const pauseCarouselTemporarily = useCallback((delay = 1800) => {
    setIsCarouselPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsCarouselPaused(false);
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  return (
    <PolySection
      id="programs"
      tone="transparent"
      className="group/section relative overflow-hidden border-t border-slate-100 bg-[#f6f8f7]"
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 420px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 420px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 92, 185, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 92, 185, 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div className="bg-polytechnic-accent/5 pointer-events-none absolute top-0 right-0 z-0 h-125 w-125 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />
      <div className="bg-polytechnic-dark/5 pointer-events-none absolute bottom-0 left-0 z-0 h-100 w-100 -translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <PolySectionHeader
            eyebrow="Programs"
            title="Diploma Programs"
            description="Six industry-relevant diploma streams with practical training and structured academic support."
            className="mb-0"
          />
          <PolyButtonLink
            href="/institutions/polytechnic/departments"
            variant="outline"
          >
            View All Programs
            <ArrowRight className="ml-2 h-4 w-4" />
          </PolyButtonLink>
        </div>

        <div
          className="group/carousel relative mt-10 mb-2 flex w-full overflow-hidden py-4"
          onWheel={() => pauseCarouselTemporarily()}
          onTouchStart={() => pauseCarouselTemporarily()}
          onTouchMove={() => pauseCarouselTemporarily()}
          onMouseDown={() => pauseCarouselTemporarily()}
        >
          <style>{`
          @keyframes poly-marquee {
            to { transform: translateX(-50%); }
          }
        `}</style>
          <div
            className="relative z-10 flex w-max items-stretch gap-6 pr-6 md:gap-8 md:pr-8"
            style={{
              animation: "poly-marquee 65s linear infinite",
              animationPlayState: isCarouselPaused ? "paused" : "running",
            }}
          >
            {[
              ...diplomaPrograms,
              ...diplomaPrograms,
              ...diplomaPrograms,
              ...diplomaPrograms,
            ].map((prog, index) => (
              <motion.article
                key={`${prog.slug}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: (index % diplomaPrograms.length) * 0.06,
                }}
                className="border-polytechnic/12 group flex h-full w-[84vw] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-[0_8px_24px_rgba(2,42,50,0.06)] sm:w-[70vw] md:w-[50vw] lg:w-95"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  {prog.image ? (
                    <Image
                      src={prog.image}
                      alt={prog.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  ) : (
                    <div className="bg-polytechnic-muted absolute inset-0 flex items-center justify-center">
                      <prog.icon className="text-polytechnic/45 h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    AICTE Approved
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                    <Clock className="text-polytechnic h-3.5 w-3.5" />
                    {prog.duration}
                  </div>

                  <h3 className="text-polytechnic-dark mb-2 line-clamp-2 text-xl leading-snug font-semibold">
                    {prog.name}
                  </h3>

                  <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {prog.desc}
                  </p>

                  <div className="mt-auto">
                    <Link
                      href={`/institutions/polytechnic/departments/${prog.slug}`}
                      className="text-polytechnic inline-flex items-center text-sm font-semibold hover:underline"
                    >
                      Program Details
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PolySection>
  );
}
