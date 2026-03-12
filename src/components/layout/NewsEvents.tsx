"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Clock } from "lucide-react";

const newsItems = [
  {
    date: "04 Mar 2026",
    title: "JCT Engineering Students Win National Hackathon at IIT Madras",
    excerpt:
      "A team of 4 CSE students bagged first prize at CodeSprint 2026, competing against 200+ teams from across India.",
    category: "Achievement",
  },
  {
    date: "28 Feb 2026",
    title: "MoU Signed with TCS for Industry-Integrated Learning",
    excerpt:
      "JCT College of Engineering partners with TCS to offer hands-on training modules and guaranteed internship placements.",
    category: "Partnership",
  },
  {
    date: "22 Feb 2026",
    title: "NAAC Re-Accreditation Process Successfully Completed",
    excerpt:
      "JCT Institutions undergoes peer review for NAAC re-accreditation, with preliminary reports indicating strong outcomes.",
    category: "Accreditation",
  },
  {
    date: "15 Feb 2026",
    title: "Annual Sports Day 2026 — Record Participation",
    excerpt:
      "Over 1,500 students participated in inter-department sports events spanning athletics, cricket, basketball, and chess.",
    category: "Campus Life",
  },
  {
    date: "10 Feb 2026",
    title: "Guest Lecture by Dr. A.P.J. Abdul Kalam Foundation",
    excerpt:
      "Students attended an inspiring lecture on innovation and scientific temper by the A.P.J. Abdul Kalam Foundation delegation.",
    category: "Events",
  },
  {
    date: "05 Feb 2026",
    title: "Placement Drive: 150+ Offers from Top Recruiters",
    excerpt:
      "The 2025-26 placement season sees record offers from Infosys, Wipro, CTS, and 40+ other companies visiting campus.",
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
  const [showAllNews] = useState(false);

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              Stay Updated
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
            >
              Happenings at{" "}
              <span className="text-muted-foreground font-light italic">
                JCT
              </span>
            </motion.h2>
          </div>

          {/* Tab Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-muted flex gap-1 rounded-xl p-1"
          >
            {[
              { id: "news" as const, label: "Latest News" },
              { id: "events" as const, label: "Upcoming Events" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-navy bg-white shadow-sm"
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
              className="snap-container scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
            >
              {(showAllNews ? newsItems : newsItems.slice(0, 6)).map(
                (item, i) => (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-surface border-border hover:border-gold/30 card-hover-lift snap-item w-[280px] shrink-0 cursor-pointer rounded-2xl border p-5 sm:w-[320px] md:w-auto md:p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-bold tracking-wider uppercase ${categoryColors[item.category] || "bg-gray-50 text-gray-600"}`}
                      >
                        {item.category}
                      </span>
                      <span className="text-muted-foreground font-sans text-xs">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-navy group-hover:text-gold mb-2 line-clamp-2 font-sans text-base leading-snug font-semibold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 font-sans text-sm leading-relaxed">
                      {item.excerpt}
                    </p>
                    <span className="text-gold flex items-center gap-1 font-sans text-xs font-semibold transition-all group-hover:gap-2">
                      Read More <ArrowRight size={12} />
                    </span>
                  </motion.article>
                ),
              )}
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="snap-container scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
            >
              {events.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-surface border-border hover:border-gold/30 card-hover-lift snap-item flex w-[300px] shrink-0 cursor-pointer gap-4 rounded-2xl border p-5 sm:w-[360px] md:w-auto md:gap-5 md:p-6"
                >
                  {/* Date Badge */}
                  <div className="bg-navy flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl">
                    <span className="font-sans text-xl leading-none font-black text-white">
                      {event.date.day}
                    </span>
                    <span className="text-gold mt-0.5 font-sans text-[10px] font-bold tracking-wider uppercase">
                      {event.date.month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-navy group-hover:text-gold mb-2 font-sans text-base leading-snug font-semibold transition-colors">
                      {event.title}
                    </h3>
                    <div className="text-muted-foreground flex flex-wrap gap-3 font-sans text-xs">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {event.time}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground group-hover:text-gold mt-1 shrink-0 transition-colors"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
