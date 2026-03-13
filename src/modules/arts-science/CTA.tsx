"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="border-t border-[#800020] bg-[#800020] py-20 md:py-32">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="mb-6 font-sans text-4xl leading-tight font-bold text-white md:text-5xl">
              Ready to begin your journey
            </h2>

            <p className="mb-10 text-lg leading-relaxed font-light text-white/90 md:text-xl">
              Take the first step toward a degree that opens doors and builds
              futures. Apply today to secure your place.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 w-full rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-bold text-[#70001b] shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95 sm:w-auto"
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-full border-2 border-white/55 bg-white/5 px-8 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
              >
                Visit
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
