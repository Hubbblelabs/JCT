"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ugPrograms } from "@/data/arts-science";

export function UgPrograms() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-arts-science mb-4 text-xs font-bold tracking-[0.2em] uppercase">
            Programs
          </h2>
          <h3 className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
            Study what moves you forward
          </h3>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed font-light md:mx-0 md:text-xl">
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
              className="group border-border hover:border-arts-science/30 card-hover-lift flex h-full flex-col rounded-2xl border bg-white p-6 md:p-8"
            >
              <Link
                href={`/institutions/arts-science/departments/${prog.slug}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">View {prog.name} details</span>
              </Link>

              <div className="mb-6">
                <div className="bg-arts-science-muted text-arts-science group-hover:bg-arts-science mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 group-hover:text-white">
                  <prog.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-navy mb-3 font-serif text-2xl leading-tight font-bold transition-colors">
                  {prog.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  {prog.desc}
                </p>
              </div>

              <div className="border-border text-arts-science mt-auto flex items-center justify-between border-t pt-4 text-sm font-semibold">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-border flex items-center justify-center gap-4 border-t pt-10">
          <Link
            href="/institutions/arts-science/courses"
            className="group bg-navy shadow-navy/20 hover:bg-navy-light inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Browse all programs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
