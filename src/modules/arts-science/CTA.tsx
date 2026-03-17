"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="border-arts-science bg-navy border-t-4 py-16 md:py-24">
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
                className="border-arts-science-light/70 from-arts-science to-arts-science-dark h-14 w-full rounded-full border bg-linear-to-r px-8 font-bold text-white shadow-[0_12px_28px_rgba(155,27,48,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
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
