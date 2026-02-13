"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const departments = [
    {
        name: "Electronics & Communication",
        slug: "ece",
        count: "480 Students",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        description: "Advanced signal processing, IoT, and wireless communication systems"
    },
    {
        name: "Computer Science",
        slug: "cse",
        count: "600 Students",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80",
        description: "Software engineering, cloud computing, and full-stack development"
    },
    {
        name: "Petrochemical Engineering",
        slug: "petro",
        count: "240 Students",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
        description: "Process optimization, refinery operations, and sustainable energy"
    },
    {
        name: "Civil Engineering",
        slug: "civil",
        count: "320 Students",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
        description: "Infrastructure design, smart cities, and sustainable construction"
    },
    {
        name: "Artificial Intelligence",
        slug: "ai",
        count: "120 Students",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
        description: "Machine learning, neural networks, and intelligent systems"
    },
    {
        name: "Cyber Security",
        slug: "cyber",
        count: "60 Students",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
        description: "Network security, ethical hacking, and digital forensics"
    }
];

export function Departments() {
    return (
        <section id="academics" className="py-16 md:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-4 md:mb-6">Our Faculties</h2>
                    <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif text-primary leading-tight mb-4 md:mb-6">
                        Schools of <span className="italic text-stone-300 font-light">Innovation</span>
                    </h3>
                    <p className="text-stone-500 font-light leading-relaxed text-lg">
                        Our academic structure is designed to foster deep specialization while encouraging interdisciplinary collaboration across six core schools.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {departments.map((dept, index) => (
                        <motion.div
                            key={dept.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link href={`/academics/${dept.slug}`} className="group block h-full">
                                <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="aspect-4/3 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                        <Image
                                            src={dept.image}
                                            alt={dept.name}
                                            width={800}
                                            height={600}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-all shadow-lg">
                                                <ArrowUpRight size={20} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <span className="text-xl font-sans font-black text-accent/80 tracking-tighter">0{index + 1}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif text-primary mb-3 group-hover:text-accent transition-colors">
                                            {dept.name}
                                        </h3>
                                        <p className="text-stone-500 text-sm font-light leading-relaxed mb-4 flex-1">
                                            {dept.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                            <span className="text-xs text-stone-400 font-medium">{dept.count}</span>
                                            <span className="text-xs text-primary font-bold uppercase tracking-wider group-hover:text-accent transition-colors">Learn More →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link href="/academics" className="inline-flex items-center gap-2 px-8 py-4 bg-stone-50 hover:bg-accent/10 border border-stone-200 hover:border-accent rounded-2xl text-sm font-bold text-primary hover:text-accent transition-all">
                        View Full Curriculum & Programs
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
