"use client";

import { motion } from "framer-motion";
import { testimonials } from "../data";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] leading-tight mb-6">
            Student Voices
          </h2>
          <p className="text-lg md:text-xl text-[#2C2C2C] font-light max-w-2xl leading-relaxed mx-auto md:mx-0">
            Hear directly from our graduates about how their experiences on campus prepared them for the challenges of tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testy, index) => (
            <motion.div
              key={testy.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col h-full bg-[#f4f4f4] p-8 md:p-10 rounded-xl"
            >
              <Quote className="w-10 h-10 text-stone-300 mb-6" />
              <p className="text-lg text-[#800020] font-medium leading-relaxed mb-8 flex-1">
                "{testy.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testy.image} alt={testy.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#800020] font-sans">{testy.name}</h4>
                  <p className="text-sm font-light text-stone-500">{testy.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
