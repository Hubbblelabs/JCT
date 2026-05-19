"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { admissionsCriteria } from "@/data/engineering";
import React from "react";

export function Admissions() {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section
      id="admissions"
      className="group/section relative overflow-hidden bg-slate-50 py-20 md:py-24 border-t border-slate-200"
      onMouseMove={handleMouseMove}
    >
      {/* Background Textures & Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute inset-0 bg-engineering-light/10 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />

        {/* Spotlight dots layer tracking the mouse */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="bg-engineering-light absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />
        </div>
      </div>
      <div className="bg-engineering-light/5 absolute -top-40 -right-40 h-120 w-120 rounded-full blur-[100px]" />
      <div className="bg-engineering-light/5 absolute -bottom-40 -left-40 h-120 w-120 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-xs backdrop-blur-md">
          <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-engineering-light mb-3 text-xs font-bold tracking-[0.2em] uppercase">
                Admissions
              </h2>
              <h3 className="text-engineering-dark font-serif text-3xl font-bold md:text-4xl leading-tight">
                Admission Process
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-xl">
                Begin your professional engineering career through Anna University Counselling (TNEA Code: 2724) or direct admission guidelines.
              </p>
            </div>
            <a
              href="https://admissions.jct.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-[0.98] w-full sm:w-auto self-start md:self-end shrink-0"
              style={{ backgroundColor: "#d4a024", color: "#081323" }}
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {admissionsCriteria.map((block, index) => (
              <motion.article
                key={block.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 hover:shadow-xs transition-shadow duration-300"
              >
                <h4 className="text-engineering-dark mb-4 text-[1.1rem] font-serif font-bold border-b border-slate-100 pb-2">
                  {block.title}
                </h4>
                <ul className="space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[0.925rem] leading-relaxed text-slate-600"
                    >
                      <CheckCircle2
                        size={15}
                        className="text-engineering-light mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <div
            id="contact"
            className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50/30 p-5 text-sm md:grid-cols-3 md:gap-6"
          >
            <a
              href="tel:+919361488801"
              className="text-engineering-dark hover:text-engineering-light flex items-center gap-2.5 font-medium transition-colors"
            >
              <Phone size={16} className="text-engineering-light" /> +91 93614 88801
            </a>
            <a
              href="mailto:admissions@jct.ac.in"
              className="text-engineering-dark hover:text-engineering-light flex items-center gap-2.5 font-medium transition-colors"
            >
              <Mail size={16} className="text-engineering-light" /> admissions@jct.ac.in
            </a>
            <div className="text-engineering-dark flex items-start gap-2.5 font-medium">
              <MapPin size={16} className="text-engineering-light mt-0.5 shrink-0" />
              <span>Knowledge Park, Pichanur, Coimbatore - 641105</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
