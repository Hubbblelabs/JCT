"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ugPrograms } from "../data";

export function UgPrograms() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#800020] mb-4">
            Programs
          </h2>
          <h3 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] leading-tight mb-6">
            Study what moves you forward
          </h3>
          <p className="text-lg md:text-xl text-[#2C2C2C] font-light max-w-2xl leading-relaxed mx-auto md:mx-0">
            Choose from diverse academic pathways designed to prepare you for meaningful careers in your field of choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {ugPrograms.map((prog, index) => (
            <motion.div
              key={prog.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col group relative"
            >
              <Link href={`/institutions/arts-science/courses/${prog.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {prog.name} details</span>
              </Link>
              
              <div className="mb-6">
                <div className="w-14 h-14 bg-stone-100 rounded flex items-center justify-center text-[#800020] mb-6 group-hover:bg-[#800020] group-hover:text-white transition-colors duration-300">
                  <prog.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold font-sans text-[#800020] mb-3 leading-tight group-hover:text-[#800020] transition-colors">
                  {prog.name}
                </h3>
                <p className="text-[#2C2C2C] font-light leading-relaxed">
                  {prog.desc}
                </p>
              </div>
              
              <div className="mt-auto flex items-center text-[#800020] font-semibold text-sm group-hover:text-[#800020]">
                Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-10 border-t border-stone-200">
          <Button variant="outline" className="h-14 px-8 border-stone-300 text-[#2C2C2C] bg-transparent hover:bg-stone-50 rounded-none cursor-pointer w-full sm:w-auto">
            Browse
          </Button>
          <a href="#all" className="flex items-center text-[#800020] font-semibold text-sm hover:underline mt-2">
            All &gt;
          </a>
        </div>

      </div>
    </section>
  );
}
