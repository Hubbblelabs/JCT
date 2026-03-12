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
          className="max-w-2xl px-4 text-center"
        >
          <p className="font-serif text-3xl leading-snug font-light text-white italic drop-shadow-md md:text-4xl">
            &ldquo;The unexamined life is not worth living.&rdquo;
          </p>
          <span className="mt-4 block text-sm font-bold tracking-widest text-[#D4AF37] uppercase drop-shadow-sm">
            — Socrates
          </span>
        </motion.div>
      </div>
    </section>
  );
}
