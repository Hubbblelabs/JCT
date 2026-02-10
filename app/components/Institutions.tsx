"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Microscope, PenTool } from "lucide-react";
import Link from "next/link";


const institutions = [
    {
        name: "JCT College of Engineering and Technology",
        slug: "engineering",
        href: "/institutions/engineering",
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2686&auto=format&fit=crop",
        description: "Pioneering technical education with state-of-the-art laboratories and industry-aligned curriculum.",
        programs: "BE, B.Tech, ME, PhD"
    },
    {
        name: "JCT College of Arts and Science",
        slug: "arts-science",
        href: "/institutions/arts-science",
        icon: Microscope,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop",
        description: "Fostering creativity and scientific inquiry through comprehensive arts and science programs.",
        programs: "B.Sc, B.Com, BBA, BA"
    },
    {
        name: "JCT Polytechnic College",
        slug: "polytechnic",
        href: "/institutions/polytechnic",
        icon: PenTool,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop",
        description: "Empowering students with practical skills and hands-on technical training for industry readiness.",
        programs: "Diploma Courses"
    }
];

export function Institutions() {
    return (
        <section id="institutions" className="py-24 bg-stone-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Our Institutions</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                        Three Pathways to <span className="italic text-stone-400 font-light">Excellence</span>
                    </h3>
                    <p className="text-stone-500 font-light leading-relaxed text-lg">
                        JCT Institutions comprises three premier colleges, each dedicated to shaping future leaders in their respective fields.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {institutions.map((inst, index) => (
                        <motion.div
                            key={inst.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group relative"
                        >
                          <Link href={inst.href}>
                            <div className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 flex flex-col border border-stone-100">
                                {/* Image Container */}
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={inst.image}
                                        alt={inst.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-lg">
                                            <inst.icon size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h4 className="text-xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                                        {inst.name}
                                    </h4>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed mb-6 flex-1">
                                        {inst.description}
                                    </p>

                                    <div className="pt-6 border-t border-stone-100 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary/70 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                {inst.programs}
                                            </span>
                                            <span className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-accent group-hover:border-accent group-hover:text-primary transition-all">
                                                <ArrowUpRight size={14} />
                                            </span>
                                        </div>
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
