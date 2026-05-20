"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { admissionsCriteria } from "@/data/arts-science";
import React from "react";

export function AdmissionProcess() {
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
      className="group/section relative overflow-hidden border-t border-slate-200 bg-slate-50 py-20 md:py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Background Textures & Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="bg-arts-science-accent/15 absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />

        {/* Spotlight dots layer tracking the mouse */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="bg-arts-science-accent absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />
        </div>
      </div>
      <div className="bg-arts-science/5 absolute -top-40 -right-40 h-120 w-120 rounded-full blur-[100px]" />
      <div className="bg-arts-science/5 absolute -bottom-40 -left-40 h-120 w-120 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs backdrop-blur-md md:p-10">
          <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-arts-science-accent mb-3 text-xs font-bold tracking-[0.2em] uppercase">
                Admissions
              </h2>
              <h3 className="text-arts-science font-serif text-3xl leading-tight font-bold md:text-4xl">
                Admission Process
              </h3>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Start your academic journey with a simple and transparent
                admission procedure aligned with university standards.
              </p>
            </div>
            <a
              href="https://admissions.jct.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-arts-science-accent hover:bg-arts-science-accent-dark flex w-full shrink-0 items-center justify-center gap-2 self-start rounded-full px-8 py-3.5 font-semibold text-white shadow-xs transition-all sm:w-auto md:self-end"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
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
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 transition-shadow duration-300 hover:shadow-xs"
              >
                <h4 className="text-arts-science mb-4 border-b border-slate-100 pb-2 font-serif text-[1.1rem] font-bold">
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
                        className="text-arts-science-accent mt-0.5 shrink-0"
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
              className="text-arts-science hover:text-arts-science-accent flex items-center gap-2.5 font-medium transition-colors"
            >
              <Phone size={16} className="text-arts-science-accent" /> +91 93614
              88801
            </a>
            <a
              href="mailto:admissions@jct.ac.in"
              className="text-arts-science hover:text-arts-science-accent flex items-center gap-2.5 font-medium transition-colors"
            >
              <Mail size={16} className="text-arts-science-accent" />{" "}
              admissions@jct.ac.in
            </a>
            <div className="text-arts-science flex items-start gap-2.5 font-medium">
              <MapPin
                size={16}
                className="text-arts-science-accent mt-0.5 shrink-0"
              />
              <span>Knowledge Park, Pichanur, Coimbatore - 641105</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
