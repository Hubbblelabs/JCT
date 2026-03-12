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
    <section className="py-16 md:py-24 bg-[#edeff2]">
      <div className="container mx-auto px-4 md:px-8 text-center">
        
        <h2 className="text-xl md:text-2xl font-bold font-sans text-[#800020] mb-12">
          Where our graduates work
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 text-[#2C2C2C] text-lg md:text-xl font-bold font-sans"
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
