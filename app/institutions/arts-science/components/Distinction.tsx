"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";

export function Distinction() {
  return (
    <section className="py-20 md:py-32 bg-[#edeff2]">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#800020] mb-6">
              Distinction
            </h2>
            <h3 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] leading-tight mb-6">
              Why we stand apart
            </h3>
            
            <p className="text-lg md:text-xl text-[#2C2C2C] leading-relaxed font-light mb-10">
              Our commitment to excellence is reflected in every aspect of campus life, from world-class faculty to industry partnerships. We ensure our students receive a holistic education that goes beyond textbooks.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-[#D4AF37] text-[#800020] hover:bg-[#b8962e] font-bold rounded-none border-none shadow-md"
              >
                Discover
              </Button>
              <a href="#more" className="text-[#800020] font-semibold text-sm hover:underline mt-2 sm:mt-0">
                More &gt;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
