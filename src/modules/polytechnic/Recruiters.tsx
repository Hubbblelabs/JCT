"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { recruiters } from "@/data/polytechnic";

function LogoCard({ company }: { company: { name: string; logo: string } }) {
  return (
    <div className="flex h-14 w-32 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md md:h-16 md:w-36">
      <div className="relative h-7 w-full md:h-8">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="144px"
          className="object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function Recruiters() {
  const row1 = [...recruiters, ...recruiters];
  const row2 = [...recruiters.slice().reverse(), ...recruiters.slice().reverse()];

  return (
    <section className="overflow-hidden bg-[#F8F9FA] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-sans text-xl font-bold text-[#1A237E] md:text-2xl"
        >
          Where our graduates work
        </motion.h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r from-[#F8F9FA] to-transparent md:w-32" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l from-[#F8F9FA] to-transparent md:w-32" />

        {/* Row 1 — scrolls left */}
        <div className="mb-4">
          <div className="animate-scroll-left flex gap-4">
            {row1.map((company, i) => (
              <LogoCard key={`r1-${i}`} company={company} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div>
          <div className="animate-scroll-right flex gap-4">
            {row2.map((company, i) => (
              <LogoCard key={`r2-${i}`} company={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
