"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-[#800020] border-t border-[#800020]">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white leading-tight mb-6">
              Ready to begin your journey
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light mb-10">
              Take the first step toward a degree that opens doors and builds futures. Apply today to secure your place.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
               <Button
                size="lg"
                className="h-14 px-8 bg-[#D4AF37] text-[#800020] hover:bg-[#b8962e] font-bold rounded-none w-full sm:w-auto shadow-xl"
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-white/30 text-white bg-transparent hover:bg-white/10 font-bold rounded-none w-full sm:w-auto"
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
