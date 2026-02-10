"use client";

import { motion } from "framer-motion";

const milestones = [
    { year: "2026", title: "Looking Ahead", desc: "Expanding research collaborations, industry tie-ups, and international academic partnerships for a future-ready ecosystem." },
    { year: "2018", title: "Two Decades of Impact", desc: "Over 12,000 alumni across three institutions. New departments in AI, Cyber Security, and Data Science introduced." },
    { year: "2010", title: "Polytechnic College Established", desc: "JCT Polytechnic College was founded to provide diploma-level technical education with strong workshop-based training." },
    { year: "2006", title: "Arts & Science College Added", desc: "Responding to demand for broader academic pathways, JCT College of Arts and Science began operations with six undergraduate programs." },
    { year: "2001", title: "Engineering College Launched", desc: "JCT College of Engineering and Technology opened its doors with four core departments and 240 students in the inaugural batch." },
    { year: "1998", title: "Foundation Year", desc: "JCT Institutions was established in Coimbatore with a clear mandate: build an educational group rooted in ethics and practical learning." },
];

export function ReverseRoadmap() {
    return (
        <div className="relative mb-24 overflow-hidden">
            {/* Curly connecting path - SVG (Simplified for reverse flow visually, or just straight line) */}
            <div className="absolute top-14 left-0 right-0 h-0.5 bg-stone-100 hidden lg:block" />

            {/* Content Container */}
            <div className="mt-20 relative z-10 overflow-x-auto lg:overflow-visible pb-4 lg:pb-20">
                <div className="flex lg:grid lg:grid-cols-6 gap-6 lg:gap-4 min-w-max lg:min-w-0">
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.year}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="shrink-0 w-64 lg:w-auto relative group"
                        >
                            {/* Dot marker */}
                            <div className="absolute -top-8 lg:top-8 lg:-mt-10 left-8 lg:left-1/2 lg:-translate-x-1/2 w-4 h-4 rounded-full bg-stone-200 border-4 border-white shadow-sm group-hover:bg-accent transition-colors duration-300 hidden lg:block z-20" />

                            {/* Card */}
                            <div className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full relative mt-4 lg:mt-12">
                                <div className="absolute top-0 left-6 -translate-y-1/2 lg:hidden w-3 h-3 rounded-full bg-accent border-2 border-white shadow-sm" />

                                <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-xs font-black rounded-lg mb-3 group-hover:bg-accent group-hover:text-primary transition-colors">
                                    {milestone.year}
                                </span>
                                <h4 className="text-base font-serif text-primary mb-2 leading-tight font-bold">{milestone.title}</h4>
                                <p className="text-stone-500 text-xs font-light leading-relaxed">{milestone.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mobile scroll hint */}
            <div className="lg:hidden text-center mt-4">
                <span className="text-xs text-stone-400 font-medium">← Scroll to explore our history →</span>
            </div>
        </div>
    );
}
