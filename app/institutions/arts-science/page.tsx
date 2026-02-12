"use client";

import { DragScroll } from "@/app/components/ui/DragScroll";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
    ArrowRight,
    BookOpen,
    Calculator,
    BarChart3,
    Languages,
    Atom,
    Briefcase,
    FlaskConical,
    CheckCircle2,
    Phone,
    Mail,
    MapPin,
    Feather,
    Users,
    Lightbulb,
    MessageSquare,
    Palette,
} from "lucide-react";

/* ─── UG Programs ─── */
const ugPrograms = [
    { name: "B.Sc Mathematics", duration: "3 Years", icon: Calculator, desc: "Pure and applied mathematics with an emphasis on analytical reasoning, statistics, and computational methods." },
    { name: "B.Sc Computer Science", duration: "3 Years", icon: Atom, desc: "Programming, data structures, software development, and database systems — with lab-intensive coursework each semester." },
    { name: "B.Com (General / CA)", duration: "3 Years", icon: BarChart3, desc: "Accounting, taxation, financial management, and business law. The CA track includes computerized accounting modules." },
    { name: "BBA", duration: "3 Years", icon: Briefcase, desc: "Management principles, marketing, organizational behavior, and entrepreneurship with case-study driven pedagogy." },
    { name: "B.A English Literature", duration: "3 Years", icon: Languages, desc: "Critical reading, literary analysis, creative writing, and communication skills rooted in classical and modern texts." },
    { name: "B.Sc Physics", duration: "3 Years", icon: FlaskConical, desc: "Classical mechanics, electrodynamics, quantum physics, and optics with dedicated laboratory sessions every week." },
];

/* ─── PG Programs ─── */
const pgPrograms = [
    { name: "M.Sc Mathematics", duration: "2 Years", icon: Calculator, desc: "Advanced algebra, real analysis, topology, and research methodology for students pursuing academic or analytical careers." },
    { name: "M.Com", duration: "2 Years", icon: BarChart3, desc: "Advanced commerce studies covering cost accounting, auditing, international trade, and financial statement analysis." },
    { name: "M.Sc Computer Science", duration: "2 Years", icon: Atom, desc: "Advanced computing, machine learning fundamentals, network security, and a research project in the final semester." },
];

/* ─── Academic life highlights ─── */
const academicLife = [
    { icon: BookOpen, title: "Departmental Seminars", desc: "Each department hosts monthly seminars where students present papers, discuss ideas, and engage with faculty-led research topics." },
    { icon: Feather, title: "Literary & Debate Society", desc: "The college has an active literary club that organizes essay competitions, poetry readings, and inter-college debate tournaments." },
    { icon: Lightbulb, title: "Undergraduate Research", desc: "Final-year students in science programs undertake guided research projects. Several have been presented at state-level conferences." },
    { icon: MessageSquare, title: "Guest Lecture Series", desc: "Industry professionals, academics, and alumni visit regularly for talks that connect classroom theory to real-world practice." },
    { icon: Palette, title: "Cultural Festivals", desc: "An annual arts festival brings together drama, music, dance, and visual arts — organized and run entirely by students." },
    { icon: Users, title: "Community Outreach", desc: "NSS and extension activities connect students with local communities — from literacy drives to environmental cleanup campaigns." },
];

export default function ArtsSciencePage() {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden arts-science-theme">
            <Navbar />

            {/* ═══ HERO — Text-led, calm, editorial ═══ */}
            <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[#1E1B4B]">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2670&auto=format&fit=crop"
                        alt="Arts and Science Campus"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#1E1B4B]/95 via-[#1E1B4B]/85 to-[#1E1B4B]/40" />
                    {/* Artistic pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, transparent 0%, transparent 2%, #A78BFA 2%, #A78BFA 2.2%, transparent 2.2%)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-16 md:pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left — Text */}
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="mb-4 md:mb-6"
                            >
                                <span className="inline-block py-1 px-3 rounded-full bg-[#C4B5FD]/10 border border-[#C4B5FD]/20 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#C4B5FD] backdrop-blur-md">
                                    JCT College of Arts & Science
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight leading-[1.1] md:leading-none"
                            >
                                Where Curiosity <br />
                                Becomes <span className="text-[#A78BFA] italic font-light">Understanding.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-sm md:text-base lg:text-lg text-white/80 max-w-lg leading-relaxed font-light mb-8"
                            >
                                We offer undergraduate and postgraduate programs across science, commerce, and the humanities. The emphasis here is on thinking clearly, reading widely, and developing the discipline to pursue ideas to their conclusions.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Button size="lg" className="h-12 md:h-14 px-8 bg-[#C4B5FD] text-[#1E1B4B] hover:bg-[#A78BFA] font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#C4B5FD]/20 w-full sm:w-auto">
                                    Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-12 md:h-14 px-8 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-bold rounded-xl w-full sm:w-auto">
                                    Campus Tour
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right — Stats Grid (Moved from bottom bar) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="grid grid-cols-2 gap-3 md:gap-4 mt-8 lg:mt-0"
                        >
                            {[
                                { value: "2,500+", label: "Students", accent: true },
                                { value: "9", label: "Programs", accent: false },
                                { value: "60+", label: "Faculty Members", accent: false },
                                { value: "15+", label: "Years of Excellence", accent: true },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`p-4 md:p-6 rounded-2xl border backdrop-blur-md ${stat.accent ? "bg-[#C4B5FD]/15 border-[#C4B5FD]/30" : "bg-white/8 border-white/15"}`}
                                >
                                    <span className={`block text-2xl md:text-4xl font-sans font-black mb-1 md:mb-2 ${stat.accent ? "text-[#C4B5FD]" : "text-white"}`}>{stat.value}</span>
                                    <span className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ PHILOSOPHY — About section, text-forward ═══ */}
            <section className="py-16 md:py-32 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-8">Our Philosophy</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-10">
                                Education That <span className="text-stone-400 italic font-light">Changes How You Think</span>
                            </h3>

                            <div className="prose prose-lg max-w-none">
                                <p className="text-stone-600 text-xl leading-relaxed font-light mb-8">
                                    JCT College of Arts and Science was founded with a straightforward idea: that good education doesn't just fill notebooks — it changes how students think. Our programs in science, commerce, and the humanities are designed to develop analytical minds and responsible citizens.
                                </p>
                                <p className="text-stone-600 text-xl leading-relaxed font-light mb-8">
                                    We're affiliated with Bharathiar University, Coimbatore, and recognized by the UGC. The campus shares infrastructure with the broader JCT Institutions ecosystem, giving our students access to facilities and opportunities beyond a typical arts and science college.
                                </p>
                                <p className="text-stone-500 text-lg leading-relaxed font-light">
                                    Small class sizes mean faculty know their students by name. Discussions happen naturally, and nobody gets lost in a crowd. We don't claim to be the biggest — we aim to be the most thoughtful.
                                </p>
                            </div>

                            <div className="mt-14 pt-10 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                                <div>
                                    <span className="block text-4xl font-sans font-black text-primary mb-1">6</span>
                                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Departments</span>
                                </div>
                                <div>
                                    <span className="block text-4xl font-sans font-black text-primary mb-1">30:1</span>
                                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Student-Faculty Ratio</span>
                                </div>
                                <div>
                                    <span className="block text-4xl font-sans font-black text-primary mb-1">UGC</span>
                                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Recognized</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ UG PROGRAMS — Conceptually grouped ═══ */}
            <section className="py-16 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-10 md:mb-12">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4 md:mb-6">Undergraduate Programs</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary leading-tight mb-4 md:mb-6">
                            Six Paths <br />
                            <span className="text-stone-300 italic font-light">to a Degree</span>
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 justify-between items-end">
                            <p className="text-stone-500 font-light leading-relaxed text-lg max-w-2xl">
                                Three-year programs that build strong foundations in theory and application — from pure mathematics to English literature, from physics labs to business case studies.
                            </p>
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-sm text-stone-500 font-light leading-relaxed max-w-sm">
                                <span className="text-primary font-bold">Affiliated to</span> Bharathiar University, Coimbatore.
                            </div>
                        </div>
                    </div>

                    <DragScroll className="flex gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth">
                        {ugPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300 group min-w-55 md:min-w-65 max-w-70 snap-center shrink-0 flex flex-col justify-between"
                                draggable={false}
                            >
                                <div>
                                    <div className="flex items-start gap-5 mb-6">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0">
                                            <prog.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-serif text-primary font-bold leading-tight mb-2">{prog.name}</h4>
                                            <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">{prog.duration}</span>
                                        </div>
                                    </div>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed mb-4">{prog.desc}</p>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-stone-50">
                                    <ArrowRight size={18} className="text-stone-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </DragScroll>
                </div>
            </section>

            {/* ═══ PG PROGRAMS — Compact row ═══ */}
            <section className="py-16 md:py-20 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Postgraduate Programs</h2>
                            <h3 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                                For Deeper <span className="italic text-stone-400 font-light">Specialization</span>
                            </h3>
                        </div>
                        <p className="text-stone-500 font-light text-sm max-w-md">
                            Two-year programs for research exposure, advanced study, and preparation for competitive exams or academic careers.
                        </p>
                    </div>

                    <DragScroll className="flex gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth">
                        {pgPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300 min-w-55 md:min-w-65 max-w-70 snap-center shrink-0 flex flex-col justify-between"
                                draggable={false}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary">
                                            <prog.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">{prog.duration}</span>
                                    </div>
                                    <h4 className="text-xl font-serif text-primary mb-3 font-bold">{prog.name}</h4>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed mb-4">{prog.desc}</p>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-stone-50">
                                    <ArrowRight size={18} className="text-stone-300 hover:text-accent transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </DragScroll>
                </div>
            </section>

            {/* ═══ ACADEMIC LIFE — Activities & culture ═══ */}
            <section className="py-16 md:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Beyond the Classroom</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                            Research, Seminars, <span className="italic text-stone-300 font-light">& Student Life</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Academic growth doesn't stop at lectures. These are the activities and spaces that make learning richer.
                        </p>
                    </div>

                    <DragScroll className="flex gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth">
                        {academicLife.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="p-8 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-md transition-all duration-300 group min-w-60 md:min-w-70 snap-center shrink-0 bg-white"
                                draggable={false}
                            >
                                <div className="p-3 bg-stone-50 rounded-xl text-primary w-fit mb-5 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                    <item.icon size={22} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg font-serif text-primary mb-2 font-bold">{item.title}</h4>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </DragScroll>
                </div>
            </section>

            {/* ═══ IMAGE BREAK — Calm campus image ═══ */}
            <section className="relative h-[50vh] min-h-100 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop"
                    alt="Students studying on campus"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl px-4"
                    >
                        <p className="text-3xl md:text-4xl font-serif text-white leading-snug italic font-light">
                            "The unexamined life is not worth living."
                        </p>
                        <span className="block mt-4 text-sm text-white/50 font-bold uppercase tracking-widest">— Socrates</span>
                    </motion.div>
                </div>
            </section>

            {/* ═══ ADMISSIONS — Gentle CTA ═══ */}
            <section className="py-16 md:py-28 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Admissions</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-8">
                                Join a College That <br />
                                <span className="text-stone-400 italic font-light">Values Substance.</span>
                            </h3>
                            <p className="text-stone-500 text-lg font-light leading-relaxed mb-12">
                                Admissions are open for undergraduate and postgraduate programs. We follow a transparent, merit-based process aligned with Bharathiar University guidelines. No pressure, no complicated steps.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
                            {[
                                { title: "UG Eligibility", items: ["Passed 12th (HSC) from a recognized board", "Relevant subject combination", "Minimum aggregate per university norms"] },
                                { title: "PG Eligibility", items: ["Relevant bachelor's degree", "Minimum percentage as prescribed", "Interview for select programs"] },
                                { title: "How to Apply", items: ["Fill out the online application", "Attend counseling with original documents", "Confirm enrollment with fee payment"] },
                            ].map((block) => (
                                <div key={block.title} className="bg-white p-8 rounded-2xl border border-stone-100">
                                    <h4 className="font-serif text-lg text-primary font-bold mb-4">{block.title}</h4>
                                    <ul className="space-y-3">
                                        {block.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-stone-600 font-light">
                                                <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <Button size="lg" className="h-14 px-10 bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                                Apply for Admission <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-10 border-stone-200 text-primary hover:bg-stone-50/80 font-bold rounded-2xl">
                                Download Prospectus
                            </Button>
                        </div>

                        {/* Contact info */}
                        <div className="bg-white p-8 rounded-2xl border border-stone-100 max-w-md mx-auto">
                            <h4 className="font-serif text-lg text-primary mb-4">Questions? Reach Out.</h4>
                            <div className="space-y-3 text-sm">
                                <a href="tel:+919361488801" className="flex items-center gap-3 text-stone-500 hover:text-primary transition-colors">
                                    <Phone size={16} className="text-accent" /> +91 93614 88801
                                </a>
                                <a href="mailto:artsscience@jct.edu" className="flex items-center gap-3 text-stone-500 hover:text-primary transition-colors">
                                    <Mail size={16} className="text-accent" /> artsscience@jct.edu
                                </a>
                                <div className="flex items-start gap-3 text-stone-500">
                                    <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                                    <span>Knowledge Park, Pichanur, Coimbatore — 641105</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
