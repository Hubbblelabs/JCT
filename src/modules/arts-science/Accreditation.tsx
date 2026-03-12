"use client";

import { motion } from "framer-motion";
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
                className="h-14 w-full rounded-none border-none bg-[#D4AF37] px-8 font-bold text-[#800020] shadow-md hover:bg-[#b8962e] sm:w-auto"
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
            className="relative flex aspect-square w-full shrink-0 flex-col items-center justify-center bg-stone-300 lg:aspect-[4/3]"
          >
            {/* Relume style image placeholder */}
            <div className="text-stone-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
