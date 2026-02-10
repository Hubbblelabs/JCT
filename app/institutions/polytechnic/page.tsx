"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import {
    ArrowRight,
    ArrowUpRight,
    Wrench,
    Cpu,
    HardHat,
    Zap,
    Cog,
    FlaskConical,
    CheckCircle2,
    Phone,
    Mail,
    Hammer,
    Target,
    GraduationCap,
    Factory,
    Briefcase,
} from "lucide-react";

/* ─── Programs ─── */
const diplomaPrograms = [
    {
        name: "Mechanical Engineering",
        duration: "3 Years",
        icon: Cog,
        outcomes: ["CNC machine operation", "AutoCAD & SolidWorks", "Workshop supervision", "Quality control"],
        career: "Manufacturing, Maintenance, Tool Design",
    },
    {
        name: "Electrical & Electronics",
        duration: "3 Years",
        icon: Zap,
        outcomes: ["Power system basics", "PLC programming", "Motor winding & testing", "Industrial wiring"],
        career: "Power plants, TNEB, Electrical contracting",
    },
    {
        name: "Civil Engineering",
        duration: "3 Years",
        icon: HardHat,
        outcomes: ["Site surveying", "AutoCAD drafting", "Estimation & costing", "Concrete technology"],
        career: "Construction firms, PWD, Real estate",
    },
    {
        name: "Computer Engineering",
        duration: "3 Years",
        icon: Cpu,
        outcomes: ["Web development", "Database management", "Networking basics", "Python programming"],
        career: "IT support, Software testing, Web development",
    },
    {
        name: "Electronics & Communication",
        duration: "3 Years",
        icon: FlaskConical,
        outcomes: ["PCB design", "Microcontroller programming", "Embedded systems", "Telecom basics"],
        career: "Telecom companies, Electronics manufacturing",
    },
    {
        name: "Automobile Engineering",
        duration: "3 Years",
        icon: Wrench,
        outcomes: ["Engine overhauling", "Vehicle diagnostics", "Chassis design", "EV fundamentals"],
        career: "Auto service centres, OEMs, Transport sector",
    },
];

/* ─── Advantages ─── */
const advantages = [
    { icon: Hammer, title: "Workshop Hours from Semester One", desc: "You don't wait two years to touch a machine. Practical sessions begin in the very first semester — welding, fitting, carpentry, and beyond." },
    { icon: Factory, title: "Industry-Reviewed Curriculum", desc: "Our course content is periodically reviewed with input from local industries and alumni now working in technical roles." },
    { icon: Target, title: "Affordable, Focused Education", desc: "A three-year diploma costs a fraction of a four-year degree. For students who want to start working sooner, this is the most direct path." },
    { icon: GraduationCap, title: "Clear Path to a Degree", desc: "Every diploma graduate can apply for lateral entry into the second year of B.E. programs — at JCT Engineering or any AICTE-approved college." },
];

/* ─── Facilities ─── */
const facilities = [
    {
        title: "Mechanical Workshop",
        desc: "Lathes, milling machines, welding stations, and a dedicated fitting shop where students learn by building actual components.",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Electrical Lab",
        desc: "Transformers, motor test benches, and PLC trainers. Students wire real circuits and troubleshoot faults as part of their coursework.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Computer Lab",
        desc: "Networked workstations with CAD software, programming environments, and simulation tools updated each academic year.",
        image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Library & Study Hall",
        desc: "Technical reference books, periodicals, past question papers, and a quiet reading area that stays open until evening.",
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1500&auto=format&fit=crop&q=80",
    },
];

export default function PolytechnicPage() {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* ═══ HERO — Split layout (text left + stats right) ═══ */}
            <section className="relative min-h-[85vh] bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-32">
                        {/* Left — Text */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8"
                            >
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-sm font-bold tracking-widest uppercase text-accent">
                                    <Wrench size={14} />
                                    Diploma Programs — AICTE Approved
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 tracking-tighter leading-[0.9]"
                            >
                                Learn a Trade. <br />
                                <span className="text-white/70 font-light italic">Build a Career.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.25 }}
                                className="text-lg text-white/60 max-w-lg leading-relaxed font-light mb-10"
                            >
                                JCT Polytechnic College offers three-year diploma programs where students spend as much time in workshops as they do in classrooms. The goal is simple: graduate with skills that employers actually need.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Button size="lg" className="h-14 px-8 bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                                    View Programs <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-8 bg-transparent border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl">
                                    Download Brochure
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right — Key facts panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { value: "1,200+", label: "Students Enrolled", sub: "Across 6 streams" },
                                { value: "6", label: "Diploma Programs", sub: "AICTE-approved" },
                                { value: "85%", label: "Placement Rate", sub: "Within 6 months" },
                                { value: "3 Yrs", label: "Program Duration", sub: "10th standard entry" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                    <span className="block text-3xl md:text-4xl font-sans font-black text-accent tracking-tight mb-2">{stat.value}</span>
                                    <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-1">{stat.label}</h4>
                                    <p className="text-xs text-white/40 font-light">{stat.sub}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ PROGRAMS — Skill & outcome blocks ═══ */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Programs Offered</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">
                            Six Streams. <span className="text-stone-300 italic font-light">Clear Outcomes.</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-lg">
                            Each diploma program is structured around what you'll actually be able to do when you finish — not just what you'll know in theory.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {diplomaPrograms.map((prog, index) => (
                            <motion.div
                                key={prog.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="bg-stone-50 rounded-2xl p-8 border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white text-primary border border-stone-100 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                            <prog.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif text-primary font-bold leading-tight">{prog.name}</h4>
                                            <span className="text-xs text-stone-400">{prog.duration} — Full Time</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent mb-3 block">What You'll Learn</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {prog.outcomes.map((outcome) => (
                                            <div key={outcome} className="flex items-center gap-2 text-sm text-stone-600 font-light">
                                                <CheckCircle2 size={13} className="text-accent shrink-0" />
                                                {outcome}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-stone-200">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Career Paths</span>
                                    <p className="text-sm text-primary font-medium mt-1">{prog.career}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ WHY POLYTECHNIC — Advantages ═══ */}
            <section className="py-28 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Why JCT Polytechnic</h2>
                                <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-8">
                                    A Practical Start <br />
                                    <span className="text-stone-400 italic font-light">to Working Life.</span>
                                </h3>
                                <p className="text-stone-500 text-lg font-light leading-relaxed mb-8">
                                    Not every good career begins with a four-year degree. Our diploma programs offer focused, affordable, workshop-driven training — and a clear path forward, whether you join the workforce or continue studying.
                                </p>

                                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-200 hidden lg:block">
                                    <img
                                        src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1500&auto=format&fit=crop&q=80"
                                        alt="Students in the polytechnic workshop"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            {advantages.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl border border-stone-100 hover:border-accent/20 transition-all duration-300 group flex gap-5"
                                >
                                    <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0 h-fit">
                                        <item.icon size={22} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif text-primary mb-2 font-bold">{item.title}</h4>
                                        <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FACILITIES — Bento grid ═══ */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Facilities</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                            Where Training <span className="italic text-stone-300 font-light">Happens</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {facilities.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`group rounded-3xl overflow-hidden relative ${index === 0 ? 'md:row-span-2' : ''}`}
                            >
                                <div className={`${index === 0 ? 'aspect-auto h-full min-h-100' : 'aspect-16/10'} relative`}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h4 className="text-2xl font-serif text-white mb-2">{item.title}</h4>
                                        <p className="text-white/70 text-sm font-light leading-relaxed max-w-md">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PATHWAY — After diploma ═══ */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">After Your Diploma</h2>
                            <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-10">
                                Two Clear Roads <span className="text-white/60 italic font-light">Forward</span>
                            </h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/5 border border-white/10 p-10 rounded-3xl text-left"
                            >
                                <Briefcase size={28} className="text-accent mb-6" />
                                <h4 className="text-2xl font-serif text-white mb-4">Start Working</h4>
                                <p className="text-blue-200/70 font-light leading-relaxed text-sm mb-6">
                                    Diploma holders are eligible for technical positions in manufacturing, construction, IT support, government departments, and more. Many of our graduates are placed through campus recruitment itself.
                                </p>
                                <span className="text-accent text-sm font-bold">85% placed within 6 months</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white/5 border border-white/10 p-10 rounded-3xl text-left"
                            >
                                <GraduationCap size={28} className="text-accent mb-6" />
                                <h4 className="text-2xl font-serif text-white mb-4">Continue to B.E.</h4>
                                <p className="text-blue-200/70 font-light leading-relaxed text-sm mb-6">
                                    Through lateral entry, you can join the second year of B.E./B.Tech programs at JCT College of Engineering and Technology or any Anna University-affiliated college. Skip a year, save a year.
                                </p>
                                <Link href="/institutions/engineering" className="text-accent text-sm font-bold inline-flex items-center gap-1 hover:underline">
                                    View Engineering Programs <ArrowUpRight size={14} />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ ADMISSIONS — Steps + contact form ═══ */}
            <section className="py-28 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Admissions</h2>
                                <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-8">
                                    Simple Entry. <br />
                                    <span className="text-stone-400 italic font-light">Clear Requirements.</span>
                                </h3>

                                <div className="space-y-8 mb-10">
                                    {[
                                        { step: "01", title: "Eligibility", desc: "Passed 10th standard (SSLC) with Mathematics and Science from any recognized board." },
                                        { step: "02", title: "Apply", desc: "Through DOTE counseling or directly for management-quota seats. ITI holders eligible for lateral entry." },
                                        { step: "03", title: "Confirm", desc: "Attend document verification with originals and pay the prescribed fee to secure your seat." },
                                    ].map((item) => (
                                        <div key={item.step} className="flex gap-5">
                                            <span className="text-3xl font-sans font-black text-accent/30">{item.step}</span>
                                            <div>
                                                <h4 className="font-serif text-lg text-primary font-bold mb-1">{item.title}</h4>
                                                <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button size="lg" className="h-14 px-10 bg-accent text-primary hover:bg-accent/90 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                                    Apply for Admission <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-stone-50 p-8 md:p-10 rounded-3xl border border-stone-100"
                        >
                            <h4 className="font-serif text-xl text-primary mb-2">Have Questions?</h4>
                            <p className="text-stone-400 text-sm font-light mb-6">Our admissions office responds within one working day.</p>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm" placeholder="Your Name" />
                                    <input type="tel" className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm" placeholder="Phone Number" />
                                </div>
                                <select className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm text-stone-600">
                                    <option>Select a Diploma Program</option>
                                    <option>Mechanical Engineering</option>
                                    <option>Electrical & Electronics</option>
                                    <option>Civil Engineering</option>
                                    <option>Computer Engineering</option>
                                    <option>Electronics & Communication</option>
                                    <option>Automobile Engineering</option>
                                </select>
                                <textarea rows={3} className="w-full px-4 py-3.5 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm resize-none" placeholder="Any questions?" />
                                <Button className="w-full px-8 py-5 font-bold text-sm rounded-2xl bg-accent text-primary hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
                                    Send Enquiry <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-4 text-sm">
                                <a href="tel:+919876543210" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors">
                                    <Phone size={14} className="text-accent" /> +91 98765 43210
                                </a>
                                <a href="mailto:polytechnic@jct.edu" className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors">
                                    <Mail size={14} className="text-accent" /> polytechnic@jct.edu
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
