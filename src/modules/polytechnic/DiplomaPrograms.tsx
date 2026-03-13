"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";
import { diplomaPrograms } from "@/data/polytechnic";

export function DiplomaPrograms() {
  return (
    <section
      id="programs"
      className="relative overflow-hidden bg-linear-to-b from-[#F4F6FF] via-white to-[#FFF9EC] py-20 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#1A237E]/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[#FFB300]/12 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 md:px-8">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="text-center md:text-left">
            <h2 className="mb-4 text-xs font-black tracking-[0.22em] text-[#1A237E] uppercase">
              Study @ JCT
            </h2>
            <h3 className="mb-5 font-sans text-4xl font-black leading-tight text-[#1A237E] md:text-5xl lg:text-6xl">
              Six streams. One
              <span className="block text-[#FFB300]">polytechnic future.</span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[#212121]/75 md:mx-0 md:text-xl">
              Choose a diploma program tailored to your interests, with a
              practical-first path into industry, higher studies, and technical
              careers.
            </p>
          </div>

          <div className="mx-auto w-fit rounded-2xl border border-[#1A237E]/15 bg-white/90 px-5 py-3 text-left shadow-sm backdrop-blur-sm md:mx-0">
            <p className="text-[10px] font-black tracking-[0.18em] text-[#1A237E]/70 uppercase">
              Programs Available
            </p>
            <p className="font-sans text-3xl font-black text-[#1A237E]">
              {diplomaPrograms.length}
            </p>
          </div>
        </div>

        <DragScroll className="-mx-4 flex snap-x snap-mandatory gap-6 scroll-smooth px-4 pb-8 md:mx-0 md:px-0">
          {diplomaPrograms.map((prog, index) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex min-w-[18rem] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-[#1A237E]/10 bg-white p-8 shadow-[0_12px_36px_-22px_rgba(26,35,126,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1A237E]/30 hover:shadow-[0_24px_56px_-24px_rgba(26,35,126,0.45)] md:min-w-88"
              draggable={false}
            >
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-[2.5rem] bg-[#1A237E]/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1A237E]/10" />

              <Link
                href={`/polytechnic/departments/${prog.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {prog.name} details</span>
              </Link>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1A237E]/10 bg-[#F4F6FF] text-[#1A237E] transition-colors group-hover:bg-[#1A237E] group-hover:text-white">
                <prog.icon size={28} strokeWidth={1.5} />
              </div>

              <span className="mb-2 text-xs font-black tracking-wider text-[#FFB300] uppercase">
                {prog.duration} · Full Time
              </span>

              <h3 className="mb-3 font-sans text-2xl font-black leading-tight text-[#1A237E]">
                {prog.name}
              </h3>

              <p className="mb-7 flex-1 text-sm leading-relaxed font-light text-[#212121]/75">
                {prog.desc}
              </p>

              <div className="mt-auto inline-flex w-fit items-center gap-1 rounded-full border border-[#1A237E]/15 bg-[#F4F6FF] px-4 py-2 text-sm font-semibold text-[#1A237E] transition-colors group-hover:border-[#1A237E]/30 group-hover:bg-[#1A237E] group-hover:text-white">
                Find Out More
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </DragScroll>

        <div className="mt-8 flex items-center justify-center border-t border-[#1A237E]/10 pt-10">
          <Link
            href="/polytechnic/courses"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] to-[#FFB300] px-8 text-sm font-semibold text-[#1A237E] shadow-[0_10px_24px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
          >
            Browse all programs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
