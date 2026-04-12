"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { ugCourses, pgCourses, researchCourses } from "@/data/engineering";

export function EngineeringDomains() {
  return (
    <section
      id="engineering-domains"
      className="group/section relative overflow-hidden bg-white py-16 md:py-24"
    >
      <style>{`
        @keyframes slide-bg {
          0% { background-position: 0 0; }
          100% { background-position: -28.28px 0; }
        }
        @keyframes marquee-courses {
          to { transform: translateX(calc(-50% - 12px)); }
        }
        @media (min-width: 768px) {
          @keyframes marquee-courses {
            to { transform: translateX(calc(-50% - 16px)); }
          }
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
            <h3 className="text-navy font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
              11 UG Courses,{" "}
              <span className="font-normal text-stone-300 italic">
                One Standard.
              </span>
            </h3>
          </div>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-sm">
            4-year B.E. / B.Tech programs approved by AICTE and affiliated to
            Anna University, Chennai. Each department has dedicated labs,
            workshops, and faculty with industry experience.
          </p>
        </div>
      </div>

      <div className="group/carousel relative flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] pt-4 pb-8 md:mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="flex w-max items-stretch gap-6 pl-6 group-hover/carousel:[animation-play-state:paused]! md:gap-8 md:pl-8"
          style={{ animation: "marquee-courses 30s linear infinite" }}
        >
          {[...ugCourses, ...ugCourses].map((dept, index) => (
            <motion.div
              key={`${dept.abbr}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: (index % ugCourses.length) * 0.05,
              }}
              className="group border-border hover:border-engineering/30 card-hover-lift relative flex min-h-75 w-72.5 shrink-0 flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm shadow-slate-200/50 transition-all hover:shadow-xl md:w-[320px] md:p-8"
              draggable={false}
            >
              <Link
                href={`/institutions/engineering/departments/${dept.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">
                  View {dept.name} department page
                </span>
              </Link>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-engineering group-hover:bg-engineering bg-engineering-muted shrink-0 rounded-xl p-3 transition-colors group-hover:text-white">
                    <dept.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-navy font-serif text-xl font-bold">
                      {dept.name}
                    </h3>
                    <span className="text-engineering mt-1 text-sm font-bold tracking-wider uppercase">
                      {dept.abbr}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-600 text-base leading-relaxed">
                    {dept.highlight}
                  </p>
                </div>
              </div>

              <div className="border-border mt-6 flex items-center justify-between border-t pt-6">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-stone-400" />
                  <span className="text-stone-600 text-sm font-bold">
                    {dept.seats} Seats
                  </span>
                  {dept.nbaAccredited && (
                    <div className="ml-1 flex items-center rounded border border-stone-100 bg-white px-1.5 py-0.5 shadow-xs">
                      <Image
                        src="/nba.png"
                        alt="NBA Accredited"
                        width={60}
                        height={24}
                        style={{ width: "auto" }}
                        className="h-5 object-contain"
                      />
                    </div>
                  )}
                </div>
                <ArrowRight
                  size={18}
                  className="text-engineering/40 group-hover:text-engineering transition-all group-hover:translate-x-1"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PG Programs ── */}
      <div className="relative z-10 container mx-auto mt-16 px-4 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-engineering-light mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              Postgraduate Programs
            </h2>
            <h3 className="text-navy font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
              3 M.E. Courses,{" "}
              <span className="font-normal text-stone-300 italic">
                Advanced Learning.
              </span>
            </h3>
          </div>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-sm">
            M.E. programs for advanced learning and specialized expertise in
            engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pgCourses.map((course, index) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group hover:border-engineering/30 rounded-2xl border border-stone-100 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-engineering group-hover:bg-engineering bg-engineering-muted shrink-0 rounded-xl p-3 transition-colors group-hover:text-white">
                    <course.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                    {course.abbr}
                  </span>
                </div>
                <div>
                  <h3 className="text-navy mb-2 font-serif text-xl font-bold">
                    {course.name}
                  </h3>
                  <p className="text-stone-600 text-base leading-relaxed">
                    {course.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Research Programs ── */}
      <div className="relative z-10 container mx-auto mt-16 px-4 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-engineering-light mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              Research Programs
            </h2>
            <h3 className="text-navy font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
              Ph.D. Programs,{" "}
              <span className="font-normal text-stone-300 italic">
                Leading Innovation.
              </span>
            </h3>
          </div>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-sm">
            Doctoral programs for deep research, innovation, and specialized
            expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchCourses.map((course, index) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group hover:border-engineering/30 rounded-2xl border border-stone-100 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-engineering group-hover:bg-engineering bg-engineering-muted shrink-0 rounded-xl p-3 transition-colors group-hover:text-white">
                    <course.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                    {course.abbr}
                  </span>
                </div>
                <div>
                  <h3 className="text-navy mb-2 font-serif text-xl font-bold">
                    {course.name}
                  </h3>
                  <p className="text-stone-600 text-base leading-relaxed">
                    {course.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}