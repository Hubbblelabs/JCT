"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Microscope, PenTool, Users, ArrowUpRight } from "lucide-react";

/* ─── Institution cards ─── */
const institutions = [
    {
        name: "JCT College of Engineering & Technology",
        href: "/institutions/engineering",
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2686&auto=format&fit=crop",
        tagline: "Technical depth. Research exposure. Industry-ready graduates.",
        programs: "B.E. / B.Tech / M.E.",
        students: "3,000+",
        highlight: "96% placement rate",
    },
    {
        name: "JCT College of Arts & Science",
        href: "/institutions/arts-science",
        icon: Microscope,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop",
        tagline: "Broad foundations in science, commerce, and the humanities.",
        programs: "B.Sc / B.Com / BBA / BA / M.Sc / M.Com",
        students: "2,500+",
        highlight: "9 academic programs",
    },
    {
        name: "JCT Polytechnic College",
        href: "/institutions/polytechnic",
        icon: PenTool,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop",
        tagline: "Skill-based diploma programs built around workshop training.",
        programs: "Diploma Courses",
        students: "1,200+",
        highlight: "Direct lateral entry to B.E.",
    },
];

export function HomeInstitutions() {
    return (
        <section id="institutions" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Our Institutions</h2>
                        <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight mb-4">
                            Three distinct colleges. <br />
                            <span className="text-stone-300 italic font-light">One shared standard.</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-base max-w-xl">
                            Each institution serves a different purpose and a different student — but all of them maintain the same academic rigor and ethical foundation.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-8">
                    {institutions.map((inst, index) => (
                        <motion.div
                            key={inst.href}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                        >
                            <Link href={inst.href} className="group block">
                                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500`}>
                                    {/* Image */}
                                    <div className={`lg:col-span-5 aspect-16/10 lg:aspect-auto overflow-hidden relative ${index === 1 ? 'lg:order-2' : ''}`}>
                                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={inst.image}
                                            alt={inst.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className={`lg:col-span-7 p-10 md:p-14 flex flex-col justify-center ${index === 1 ? 'lg:order-1' : ''}`}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-white rounded-xl text-primary shadow-sm border border-stone-100">
                                                <inst.icon size={22} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-xs font-bold text-accent uppercase tracking-[0.15em]">{inst.programs}</span>
                                        </div>

                                        <h4 className="text-3xl md:text-4xl font-serif text-primary mb-4 group-hover:text-accent transition-colors leading-tight">
                                            {inst.name}
                                        </h4>

                                        <p className="text-stone-500 text-lg font-light leading-relaxed mb-8 max-w-lg">
                                            {inst.tagline}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 mb-8">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-accent" />
                                                <span className="text-sm font-bold text-primary">{inst.students}</span>
                                                <span className="text-sm text-stone-400">students</span>
                                            </div>
                                            <div className="w-px h-4 bg-stone-200" />
                                            <span className="text-sm font-medium text-accent">{inst.highlight}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-accent transition-colors">
                                            Explore this institution
                                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
