"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const institutions = [
    {
        name: "JCT College of Engineering and Technology",
        slug: "engineering",
        href: "/institutions/engineering",
        logo: "/jct_engineering.png",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
        description: "Pioneering technical education with state-of-the-art laboratories and industry-aligned curriculum.",
        programs: "BE, B.Tech, ME, PhD"
    },
    {
        name: "JCT College of Arts and Science",
        slug: "arts-science",
        href: "/institutions/arts-science",
        logo: "/jct_arts.png",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
        description: "Fostering creativity and scientific inquiry through comprehensive arts and science programs.",
        programs: "B.Sc, B.Com, BBA, BA"
    },
    {
        name: "JCT Polytechnic College",
        slug: "polytechnic",
        href: "/institutions/polytechnic",
        logo: "/jct_polytechnic.png",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        description: "Empowering students with practical skills and hands-on technical training for industry readiness.",
        programs: "Diploma Courses"
    }
];

export function Institutions() {
    return (
        <section id="institutions" className="py-16 md:py-24 3xl:py-32 bg-stone-50">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-4 md:mb-6">Our Institutions</h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-serif text-primary leading-tight mb-4 md:mb-6">
                        Three Pathways to <span className="italic text-stone-500 font-light">Excellence</span>
                    </h3>
                    <p className="text-stone-500 font-light leading-relaxed text-sm sm:text-base md:text-lg">
                        JCT Institutions comprises three premier colleges, each dedicated to shaping future leaders in their respective fields.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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
                                    <div className="aspect-16/10 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <Image
                                            src={inst.image}
                                            alt={inst.name}
                                            width={800}
                                            height={500}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-lg p-2">
                                                <Image src={inst.logo} alt={inst.name} width={32} height={32} className="object-contain" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 sm:p-6 md:p-8 3xl:p-10 flex-1 flex flex-col">
                                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-primary mb-2 md:mb-3 group-hover:text-accent transition-colors leading-tight">
                                            {inst.name}
                                        </h3>
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
