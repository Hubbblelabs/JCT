"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  CalendarCheck,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const pathways = [
  {
    icon: FileText,
    title: "After 10th Standard",
    desc: "Join JCT Polytechnic College for a 3-year diploma in engineering. Hands-on training from day one.",
    link: "/institutions/polytechnic",
    linkText: "View Polytechnic",
    gradient: "from-emerald-50 to-teal-50",
    iconColor: "text-polytechnic",
  },
  {
    icon: CalendarCheck,
    title: "After 12th Standard",
    desc: "Choose B.E./B.Tech at Engineering or B.Sc/B.Com/BBA at Arts & Science — depending on your stream.",
    link: "/admissions/apply",
    linkText: "Apply now",
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-navy",
  },
  {
    icon: GraduationCap,
    title: "After Diploma",
    desc: "Lateral entry directly into the second year of B.E. programs at JCT College of Engineering.",
    link: "/institutions/engineering",
    linkText: "Lateral Entry Details",
    gradient: "from-rose-50 to-pink-50",
    iconColor: "text-arts-science",
  },
];

export function AdmissionsCTA() {
  return (
    <section id="admissions" className="bg-surface py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 text-center md:mb-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              Admissions 2026
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
            >
              Not Sure Which College <br className="hidden sm:block" />
              <span className="text-muted-foreground font-light italic">
                Is Right for You?
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mx-auto max-w-2xl font-sans text-base leading-relaxed"
            >
              Whether you&apos;re coming from 10th, 12th, or completing a
              diploma — there&apos;s a clear pathway for you at JCT.
            </motion.p>
          </div>

          <div className="snap-container scrollbar-hide -mx-4 mb-8 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:mb-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
            <div className="w-1 shrink-0 md:hidden"></div>
            {pathways.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-item w-65 shrink-0 sm:w-75 md:w-auto"
              >
                <div className="group border-border hover:border-gold/30 card-hover-lift h-full rounded-2xl border bg-white p-5 md:p-8">
                  <div
                    className={`h-12 w-12 rounded-xl bg-linear-to-br ${item.gradient} mb-5 flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <item.icon
                      size={22}
                      className={item.iconColor}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-navy mb-3 font-serif text-xl">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 font-sans text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <Link
                    href={item.link}
                    className="text-navy hover:text-gold inline-flex items-center gap-1 font-sans text-sm font-semibold transition-colors group-hover:gap-2"
                  >
                    {item.linkText} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
            <div className="w-1 shrink-0 md:hidden"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link
              href="#contact"
              className="bg-navy hover:bg-navy-light shadow-navy/20 inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 font-sans text-base font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Apply Online <ArrowRight size={16} />
            </Link>
            <Link
              href="#"
              className="border-border text-navy hover:bg-muted inline-flex h-14 items-center justify-center rounded-full border-2 px-8 font-sans text-base font-semibold transition-all"
            >
              Download Prospectus
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
