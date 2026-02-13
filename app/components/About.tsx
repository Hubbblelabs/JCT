"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function About() {
    return (
        <section id="about" className="py-16 md:py-32 bg-stone-50/50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Image Composition - Left offset */}
                    <div className="lg:col-span-5 relative order-2 lg:order-1 mt-12 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="aspect-3/4 relative overflow-hidden rounded-3xl bg-stone-200 shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
                                    alt="Students in discussion at JCT Library"
                                    width={800}
                                    height={1067}
                                    className="object-cover w-full h-full grayscale-20 hover:grayscale-0 transition-all duration-1000"
                                    sizes="(max-width: 1024px) 100vw, 42vw"
                                    loading="lazy"
                                />
                            </div>

                            {/* Floating quote card */}
                            <div className="absolute -bottom-8 -right-8 bg-accent p-8 max-w-xs shadow-xl hidden md:block rounded-2xl text-primary">
                                <p className="font-serif text-lg italic leading-relaxed font-medium">
                                    "Education is the kindling of a flame, not the filling of a vessel."
                                </p>
                                <span className="block mt-4 text-xs font-bold uppercase tracking-widest opacity-70">- Socrates</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block lg:col-span-1 order-1"></div>

                    {/* Text Content */}
                    <div className="lg:col-span-6 order-1 lg:order-2 pt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-8">
                                History & Philosophy
                            </h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-8 md:mb-10 leading-[1.1]">
                                More than a degree.<br />
                                <span className="text-stone-500">A transformation.</span>
                            </h3>
                            <div className="space-y-6 md:space-y-8 text-stone-600 text-base md:text-xl leading-relaxed font-light max-w-2xl">
                                <p>
                                    Since 1998, we have believed that true education happens in the margins—in the late-night debates, the lab failures that lead to breakthroughs, and the quiet moments of reflection.
                                </p>
                                <p>
                                    We don't just teach engineering; we cultivate the conscience required to wield technology responsibly.
                                </p>
                            </div>

                            <div className="mt-12 pt-12 border-t border-stone-200 flex flex-wrap gap-12">
                                <div>
                                    <span className="block text-5xl font-sans font-black text-primary mb-2">25+</span>
                                    <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Years of Excellence</span>
                                </div>
                                <div>
                                    <span className="block text-5xl font-sans font-black text-primary mb-2">12k</span>
                                    <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Global Alumni</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
