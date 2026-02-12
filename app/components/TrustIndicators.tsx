"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Briefcase, Users } from "lucide-react";

const indicators = [
    {
        icon: ShieldCheck,
        label: "AICTE / UGC Approved",
        sub: "Government Recognized"
    },
    {
        icon: Award,
        label: "NBA & NAAC Accredited",
        sub: "Quality Education"
    },
    {
        icon: Briefcase,
        label: "96% Placement",
        sub: "Consistent Record"
    },
    {
        icon: Users,
        label: "12,000+ Alumni",
        sub: "Global Network"
    }
];

export function TrustIndicators() {
    return (
        <section className="bg-primary text-white py-12 border-t border-white/10 relative overflow-hidden z-20 -mt-2">
            <div className="absolute inset-0 bg-blue-900/50" />
            <div className="container mx-auto px-4 md:px-6 3xl:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                    {indicators.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center px-2 md:border-r md:last:border-r-0 border-white/10"
                        >
                            <div className="mb-3 p-2 bg-white/5 rounded-full text-accent shadow-inner shadow-white/5 ring-1 ring-white/10">
                                <item.icon size={20} strokeWidth={1.5} />
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm md:text-base 2xl:text-lg tracking-wide">{item.label}</h4>
                            <p className="text-xs text-blue-200/70 font-light mt-1 uppercase tracking-wider">{item.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
