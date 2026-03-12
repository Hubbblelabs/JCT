"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { admissionsCriteria } from "../data";

export function Admissions() {
  return (
    <section className="py-12 md:py-16 bg-stone-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#800020] mb-6">
              Admissions
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#800020] leading-tight mb-8">
              Join a College That <br />
              <span className="text-[#D4AF37] italic font-light drop-shadow-sm">
                Values Substance.
              </span>
            </h3>
            <p className="text-stone-500 text-lg font-light leading-relaxed mb-12">
              Admissions are open for undergraduate and postgraduate programs.
              We follow a transparent, merit-based process aligned with
              Bharathiar University guidelines. No pressure, no complicated
              steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {admissionsCriteria.map((block) => (
              <div
                key={block.title}
                className="bg-white p-8 rounded-2xl border border-stone-100"
              >
                <h3 className="font-serif text-lg text-[#800020] font-bold mb-4">
                  {block.title}
                </h3>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[#2C2C2C] font-light"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-[#D4AF37] shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="h-14 px-10 bg-[#D4AF37] text-[#800020] hover:bg-[#b8962e] font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#D4AF37]/20"
            >
              Apply for Admission <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 border-stone-200 text-[#800020] hover:bg-stone-50/80 font-bold rounded-2xl"
            >
              Download Prospectus
            </Button>
          </div>

          {/* Contact info */}
          <div className="bg-white p-8 rounded-2xl border border-stone-100 max-w-md mx-auto">
            <h3 className="font-serif text-lg text-[#800020] mb-4">
              Questions? Reach Out.
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+919361488801"
                className="flex items-center gap-3 text-stone-500 hover:text-[#800020] transition-colors"
              >
                <Phone size={16} className="text-[#D4AF37]" /> +91 93614 88801
              </a>
              <a
                href="mailto:artsscience@jct.edu"
                className="flex items-center gap-3 text-stone-500 hover:text-[#800020] transition-colors"
              >
                <Mail size={16} className="text-[#D4AF37]" /> artsscience@jct.edu
              </a>
              <div className="flex items-start gap-3 text-stone-500">
                <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Knowledge Park, Pichanur, Coimbatore — 641105</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
