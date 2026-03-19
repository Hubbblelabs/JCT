"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Distinction() {
  return (
    <section className="bg-arts-science-muted py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-arts-science-accent mb-6 text-sm font-bold tracking-[0.2em] uppercase">
              Distinction
            </h2>
            <h3 className="text-arts-science mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl">
              Why we stand apart
            </h3>

            <p className="mb-10 text-lg leading-relaxed font-light text-arts-science-light md:text-xl">
              Our commitment to excellence is reflected in every aspect of
              campus life, from world-class faculty to industry partnerships. We
              ensure our students receive a holistic education that goes beyond
              textbooks.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-arts-science hover:bg-arts-science-light h-14 rounded-full px-8 font-bold text-white shadow-xl transition-all hover:-translate-y-0.5"
              >
                Discover
              </Button>
              <a
                href="#more"
                className="text-arts-science-accent mt-2 text-sm font-semibold hover:underline sm:mt-0"
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
