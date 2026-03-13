"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ugPrograms } from "@/data/arts-science";

export function UgPrograms() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="mb-4 text-sm font-bold tracking-[0.2em] text-[#800020] uppercase">
            Programs
          </h2>
          <h3 className="mb-6 font-sans text-4xl leading-tight font-bold text-[#800020] md:text-5xl">
            Study what moves you forward
          </h3>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[#2C2C2C] md:mx-0 md:text-xl">
            Choose from diverse academic pathways designed to prepare you for
            meaningful careers in your field of choice.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {ugPrograms.map((prog, index) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col"
            >
              <Link
                href={`/arts-science/courses/${prog.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {prog.name} details</span>
              </Link>

              <div className="mb-6">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded bg-stone-100 text-[#800020] transition-colors duration-300 group-hover:bg-[#800020] group-hover:text-white">
                  <prog.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-sans text-2xl leading-tight font-bold text-[#800020] transition-colors group-hover:text-[#800020]">
                  {prog.name}
                </h3>
                <p className="leading-relaxed font-light text-[#2C2C2C]">
                  {prog.desc}
                </p>
              </div>

              <div className="mt-auto flex items-center text-sm font-semibold text-[#800020] group-hover:text-[#800020]">
                Learn more{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 border-t border-stone-200 pt-10">
          <Link
            href="/arts-science/courses"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#800020] px-8 font-semibold text-sm text-white shadow-[0_8px_20px_rgba(128,0,32,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#5e0017] hover:shadow-[0_12px_24px_rgba(128,0,32,0.3)]"
          >
            Browse all programs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
