"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  CalendarCheck,
  GraduationCap,
  ArrowRight,
  Phone,
  Mail,
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
    link: "/institutions/engineering",
    linkText: "Compare Options",
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
    iconColor: "text-burgundy",
  },
];

export function AdmissionsCTA() {
  return (
    <section id="admissions" className="section-padding bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
            >
              Admissions 2026
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-navy leading-tight mb-5"
            >
              Not Sure Which College <br className="hidden sm:block" />
              <span className="italic text-muted-foreground font-light">
                Is Right for You?
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-sans text-base leading-relaxed max-w-2xl mx-auto"
            >
              Whether you&apos;re coming from 10th, 12th, or completing a
              diploma — there&apos;s a clear pathway for you at JCT.
            </motion.p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16 overflow-x-auto md:overflow-visible snap-container scrollbar-hide pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {pathways.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="snap-item shrink-0 w-[260px] sm:w-[300px] md:w-auto"
              >
                <div className="group h-full p-5 md:p-8 bg-white rounded-2xl border border-border hover:border-gold/30 card-hover-lift">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon
                      size={22}
                      className={item.iconColor}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-serif text-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  <Link
                    href={item.link}
                    className="text-sm font-sans font-semibold text-navy hover:text-gold transition-colors inline-flex items-center gap-1 group-hover:gap-2"
                  >
                    {item.linkText} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-3 mb-8 md:mb-12"
          >
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-gold text-navy font-sans font-bold rounded-full hover:bg-gold-light transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/20 text-base"
            >
              Apply Online <ArrowRight size={16} />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center h-14 px-8 border-2 border-border text-navy font-sans font-semibold rounded-full hover:bg-muted transition-all text-base"
            >
              Download Prospectus
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="bg-gradient-to-br from-navy via-navy-light to-navy-mid p-6 md:p-12 text-center noise-overlay relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse-glow">
                    <Phone size={22} className="text-gold" />
                  </div>
                </div>
                <h3 className="text-gold font-serif text-2xl md:text-3xl font-bold mb-3">
                  Admissions Helpline
                </h3>
                <a href="tel:+919361488801">
                  <p className="text-3xl md:text-4xl font-sans font-black text-white tracking-wide hover:text-gold transition-colors mb-3">
                    +91 93614 88801
                  </p>
                </a>
                <p className="text-sm text-white/50 font-sans mb-1">
                  Mon – Sat, 9:00 AM – 5:00 PM
                </p>
                <p className="text-xs text-white/30 font-sans">
                  Call for personalized guidance on admissions, programs, and
                  campus visits
                </p>
                <div
                  id="contact"
                  className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2"
                >
                  <Mail size={16} className="text-gold" />
                  <a
                    href="mailto:admissions@jct.edu"
                    className="text-white/70 hover:text-white font-sans text-sm transition-colors"
                  >
                    admissions@jct.edu
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
