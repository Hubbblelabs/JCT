"use client";

import { motion } from "framer-motion";

const milestones = [
    { year: "2009", title: "Foundation & Engineering", desc: "JCT Institutions was established in Coimbatore, launching the College of Engineering and Technology with 240 students." },
    { year: "2014", title: "Polytechnic College Established", desc: "JCT Polytechnic College was founded to provide diploma-level technical education with strong workshop-based training." },
    { year: "2016", title: "NBA Accreditation", desc: "Engineering programs received NBA accreditation, marking a significant milestone in quality assurance and academic excellence." },
    { year: "2018", title: "NAAC Accreditation", desc: "Achieved NAAC accreditation, demonstrating commitment to continuous quality improvement and institutional standards." },
    { year: "2019", title: "Decade of Excellence", desc: "Celebrated 10 years of educational service with over 12,000 alumni and new departments in emerging technologies." },
    { year: "2024", title: "Autonomous Status Granted", desc: "JCT College of Engineering and Technology was granted autonomous status, enabling greater academic flexibility and innovation." },
    { year: "2026", title: "Looking Ahead", desc: "Expanding research collaborations, industry tie-ups, and international academic partnerships for a future-ready ecosystem." },
];

export function ReverseRoadmap() {
    return (
        <div className="relative mb-24 overflow-hidden">
            {/* Curly connecting path - SVG (Simplified for reverse flow visually, or just straight line) */}
            <div className="absolute top-14 left-0 right-0 h-0.5 bg-stone-100 hidden xl:block" />

            {/* Content Container */}
            <div className="mt-20 relative z-10 overflow-x-auto xl:overflow-visible pb-4 xl:pb-20 scrollbar-hide">
                <div className="flex xl:grid xl:grid-cols-7 gap-4 sm:gap-6 xl:gap-4 min-w-max xl:min-w-0">
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.year}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="shrink-0 w-56 sm:w-64 xl:w-auto relative group"
                        >
                            {/* Dot marker */}
                            <div className="absolute -top-8 xl:top-8 xl:-mt-10 left-8 xl:left-1/2 xl:-translate-x-1/2 w-4 h-4 rounded-full bg-stone-200 border-4 border-white shadow-sm group-hover:bg-accent transition-colors duration-300 hidden xl:block z-20" />

                            {/* Card */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-stone-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full relative mt-4 xl:mt-12">
                                <div className="absolute top-0 left-6 -translate-y-1/2 xl:hidden w-3 h-3 rounded-full bg-accent border-2 border-white shadow-sm" />

                                <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-xs font-black rounded-lg mb-3 group-hover:bg-accent group-hover:text-primary transition-colors">
                                    {milestone.year}
                                </span>
                                <h3 className="text-base font-serif text-primary mb-2 leading-tight font-bold">{milestone.title}</h3>
                                <p className="text-stone-500 text-xs font-light leading-relaxed">{milestone.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mobile scroll hint */}
            <div className="xl:hidden text-center mt-4">
                <span className="text-xs text-stone-500 font-medium">← Scroll to explore our history →</span>
            </div>
        </div>
    );
}
