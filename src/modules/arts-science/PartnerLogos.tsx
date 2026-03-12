"use client";

import { motion } from "framer-motion";
import { Laptop, Briefcase, Code, Globe, Cpu, Blocks } from "lucide-react";

export function PartnerLogos() {
  const logos = [
    { icon: Laptop, name: "TechCorp" },
    { icon: Blocks, name: "Webflow" },
    { icon: Code, name: "Relume" },
    { icon: Globe, name: "GlobalNet" },
    { icon: Cpu, name: "SysCo" },
    { icon: Briefcase, name: "Enterprise" },
  ];

  return (
    <section className="bg-[#edeff2] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <h2 className="mb-12 font-sans text-xl font-bold text-[#800020] md:text-2xl">
          Where our graduates work
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale transition-all duration-700 hover:grayscale-0 md:gap-16">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 font-sans text-lg font-bold text-[#2C2C2C] md:text-xl"
            >
              <logo.icon size={28} />
              <span>{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
