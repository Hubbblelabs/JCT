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
    ArrowUpRight,
    Cpu,
    Zap,
    HardHat,
    FlaskConical,
    ShieldCheck,
    BrainCircuit,
    Waves,
    CheckCircle2,
    MapPin,
    Phone,
    Mail,
    Users,
    BookOpen,
    Building2,
    Trophy,
    TrendingUp,
} from "lucide-react";

/* ─── Departments ─── */
const departments = [
    {
        name: "Computer Science & Engineering",
        degree: "B.E. / M.E.",
        icon: Cpu,
        image:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80",
        description:
            "Software engineering, cloud computing, full-stack development, and systems design with project work every semester.",
    },
    {
        name: "Electronics & Communication Engineering",
        degree: "B.E. / M.E.",
        icon: Waves,
        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        description:
            "Signal processing, VLSI design, embedded systems, and wireless communications with strong lab infrastructure.",
    },
    {
        name: "Civil Engineering",
        degree: "B.E.",
        icon: HardHat,
        image:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
        description:
            "Structural analysis, geotechnical engineering, transportation planning, and sustainable construction methods.",
    },
    {
        name: "Petrochemical Engineering",
        degree: "B.E.",
        icon: FlaskConical,
        image:
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
        description:
            "Refinery operations, polymer technology, process optimization, and energy systems — one of the few programs of its kind in the region.",
    },
    {
        name: "Artificial Intelligence & Data Science",
        degree: "B.E.",
        icon: BrainCircuit,
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
        description:
            "Machine learning, deep neural networks, data engineering, and applied analytics with Python and cloud platforms.",
    },
    {
        name: "Cyber Security",
        degree: "B.E.",
        icon: ShieldCheck,
        image:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
        description:
            "Network defense, ethical hacking, digital forensics, and security architecture for enterprise and government systems.",
    },
];

/* ─── Why Choose ─── */
const values = [
    {
        title: "Strong Placement Record",
        desc: "Consistent campus recruitment by IT, core engineering, and consulting firms. Our training and placement cell works year-round.",
    },
    {
        title: "Research-Oriented Faculty",
        desc: "Many faculty members hold PhDs and actively publish. Students get exposure to ongoing research projects from their third year.",
    },
    {
        title: "Industry Partnerships",
        desc: "MoUs with companies for internships, guest lectures, and joint projects keep the curriculum connected to real industry needs.",
    },
    {
        title: "Modern Lab Infrastructure",
        desc: "Dedicated labs for each department — from networking and IoT labs to materials testing and chemical process simulation.",
    },
    {
        title: "Lateral Entry from Polytechnic",
        desc: "Diploma holders from JCT Polytechnic and other institutions can enter directly into the second year of B.E. programs.",
    },
];

/* ─── Facilities ─── */
const facilities = [
    {
        title: "Advanced Computing Labs",
        desc: "High-performance workstations, GPU clusters, and dedicated servers for project work and research.",
        image:
            "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Engineering Workshops",
        desc: "Machine shops, welding units, and fabrication areas where students build working prototypes.",
        image:
            "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Central Library",
        desc: "Digital journal access, technical reference collections, and reading halls open late during exam periods.",
        image:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1500&auto=format&fit=crop&q=80",
    },
    {
        title: "Innovation & Incubation Centre",
        desc: "A space for student startups, hackathon teams, and capstone project groups to work independently.",
        image:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1500&auto=format&fit=crop&q=80",
    },
];

/* ─── Placement companies ─── */
const companies = [
    "Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro",
    "Accenture", "IBM", "Zoho", "Cognizant", "HCL", "Capgemini",
    "L&T", "Cisco", "Oracle", "Deloitte",
];

export default function EngineeringPage() {
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
                                "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2686&auto=format&fit=crop')",
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
                                B.E. / B.Tech / M.E. Programs
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-white mb-8 tracking-tighter leading-[0.9]"
                        >
                            JCT College of <br />
                            <span className="text-white/80 font-light italic">Engineering & Technology.</span>
                        </motion.h1>

                        <div className="flex flex-col md:flex-row gap-12 items-end">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-light border-l border-white/20 pl-6"
                            >
                                Technical depth, research exposure, and placement-ready graduates — across six engineering disciplines with strong industry connections.
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
                                    Explore Departments{" "}
                                    <ArrowDownRight className="ml-2 w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-16 px-10 text-lg bg-transparent border-white/30 text-white hover:bg-white/10 font-bold rounded-2xl transition-all"
                                >
                                    Contact Admissions
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
                            { icon: Users, value: "3,000+", label: "Students", desc: "Across UG and PG engineering" },
                            { icon: BookOpen, value: "6", label: "Departments", desc: "Including AI & Cyber Security" },
                            { icon: Building2, value: "96%", label: "Placement Rate", desc: "Consistent year-on-year record" },
                            { icon: Trophy, value: "25+", label: "Years", desc: "of engineering education" },
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
                                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop"
                                        alt="Engineering students collaborating on a project"
                                        className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                    />
                                </div>
                                <div className="absolute -bottom-8 -right-8 bg-accent p-8 max-w-xs shadow-xl hidden md:block rounded-2xl text-primary">
                                    <p className="font-serif text-lg italic leading-relaxed font-medium">
                                        "The engineer has been, and is, a maker of history."
                                    </p>
                                    <span className="block mt-4 text-xs font-bold uppercase tracking-widest opacity-70">
                                        — James Kip Finch
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
                                    Rigorous training.
                                    <br />
                                    <span className="text-stone-400">Measured outcomes.</span>
                                </h3>
                                <div className="space-y-8 text-stone-600 text-xl leading-relaxed font-light max-w-2xl">
                                    <p>
                                        JCT College of Engineering and Technology is the flagship institution of JCT Group. For over two decades, it has trained engineers who go on to work in core industries, technology companies, and research organizations — both in India and abroad.
                                    </p>
                                    <p>
                                        The college is approved by AICTE, affiliated with Anna University, and offers undergraduate and postgraduate programs across six departments. The focus has always been on solid fundamentals, consistent lab work, and exposure to real-world problem-solving.
                                    </p>
                                </div>

                                <div className="mt-12 pt-12 border-t border-stone-200 flex flex-wrap gap-12">
                                    <div>
                                        <span className="block text-5xl font-sans font-black text-primary mb-2">6</span>
                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                            Engineering Departments
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-5xl font-sans font-black text-primary mb-2">12k+</span>
                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                            Alumni Worldwide
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ DEPARTMENTS ═══ */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Departments
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-serif text-primary leading-tight mb-6">
                            Engineering <span className="italic text-stone-300 font-light">Disciplines</span>
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-lg">
                            Six departments, each with dedicated labs, faculty, and industry tie-ups. Programs range from traditional core branches to emerging fields.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, index) => (
                            <motion.div
                                key={dept.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="group block h-full">
                                    <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <img
                                                src={dept.image}
                                                alt={dept.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-all shadow-lg">
                                                    <ArrowUpRight size={20} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <span className="text-xl font-sans font-black text-accent/80 tracking-tighter">
                                                    0{index + 1}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-serif text-primary mb-3 group-hover:text-accent transition-colors">
                                                {dept.name}
                                            </h4>
                                            <p className="text-stone-500 text-sm font-light leading-relaxed mb-4 flex-1">
                                                {dept.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                                <span className="text-xs text-primary/70 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                                                    {dept.degree}
                                                </span>
                                                <span className="text-xs text-primary font-bold uppercase tracking-wider group-hover:text-accent transition-colors">
                                                    Learn More →
                                                </span>
                                            </div>
                                        </div>
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
                                    Why JCT Engineering
                                </h2>
                                <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                                    Built for
                                    <br />
                                    <span className="text-white/80 italic font-light">Engineering Careers.</span>
                                </h3>
                                <p className="text-blue-100/80 text-lg mb-10 leading-relaxed font-light">
                                    This isn't about flashy promises. Our track record speaks through placement numbers, alumni careers, and the quality of work our students produce in their final-year projects and internships.
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
                        Facilities & Infrastructure
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                        Built to <br />
                        <span className="text-stone-400 italic">Support Engineers</span>
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

            {/* ═══ PLACEMENTS ═══ */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-16 mb-20">
                        <div className="lg:w-1/3">
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">
                                Placements
                            </h2>
                            <h3 className="text-3xl md:text-4xl font-serif text-primary mb-6 leading-tight">
                                Where Our <span className="italic text-gray-400 font-light">Graduates Go</span>
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                Our placement cell connects students with recruiters from IT, core engineering, consulting, and product companies. Training programs run throughout the pre-final and final years.
                            </p>
                            <button className="text-primary font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all group">
                                Download Placement Report{" "}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start pt-4">
                            {[
                                {
                                    value: "96%",
                                    label: "Placement Rate",
                                    description: "Consistent performance across all departments.",
                                    icon: TrendingUp,
                                },
                                {
                                    value: "42 LPA",
                                    label: "Highest Package",
                                    description: "Secured by a CSE student at a major tech firm.",
                                    icon: Building2,
                                },
                                {
                                    value: "500+",
                                    label: "Recruiting Companies",
                                    description: "IT, core, consulting, and startup ecosystem.",
                                    icon: Users,
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="p-6 bg-gray-50 rounded-sm border border-gray-100 hover:border-gray-200 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight">
                                            {stat.value}
                                        </div>
                                        <stat.icon className="text-gray-300" size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                                        {stat.label}
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-light">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Marquee */}
                    <div className="relative border-y border-gray-100 py-12 bg-gray-50/30">
                        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />

                        <div className="flex overflow-hidden group">
                            <motion.div
                                className="flex gap-20 items-center whitespace-nowrap"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                            >
                                {[...companies, ...companies].map((company, idx) => (
                                    <span
                                        key={idx}
                                        className="text-2xl md:text-3xl font-serif font-bold text-gray-300 group-hover:text-gray-400 transition-colors cursor-default select-none"
                                    >
                                        {company}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ ADMISSIONS ═══ */}
            <section className="py-32 bg-stone-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Admissions
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                            Join the <span className="italic text-stone-400 font-light">Next Batch</span>
                        </h3>
                        <p className="text-stone-600 text-lg font-light">
                            Admissions to engineering programs follow the Anna University and TNEA counseling process. Management and NRI quota seats are also available.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">B.E. / B.Tech Eligibility</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Passed 12th standard with Physics, Chemistry, and Mathematics
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Minimum aggregate as prescribed by Anna University
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Lateral entry available for diploma holders (direct to 2nd year)
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">M.E. Eligibility</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    B.E. / B.Tech degree in a relevant discipline
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Valid TANCET or GATE score
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Specializations available in CSE and ECE
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border border-stone-100">
                            <h4 className="text-xl font-serif text-primary mb-4">Admission Process</h4>
                            <ul className="space-y-3 text-stone-600 text-sm font-light">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Apply through TNEA single-window counseling
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Management quota: apply directly with 12th mark statement
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    Complete document verification and fee payment to confirm
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
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">
                            Get in Touch
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                            Contact <span className="italic text-stone-400 font-light">& Location</span>
                        </h3>
                        <p className="text-stone-600 text-lg font-light">
                            For admissions queries, campus visits, or placement-related information — our team is available during working hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <ContactCard
                                icon={Phone}
                                title="Call Us"
                                content="+91 98765 43210"
                                subContent="Mon-Sat, 9am - 5pm"
                            />
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                content="engineering@jct.edu"
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
                                className="bg-stone-50 p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100"
                            >
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-5 py-4 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Department of Interest
                                        </label>
                                        <select className="w-full px-5 py-4 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-stone-600">
                                            <option>Select a Department</option>
                                            <option>Computer Science & Engineering</option>
                                            <option>Electronics & Communication Engineering</option>
                                            <option>Civil Engineering</option>
                                            <option>Petrochemical Engineering</option>
                                            <option>Artificial Intelligence & Data Science</option>
                                            <option>Cyber Security</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Message
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-5 py-4 rounded-xl bg-white border border-stone-200 focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none resize-none"
                                            placeholder="Questions about admissions, placements, or campus facilities?"
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
        <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 flex items-start gap-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shrink-0">
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
