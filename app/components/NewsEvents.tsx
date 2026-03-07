"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const newsItems = [
  {
    date: "04 Mar 2026",
    title: "JCT Engineering Students Win National Hackathon at IIT Madras",
    excerpt: "A team of 4 CSE students bagged first prize at CodeSprint 2026, competing against 200+ teams from across India.",
    category: "Achievement",
  },
  {
    date: "28 Feb 2026",
    title: "MoU Signed with TCS for Industry-Integrated Learning",
    excerpt: "JCT College of Engineering partners with TCS to offer hands-on training modules and guaranteed internship placements.",
    category: "Partnership",
  },
  {
    date: "22 Feb 2026",
    title: "NAAC Re-Accreditation Process Successfully Completed",
    excerpt: "JCT Institutions undergoes peer review for NAAC re-accreditation, with preliminary reports indicating strong outcomes.",
    category: "Accreditation",
  },
  {
    date: "15 Feb 2026",
    title: "Annual Sports Day 2026 — Record Participation",
    excerpt: "Over 1,500 students participated in inter-department sports events spanning athletics, cricket, basketball, and chess.",
    category: "Campus Life",
  },
  {
    date: "10 Feb 2026",
    title: "Guest Lecture by Dr. A.P.J. Abdul Kalam Foundation",
    excerpt: "Students attended an inspiring lecture on innovation and scientific temper by the A.P.J. Abdul Kalam Foundation delegation.",
    category: "Events",
  },
  {
    date: "05 Feb 2026",
    title: "Placement Drive: 150+ Offers from Top Recruiters",
    excerpt: "The 2025-26 placement season sees record offers from Infosys, Wipro, CTS, and 40+ other companies visiting campus.",
    category: "Placements",
  },
];

const events = [
  {
    date: { day: "15", month: "Mar" },
    title: "TechVista 2026 — National Technical Symposium",
    venue: "JCT Engineering Campus, Main Auditorium",
    time: "9:00 AM – 5:00 PM",
  },
  {
    date: { day: "22", month: "Mar" },
    title: "Campus Placement Drive — Cognizant & Infosys",
    venue: "Placement Cell, Admin Block",
    time: "10:00 AM – 4:00 PM",
  },
  {
    date: { day: "05", month: "Apr" },
    title: "Annual Cultural Fest — Kaleidoscope 2026",
    venue: "College Ground & Open Air Theatre",
    time: "All Day Event",
  },
  {
    date: { day: "12", month: "Apr" },
    title: "Workshop: AI & Machine Learning Fundamentals",
    venue: "CSE Lab, Block A",
    time: "2:00 PM – 5:00 PM",
  },
];

const categoryColors: Record<string, string> = {
  Achievement: "bg-emerald-50 text-emerald-700",
  Partnership: "bg-blue-50 text-blue-700",
  Accreditation: "bg-amber-50 text-amber-700",
  "Campus Life": "bg-rose-50 text-rose-700",
  Events: "bg-violet-50 text-violet-700",
  Placements: "bg-indigo-50 text-indigo-700",
};

export function NewsEvents() {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
            >
              Stay Updated
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-navy leading-tight"
            >
              Happenings at{" "}
              <span className="italic text-muted-foreground font-light">JCT</span>
            </motion.h2>
          </div>

          {/* Tab Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-1 bg-muted rounded-xl p-1"
          >
            {[
              { id: "news" as const, label: "Latest News" },
              { id: "events" as const, label: "Upcoming Events" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-sans font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-navy shadow-sm"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "news" ? (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {newsItems.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 bg-surface rounded-2xl border border-border hover:border-gold/30 card-hover-lift cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-sans font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${categoryColors[item.category] || "bg-gray-50 text-gray-600"}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans">{item.date}</span>
                  </div>
                  <h3 className="text-base font-sans font-semibold text-navy mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <span className="text-xs font-sans font-semibold text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={12} />
                  </span>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {events.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex gap-5 p-6 bg-surface rounded-2xl border border-border hover:border-gold/30 card-hover-lift cursor-pointer"
                >
                  {/* Date Badge */}
                  <div className="w-16 h-16 bg-navy rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-sans font-black text-white leading-none">
                      {event.date.day}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold mt-0.5">
                      {event.date.month}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-sans font-semibold text-navy mb-2 leading-snug group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-sans">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {event.time}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0 mt-1" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
