"use client";

import { Button } from "@/app/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let rafId: number;
        const handleScroll = () => {
            const shouldShow = window.scrollY > 300;
            if (shouldShow !== isVisible) {
                setIsVisible(shouldShow);
            }
        };

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-stone-200 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full bg-white font-bold text-primary border-stone-300">
                            <Phone className="mr-2 w-4 h-4" /> Enquire
                        </Button>
                        <Button className="w-full bg-accent text-primary font-bold hover:bg-accent/90 shadow-lg shadow-accent/20">
                            Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
