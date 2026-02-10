"use client";

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
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* ═══ HERO — Text-led, calm, editorial ═══ */}
            <section className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden bg-white">
                {/* Subtle background image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop')",
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-16">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8"
                        >
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                                JCT College of Arts & Science — Coimbatore
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-primary mb-10 tracking-tighter leading-[0.92]"
                        >
                            Where Curiosity <br />
                            Becomes <span className="text-stone-400 italic font-light">Understanding.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col md:flex-row gap-12"
                        >
                            <p className="text-lg md:text-xl text-stone-500 max-w-xl leading-relaxed font-light border-l-2 border-accent/30 pl-6">
                                We offer undergraduate and postgraduate programs across science, commerce, and the humanities. The emphasis here is on thinking clearly, reading widely, and developing the discipline to pursue ideas to their conclusions.
                            </p>

                            <div className="flex flex-col gap-4 justify-end">
                                <Button size="lg" className="h-14 px-8 bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                                    Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-8 border-stone-200 text-primary hover:bg-stone-50 font-bold rounded-2xl">
                                    Campus Tour
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom stats bar */}
                <div className="w-full bg-primary z-10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                            {[
                                { value: "2,500+", label: "Students" },
                                { value: "9", label: "Programs" },
                                { value: "60+", label: "Faculty" },
                                { value: "15+", label: "Years" },
                            ].map((stat) => (
                                <div key={stat.label} className="py-6 px-6 text-center">
                                    <span className="text-2xl md:text-3xl font-sans font-black text-accent tracking-tight">{stat.value}</span>
                                    <span className="block text-[10px] text-white/50 uppercase tracking-[0.15em] font-bold mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PHILOSOPHY — About section, text-forward ═══ */}
            <section className="py-32 bg-stone-50">
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

                            <div className="mt-14 pt-10 border-t border-stone-200 grid grid-cols-3 gap-8">
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
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Sticky header */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Undergraduate Programs</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                                Six Paths <br />
                                <span className="text-stone-300 italic font-light">to a Degree</span>
                            </h3>
                            <p className="text-stone-500 font-light leading-relaxed text-lg mb-8">
                                Three-year programs that build strong foundations in theory and application — from pure mathematics to English literature, from physics labs to business case studies.
                            </p>
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                                <p className="text-sm text-stone-500 font-light leading-relaxed">
                                    <span className="text-primary font-bold">Affiliated to</span> Bharathiar University, Coimbatore. All programs lead to university-awarded degrees.
                                </p>
                            </div>
                        </div>

                        {/* Program list */}
                        <div className="lg:col-span-8 space-y-6">
                            {ugPrograms.map((prog, index) => (
                                <motion.div
                                    key={prog.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.06 }}
                                    className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0">
                                            <prog.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="text-xl font-serif text-primary font-bold">{prog.name}</h4>
                                                <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ml-4">{prog.duration}</span>
                                            </div>
                                            <p className="text-stone-500 text-sm font-light leading-relaxed">{prog.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PG PROGRAMS — Compact row ═══ */}
            <section className="py-20 bg-stone-50">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pgPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-stone-50 rounded-xl text-primary">
                                        <prog.icon size={22} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">{prog.duration}</span>
                                </div>
                                <h4 className="text-xl font-serif text-primary mb-3 font-bold">{prog.name}</h4>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{prog.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ACADEMIC LIFE — Activities & culture ═══ */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Beyond the Classroom</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                            Research, Seminars, <span className="italic text-stone-300 font-light">& Student Life</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed">
                            Academic growth doesn't stop at lectures. These are the activities and spaces that make learning richer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {academicLife.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="p-8 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="p-3 bg-stone-50 rounded-xl text-primary w-fit mb-5 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                    <item.icon size={22} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg font-serif text-primary mb-2 font-bold">{item.title}</h4>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
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
            <section className="py-28 bg-stone-50">
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
                                <a href="tel:+919876543211" className="flex items-center gap-3 text-stone-500 hover:text-primary transition-colors">
                                    <Phone size={16} className="text-accent" /> +91 98765 43211
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
