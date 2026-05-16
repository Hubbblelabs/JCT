"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ugCourses, pgCourses, researchCourses } from "@/data/engineering";

type Course = {
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
  showBadges,
  badge,
}: {
  course: Course;
  href?: string;
  showBadges?: boolean;
  badge?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={course.image}
          alt={course.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {showBadges && (
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
                alt="NBA"
                width={56}
                height={22}
                style={{ width: "auto" }}
                className="h-4 object-contain"
              />
            )}
          </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3 rounded-full bg-engineering/90 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-1.5">
          <span className="text-engineering block text-[0.7rem] font-bold tracking-wider uppercase">
            {course.abbr}
          </span>
          <h3 className="text-navy text-[1.1rem] font-semibold leading-snug">
            {course.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {course.highlight}
          </p>
        </div>

        {href && (
          <Link
            href={href}
            className="text-engineering mt-4 inline-flex items-center text-sm font-semibold hover:underline"
          >
            Course Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export default function EngineeringCoursesPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="All Courses"
        subtitle="JCT College of Engineering & Technology"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Courses" },
          ]}
        />

        {/* UG Courses */}
        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-engineering-light mb-2 block text-xs font-bold tracking-[0.2em] uppercase">
                Undergraduate Programs
              </span>
              <h2 className="text-navy font-serif text-3xl font-bold md:text-4xl">
                B.E. / B.Tech Courses
              </h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              4-year programs approved by AICTE & affiliated to Anna University
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ugCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course as Course}
                href={`/institutions/engineering/departments/${course.slug}`}
                showBadges
                badge="UG"
              />
            ))}
          </div>
        </section>

        {/* PG Courses */}
        <section className="mt-16">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-engineering-light mb-2 block text-xs font-bold tracking-[0.2em] uppercase">
                Postgraduate Programs
              </span>
              <h2 className="text-navy font-serif text-3xl font-bold md:text-4xl">
                M.E. Courses
              </h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              Advanced specialization for engineering graduates
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pgCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course as Course}
                badge="PG"
              />
            ))}
          </div>
        </section>

        {/* Research / PhD */}
        <section className="mt-16 mb-12">
          <div className="mb-6">
            <span className="text-engineering-light mb-2 block text-xs font-bold tracking-[0.2em] uppercase">
              Research Programs
            </span>
            <h2 className="text-navy font-serif text-3xl font-bold md:text-4xl">
              Doctoral Programme
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {researchCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course as Course}
                badge="Ph.D."
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
