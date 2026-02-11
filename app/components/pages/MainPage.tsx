"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { TrustIndicators } from "@/app/components/TrustIndicators";
import { ReverseRoadmap } from "@/app/components/ReverseRoadmap";
import { FloatingCTA } from "@/app/components/FloatingCTA";
import { HomeInstitutions } from "@/app/components/HomeInstitutions";
import Link from "next/link";
import {
    ArrowUpRight,
    ArrowRight,
    GraduationCap,
    Microscope,
    PenTool,
    Users,
    Building2,
    Trophy,
    Globe,
    Heart,
    Target,
    Lightbulb,
    Award,
    Clock,
    FileText,
    CalendarCheck,
    Phone,
    Mail,
    MapPin,
    Send,
} from "lucide-react";



/* ─── Group-level achievements ─── */
const achievements = [
    { icon: Users, value: "12,000+", label: "Alumni Network", desc: "Graduates working across India and 15+ countries" },
    { icon: Building2, value: "3", label: "Institutions", desc: "Engineering, Arts & Science, and Polytechnic" },
    { icon: Trophy, value: "25+", label: "Years of Service", desc: "Continuous operation since 1998" },
    { icon: Globe, value: "500+", label: "Recruiting Partners", desc: "Companies hiring from our campuses" },
];

/* ─── Core values ─── */
const values = [
    { icon: Heart, title: "Character First", desc: "We believe that technical skill without integrity is incomplete. Our programs emphasize ethical responsibility alongside academic excellence." },
    { icon: Target, title: "Outcome-Oriented", desc: "Every program is designed to lead somewhere — whether that's a career, higher education, or entrepreneurship. We track outcomes, not just enrollment." },
    { icon: Lightbulb, title: "Practical Learning", desc: "Labs, workshops, project work, and industry internships are not optional extras. They are central to how we teach across all three colleges." },
    { icon: Award, title: "Institutional Integrity", desc: "Transparent admissions, regular academic audits, and honest communication with students and parents. We earn trust by being straightforward." },
];

/* ─── Institution cards ─── */


export default function MainPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.8]);

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            {/* ═══ HERO — Full-screen editorial statement ═══ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-primary text-white pt-20">
                <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop')",
                        }}
                    />
                    <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-primary" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary" />
                </motion.div>

                <div className="container relative z-20 px-4 md:px-6">
                    <div className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6"
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-sm font-bold tracking-widest uppercase text-white/80">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                Coimbatore, Tamil Nadu — Since 1998
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tighter leading-[0.92]"
                        >
                            Three Colleges. <br />
                            One Commitment to <br />
                            <span className="text-accent italic font-light">Honest Education.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-light mb-8"
                        >
                            JCT Institutions is a group of three colleges in Coimbatore — Engineering, Arts & Science, and Polytechnic — working under a shared belief that education should build competence and character in equal measure.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button size="lg" className="h-14 px-8 text-base bg-accent text-primary hover:bg-accent/90 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-accent/20">
                                Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-transparent border-white/20 text-white hover:bg-white/10 font-bold rounded-xl transition-all">
                                Enquire Now
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-6 bg-linear-to-b from-white/40 to-transparent"
                    />
                </motion.div>
            </section>

            <TrustIndicators />

            {/* ═══ OUR INSTITUTIONS — Alternating horizontal cards ═══ */}
            {/* ═══ OUR INSTITUTIONS — Alternating horizontal cards ═══ */}
            <HomeInstitutions />

            {/* ═══ LEGACY & VALUES — Timeline + values ═══ */}
            <section id="about" className="py-20 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Our Story</h2>
                            <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight">
                                A Quarter Century of <br />
                                <span className="text-stone-400 italic font-light">Steady Growth.</span>
                            </h3>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex items-end"
                        >
                            <p className="text-stone-500 text-base font-light leading-relaxed max-w-lg">
                                JCT Institutions wasn't built in a single stroke. It grew institution by institution, responding to what students and the region actually needed — first engineers, then broadly educated graduates, then skilled technicians.
                            </p>
                        </motion.div>
                    </div>

                    {/* Reverse Roadmap */}
                    <ReverseRoadmap />

                    {/* Values grid */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-2xl mx-auto mb-16"
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Why Choose Us</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                                Principles, Not <span className="italic text-stone-400 font-light">Slogans</span>
                            </h3>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-10 rounded-3xl border border-stone-100 hover:border-accent/20 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-stone-50 rounded-xl text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors shrink-0">
                                            <value.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-serif text-primary mb-3">{value.title}</h4>
                                            <p className="text-stone-500 text-sm font-light leading-relaxed">{value.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ GROUP ACHIEVEMENTS — Numeric impact ═══ */}
            <section className="py-16 bg-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">By the Numbers</h2>
                        <h3 className="text-3xl md:text-4xl font-serif leading-tight">
                            Twenty-Five Years <span className="text-white/60 italic font-light">in Sum</span>
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center p-10 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                            >
                                <stat.icon size={28} className="text-accent mx-auto mb-6" strokeWidth={1.5} />
                                <span className="block text-5xl font-sans font-black text-white tracking-tight mb-3">{stat.value}</span>
                                <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-accent mb-2">{stat.label}</h4>
                                <p className="text-blue-200/60 text-sm font-light">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ADMISSIONS CTA — Guidance section ═══ */}
            <section id="admissions" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Admissions 2026</h2>
                            <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight mb-6">
                                Not Sure Which <br />
                                <span className="text-stone-400 italic font-light">College Is Right for You?</span>
                            </h3>
                            <p className="text-stone-500 text-base font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                                Whether you're coming from 10th, 12th, or completing a diploma — there's a clear pathway for you at JCT. Our admissions team can help you find the right fit based on your background and goals.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
                                    <h4 className="text-xl font-serif text-primary mb-3">{item.title}</h4>
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
                                <h4 className="text-accent font-serif text-2xl font-bold">Admissions Helpline</h4>
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
                            <h4 className="text-primary font-serif text-lg mb-2 font-bold">Email Us</h4>
                            <a href="mailto:admissions@jct.edu" className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-base font-medium">
                                <Mail size={18} className="text-accent" /> admissions@jct.edu
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACT — Visit & form ═══ */}
            <section id="contact" className="py-16 bg-stone-50 border-t border-stone-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Visit Us</h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-8">
                                Come See <span className="text-stone-400 italic font-light">for Yourself.</span>
                            </h3>
                            <p className="text-stone-500 text-lg font-light leading-relaxed mb-10 max-w-md">
                                The best way to understand JCT is to walk through the campus. We welcome prospective students and parents for guided visits throughout the academic year.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin size={20} className="text-accent shrink-0 mt-1" />
                                    <div>
                                        <p className="font-medium text-primary">JCT Institutions</p>
                                        <p className="text-stone-500 text-sm font-light">Knowledge Park, Pichanur, Coimbatore – 641105, Tamil Nadu</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone size={20} className="text-accent shrink-0" />
                                    <a href="tel:+919361488801" className="text-stone-600 text-sm hover:text-primary transition-colors">+91 93614 88801</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail size={20} className="text-accent shrink-0" />
                                    <a href="mailto:info@jct.edu" className="text-stone-600 text-sm hover:text-primary transition-colors">info@jct.edu</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Clock size={20} className="text-accent shrink-0" />
                                    <span className="text-stone-600 text-sm">Mon–Sat: 9:00 AM – 5:00 PM</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100"
                            >
                                <h4 className="font-serif text-xl text-primary mb-6">Schedule a Campus Visit</h4>
                                <form className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Name</label>
                                            <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm" placeholder="Your Name" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Phone</label>
                                            <input type="tel" className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm" placeholder="Phone Number" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Interested In</label>
                                        <select className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm text-stone-600">
                                            <option>Engineering College</option>
                                            <option>Arts & Science College</option>
                                            <option>Polytechnic College</option>
                                            <option>Not sure yet — help me decide</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Message (optional)</label>
                                        <textarea rows={3} className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-sm resize-none" placeholder="Anything else we should know?" />
                                    </div>
                                    <Button className="w-full px-8 py-5 font-bold text-sm rounded-2xl bg-accent text-primary hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95">
                                        Request Visit <Send className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingCTA />
            <Footer />
        </main>
    );
}
