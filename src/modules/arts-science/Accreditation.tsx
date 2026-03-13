"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Accreditation() {
  return (
    <section className="bg-[#edeff2] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h3 className="mb-6 font-sans text-3xl leading-tight font-bold text-[#800020] sm:text-4xl md:text-5xl">
              Rigorous curriculum meets global standards
            </h3>

            <p className="mb-8 text-base leading-relaxed font-light text-[#2C2C2C] md:text-lg">
              Our university is fully accredited by leading academic bodies and
              maintains academic partnerships across the globe. This ensures
              that every degree holds weight, opens doors, and prepares students
              to meet international expectations in a rapidly evolving job
              market.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 w-full rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-bold text-[#70001b] shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95 sm:w-auto"
              >
                Learn
              </Button>
              <a
                href="#more"
                className="mt-2 flex items-center justify-center px-4 text-sm font-semibold text-[#800020] hover:underline sm:mt-0 sm:justify-start"
              >
                More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex aspect-square w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl lg:aspect-4/3"
          >
            <Image
              src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop"
              alt="Academic accreditation and quality standards at JCT"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1f1f1f]/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
