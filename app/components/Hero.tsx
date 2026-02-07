"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    return (
        <section ref={ref} className="relative h-[90vh] min-h-[700px] flex items-end overflow-hidden bg-primary text-white pb-32">
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

                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />
            </motion.div>

            <div className="container relative z-20 px-4 md:px-6">
                <motion.div
                    style={{ y: textY }}
                    className="max-w-5xl"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-200/20 bg-yellow-400/10 backdrop-blur-sm text-sm font-bold tracking-widest uppercase text-yellow-300">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50"></span>
                            Est. 1998 • Excellence
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-6xl md:text-8xl lg:text-[7rem] font-serif text-white mb-8 tracking-tighter leading-[0.9]"
                    >
                        Engineers of <br />
                        <span className="text-white/80 font-light italic">Conscience.</span>
                    </motion.h1>

                    <div className="flex flex-col md:flex-row gap-12 items-end">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-light border-l border-white/20 pl-6"
                        >
                            We balance technical rigor with ethical leadership, preparing you for a meaningful contribution to society.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        >
                            <Button size="lg" className="h-16 px-10 text-lg bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-accent/20">
                                Explore Academics <ArrowDownRight className="ml-2 w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
