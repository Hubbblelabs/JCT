"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Using placeholder images from Unsplash
const campusImages = [
    {
        src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1500&auto=format&fit=crop&q=80",
        title: "State-of-the-Art Libraries",
        desc: "24/7 Access to global digital resources"
    },
    {
        src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1500&auto=format&fit=crop&q=80",
        title: "Modern Research Labs",
        desc: "Where innovation meets execution"
    },
    {
        src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1500&auto=format&fit=crop&q=80",
        title: "Active Student Life",
        desc: "Over 50+ clubs and student chapters"
    },
    {
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1500&auto=format&fit=crop&q=80",
        title: "Collaborative Spaces",
        desc: "Designed for teamwork and creativity"
    }
];

export function CampusLife() {
    return (
        <section className="py-32 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 mb-16 flex justify-between items-end">
                <div>
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Campus Life</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                        Life Beyond <br /><span className="text-stone-400 italic">The Classroom</span>
                    </h3>
                </div>

                <div className="hidden md:flex gap-4">
                    <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-primary hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-6 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0 pl-[max(1rem,calc((100vw-80rem)/2))]">
                {campusImages.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] snap-center cursor-pointer group"
                    >
                        <div className="aspect-4/5 md:aspect-3/4 rounded-3xl overflow-hidden relative mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <img
                                src={item.src}
                                alt={item.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                <span className="inline-block px-3 py-1 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-2">View Gallery</span>
                            </div>
                        </div>
                        <h4 className="text-2xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                        <p className="text-stone-500 font-light">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
