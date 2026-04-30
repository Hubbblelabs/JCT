"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";
import { ugCourses, pgCourses, researchCourses } from "@/data/engineering";

type EngineeringCourse = {
  name: string;
  abbr: string;
  slug: string;
  image: string;
  highlight: string;
  nbaAccredited?: boolean;
};

function CourseCard({
  course,
  href,
  showAccreditationBadges,
  showDescription,
}: {
  course: EngineeringCourse;
  href?: string;
  showAccreditationBadges: boolean;
  showDescription: boolean;
}) {
  const router = useRouter();

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      data-course-card="true"
      onClick={() => {
        if (href) router.push(href);
      }}
      className={`border-engineering/12 group flex h-full min-h-[20rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border bg-white pb-4 transition-all sm:w-[20rem] md:w-[21.5rem] lg:w-[22rem] ${href ? "cursor-pointer hover:shadow-md" : ""}`}
      draggable={false}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={course.image}
          alt={`${course.name} course image`}
          fill
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 320px, 296px"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        {showAccreditationBadges && (
          <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white/92 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <Image
              src="/aicte.png"
              alt="AICTE"
              width={56}
              height={22}
              style={{ width: "auto" }}
              className="h-4 object-contain"
            />
            {course.nbaAccredited && (
              <Image
                src="/nba.png"
                alt="NBA Accredited"
                width={56}
                height={22}
                style={{ width: "auto" }}
                className="h-4 object-contain"
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between px-5 pt-3.5 pb-2">
        <div className="space-y-1.5">
          <h3 className="text-navy line-clamp-2 text-[1.35rem] leading-snug font-semibold md:text-[1.45rem]">
            {course.name}
          </h3>

          {showDescription && (
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
              {course.highlight}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-end pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-engineering block text-[0.75rem] font-bold tracking-wider uppercase">
              {course.abbr}
            </span>
            {href ? (
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="text-engineering inline-flex items-center text-[0.95rem] font-semibold hover:underline"
              >
                Program Details
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="text-engineering inline-flex items-center text-[0.95rem] font-semibold">
                Program Details
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CourseCarouselSection({
  eyebrow,
  title,
  subtitle,
  courses,
  showAccreditationBadges,
  showDescription,
  showHeader = true,
  controlsPlacement = "top",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  courses: EngineeringCourse[];
  showAccreditationBadges: boolean;
  showDescription: boolean;
  showHeader?: boolean;
  controlsPlacement?: "top" | "header";
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
      {showHeader && (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-engineering-light mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              {eyebrow}
            </h2>
            <h3 className="text-navy mb-0 font-serif text-4xl leading-tight font-bold md:text-5xl">
              {title}{" "}
              <span className="font-normal text-stone-300 italic">
                {subtitle}
              </span>
            </h3>
          </div>

          {controlsPlacement === "header" && showArrows && (
            <div className="flex gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                aria-label="Scroll courses left"
                className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                aria-label="Scroll courses right"
                className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative mx-auto w-full ${showHeader ? "pt-2 pb-8" : "pt-4 pb-8"}`}
      >
        {controlsPlacement === "top" && showArrows && (
          <div className="mb-4 flex justify-end gap-2 px-4 md:px-6">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Scroll courses left"
              className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Scroll courses right"
              className="border-border text-navy hover:border-gold/30 hover:text-gold inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <DragScroll className="snap-container scrollbar-hide flex w-full items-stretch gap-4 overflow-x-auto px-4 md:gap-6 md:px-6">
          <div className="flex w-max items-stretch gap-4 md:gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                href={
                  showAccreditationBadges
                    ? `/institutions/engineering/departments/${course.slug}`
                    : undefined
                }
                showAccreditationBadges={showAccreditationBadges}
                showDescription={showDescription}
              />
            ))}
          </div>
        </DragScroll>
      </div>
    </div>
  );
}

export function EngineeringDomains() {
  const postgraduateCourses = [...pgCourses, ...researchCourses];

  return (
    <section
      id="programs"
      className="group/section relative overflow-hidden bg-white py-16 md:py-24"
    >
      <style>{`
        @keyframes slide-bg {
          0% { background-position: 0 0; }
          100% { background-position: -28.28px 0; }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-[0.02] group-hover/section:animate-[slide-bg_2s_linear_infinite]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-engineering-dark) 0px, var(--color-engineering-dark) 2px, transparent 2px, transparent 10px)",
          backgroundSize: "28.28px 28.28px",
        }}
      />

      <div className="relative z-10 container mx-auto mb-8 w-full px-4 md:px-6">
        <div className="mb-0 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-engineering-light mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              Undergraduate Programs
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
              11 UG Courses,{" "}
              <span className="font-normal text-stone-300 italic">
                One Standard.
              </span>
            </h3>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-stone-600 md:text-lg">
            4-year B.E. / B.Tech programs approved by AICTE and affiliated to
            Anna University, Chennai. Each department has dedicated labs,
            workshops, and faculty with industry experience.
          </p>
        </div>
      </div>

      <CourseCarouselSection
        eyebrow="Undergraduate Programs"
        title="11 UG Courses,"
        subtitle="One Standard."
        courses={ugCourses as EngineeringCourse[]}
        showAccreditationBadges
        showDescription={false}
        showHeader={false}
        controlsPlacement="top"
      />

      <CourseCarouselSection
        eyebrow="Postgraduate Programs"
        title={`${postgraduateCourses.length} PG Courses,`}
        subtitle="Advanced Learning."
        courses={postgraduateCourses as EngineeringCourse[]}
        showAccreditationBadges={false}
        showDescription={false}
        showHeader
        controlsPlacement="header"
      />
    </section>
  );
}
