"use client";

import { DragScroll } from "@/components/ui/DragScroll";
import Image from "next/image";
import Link from "next/link";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Cpu,
  Cog,
  Zap,
  Building2,
  Wrench,
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
  {
    name: "Computer Science & Engineering",
    abbr: "CSE",
    slug: "cse",
    icon: Cpu,
    seats: 120,
    highlight: "AI/ML, Software Engineering, Cloud Computing",
  },
  {
    name: "Mechanical Engineering",
    abbr: "MECH",
    slug: "mech",
    icon: Cog,
    seats: 60,
    highlight: "CAD/CAM, Thermal Engineering, Robotics",
  },
  {
    name: "Electrical & Electronics Engineering",
    abbr: "EEE",
    slug: "eee",
    icon: Zap,
    seats: 60,
    highlight: "Power Systems, Control Systems, Embedded Design",
  },
  {
    name: "Electronics & Communication Engineering",
    abbr: "ECE",
    slug: "ece",
    icon: Globe,
    seats: 60,
    highlight: "VLSI Design, Signal Processing, IoT",
  },
  {
    name: "Civil Engineering",
    abbr: "CE",
    slug: "ce",
    icon: Building2,
    seats: 60,
    highlight: "Structural Analysis, Environmental Engineering",
  },
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
  {
    title: "High-Performance Computing Lab",
    desc: "GPU clusters for machine learning, simulation, and computational engineering projects.",
    icon: Cpu,
  },
  {
    title: "Advanced Manufacturing Workshop",
    desc: "CNC machines, 3D printers, welding stations, and a materials testing facility.",
    icon: Wrench,
  },
  {
    title: "Electronics Prototyping Center",
    desc: "PCB fabrication, oscilloscopes, spectrum analyzers, and embedded systems test benches.",
    icon: Zap,
  },
  {
    title: "Research & Innovation Cell",
    desc: "A cross-disciplinary space for faculty-guided research, patent applications, and prototype development.",
    icon: Beaker,
  },
];

/* ─── Placement partners (names) ─── */
const placementPartners = [
  "TCS",
  "Infosys",
  "Wipro",
  "L&T",
  "Bosch",
  "Ashok Leyland",
  "Cognizant",
  "HCL",
  "Zoho",
  "Freshworks",
  "CTS",
  "Hexaware",
  "Sutherland",
  "Mphasis",
  "Capgemini",
  "Tech Mahindra",
];

const testimonials = [
  {
    quote:
      "Our final-year project was reviewed by industry mentors, and that experience changed how I approached problem-solving in real engineering teams.",
    name: "Harish V.",
    role: "Software Engineer at Infosys",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    tag: "Alumini",
  },
  {
    quote:
      "The placement training and mock interviews made a huge difference. I stepped into campus recruitment with confidence and secured my offer early.",
    name: "Keerthana M.",
    role: "Graduate Engineer Trainee at Caterpillar",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    tag: "Student",
  },
  {
    quote:
      "JCT students stand out for practical clarity. They arrive ready for production environments, not just textbook discussions.",
    name: "R. Suresh",
    role: "Senior Manager, Industry Partner",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    tag: "VIP",
  },
  {
    quote:
      "Faculty encouraged us to build beyond syllabus requirements. That project depth helped me during technical interviews and onboarding.",
    name: "Vikram N.",
    role: "Design Engineer at L&T",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop",
    tag: "Alumini",
  },
  {
    quote:
      "The coding and aptitude sessions were consistent and practical. I improved every month and was ready by placement season.",
    name: "Janani P.",
    role: "Final Year ECE Student",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    tag: "Student",
  },
  {
    quote:
      "The graduates we recruit from JCT show strong fundamentals and discipline in execution, especially in quality and documentation workflows.",
    name: "Mohan Raj",
    role: "Plant Operations Lead, Caterpillar",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200&auto=format&fit=crop",
    tag: "VIP",
  },
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
    <main className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO — Full-bleed, impact-driven ═══ */}
      <section
        ref={heroRef}
        className="bg-navy relative flex min-h-[90vh] items-center overflow-hidden md:min-h-screen"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
            alt="Engineering campus"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="from-navy/95 via-navy/80 to-navy/40 absolute inset-0 bg-linear-to-r" />
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 50px, var(--color-engineering) 50px, var(--color-engineering) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, var(--color-engineering) 50px, var(--color-engineering) 51px)",
            }}
          />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 md:px-6 md:pt-40 lg:pt-44">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 md:mb-6"
              >
                <span className="border-engineering-light/30 bg-engineering/20 text-engineering-muted inline-block rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md md:text-xs">
                  JCT College of Engineering & Technology
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl md:leading-none lg:text-7xl"
              >
                Engineer the <br />
                Future <span className="text-engineering-light">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8 max-w-lg text-sm leading-relaxed font-light text-white/80 md:text-base lg:text-lg"
              >
                An autonomous institution affiliated to Anna University. Five
                cutting-edge engineering departments, industry-grade labs, and a
                placement record that speaks for itself.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="bg-engineering hover:bg-engineering-light shadow-engineering/20 h-12 w-full rounded-xl px-8 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto md:h-14"
                >
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-xl border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto md:h-14"
                >
                  View Placements
                </Button>
              </motion.div>
            </div>

            {/* Right side: quick stats grid - Visible on mobile now */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:mt-0"
            >
              {[
                { val: "5", label: "Departments", accent: true },
                { val: "360+", label: "Seats / Year", accent: false },
                { val: "Anna", label: "University", accent: false },
                { val: "92%", label: "Placement Rate", accent: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border p-4 backdrop-blur-md md:p-6 ${s.accent ? "border-engineering-light/30 bg-engineering/20" : "border-white/10 bg-white/5"}`}
                >
                  <span
                    className={`mb-1 block font-sans text-2xl font-black md:mb-2 md:text-4xl ${s.accent ? "text-engineering-muted" : "text-white"}`}
                  >
                    {s.val}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase md:text-xs">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ENGINEERING DOMAINS — Horizontal cards ═══ */}
      <section className="relative bg-white py-16 md:py-24">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-engineering-dark) 0px, var(--color-engineering-dark) 2px, transparent 2px, transparent 10px)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-engineering-light mb-4 text-xs font-bold tracking-[0.2em] uppercase">
                Engineering Domains
              </h2>
              <h3 className="text-navy font-serif text-4xl leading-tight md:text-5xl">
                Five Disciplines,{" "}
                <span className="font-light text-stone-300 italic">
                  One Standard.
                </span>
              </h3>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm font-light">
              4-year B.E. programs approved by AICTE and affiliated to Anna
              University, Chennai. Each department has dedicated labs,
              workshops, and faculty with industry experience.
            </p>
          </div>

          <DragScroll className="-mx-4 flex snap-x snap-mandatory gap-4 scroll-smooth px-4 pb-8 md:mx-0 md:gap-6 md:px-0">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.abbr}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group border-border hover:border-engineering/30 card-hover-lift relative flex min-w-62.5 shrink-0 snap-center flex-col justify-between rounded-2xl border bg-white p-6 md:min-w-72.5 md:p-8"
                draggable={false}
              >
                <Link
                  href={`/institutions/engineering/departments/${dept.slug}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">
                    View {dept.name} department page
                  </span>
                </Link>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-engineering group-hover:bg-engineering bg-engineering-muted shrink-0 rounded-xl p-3 transition-colors group-hover:text-white">
                      <dept.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-navy font-serif text-lg font-bold">
                        {dept.name}
                      </h3>
                      <span className="text-engineering text-xs font-bold tracking-wider uppercase">
                        {dept.abbr}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-light">
                      {dept.highlight}
                    </p>
                  </div>
                </div>

                <div className="border-border mt-6 flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground/60" />
                    <span className="text-muted-foreground text-sm font-bold">
                      {dept.seats} Seats
                    </span>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-engineering/40 group-hover:text-engineering transition-all group-hover:translate-x-1"
                  />
                </div>
              </motion.div>
            ))}
          </DragScroll>
        </div>
      </section>

      {/* ═══ METRICS — Numbers grid ═══ */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-accent mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              By the Numbers
            </h2>
            <h3 className="font-serif text-3xl leading-tight text-white md:text-4xl">
              Performance That{" "}
              <span className="font-light text-white/40 italic">Speaks.</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {metrics.map((m, index) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10"
              >
                <span className="text-accent mb-1 block font-sans text-3xl font-black">
                  {m.value}
                </span>
                <span className="mb-1 block text-sm font-bold text-white">
                  {m.label}
                </span>
                <span className="text-[10px] font-bold tracking-wider text-white/30 uppercase">
                  {m.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH & INNOVATION ═══ */}
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            {/* Left: text content */}
            <div>
              <h2 className="mb-6 text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">
                Research & Innovation
              </h2>
              <h3 className="text-primary mb-8 font-serif text-4xl leading-tight md:text-5xl">
                Where Theory <br />
                <span className="font-light text-stone-300 italic">
                  Meets Application
                </span>
              </h3>
              <p className="mb-8 text-lg leading-relaxed font-light text-stone-600">
                Our faculty actively publish in peer-reviewed journals and guide
                student projects that go beyond coursework. The Research &
                Innovation Cell connects departments and facilitates
                collaboration with industry partners.
              </p>

              <div className="mb-10 space-y-6">
                {[
                  "25+ patents filed by faculty and students across departments",
                  "Annual technical symposium 'TechVista' with 2000+ participants",
                  "MoUs with 15+ companies for joint research and internships",
                  "Funded projects from DST, AICTE, and Tamil Nadu State Council for Science and Technology",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="text-accent mt-1 shrink-0"
                    />
                    <p className="text-sm leading-relaxed font-light text-stone-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-primary rounded-2xl p-6">
                <p className="mb-2 text-sm font-light text-white/60">
                  Student Innovation Challenge
                </p>
                <p className="font-serif text-lg font-bold text-white">
                  140+ student projects showcased in the last 3 editions of the
                  annual innovation expo.
                </p>
              </div>
            </div>

            {/* Right: facility cards */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {facilities.map((fac, index) => (
                <motion.div
                  key={fac.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="hover:border-accent/20 group rounded-2xl border border-stone-100 bg-white p-6 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4">
                    <div className="text-primary group-hover:bg-accent/10 group-hover:text-accent w-fit shrink-0 rounded-xl bg-stone-50 p-3 transition-colors">
                      <fac.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-primary mb-2 font-serif text-lg font-bold">
                        {fac.title}
                      </h3>
                      <p className="text-sm leading-relaxed font-light text-stone-500">
                        {fac.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLACEMENTS — Data-driven showcase ═══ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-6 text-xs font-bold tracking-[0.2em] text-amber-600 uppercase">
              Placements
            </h2>
            <h3 className="text-primary mb-6 font-serif text-4xl leading-tight md:text-5xl">
              From Campus to{" "}
              <span className="font-light text-stone-300 italic">Career.</span>
            </h3>
            <p className="leading-relaxed font-light text-stone-500">
              The Training & Placement Cell works year-round — aptitude
              coaching, mock interviews, resume workshops, and direct industry
              connects. Here&apos;s who hires from us.
            </p>
          </div>

          {/* Placement stats highlight */}
          <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                val: "92%",
                label: "Placed",
                desc: "of eligible graduates secured offers through campus placements in 2023-24.",
              },
              {
                icon: TrendingUp,
                val: "₹4.2 LPA",
                label: "Average CTC",
                desc: "across all departments. Top performers in CSE & ECE received significantly higher packages.",
              },
              {
                icon: Trophy,
                val: "₹8.4 LPA",
                label: "Highest CTC",
                desc: "offered by a leading IT products company to a CSE student with strong DSA skills.",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-stone-100 bg-stone-50 p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <s.icon size={20} className="text-accent" />
                  </div>
                  <span className="text-primary font-sans text-3xl font-black">
                    {s.val}
                  </span>
                </div>
                <h3 className="text-primary mb-2 text-sm font-bold tracking-wider uppercase">
                  {s.label}
                </h3>
                <p className="text-sm leading-relaxed font-light text-stone-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Recruiters marquee */}
          <div className="relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-linear-to-r from-white to-transparent" />
            <div className="absolute top-0 right-0 bottom-0 z-10 w-24 bg-linear-to-l from-white to-transparent" />
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="flex gap-4 whitespace-nowrap"
            >
              {[...placementPartners, ...placementPartners].map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="inline-flex min-w-40 items-center justify-center rounded-xl border border-stone-100 bg-stone-50 px-8 py-4"
                >
                  <span className="text-sm font-bold text-stone-500">
                    {name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <CollegeTestimonials
        title="Testimonials"
        subtitle="Stories from engineering students, alumni, and hiring partners who have experienced JCT's outcome-focused learning."
        accentColor="#D4A024"
        sectionBgClassName="bg-[#F8FAFC]"
        items={testimonials}
      />

      {/* ═══ ADMISSIONS — Strong CTA ═══ */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Left: CTA */}
            <div>
              <h2 className="text-accent mb-6 text-xs font-bold tracking-[0.2em] uppercase">
                Admissions 2025-26
              </h2>
              <h3 className="mb-8 font-serif text-4xl leading-tight text-white md:text-5xl">
                Your Engineering <br />
                Journey Starts <span className="text-accent">Here.</span>
              </h3>
              <p className="mb-10 text-lg leading-relaxed font-light text-white/50">
                Admissions for B.E. programs are through TNEA counseling (Tamil
                Nadu Engineering Admissions). Management quota seats are
                available for eligible candidates.
              </p>

              <div className="mb-10 space-y-4">
                {[
                  {
                    step: "01",
                    text: "Appear for TNEA Counseling with 12th marks",
                  },
                  {
                    step: "02",
                    text: "Select JCT College of Engineering and Technology",
                  },
                  {
                    step: "03",
                    text: "Complete document verification on campus",
                  },
                  { step: "04", text: "Confirm enrollment with fee payment" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <span className="text-accent font-sans text-lg font-black">
                      {s.step}
                    </span>
                    <p className="pt-1 text-sm font-light text-white/70">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-accent text-primary hover:bg-accent/90 shadow-accent/20 h-14 rounded-2xl px-8 font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Apply Through TNEA <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-2xl border-white/20 bg-transparent px-8 font-bold text-white hover:bg-white/10"
                >
                  Management Quota
                </Button>
              </div>
            </div>

            {/* Right: Contact card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10">
              <h3 className="mb-2 font-serif text-2xl text-white">
                Admissions Office
              </h3>
              <p className="mb-8 text-sm text-white/40">
                Reach out for queries about eligibility, scholarships, or campus
                visits.
              </p>

              <div className="mb-10 space-y-5">
                <a
                  href="tel:+919361488801"
                  className="flex items-center gap-4 text-white/70 transition-colors hover:text-white"
                >
                  <div className="rounded-xl bg-white/5 p-3">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">
                      +91 93614 88801
                    </span>
                    <span className="text-xs text-white/40">
                      Mon — Sat, 9 AM — 5 PM
                    </span>
                  </div>
                </a>
                <a
                  href="mailto:engineering@jct.edu"
                  className="flex items-center gap-4 text-white/70 transition-colors hover:text-white"
                >
                  <div className="rounded-xl bg-white/5 p-3">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">
                      engineering@jct.edu
                    </span>
                    <span className="text-xs text-white/40">
                      Typical response within 24 hours
                    </span>
                  </div>
                </a>
                <div className="flex items-start gap-4 text-white/70">
                  <div className="rounded-xl bg-white/5 p-3">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">
                      Knowledge Park, Pichanur
                    </span>
                    <span className="text-xs text-white/40">
                      Coimbatore — 641105, Tamil Nadu
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-accent" />
                  <span className="text-sm font-bold text-white">
                    Approved & Recognized
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-light text-white/40">
                  AICTE Approved • Anna University Affiliated • ISO 9001:2015
                  Certified • NBA Accreditation Applied
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
