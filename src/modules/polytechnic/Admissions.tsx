"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { admissionsCriteria } from "@/data/polytechnic";

export function Admissions() {
  return (
    <section id="admissions" className="bg-[#1A237E] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#FFB300] uppercase">
              Admissions Open
            </h2>
            <h3 className="mb-6 font-sans text-4xl font-bold leading-tight text-white md:text-5xl">
              Begin your journey at{" "}
              <span className="font-light italic text-[#FFB300]">
                JCT Polytechnic.
              </span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-white/80">
              Admissions are open for all diploma programs. We follow a
              transparent process aligned with DOTE and TNEA Polytechnic
              guidelines.
            </p>
          </motion.div>

          {/* Criteria grid */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {admissionsCriteria.map((block, index) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm"
              >
                <h4 className="mb-4 font-sans text-lg font-bold text-[#FFB300]">
                  {block.title}
                </h4>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm font-light text-white/80"
                    >
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-[#FFB300]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/institutions/polytechnic#admissions"
              className="group inline-flex h-14 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] to-[#FFB300] px-10 font-bold text-[#1A237E] shadow-[0_12px_28px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
            >
              Apply for Admission
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="/institutions/polytechnic/prospectus.pdf"
              className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 px-10 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
            >
              Download Prospectus
            </a>
          </div>

          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-sm"
          >
            <h4 className="mb-5 font-sans text-lg font-semibold text-[#FFB300]">
              Questions? Reach out.
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="tel:+919361422201"
                className="flex items-center justify-center gap-3 text-white/75 transition-colors hover:text-white"
              >
                <Phone size={15} className="text-[#FFB300]" /> +91 93614 22201
              </a>
              <a
                href="mailto:info@jct.ac.in"
                className="flex items-center justify-center gap-3 text-white/75 transition-colors hover:text-white"
              >
                <Mail size={15} className="text-[#FFB300]" /> info@jct.ac.in
              </a>
              <div className="flex items-start justify-center gap-3 text-white/75">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#FFB300]" />
                <span>
                  Knowledge Park, Pichanur, Coimbatore — 641105
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
