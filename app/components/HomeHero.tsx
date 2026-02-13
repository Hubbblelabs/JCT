"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HomeHero() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.8]);

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-primary text-white pt-20">
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
                    alt="JCT Campus"
                    fill
                    priority
                    className="object-cover scale-110"
                    sizes="100vw"
                    quality={90}
                />
                <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                {/* Original overlay was just bg-primary with opacity. Keeping close to original design but using standardized overlay approach */}
                <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-primary" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary" />
            </motion.div>

            <div className="container relative z-10 px-4 md:px-6 3xl:px-8">
                <div className="max-w-5xl 3xl:max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-sm font-bold tracking-widest uppercase text-white/80">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Coimbatore, Tamil Nadu — Since 2009
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl 3xl:text-9xl font-serif text-white mb-6 tracking-tighter leading-[0.92]"
                    >
                        Three Colleges. <br />
                        One Commitment to <br />
                        <span className="text-accent italic font-light">your success starts here</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="text-sm sm:text-base md:text-lg 2xl:text-xl text-white/60 max-w-2xl leading-relaxed font-light mb-8"
                    >
                        JCT Institutions is a group of three colleges in Coimbatore — Engineering, Arts & Science, and Polytechnic — working under a shared belief that education should build competence and character in equal measure.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <Button size="lg" className="h-14 px-8 text-base bg-accent text-primary hover:bg-accent/90 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-accent/20">
                            Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-transparent border-white/20 text-white hover:bg-white/10 font-bold rounded-xl transition-all">
                            Enquire Now
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
