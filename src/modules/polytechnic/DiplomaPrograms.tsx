"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";
import { diplomaPrograms } from "@/data/polytechnic";

export function DiplomaPrograms() {
  return (
    <section id="programs" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#1A237E] uppercase">
            Study @ JCT
          </h2>
          <h3 className="mb-6 font-sans text-4xl font-bold leading-tight text-[#1A237E] md:text-5xl">
            Six streams. Clear careers.
          </h3>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[#212121]/75 md:mx-0 md:text-xl">
            Choose a diploma program tailored to your interests — built around
            what you&apos;ll actually be able to do when you finish.
          </p>
        </div>

        <DragScroll className="-mx-4 flex snap-x snap-mandatory gap-6 scroll-smooth px-4 pb-8 md:mx-0 md:px-0">
          {diplomaPrograms.map((prog, index) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex min-w-70 shrink-0 snap-center flex-col rounded-2xl border border-stone-100 bg-[#F8F9FA] p-8 transition-all duration-300 hover:border-[#1A237E]/20 hover:shadow-lg md:min-w-80"
              draggable={false}
            >
              <Link
                href={`/polytechnic/courses/${prog.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {prog.name} details</span>
              </Link>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1A237E] transition-colors group-hover:bg-[#1A237E] group-hover:text-white">
                <prog.icon size={28} strokeWidth={1.5} />
              </div>

              <span className="mb-2 text-xs font-bold tracking-wider text-[#FFB300] uppercase">
                {prog.duration} · Full Time
              </span>

              <h3 className="mb-3 font-sans text-xl font-bold leading-tight text-[#1A237E]">
                {prog.name}
              </h3>

              <p className="mb-6 flex-1 text-sm leading-relaxed font-light text-[#212121]/75">
                {prog.desc}
              </p>

              <div className="mt-auto flex items-center text-sm font-semibold text-[#1A237E]">
                Find Out More{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </DragScroll>

        <div className="mt-10 flex items-center justify-center border-t border-stone-100 pt-10">
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
