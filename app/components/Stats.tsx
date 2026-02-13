"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, Building2, Trophy } from "lucide-react";

const stats = [
    {
        label: "Students Enrolled",
        value: "5,000+",
        icon: Users,
        description: "From 20+ states"
    },
    {
        label: "Expert Faculty",
        value: "250+",
        icon: GraduationCap,
        description: "Ph.D. holders & Industry Experts"
    },
    {
        label: "Years of Excellence",
        value: "25+",
        icon: Building2,
        description: "Legacy of quality education"
    },
    {
        label: "Placement Rate",
        value: "95%",
        icon: Trophy,
        description: "In top tier companies"
    },
];

export function Stats() {
    return (
        <section className="relative z-30 -mt-16 pb-8 md:pb-12">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-5 sm:p-6 md:p-8 border border-stone-100 shadow-sm hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 rounded-xl sm:rounded-2xl group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-500 rounded-l-2xl" />
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-primary/70 group-hover:text-accent transition-colors">
                                    <stat.icon size={28} strokeWidth={1} />
                                </div>
                                <span className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-primary tracking-tight">{stat.value}</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-xs text-primary/60 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{stat.label}</h2>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">{stat.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
