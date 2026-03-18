"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section id="about" className="bg-[#f4f4f4] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-navy mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl">
              Excellence matters
            </h2>

            <p className="text-xl leading-relaxed font-light text-[#2C2C2C] md:text-2xl">
              We build leaders through innovation, integrity, and intellectual
              rigor across every discipline. Our programs in science, commerce,
              and the humanities are designed to develop analytical minds and
              responsible citizens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
