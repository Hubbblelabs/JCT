"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Distinction() {
  return (
    <section className="bg-[#edeff2] py-20 md:py-32">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="mb-6 text-sm font-bold tracking-[0.2em] text-[#800020] uppercase">
              Distinction
            </h2>
            <h3 className="mb-6 font-sans text-4xl leading-tight font-bold text-[#800020] md:text-5xl">
              Why we stand apart
            </h3>

            <p className="mb-10 text-lg leading-relaxed font-light text-[#2C2C2C] md:text-xl">
              Our commitment to excellence is reflected in every aspect of
              campus life, from world-class faculty to industry partnerships. We
              ensure our students receive a holistic education that goes beyond
              textbooks.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-bold text-[#70001b] shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
              >
                Discover
              </Button>
              <a
                href="#more"
                className="mt-2 text-sm font-semibold text-[#800020] hover:underline sm:mt-0"
              >
                More &gt;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
