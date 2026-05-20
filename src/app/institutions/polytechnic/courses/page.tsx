"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { diplomaPrograms } from "@/data/polytechnic";

type Course = {
  name: string;
  slug: string;
  image: string;
  desc: string;
};

function CourseCard({
  course,
  href,
  badge,
}: {
  course: Course;
  href?: string;
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
        {course.image && (
          <Image
            src={course.image}
            alt={course.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {badge && (
          <div className="bg-polytechnic/90 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-1.5">
          <span className="text-polytechnic block text-[0.7rem] font-bold tracking-wider uppercase">
            Diploma
          </span>
          <h3 className="text-navy text-[1.1rem] leading-snug font-semibold">
            {course.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {course.desc}
          </p>
        </div>

        {href && (
          <Link
            href={href}
            className="text-polytechnic mt-4 inline-flex items-center text-sm font-semibold hover:underline"
          >
            Course Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export default function PolytechnicCoursesPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="All Courses"
        subtitle="JCT Polytechnic College"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
            { label: "Courses" },
          ]}
        />

        {/* Diploma Programs */}
        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-polytechnic mb-2 block text-xs font-bold tracking-[0.2em] uppercase">
                Diploma Programs
              </span>
              <h2 className="text-navy font-serif text-3xl font-bold md:text-4xl">
                Engineering & Technology Courses
              </h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              3-year programs approved by AICTE & governed by DOTE, Tamil Nadu
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {diplomaPrograms.map((course) => (
              <CourseCard
                key={course.slug}
                course={course as Course}
                href={`/institutions/polytechnic/departments/${course.slug}`}
                badge="Diploma"
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
