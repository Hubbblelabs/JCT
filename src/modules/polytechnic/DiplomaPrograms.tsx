"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { diplomaPrograms } from "@/data/polytechnic";
import { DragScroll } from "@/components/ui/DragScroll";
import {
  PolySection,
  PolySectionHeader,
  PolyButtonLink
} from "@/modules/polytechnic/PolyUI";

type PolytechnicCourse = {
  name: string;
  slug: string;
  image?: string;
  icon?: any;
};

function CourseCard({ course }: { course: PolytechnicCourse }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      data-course-card="true"
      className="border-polytechnic/12 group flex h-[21.25rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all sm:h-[21.75rem] sm:w-[20rem] md:h-[21.75rem] md:w-[21.5rem] lg:w-[22rem]"
      draggable={false}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {course.image ? (
          <Image
            src={course.image}
            alt={`${course.name} course image`}
            fill
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 320px, 296px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200">
            {course.icon && <course.icon className="h-16 w-16 text-slate-400" />}
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        
        {/* AICTE Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white/92 px-2.5 py-1 shadow-sm backdrop-blur-sm">
          <Image
            src="/aicte.png"
            alt="AICTE"
            width={56}
            height={22}
            style={{ width: "auto" }}
            className="h-4 object-contain"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-3.5">
        <div className="space-y-1.5 flex flex-col h-full">
          <h3 className="text-polytechnic-dark line-clamp-3 text-[1.35rem] leading-snug font-semibold md:text-[1.45rem]">
            {course.name}
          </h3>

          <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
            <span className="text-polytechnic block text-[0.75rem] font-bold tracking-wider uppercase">
              Diploma
            </span>
            <Link
              href={`/institutions/polytechnic/departments/${course.slug}`}
              className="text-polytechnic inline-flex items-center text-[0.95rem] font-semibold hover:underline"
            >
              Program Details
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CourseCarouselSection({
  courses,
}: {
  courses: PolytechnicCourse[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const updateArrows = () => {
      setShowArrows(container.scrollWidth > container.clientWidth + 2);
    };

    updateArrows();

    const observer = new ResizeObserver(updateArrows);
    observer.observe(container);

    return () => observer.disconnect();
  }, [courses.length]);

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>('[data-course-card="true"]');
    const cardWidth = card?.offsetWidth ?? 300;
    const gap = 24;

    container.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-10 w-full pb-8">
      {showArrows && (
        <div className="mb-4 flex justify-end gap-2 px-4 md:px-0">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            aria-label="Scroll courses left"
            className="border-border bg-white text-polytechnic-dark hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            aria-label="Scroll courses right"
            className="border-border bg-white text-polytechnic-dark hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <DragScroll className="snap-container scrollbar-hide flex w-full items-stretch gap-4 overflow-x-auto px-4 pb-4 md:gap-6 md:px-0">
        <div className="flex w-max items-stretch gap-4 md:gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
            />
          ))}
        </div>
      </DragScroll>
    </div>
  );
}

export function DiplomaPrograms() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <PolySection
      id="programs"
      tone="transparent"
      className="group/section relative overflow-hidden border-t border-slate-100 bg-[#f6f8f7] pt-20 pb-12"
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

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
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

        <CourseCarouselSection courses={diplomaPrograms as PolytechnicCourse[]} />
      </div>
    </PolySection>
  );
}
