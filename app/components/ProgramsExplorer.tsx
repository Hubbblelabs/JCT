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
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
          >
            Academic Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-navy leading-tight mb-5"
          >
            Find Your{" "}
            <span className="italic text-muted-foreground font-light">
              Path
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed"
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
          className="flex justify-center gap-2 mb-6 md:mb-14 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAll(false);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-sans font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-navy text-white shadow-lg shadow-navy/20"
                  : "bg-white text-muted-foreground border border-border hover:border-navy/20 hover:text-navy"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
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
                  href={`/institutions/${activeTab}`}
                  className="group block p-6 bg-white rounded-2xl border border-border hover:border-gold/30 card-hover-lift"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                      {program.category}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-gold group-hover:border-gold group-hover:text-navy transition-all">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                  <h3 className="text-base font-sans font-semibold text-navy mb-2 leading-snug group-hover:text-gold transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gold font-sans font-medium mb-3">
                    {program.highlight}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
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
          <div className="sm:hidden text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-navy hover:text-gold transition-colors px-5 py-2.5 rounded-full border border-border hover:border-gold/30"
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
          className="text-center mt-10"
        >
          <Link
            href="#institutions"
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-navy hover:text-gold transition-colors"
          >
            View All Programs <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
