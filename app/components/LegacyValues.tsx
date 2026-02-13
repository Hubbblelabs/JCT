"use client";

import { motion } from "framer-motion";
import { ReverseRoadmap } from "@/app/components/ReverseRoadmap";

export function LegacyValues() {
    return (
        <section id="about" className="py-16 md:py-20 3xl:py-28 bg-stone-50">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 3xl:gap-16 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-4">Our Story</h2>
                        <h3 className="text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl font-serif text-primary leading-tight">
                            Over a Decade of <br />
                            <span className="text-stone-500 italic font-light">Steady Growth.</span>
                        </h3>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex items-end"
                    >
                        <p className="text-stone-500 text-base font-light leading-relaxed max-w-lg">
                            JCT Institutions wasn't built in a single stroke. Since 2009, it grew institution by institution, responding to what students and the region actually needed — first engineers, then skilled technicians, then broadly educated graduates.
                        </p>
                    </motion.div>
                </div>

                {/* Reverse Roadmap */}
                <ReverseRoadmap />


            </div>
        </section>
    );
}
