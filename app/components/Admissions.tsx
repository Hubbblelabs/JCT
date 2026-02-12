"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { FileText, Users, GraduationCap, CalendarCheck } from "lucide-react";

const admissionSteps = [
    {
        icon: FileText,
        title: "Application",
        desc: "Submit your basic details and academic records online.",
        date: "Open Now"
    },
    {
        icon: Users,
        title: "Counseling",
        desc: "Interactive session to understand your goals and aptitude.",
        date: "March - April"
    },
    {
        icon: CalendarCheck,
        title: "Selection",
        desc: "Merit-based selection transparency assured.",
        date: "May 2026"
    },
    {
        icon: GraduationCap,
        title: "Enrollment",
        desc: "Begin your journey at JCT Institutions.",
        date: "June 2026"
    }
];

export function Admissions() {
    return (
        <section id="admissions" className="py-16 md:py-32 bg-primary text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

            <div className="container mx-auto px-4 md:px-6 3xl:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 md:gap-20">

                    <div className="w-full lg:w-1/3 pt-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Admissions 2026</h2>
                            <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                                Begin Your <br /><span className="text-white/80 italic font-light">Journey Here.</span>
                            </h3>
                            <p className="text-blue-100/80 text-lg mb-10 leading-relaxed font-light">
                                We look for curiosity, dedication, and potential. Our admissions process is designed to be transparent and supportive, guiding you every step of the way.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <Button size="lg" className="bg-accent text-primary hover:bg-accent/90 border-none font-bold h-14 px-8 rounded-2xl shadow-lg shadow-accent/20 transition-transform hover:scale-105">
                                    Apply Online
                                </Button>
                                <Button variant="outline" size="lg" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-primary h-14 px-8 rounded-2xl font-bold transition-all shadow-sm">
                                    Download Brochure
                                </Button>
                            </div>

                            <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                                <h4 className="text-accent font-serif text-xl mb-3">Need Guidance?</h4>
                                <p className="text-sm text-blue-200 mb-6 font-light">Our admissions office is open Mon-Sat, 9AM - 5PM.</p>
                                <p className="text-lg font-medium text-white tracking-widest">+91 93614 88801</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {admissionSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 p-10 rounded-3xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-4 bg-white/10 rounded-2xl text-accent">
                                            <step.icon size={28} />
                                        </div>
                                        <span className="text-xs font-bold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                                            {step.date}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-serif mb-3 text-white">{step.title}</h4>
                                    <p className="text-blue-200/80 text-sm font-light leading-relaxed">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
