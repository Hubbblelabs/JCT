"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section className="py-20 md:py-32 bg-[#f4f4f4]">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#800020] mb-6 leading-tight">
              Excellence matters
            </h2>
            
            <p className="text-xl md:text-2xl text-[#2C2C2C] leading-relaxed font-light">
              We build leaders through innovation, integrity, and intellectual rigor across every discipline. 
              Our programs in science, commerce, and the humanities are designed to develop analytical minds and responsible citizens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
