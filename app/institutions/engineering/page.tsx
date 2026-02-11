"use client";

import { DragScroll } from "@/app/components/ui/DragScroll";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
    ArrowRight,
    Cpu,
    Cog,
    Zap,
    Building2,
    Wrench,
    GraduationCap,
    BookOpen,
    Trophy,
    Users,
    Target,
    TrendingUp,
    CheckCircle2,
    Phone,
    Mail,
    MapPin,
    Globe,
    Beaker,
    ShieldCheck,
} from "lucide-react";
import { useRef } from "react";

/* ─── Departments ─── */
const departments = [
    { name: "Computer Science & Engineering", abbr: "CSE", icon: Cpu, seats: 120, highlight: "AI/ML, Software Engineering, Cloud Computing" },
    { name: "Mechanical Engineering", abbr: "MECH", icon: Cog, seats: 60, highlight: "CAD/CAM, Thermal Engineering, Robotics" },
    { name: "Electrical & Electronics Engineering", abbr: "EEE", icon: Zap, seats: 60, highlight: "Power Systems, Control Systems, Embedded Design" },
    { name: "Electronics & Communication Engineering", abbr: "ECE", icon: Globe, seats: 60, highlight: "VLSI Design, Signal Processing, IoT" },
    { name: "Civil Engineering", abbr: "CE", icon: Building2, seats: 60, highlight: "Structural Analysis, Environmental Engineering" },
];

/* ─── Key metrics  ─── */
const metrics = [
    { value: "92%", label: "Placement Rate", sub: "2023-24 Batch" },
    { value: "₹8.4L", label: "Highest Package", sub: "On-campus" },
    { value: "45+", label: "Recruiters", sub: "Annual visits" },
    { value: "500+", label: "Offers Made", sub: "Last 3 years" },
    { value: "100%", label: "Lab Access", sub: "Industry-grade" },
    { value: "25+", label: "Patents Filed", sub: "Faculty & Students" },
];

/* ─── Facilities ─── */
const facilities = [
    { title: "High-Performance Computing Lab", desc: "GPU clusters for machine learning, simulation, and computational engineering projects.", icon: Cpu },
    { title: "Advanced Manufacturing Workshop", desc: "CNC machines, 3D printers, welding stations, and a materials testing facility.", icon: Wrench },
    { title: "Electronics Prototyping Center", desc: "PCB fabrication, oscilloscopes, spectrum analyzers, and embedded systems test benches.", icon: Zap },
    { title: "Research & Innovation Cell", desc: "A cross-disciplinary space for faculty-guided research, patent applications, and prototype development.", icon: Beaker },
];

/* ─── Placement partners (names) ─── */
const placementPartners = [
    "TCS", "Infosys", "Wipro", "L&T", "Bosch", "Ashok Leyland",
    "Cognizant", "HCL", "Zoho", "Freshworks", "CTS", "Hexaware",
    "Sutherland", "Mphasis", "Capgemini", "Tech Mahindra",
];

export default function EngineeringPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden engineering-theme">
            <Navbar />

            {/* ═══ HERO — Full-bleed, impact-driven ═══ */}
            <section ref={heroRef} className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[#0F172A]">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2670&auto=format&fit=crop"
                        alt="Engineering campus"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/40" />
                    {/* Subtle grid pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, #FBBF24 50px, #FBBF24 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, #FBBF24 50px, #FBBF24 51px)' }} />
                </motion.div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-16 md:pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mb-4 md:mb-6"
                            >
                                <span className="inline-block py-1 px-3 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#FBBF24] backdrop-blur-md">
                                    JCT College of Engineering & Technology
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight leading-[1.1] md:leading-none"
                            >
                                Engineer the <br />
                                Future <span className="text-[#FBBF24]">.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-sm md:text-base lg:text-lg text-white/80 font-light leading-relaxed max-w-lg mb-8"
                            >
                                An autonomous institution affiliated to Anna University. Five cutting-edge engineering departments, industry-grade labs, and a placement record that speaks for itself.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.35 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Button size="lg" className="h-12 md:h-14 px-8 bg-[#FBBF24] text-[#0F172A] hover:bg-[#F59E0B] font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FBBF24]/20 w-full sm:w-auto">
                                    Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-12 md:h-14 px-8 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-bold rounded-xl w-full sm:w-auto">
                                    View Placements
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right side: quick stats grid - Visible on mobile now */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="grid grid-cols-2 gap-3 md:gap-4 mt-8 lg:mt-0"
                        >
                            {[
                                { val: "5", label: "Departments", accent: true },
                                { val: "360+", label: "Seats / Year", accent: false },
                                { val: "Anna", label: "University", accent: false },
                                { val: "92%", label: "Placement Rate", accent: true },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className={`p-4 md:p-6 rounded-2xl border backdrop-blur-md ${s.accent ? "bg-[#FBBF24]/15 border-[#FBBF24]/30" : "bg-white/5 border-white/10"}`}
                                >
                                    <span className={`block text-2xl md:text-4xl font-sans font-black mb-1 md:mb-2 ${s.accent ? "text-[#FBBF24]" : "text-white"}`}>{s.val}</span>
                                    <span className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-wider">{s.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ ENGINEERING DOMAINS — Horizontal cards ═══ */}
            <section className="py-20 bg-white relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0F172A 0px, #0F172A 2px, transparent 2px, transparent 10px)' }} />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#FBBF24] mb-4">Engineering Domains</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                                Five Disciplines, <span className="text-stone-300 italic font-light">One Standard.</span>
                            </h3>
                        </div>
                        <p className="text-stone-500 font-light max-w-sm text-sm">
                            4-year B.E. programs approved by AICTE and affiliated to Anna University, Chennai. Each department has dedicated labs, workshops, and faculty with industry experience.
                        </p>
                    </div>

                    <DragScroll className="flex gap-4 md:gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth">
                        {departments.map((dept, index) => (
                            <motion.div
                                key={dept.abbr}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                className="group bg-white border border-stone-100 rounded-2xl p-6 md:p-8 hover:border-accent/20 hover:shadow-lg transition-all duration-300 min-w-[250px] md:min-w-[290px] snap-center shrink-0 flex flex-col justify-between"
                                draggable={false}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0">
                                            <dept.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif text-primary font-bold">{dept.name}</h4>
                                            <span className="text-xs font-bold text-accent uppercase tracking-wider">{dept.abbr}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-stone-500 text-sm font-light">{dept.highlight}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-stone-100">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-stone-300" />
                                        <span className="text-sm text-stone-400 font-bold">{dept.seats} Seats</span>
                                    </div>
                                    <ArrowRight size={18} className="text-stone-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </DragScroll>
                </div>
            </section>

            {/* ═══ METRICS — Numbers grid ═══ */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">By the Numbers</h2>
                        <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                            Performance That <span className="text-white/40 italic font-light">Speaks.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {metrics.map((m, index) => (
                            <motion.div
                                key={m.label}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.06 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
                            >
                                <span className="block text-3xl font-sans font-black text-accent mb-1">{m.value}</span>
                                <span className="block text-sm text-white font-bold mb-1">{m.label}</span>
                                <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">{m.sub}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ RESEARCH & INNOVATION ═══ */}
            <section className="py-20 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Left: text content */}
                        <div>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Research & Innovation</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-8">
                                Where Theory <br />
                                <span className="text-stone-300 italic font-light">Meets Application</span>
                            </h3>
                            <p className="text-stone-600 text-lg font-light leading-relaxed mb-8">
                                Our faculty actively publish in peer-reviewed journals and guide student projects that go beyond coursework. The Research & Innovation Cell connects departments and facilitates collaboration with industry partners.
                            </p>

                            <div className="space-y-6 mb-10">
                                {[
                                    "25+ patents filed by faculty and students across departments",
                                    "Annual technical symposium 'TechVista' with 2000+ participants",
                                    "MoUs with 15+ companies for joint research and internships",
                                    "Funded projects from DST, AICTE, and Tamil Nadu State Council for Science and Technology",
                                ].map((item) => (
                                    <div key={item} className="flex gap-3 items-start">
                                        <CheckCircle2 size={16} className="text-accent mt-1 shrink-0" />
                                        <p className="text-stone-600 text-sm font-light leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-primary rounded-2xl">
                                <p className="text-white/60 text-sm font-light mb-2">Student Innovation Challenge</p>
                                <p className="text-white text-lg font-serif font-bold">
                                    140+ student projects showcased in the last 3 editions of the annual innovation expo.
                                </p>
                            </div>
                        </div>

                        {/* Right: facility cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {facilities.map((fac, index) => (
                                <motion.div
                                    key={fac.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-accent/20 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0 w-fit">
                                            <fac.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif text-primary font-bold mb-2">{fac.title}</h4>
                                            <p className="text-stone-500 text-sm font-light leading-relaxed">{fac.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PLACEMENTS — Data-driven showcase ═══ */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Placements</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                            From Campus to <span className="text-stone-300 italic font-light">Career.</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed">
                            The Training & Placement Cell works year-round — aptitude coaching, mock interviews, resume workshops, and direct industry connects. Here's who hires from us.
                        </p>
                    </div>

                    {/* Placement stats highlight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                        {[
                            { icon: Target, val: "92%", label: "Placed", desc: "of eligible graduates secured offers through campus placements in 2023-24." },
                            { icon: TrendingUp, val: "₹4.2 LPA", label: "Average CTC", desc: "across all departments. Top performers in CSE & ECE received significantly higher packages." },
                            { icon: Trophy, val: "₹8.4 LPA", label: "Highest CTC", desc: "offered by a leading IT products company to a CSE student with strong DSA skills." },
                        ].map((s) => (
                            <div key={s.label} className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-accent/10 rounded-lg">
                                        <s.icon size={20} className="text-accent" />
                                    </div>
                                    <span className="text-3xl font-sans font-black text-primary">{s.val}</span>
                                </div>
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{s.label}</h4>
                                <p className="text-stone-500 text-sm font-light leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recruiters marquee */}
                    <div className="overflow-hidden relative">
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10" />
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="flex gap-4 whitespace-nowrap"
                        >
                            {[...placementPartners, ...placementPartners].map((name, i) => (
                                <div
                                    key={`${name}-${i}`}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-stone-50 border border-stone-100 rounded-xl min-w-40"
                                >
                                    <span className="text-sm font-bold text-stone-400">{name}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ ADMISSIONS — Strong CTA ═══ */}
            <section className="py-24 bg-primary">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Left: CTA */}
                        <div>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Admissions 2025-26</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
                                Your Engineering <br />
                                Journey Starts <span className="text-accent">Here.</span>
                            </h3>
                            <p className="text-white/50 text-lg font-light leading-relaxed mb-10">
                                Admissions for B.E. programs are through TNEA counseling (Tamil Nadu Engineering Admissions). Management quota seats are available for eligible candidates.
                            </p>

                            <div className="space-y-4 mb-10">
                                {[
                                    { step: "01", text: "Appear for TNEA Counseling with 12th marks" },
                                    { step: "02", text: "Select JCT College of Engineering and Technology" },
                                    { step: "03", text: "Complete document verification on campus" },
                                    { step: "04", text: "Confirm enrollment with fee payment" },
                                ].map((s) => (
                                    <div key={s.step} className="flex gap-4 items-start">
                                        <span className="text-accent font-sans font-black text-lg">{s.step}</span>
                                        <p className="text-white/70 font-light text-sm pt-1">{s.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="h-14 px-8 bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                                    Apply Through TNEA <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-8 border-white/20 bg-transparent text-white hover:bg-white/10 font-bold rounded-2xl">
                                    Management Quota
                                </Button>
                            </div>
                        </div>

                        {/* Right: Contact card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-10">
                            <h4 className="font-serif text-2xl text-white mb-2">Admissions Office</h4>
                            <p className="text-white/40 text-sm mb-8">Reach out for queries about eligibility, scholarships, or campus visits.</p>

                            <div className="space-y-5 mb-10">
                                <a href="tel:+919361488801" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                                    <div className="p-3 bg-white/5 rounded-xl"><Phone size={18} className="text-accent" /></div>
                                    <div>
                                        <span className="block text-sm font-bold text-white">+91 93614 88801</span>
                                        <span className="text-xs text-white/40">Mon — Sat, 9 AM — 5 PM</span>
                                    </div>
                                </a>
                                <a href="mailto:engineering@jct.edu" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                                    <div className="p-3 bg-white/5 rounded-xl"><Mail size={18} className="text-accent" /></div>
                                    <div>
                                        <span className="block text-sm font-bold text-white">engineering@jct.edu</span>
                                        <span className="text-xs text-white/40">Typical response within 24 hours</span>
                                    </div>
                                </a>
                                <div className="flex items-start gap-4 text-white/70">
                                    <div className="p-3 bg-white/5 rounded-xl"><MapPin size={18} className="text-accent" /></div>
                                    <div>
                                        <span className="block text-sm font-bold text-white">Knowledge Park, Pichanur</span>
                                        <span className="text-xs text-white/40">Coimbatore — 641105, Tamil Nadu</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <ShieldCheck size={18} className="text-accent" />
                                    <span className="text-sm text-white font-bold">Approved & Recognized</span>
                                </div>
                                <p className="text-xs text-white/40 font-light leading-relaxed">
                                    AICTE Approved • Anna University Affiliated • ISO 9001:2015 Certified • NBA Accreditation Applied
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
