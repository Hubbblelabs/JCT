"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectStats } from "@/data/polytechnic";

export function Connect() {
  return (
    <section className="bg-[#F8F9FA] py-20 md:py-32">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="mb-2 text-sm font-bold tracking-[0.2em] text-[#1A237E] uppercase">
              Connect
            </h2>
            <h3 className="mb-6 font-sans text-4xl font-bold leading-tight text-[#1A237E] md:text-5xl">
              Connect. Learn. Explore.
            </h3>
            <p className="mb-10 text-xl leading-relaxed font-light text-[#212121]/80 md:text-2xl">
              Shri Jagannath Educational Health and Charitable Trust was
              established by renowned and philanthropic people with an objective
              of providing education to all — especially the downtrodden and
              rural population.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-12">
              {connectStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block font-sans text-3xl font-black text-[#1A237E] md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs font-bold tracking-wider text-stone-500 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] to-[#FFB300] px-8 text-sm font-semibold text-[#1A237E] shadow-[0_10px_24px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
            >
              Learn More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
