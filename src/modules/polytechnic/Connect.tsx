"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectStats } from "@/data/polytechnic";

export function Connect() {
  return (
    <section className="bg-[#F8F9FA] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-polytechnic-dark mb-2 text-sm font-bold tracking-[0.2em] uppercase">
              Connect
            </h2>
            <h3 className="text-polytechnic-dark mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl">
              Connect. Learn. Explore.
            </h3>
            <p className="mb-10 text-xl leading-relaxed font-normal text-[#212121]/80 md:text-2xl">
              Shri Jagannath Educational Health and Charitable Trust was
              established by renowned and philanthropic people with an objective
              of providing education to all — especially the downtrodden and
              rural population.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-12">
              {connectStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-polytechnic-dark block font-sans text-3xl font-black md:text-4xl">
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
              className="group bg-polytechnic hover:bg-polytechnic-light inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(58,67,84,0.35)] transition-all hover:-translate-y-0.5"
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
