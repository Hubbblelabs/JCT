"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Accreditation() {
  return (
    <section className="py-20 md:py-32 bg-[#edeff2]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#800020] mb-6 leading-tight">
              Rigorous curriculum meets global standards
            </h3>
            
            <p className="text-base md:text-lg text-[#2C2C2C] leading-relaxed mb-8 font-light">
              Our university is fully accredited by leading academic bodies and maintains academic partnerships across the globe. This ensures that every degree holds weight, opens doors, and prepares students to meet international expectations in a rapidly evolving job market.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-[#D4AF37] text-[#800020] hover:bg-[#b8962e] font-bold rounded-none border-none shadow-md w-full sm:w-auto"
              >
                Learn
              </Button>
              <a href="#more" className="flex items-center justify-center sm:justify-start text-[#800020] font-semibold text-sm hover:underline mt-2 sm:mt-0 px-4">
                More <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative w-full aspect-square lg:aspect-[4/3] bg-stone-300 flex items-center justify-center flex-col shrink-0"
          >
            {/* Relume style image placeholder */}
            <div className="text-stone-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
