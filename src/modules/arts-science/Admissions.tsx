"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { admissionsCriteria } from "@/data/arts-science";

export function Admissions() {
  return (
    <section className="bg-stone-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-arts-science-dark mb-6 text-xs font-bold tracking-[0.2em] uppercase">
              Admissions
            </h2>
            <h3 className="text-arts-science-dark mb-8 font-serif text-4xl leading-tight md:text-5xl">
              Join a College That <br />
              <span className="text-gold font-light italic drop-shadow-sm">
                Values Substance.
              </span>
            </h3>
            <p className="mb-12 text-lg leading-relaxed font-light text-stone-500">
              Admissions are open for undergraduate and postgraduate programs.
              We follow a transparent, merit-based process aligned with
              Bharathiar University guidelines. No pressure, no complicated
              steps.
            </p>
          </motion.div>

          <div className="mb-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {admissionsCriteria.map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-stone-100 bg-white p-8"
              >
                <h3 className="text-arts-science-dark mb-4 font-serif text-lg font-bold">
                  {block.title}
                </h3>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm font-light text-[#2C2C2C]"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-gold mt-0.5 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="from-gold-light to-gold h-14 rounded-full border border-[#f1d892]/70 bg-linear-to-r px-10 font-bold text-[#70001b] shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
            >
              Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-arts-science-dark/35 text-arts-science-dark h-14 rounded-full border-2 bg-white/80 px-10 font-bold transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              Download Prospectus
            </Button>
          </div>

          {/* Contact info */}
          <div className="mx-auto max-w-md rounded-2xl border border-stone-100 bg-white p-8">
            <h3 className="text-arts-science-dark mb-4 font-serif text-lg">
              Questions? Reach Out.
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+919361488801"
                className="hover:text-arts-science-dark flex items-center gap-3 text-stone-500 transition-colors"
              >
                <Phone size={16} className="text-gold" /> +91 93614 88801
              </a>
              <a
                href="mailto:artsscience@jct.edu"
                className="hover:text-arts-science-dark flex items-center gap-3 text-stone-500 transition-colors"
              >
                <Mail size={16} className="text-gold" /> artsscience@jct.edu
              </a>
              <div className="flex items-start gap-3 text-stone-500">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>Knowledge Park, Pichanur, Coimbatore — 641105</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
