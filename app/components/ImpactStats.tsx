"use client";

import { motion } from "framer-motion";
import { Users, Building2, Trophy, Globe } from "lucide-react";

/* ─── Group-level achievements ─── */
const achievements = [
    { icon: Users, value: "12,000+", label: "Alumni Network", desc: "Graduates working across India and 15+ countries" },
    { icon: Building2, value: "3", label: "Institutions", desc: "Engineering, Arts & Science, and Polytechnic" },
    { icon: Trophy, value: "15+", label: "Years of Service", desc: "Continuous operation since 2009" },
    { icon: Globe, value: "500+", label: "Recruiting Partners", desc: "Companies hiring from our campuses" },
];

export function ImpactStats() {
    return (
        <section className="py-12 md:py-16 3xl:py-24 bg-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

            <div className="container mx-auto px-4 md:px-6 3xl:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">By the Numbers</h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-serif leading-tight">
                        Fifteen+ Years <span className="text-white/60 italic font-light">in Sum</span>
                    </h3>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {achievements.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center p-6 sm:p-8 md:p-10 3xl:p-12 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                            <stat.icon size={28} className="text-accent mx-auto mb-4 sm:mb-6" strokeWidth={1.5} />
                            <span className="block text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-sans font-black text-white tracking-tight mb-2 sm:mb-3">{stat.value}</span>
                            <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] text-accent mb-1 sm:mb-2">{stat.label}</h3>
                            <p className="text-blue-200/60 text-xs sm:text-sm font-light hidden sm:block">{stat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
