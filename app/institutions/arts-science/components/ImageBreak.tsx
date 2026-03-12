"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ImageBreak() {
  return (
    <section className="relative h-[50vh] min-h-100 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
        alt="Students studying on campus"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#800020]/60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl px-4"
        >
          <p className="text-3xl md:text-4xl font-serif text-white leading-snug italic font-light drop-shadow-md">
            "The unexamined life is not worth living."
          </p>
          <span className="block mt-4 text-sm text-[#D4AF37] font-bold uppercase tracking-widest drop-shadow-sm">
            — Socrates
          </span>
        </motion.div>
      </div>
    </section>
  );
}
