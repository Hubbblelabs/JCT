"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
    FileText,
    CalendarCheck,
    GraduationCap,
    ArrowUpRight,
    Phone,
    Mail
} from "lucide-react";

export function AdmissionsCTA() {
    return (
        <section id="admissions" className="py-16 md:py-20 3xl:py-28 bg-white">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-4">Admissions 2026</h2>
                        <h3 className="text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl font-serif text-primary leading-tight mb-6">
                            Not Sure Which <br />
                            <span className="text-stone-500 italic font-light">College Is Right for You?</span>
                        </h3>
                        <p className="text-stone-500 text-base font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            Whether you're coming from 10th, 12th, or completing a diploma — there's a clear pathway for you at JCT. Our admissions team can help you find the right fit based on your background and goals.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                        {[
                            {
                                icon: FileText,
                                title: "After 10th Standard",
                                desc: "Join JCT Polytechnic College for a 3-year diploma in engineering disciplines. Hands-on training from day one.",
                                link: "/institutions/polytechnic",
                                linkText: "View Polytechnic",
                            },
                            {
                                icon: CalendarCheck,
                                title: "After 12th Standard",
                                desc: "Choose between B.E./B.Tech at the Engineering College or B.Sc/B.Com/BBA at Arts & Science — depending on your stream.",
                                link: "/institutions/engineering",
                                linkText: "Compare Options",
                            },
                            {
                                icon: GraduationCap,
                                title: "After Diploma",
                                desc: "Lateral entry directly into the second year of B.E. programs at JCT College of Engineering and Technology.",
                                link: "/institutions/engineering",
                                linkText: "Lateral Entry Details",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-stone-50 p-10 rounded-3xl border border-stone-100 text-left hover:border-accent/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="p-3 bg-white rounded-xl text-primary mb-6 inline-block shadow-sm group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-serif text-primary mb-3">{item.title}</h3>
                                <p className="text-stone-500 text-sm font-light leading-relaxed mb-6">{item.desc}</p>
                                <Link href={item.link} className="text-sm font-bold text-primary hover:text-accent transition-colors inline-flex items-center gap-1">
                                    {item.linkText} <ArrowUpRight size={14} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                        <Button size="lg" className="h-14 px-8 text-base bg-accent text-primary hover:bg-accent/90 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                            Apply Online
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-base border-stone-200 text-primary hover:bg-stone-50 font-bold rounded-xl transition-all">
                            Download Prospectus
                        </Button>
                    </div>

                    {/* Prominent Admission Contact Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 p-6 bg-linear-to-r from-primary to-primary/90 rounded-2xl text-white text-center max-w-2xl mx-auto border-2 border-accent/30 shadow-2xl"
                    >
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Phone size={24} className="text-accent" />
                            <h3 className="text-accent font-serif text-2xl font-bold">Admissions Helpline</h3>
                        </div>
                        <a href="tel:+919361488801" className="block">
                            <p className="text-3xl md:text-4xl font-black text-white tracking-wide hover:text-accent transition-colors mb-2">
                                +91 93614 88801
                            </p>
                        </a>
                        <p className="text-sm text-blue-200/70 font-light">Mon–Sat, 9:00 AM – 5:00 PM</p>
                        <p className="text-xs text-white/60 mt-2">Call for personalized guidance on admissions, programs, and campus visits</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-8 p-6 bg-stone-50 rounded-2xl text-left max-w-xl mx-auto"
                    >
                        <h3 className="text-primary font-serif text-lg mb-2 font-bold">Email Us</h3>
                        <a href="mailto:admissions@jct.edu" className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-base font-medium">
                            <Mail size={18} className="text-accent" /> admissions@jct.edu
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
