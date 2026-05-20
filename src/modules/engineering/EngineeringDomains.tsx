"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";
import { getImageUrl } from "@/lib/utils";

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
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
        {course.image && (
          <Image
            src={getImageUrl(course.image) ?? course.image}
            alt={`${course.name} course image`}
            fill
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 320px, 296px"
            className="object-cover transition-transform duration-500 group-hover:scale-103"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        {showAccreditationBadges && (
          <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-white/92 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <Image
              src="/accreditations/aicte.webp"
              alt="AICTE"
              width={56}
              height={22}
              style={{ width: "auto" }}
              className="h-4 object-contain"
            />
            {course.nbaAccredited && (
              <Image
                src="/accreditations/nba.webp"
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
  pgCourses = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  courses: EngineeringCourse[];
  showAccreditationBadges: boolean;
  showDescription: boolean;
  showHeader?: boolean;
  controlsPlacement?: "top" | "header";
  pgCourses?: boolean;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const handleScroll = useCallback(() => {
    const container = carouselRef.current;
    if (!container || courses.length === 0) return;

    const cards = container.querySelectorAll<HTMLElement>(
      '[data-course-card="true"]',
    );
    const n = courses.length;
    if (cards.length < 3 * n) return;

    const singleSetWidth = cards[n].offsetLeft - cards[0].offsetLeft;
    if (singleSetWidth <= 0) return;

    const scrollLeft = container.scrollLeft;

    if (scrollLeft < singleSetWidth - 4) {
      container.scrollLeft = scrollLeft + singleSetWidth;
    } else if (scrollLeft >= singleSetWidth * 2 - 4) {
      container.scrollLeft = scrollLeft - singleSetWidth;
    }
  }, [courses.length]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || courses.length === 0) return;

    const initializeScroll = () => {
      const cards = container.querySelectorAll<HTMLElement>(
        '[data-course-card="true"]',
      );
      const n = courses.length;
      if (cards.length < 3 * n) return;

      const singleSetWidth = cards[n].offsetLeft - cards[0].offsetLeft;
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth;
      }
    };

    const timer = setTimeout(initializeScroll, 100);

    const observer = new ResizeObserver(initializeScroll);
    observer.observe(container);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [courses.length]);

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(
      '[data-course-card="true"]',
    );
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    let step = cardWidth + 24;
    if (cards.length > 1) {
      step = cards[1].offsetLeft - cards[0].offsetLeft;
    }

    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      scrollCarousel("right");
    }, 1500);

    const container = carouselRef.current;
    const pause = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
    const resume = () => {
      autoScrollRef.current = setInterval(() => scrollCarousel("right"), 1500);
    };

    container?.addEventListener("mouseenter", pause);
    container?.addEventListener("mouseleave", resume);
    container?.addEventListener("touchstart", pause, { passive: true });
    container?.addEventListener("touchend", resume);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      container?.removeEventListener("mouseenter", pause);
      container?.removeEventListener("mouseleave", resume);
      container?.removeEventListener("touchstart", pause);
      container?.removeEventListener("touchend", resume);
    };
  }, [scrollCarousel]);

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

        <DragScroll
          ref={carouselRef}
          onScroll={handleScroll}
          className="snap-container scrollbar-hide flex w-full items-stretch gap-4 overflow-x-auto px-4 md:gap-6 md:px-6"
        >
          <div className="flex w-max items-stretch gap-4 md:gap-6">
            {[...courses, ...courses, ...courses].map((course, index) => (
              <CourseCard
                key={`${course.slug}-${index}`}
                course={course}
                href={
                  showAccreditationBadges || pgCourses
                    ? `/institutions/engineering/programs/${course.slug}`
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

function normalizeDbCourses(raw: unknown): EngineeringCourse[] {
  if (!Array.isArray(raw)) return [];
  const out: EngineeringCourse[] = [];
  for (const entry of raw) {
    const r = (entry ?? {}) as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name : null;
    const slug = typeof r.slug === "string" ? r.slug : null;
    const abbr = typeof r.abbr === "string" ? r.abbr : "";
    if (!name || !slug) continue;
    out.push({
      name,
      abbr,
      slug,
      image: typeof r.image === "string" ? r.image : "",
      highlight: typeof r.highlight === "string" ? r.highlight : "",
    });
  }
  return out;
}

export function EngineeringDomains() {
  const [ugCourses, setUgCourses] = useState<EngineeringCourse[]>([]);
  const [postgraduateCourses, setPostgraduateCourses] = useState<
    EngineeringCourse[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/programs?institution=engineering&published=true")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const raw = Array.isArray(res?.data)
          ? (res.data as Record<string, unknown>[])
          : [];
        const all = normalizeDbCourses(raw);

        const ug: EngineeringCourse[] = [];
        const pg: EngineeringCourse[] = [];
        all.forEach((course, idx) => {
          const item = raw[idx] ?? {};
          const degree =
            typeof item.degree === "string" ? item.degree.toLowerCase() : "";
          if (
            degree.includes("m.e") ||
            degree.includes("m.tech") ||
            degree.includes("ph.d")
          ) {
            pg.push(course);
          } else {
            ug.push(course);
          }
        });

        setUgCourses(ug);
        setPostgraduateCourses(pg);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
              {ugCourses.length > 0
                ? `${ugCourses.length} UG Courses,`
                : "UG Courses,"}{" "}
              <span className="font-normal text-stone-300 italic">
                One Standard.
              </span>
            </h3>
            <Link
              href="/institutions/engineering/courses"
              className="text-engineering hover:bg-engineering inline-flex items-center gap-2 rounded-full border border-current px-5 py-2 text-sm font-semibold transition-all hover:text-white"
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-stone-600 md:text-lg">
            4-year B.E. / B.Tech programs approved by AICTE and affiliated to
            Anna University, Chennai. Each department has dedicated labs,
            workshops, and faculty with industry experience.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container mx-auto px-4 py-16 text-center text-sm text-stone-400 md:px-6">
          Loading programs…
        </div>
      ) : ugCourses.length === 0 && postgraduateCourses.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center text-sm text-stone-400 md:px-6">
          No programs published yet.
        </div>
      ) : (
        <>
          {ugCourses.length > 0 && (
            <CourseCarouselSection
              eyebrow="Undergraduate Programs"
              title={`${ugCourses.length} UG Courses,`}
              subtitle="One Standard."
              courses={ugCourses}
              showAccreditationBadges
              showDescription={false}
              showHeader={false}
              controlsPlacement="top"
            />
          )}

          {postgraduateCourses.length > 0 && (
            <CourseCarouselSection
              eyebrow="Postgraduate Programs"
              title={`${postgraduateCourses.length} PG Courses,`}
              subtitle="Advanced Learning."
              courses={postgraduateCourses}
              showAccreditationBadges={false}
              showDescription={false}
              showHeader
              controlsPlacement="header"
              pgCourses={true}
            />
          )}
        </>
      )}
    </section>
  );
}
