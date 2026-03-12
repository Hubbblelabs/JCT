"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/arts-science";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="mb-6 font-sans text-4xl leading-tight font-bold text-[#800020] md:text-5xl">
            Student Voices
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[#2C2C2C] md:mx-0 md:text-xl">
            Hear directly from our graduates about how their experiences on
            campus prepared them for the challenges of tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testy, index) => (
            <motion.div
              key={testy.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex h-full flex-col rounded-xl bg-[#f4f4f4] p-8 md:p-10"
            >
              <Quote className="mb-6 h-10 w-10 text-stone-300" />
              <p className="mb-8 flex-1 text-lg leading-relaxed font-medium text-[#800020]">
                &ldquo;{testy.quote}&rdquo;
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testy.image}
                    alt={testy.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[#800020]">
                    {testy.name}
                  </h4>
                  <p className="text-sm font-light text-stone-500">
                    {testy.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
