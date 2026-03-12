"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "engineering", label: "Engineering", color: "bg-navy" },
  { id: "arts", label: "Arts & Science", color: "bg-burgundy" },
  { id: "polytechnic", label: "Polytechnic", color: "bg-polytechnic" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface Program {
  name: string;
  duration: string;
  highlight: string;
  category: string;
}

const programs: Record<TabId, Program[]> = {
  engineering: [
    {
      name: "B.E. Computer Science & Engineering",
      duration: "4 Years",
      highlight: "AI & Data Science Track",
      category: "UG",
    },
    {
      name: "B.E. Electronics & Communication",
      duration: "4 Years",
      highlight: "IoT & VLSI Specialization",
      category: "UG",
    },
    {
      name: "B.E. Mechanical Engineering",
      duration: "4 Years",
      highlight: "Industry 4.0 Curriculum",
      category: "UG",
    },
    {
      name: "B.E. Electrical & Electronics",
      duration: "4 Years",
      highlight: "Smart Grid Technologies",
      category: "UG",
    },
    {
      name: "B.E. Civil Engineering",
      duration: "4 Years",
      highlight: "Green Building Design",
      category: "UG",
    },
    {
      name: "B.Tech Information Technology",
      duration: "4 Years",
      highlight: "Cloud & DevOps Focus",
      category: "UG",
    },
  ],
  arts: [
    {
      name: "B.Sc Computer Science",
      duration: "3 Years",
      highlight: "Full-Stack Development",
      category: "UG",
    },
    {
      name: "B.Sc Mathematics",
      duration: "3 Years",
      highlight: "Applied & Computational",
      category: "UG",
    },
    {
      name: "B.Com (General)",
      duration: "3 Years",
      highlight: "Tally & GST Certified",
      category: "UG",
    },
    {
      name: "B.Com (Computer Applications)",
      duration: "3 Years",
      highlight: "ERP & Digital Commerce",
      category: "UG",
    },
    {
      name: "BBA (Bachelor of Business Admin)",
      duration: "3 Years",
      highlight: "Entrepreneurship Track",
      category: "UG",
    },
    {
      name: "B.Sc Physics",
      duration: "3 Years",
      highlight: "Material Science Electives",
      category: "UG",
    },
  ],
  polytechnic: [
    {
      name: "Diploma in Computer Engineering",
      duration: "3 Years",
      highlight: "Hands-on Lab Projects",
      category: "Diploma",
    },
    {
      name: "Diploma in Mechanical Engineering",
      duration: "3 Years",
      highlight: "CNC & CAD Training",
      category: "Diploma",
    },
    {
      name: "Diploma in Electrical Engineering",
      duration: "3 Years",
      highlight: "PLC & Automation",
      category: "Diploma",
    },
    {
      name: "Diploma in Electronics & Comm.",
      duration: "3 Years",
      highlight: "Embedded Systems",
      category: "Diploma",
    },
    {
      name: "Diploma in Civil Engineering",
      duration: "3 Years",
      highlight: "AutoCAD & Surveying",
      category: "Diploma",
    },
  ],
};

export function ProgramsExplorer() {
  const [activeTab, setActiveTab] = useState<TabId>("engineering");
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="programs" className="section-padding bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
          >
            Academic Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
          >
            Find Your{" "}
            <span className="text-muted-foreground font-light italic">
              Path
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base leading-relaxed md:text-lg"
          >
            Choose from 17+ programs across Engineering, Arts & Science, and
            Polytechnic disciplines — each designed for career readiness.
          </motion.p>
        </div>

        {/* Tab Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="scrollbar-hide -mx-4 mb-6 flex justify-center gap-2 overflow-x-auto px-4 md:mx-0 md:mb-14 md:px-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-navy shadow-navy/20 text-white shadow-lg"
                  : "text-muted-foreground border-border hover:border-navy/20 hover:text-navy border bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Program Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
          >
            {programs[activeTab].map((program, i) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={!showAll && i >= 3 ? "hidden sm:block" : ""}
              >
                <Link
                  href={`/${activeTab}`}
                  className="group border-border hover:border-gold/30 card-hover-lift block rounded-2xl border bg-white p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 font-sans text-[10px] font-bold tracking-[0.15em] uppercase">
                      {program.category}
                    </span>
                    <span className="border-border text-muted-foreground group-hover:bg-gold group-hover:border-gold group-hover:text-navy flex h-8 w-8 items-center justify-center rounded-full border transition-all">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                  <h3 className="text-navy group-hover:text-gold mb-2 font-sans text-base leading-snug font-semibold transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-gold mb-3 font-sans text-sm font-medium">
                    {program.highlight}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-4 font-sans text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {program.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} /> Full-Time
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Show All */}
        {!showAll && programs[activeTab].length > 3 && (
          <div className="mt-6 text-center sm:hidden">
            <button
              onClick={() => setShowAll(true)}
              className="text-navy hover:text-gold border-border hover:border-gold/30 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-sm font-semibold transition-colors"
            >
              View All {programs[activeTab].length} Programs{" "}
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="#institutions"
            className="text-navy hover:text-gold inline-flex items-center gap-2 font-sans text-sm font-semibold transition-colors"
          >
            View All Programs <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
