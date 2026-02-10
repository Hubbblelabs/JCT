"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
    ArrowDownRight,
    ArrowRight,
    BookOpen,
    FlaskConical,
    Palette,
    Calculator,
    BarChart3,
    Languages,
    Atom,
    Briefcase,
    CheckCircle2,
    MapPin,
    Phone,
    Mail,
    Users,
    GraduationCap,
    Building2,
    Trophy,
} from "lucide-react";

/* ─── Programs ─── */
const ugPrograms = [
    {
        name: "B.Sc Mathematics",
        duration: "3 Years",
        icon: Calculator,
        description:
            "Pure and applied mathematics with an emphasis on analytical reasoning, statistics, and computational methods.",
    },
    {
        name: "B.Sc Computer Science",
        duration: "3 Years",
        icon: Atom,
        description:
            "Programming, data structures, software development, and database systems — with lab-intensive coursework each semester.",
    },
    {
        name: "B.Com (General / Computer Applications)",
        duration: "3 Years",
        icon: BarChart3,
        description:
            "Accounting, taxation, financial management, and business law. The CA track includes computerized accounting modules.",
    },
    {
        name: "BBA (Bachelor of Business Administration)",
        duration: "3 Years",
        icon: Briefcase,
        description:
            "Management principles, marketing, organizational behavior, and entrepreneurship with case-study driven pedagogy.",
    },
    {
        name: "B.A English Literature",
        duration: "3 Years",
        icon: Languages,
        description:
            "Critical reading, literary analysis, creative writing, and communication skills rooted in classical and modern texts.",
    },
    {
        name: "B.Sc Physics",
        duration: "3 Years",
        icon: FlaskConical,
        description:
            "Classical mechanics, electrodynamics, quantum physics, and optics with dedicated laboratory sessions every week.",
    },
];

const pgPrograms = [
    {
        name: "M.Sc Mathematics",
        duration: "2 Years",
        icon: Calculator,
        description:
            "Advanced algebra, real analysis, topology, and research methodology for students pursuing academic or analytical careers.",
    },
    {
        name: "M.Com",
        duration: "2 Years",
        icon: BarChart3,
        description:
            "Advanced commerce studies covering cost accounting, auditing, international trade, and financial statement analysis.",
    },
    {
        name: "M.Sc Computer Science",
        duration: "2 Years",
        icon: Atom,
        description:
            "Advanced computing, machine learning fundamentals, network security, and a research project in the final semester.",
    },
];

/* ─── Why Choose ─── */
const values = [
    {
        title: "Broad Academic Foundation",
        desc: "Our programs are designed to build strong fundamentals before specialization — giving graduates flexibility in career choices.",
    },
    {
        title: "Small Class Sizes",
        desc: "Faculty know their students by name. Discussions happen naturally, and nobody gets lost in a crowd.",
    },
    {
        title: "Research Encouragement",
        desc: "Undergraduate students are encouraged to participate in departmental research projects and present at conferences.",
    },
    {
        title: "Interdisciplinary Thinking",
        desc: "Electives across departments let science students take humanities courses and vice versa — building well-rounded graduates.",
    },
    {
        title: "Active Campus Culture",
        desc: "Literary clubs, debate societies, cultural festivals, and community outreach programs keep student life engaging beyond academics.",
    },
];

/* ─── Facilities ─── */
const facilities = [
    {
        title: "Science Laboratories",
        desc: "Dedicated physics, chemistry, and computer science labs equipped for both coursework and independent experiments.",
        image:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Central Library",
        desc: "Over 30,000 volumes, digital journals, and quiet reading rooms open throughout the week.",
        image:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Seminar & Conference Hall",
        desc: "A 300-seat auditorium used for guest lectures, departmental seminars, and cultural events.",
        image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Hostel & Student Housing",
        desc: "Separate hostels for men and women with mess facilities, study rooms, and recreation areas on campus.",
        image:
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1500&auto=format&fit=crop&q=80",
    },
];

export default function ArtsSciencePage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* ═══ HERO ═══ */}
            <section
                ref={heroRef}
                className="relative h-[90vh] min-h-[700px] flex items-end overflow-hidden bg-primary text-white pb-32"
            >
                <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />
                </motion.div>

                <div className="container relative z-20 px-4 md:px-6">
                    <motion.div style={{ y: textY }} className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-200/20 bg-yellow-400/10 backdrop-blur-sm text-sm font-bold tracking-widest uppercase text-yellow-300">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50" />
                                UG & PG Programs • Arts, Science & Commerce
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-white mb-8 tracking-tighter leading-[0.9]"
                        >
                            JCT College of <br />
                            <span className="text-white/80 font-light italic">Arts & Science.</span>
                        </motion.h1>

                        <div className="flex flex-col md:flex-row gap-12 items-end">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-light border-l border-white/20 pl-6"
                            >
                                A place where curiosity meets discipline. We offer undergraduate and postgraduate programs across science, commerce, and the humanities — each built on strong academic foundations.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="flex gap-4 flex-wrap"
                            >
                                <Button
                                    size="lg"
                                    className="h-16 px-10 text-lg bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-accent/20"
                                >
                                    Explore Programs{" "}
                                    <ArrowDownRight className="ml-2 w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-16 px-10 text-lg bg-transparent border-white/30 text-white hover:bg-white/10 font-bold rounded-2xl transition-all"
                                >
                                    Campus Tour
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ STATS BAR ═══ */}
            <section className="relative z-30 -mt-16 pb-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Users, value: "2,500+", label: "Students", desc: "Across UG and PG programs" },
                            { icon: BookOpen, value: "9", label: "Programs", desc: "Undergraduate & postgraduate" },
                            { icon: GraduationCap, value: "60+", label: "Faculty Members", desc: "With doctoral qualifications" },
                            { icon: Trophy, value: "15+", label: "Years", desc: "Established academic record" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-8 border border-stone-100 shadow-sm hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 rounded-2xl group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-500 rounded-l-2xl" />
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-primary/70 group-hover:text-accent transition-colors">
                                        <stat.icon size={28} strokeWidth={1} />
                                    </div>
                                    <span className="text-5xl font-sans font-black text-primary tracking-tight">
                                        {stat.value}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xs text-primary/60 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                                    {stat.label}
                                </h3>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ABOUT ═══ */}
            <section className="py-32 bg-stone-50/50 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-5 relative order-2 lg:order-1 mt-12 lg:mt-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative z-10"
                            >
                                <div className="aspect-[3/4] relative overflow-hidden rounded-3xl bg-stone-200 shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                                        alt="Students in a seminar discussion"
                                        className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                    />
                                </div>
                                <div className="absolute -bottom-8 -right-8 bg-accent p-8 max-w-xs shadow-xl hidden md:block rounded-2xl text-primary">
                                    <p className="font-serif text-lg italic leading-relaxed font-medium">
                                        "The unexamined life is not worth living."
                                    </p>
                                    <span className="block mt-4 text-xs font-bold uppercase tracking-widest opacity-70">
                                        — Socrates
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        <div className="hidden lg:block lg:col-span-1 order-1" />

                        <div className="lg:col-span-6 order-1 lg:order-2 pt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-8">
                                    About the College
                                </h2>
                                <h3 className="text-5xl md:text-6xl font-serif text-primary mb-10 leading-[1.1]">
                                    Think broadly.
                                    <br />
                                    <span className="text-stone-400">Learn deeply.</span>
                                </h3>
                                <div className="space-y-8 text-stone-600 text-xl leading-relaxed font-light max-w-2xl">
                                    <p>
                                        JCT College of Arts and Science was founded with a straightforward idea: that good education doesn't just fill notebooks — it changes how students think. Our programs in science, commerce, and the humanities are designed to develop analytical minds and responsible citizens.
                                    </p>
                                    <p>
                                        We're affiliated with Bharathiar University, Coimbatore, and recognized by the UGC. The campus shares infrastructure with the broader JCT Institutions ecosystem, giving our students access to facilities and opportunities beyond a typical arts and science college.
                                    </p>
                                </div>

                                <div className="mt-12 pt-12 border-t border-stone-200 flex flex-wrap gap-12">
                                    <div>
                                        <span className="block text-5xl font-sans font-black text-primary mb-2">9</span>
                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                            Academic Programs
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-5xl font-sans font-black text-primary mb-2">6</span>
                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                            Departments
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ UG PROGRAMS ═══ */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Undergraduate Programs
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-serif text-primary leading-tight mb-6">
                            Bachelor's <span className="italic text-stone-300 font-light">Degrees</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-lg">
                            Three-year programs that build solid foundations in theory and application, preparing students for careers or further studies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ugPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-stone-50 rounded-2xl text-primary">
                                            <prog.icon size={28} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-bold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                                            {prog.duration}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-xl font-sans font-black text-accent/80 tracking-tighter">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-serif text-primary mb-3">{prog.name}</h4>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed flex-1">
                                        {prog.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-stone-100 mt-6">
                                        <span className="text-xs text-stone-400 font-medium">Full-time • On Campus</span>
                                        <span className="text-xs text-primary font-bold uppercase tracking-wider">
                                            Details →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PG PROGRAMS ═══ */}
            <section className="py-24 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Postgraduate Programs
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                            Master's <span className="italic text-stone-300 font-light">Degrees</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-lg">
                            Two-year programs for deeper specialization, research exposure, and preparation for academic or professional advancement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pgPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-stone-50 rounded-2xl text-primary">
                                            <prog.icon size={28} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-bold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                                            {prog.duration}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-serif text-primary mb-3">{prog.name}</h4>
                                    <p className="text-stone-500 text-sm font-light leading-relaxed flex-1">
                                        {prog.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-stone-100 mt-6">
                                        <span className="text-xs text-stone-400 font-medium">Full-time • On Campus</span>
                                        <span className="text-xs text-primary font-bold uppercase tracking-wider">
                                            Details →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ WHY CHOOSE ═══ */}
            <section className="py-32 bg-primary text-white relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20">
                        <div className="w-full lg:w-1/3 pt-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                                    Why This College
                                </h2>
                                <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                                    An Education That
                                    <br />
                                    <span className="text-white/80 italic font-light">Stays With You.</span>
                                </h3>
                                <p className="text-blue-100/80 text-lg mb-10 leading-relaxed font-light">
                                    We don't claim to be the biggest or the flashiest. What we offer is a thoughtful academic environment where students are treated as individuals — and leave better prepared for whatever comes next.
                                </p>
                            </motion.div>
                        </div>

                        <div className="w-full lg:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {values.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 p-10 rounded-3xl transition-all duration-300 hover:translate-y-[-4px]"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <CheckCircle2 size={24} className="text-accent shrink-0 mt-1" />
                                            <h4 className="text-2xl font-serif text-white">{item.title}</h4>
                                        </div>
                                        <p className="text-blue-200/80 text-sm font-light leading-relaxed pl-10">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FACILITIES ═══ */}
            <section className="py-32 bg-stone-50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 mb-16">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                        Facilities & Campus Life
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                        A Campus That <br />
                        <span className="text-stone-400 italic">Supports Learning</span>
                    </h3>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-12 px-4 md:px-6 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0 pl-[max(1rem,calc((100vw-80rem)/2))]">
                    {facilities.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] snap-center cursor-pointer group"
                        >
                            <div className="aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden relative mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h4 className="text-2xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-stone-500 font-light">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══ ADMISSIONS ═══ */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Admissions
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                            Join <span className="italic text-stone-400 font-light">Our Community</span>
                        </h3>
                        <p className="text-stone-600 text-lg font-light">
                            Admissions are open for undergraduate and postgraduate programs. We follow a transparent, merit-based process aligned with university guidelines.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">Undergraduate Eligibility</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Passed 12th standard (HSC) from a recognized board
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Relevant subject combination for the chosen program
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Minimum aggregate as per Bharathiar University norms
                                </li>
                            </ul>
                        </div>
                        <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">Postgraduate Eligibility</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Relevant bachelor's degree from a recognized university
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Minimum percentage as per university regulations
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Entrance test or interview may apply for select programs
                                </li>
                            </ul>
                        </div>
                        <div className="bg-stone-50 p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">How to Apply</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Fill out the online application form with your details
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Attend the counseling session with original documents
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Confirm enrollment by paying the prescribed fee
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            className="h-16 px-12 text-lg bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
                        >
                            Apply for Admission <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACT ═══ */}
            <section className="py-32 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Get in Touch
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                            Reach <span className="italic text-stone-400 font-light">Out</span>
                        </h3>
                        <p className="text-stone-600 text-lg font-light">
                            Whether it's about programs, fees, campus visits, or anything else — we're here to answer your questions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <ContactCard
                                icon={Phone}
                                title="Call Us"
                                content="+91 98765 43211"
                                subContent="Mon-Sat, 9am - 5pm"
                            />
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                content="artsscience@jct.edu"
                                subContent="Response within one working day"
                            />
                            <ContactCard
                                icon={MapPin}
                                title="Visit Us"
                                content="Knowledge Park, Pichanur"
                                subContent="Coimbatore - 641105, Tamil Nadu"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100"
                            >
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Interested Program
                                        </label>
                                        <select className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-stone-600">
                                            <option>Select a Program</option>
                                            <option>B.Sc Mathematics</option>
                                            <option>B.Sc Computer Science</option>
                                            <option>B.Sc Physics</option>
                                            <option>B.Com</option>
                                            <option>BBA</option>
                                            <option>B.A English Literature</option>
                                            <option>M.Sc Mathematics</option>
                                            <option>M.Sc Computer Science</option>
                                            <option>M.Com</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Message
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none resize-none"
                                            placeholder="Questions about admissions, scholarships, or campus life?"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button className="w-full md:w-auto px-12 py-6 font-bold text-base rounded-2xl bg-accent text-primary hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95">
                                            Send Enquiry <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ContactCard({
    icon: Icon,
    title,
    content,
    subContent,
}: {
    icon: any;
    title: string;
    content: string;
    subContent: string;
}) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-stone-100 flex items-start gap-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-primary shrink-0">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div>
                <h4 className="font-serif font-bold text-primary mb-1 text-lg">{title}</h4>
                <p className="text-stone-600 text-sm mb-1">{content}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{subContent}</p>
            </div>
        </div>
    );
}
