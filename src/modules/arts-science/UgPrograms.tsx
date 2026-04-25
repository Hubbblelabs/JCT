"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ugPrograms } from "@/data/arts-science";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DragScroll } from "@/components/ui/DragScroll";

type ArtsScienceCourse = {
  name: string;
  abbr?: string;
  slug: string;
  image?: string;
  highlight?: string;
};

function CourseCard({ course }: { course: ArtsScienceCourse }) {
  const router = useRouter();
  const href = `/institutions/arts-science/departments/${course.slug}`;
  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      data-course-card="true"
      onClick={() => router.push(href)}
      className="border-arts-science/10 group cursor-pointer hover:shadow-md flex h-full min-h-[20rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border bg-white transition-all sm:w-[20rem] md:w-[21.5rem] lg:w-[22rem] pb-4"
      draggable={false}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {course.image && (
          <Image
            src={course.image}
            alt={`${course.name} course image`}
            fill
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 320px, 296px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-5 pt-3.5 pb-2 justify-between">
        <div className="space-y-1.5">
          <h3 className="text-arts-science line-clamp-2 text-[1.35rem] leading-snug font-semibold md:text-[1.45rem]">
            {course.name}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {course.highlight}
          </p>
        </div>

        <div className="flex flex-col flex-1 justify-end pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-arts-science block text-[0.75rem] font-bold tracking-wider uppercase">
              {course.abbr}
            </span>
            <Link
              href={href}
              className="text-arts-science inline-flex items-center text-[0.95rem] font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()}
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

function CourseCarouselSection({ courses }: { courses: ArtsScienceCourse[] }) {
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

    const card = container.querySelector<HTMLElement>(
      '[data-course-card="true"]',
    );
    const cardWidth = card?.offsetWidth ?? 300;
    const gap = 24;

    container.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-10 container mx-auto mt-12 px-4 md:px-6">
      <div className="relative mx-auto w-full pt-4 pb-8">
        {showArrows && (
          <div className="mb-4 flex justify-end gap-2 px-4 md:px-6">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Scroll courses left"
              className="border-border text-arts-science hover:border-arts-science-accent/30 hover:text-arts-science-accent inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Scroll courses right"
              className="border-border text-arts-science hover:border-arts-science-accent/30 hover:text-arts-science-accent inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <DragScroll className="snap-container scrollbar-hide flex w-full items-stretch gap-4 overflow-x-auto px-4 md:gap-6 md:px-6">
          <div className="flex w-max items-stretch gap-4 md:gap-6">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </DragScroll>
      </div>
    </div>
  );
}

export function UgPrograms() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section
      id="courses"
      className="group/section relative overflow-hidden bg-slate-50 py-20 md:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Background Textures & Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute inset-0 bg-orange-200 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />

        {/* Spotlight dots layer tracking the mouse */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="bg-arts-science-accent absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />
        </div>
      </div>
      <div className="bg-arts-science/5 absolute -top-40 -right-40 h-120 w-120 rounded-full blur-[100px]" />
      <div className="bg-arts-science/5 absolute -bottom-40 -left-40 h-120 w-120 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto mb-8 w-full px-4 md:px-6">
        <div className="mb-0 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-arts-science-accent mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              Undergraduate Programs
            </h2>
            <h3 className="text-arts-science mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
              Study what moves you forward
            </h3>
          </div>
        </div>
      </div>

      <CourseCarouselSection courses={ugPrograms as ArtsScienceCourse[]} />
    </section>
  );
}
