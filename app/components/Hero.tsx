"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    return (
        <section ref={ref} className="relative h-[92vh] min-h-187.5 flex items-center overflow-hidden bg-primary text-white">
            {/* Background Image with Overlay */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop')",
                    }}
                />

                {/* Enhanced Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/60 to-transparent md:via-primary/40" />
                <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-transparent to-black/30" />
            </motion.div>

            <div className="container relative z-20 px-4 md:px-6 pt-20">
                <motion.div
                    style={{ y: textY }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                            Admissions Open 2026-27
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight leading-[0.95] drop-shadow-sm"
                    >
                        Engineers of <br />
                        <span className="text-white/90 italic font-medium">Conscience</span> & <br />
                        <span className="text-accent">Change.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-lg md:text-xl text-stone-200 max-w-xl leading-relaxed font-light mb-10"
                    >
                        Empowering the next generation of leaders through world-class education in{' '}
                        <span className="font-semibold text-white">Engineering</span>,{' '}
                        <span className="font-semibold text-white">Arts & Science</span>, and{' '}
                        <span className="font-semibold text-white">Polytechnic</span> studies.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button size="lg" className="h-14 px-8 text-base bg-accent text-primary hover:bg-accent/90 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                            Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-base text-white border-white/30 bg-white/5 hover:bg-white hover:text-primary font-semibold rounded-full backdrop-blur-sm transition-all">
                            <Phone className="mr-2 w-4 h-4" /> Enquire / Callback
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Accreditation Logos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
                        {[
                            { name: "AICTE", logo: "/aicte.png" },
                            { name: "Anna University", logo: "/anna.png" },
                            { name: "NAAC", logo: "/naac.png" },
                            { name: "NBA", logo: "/nba.png" },
                            { name: "ISO", logo: "/iso.png" },
                            { name: "UGC", logo: "/ugc.png" },
                            { name: "DOTE", logo: "/dote.png" },
                            { name: "Bharathiar University", logo: "/bharathiar_university.png" },
                        ].map((item) => (
                            <div key={item.name} className="relative group">
                                <div className="relative h-9 w-9 md:h-11 md:w-11 transition-transform duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100">
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        fill
                                        className="object-contain filter drop-shadow-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
