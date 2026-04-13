"use client";

import { DragScroll } from "@/components/ui/DragScroll";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    outcomes: [
      "CNC machine operation",
      "AutoCAD & SolidWorks",
      "Workshop supervision",
      "Quality control",
    ],
    career: "Manufacturing, Maintenance, Tool Design",
  },
  {
    name: "Electrical & Electronics",
    duration: "3 Years",
    icon: Zap,
    outcomes: [
      "Power system basics",
      "PLC programming",
      "Motor winding & testing",
      "Industrial wiring",
    ],
    career: "Power plants, TNEB, Electrical contracting",
  },
  {
    name: "Civil Engineering",
    duration: "3 Years",
    icon: HardHat,
    outcomes: [
      "Site surveying",
      "AutoCAD drafting",
      "Estimation & costing",
      "Concrete technology",
    ],
    career: "Construction firms, PWD, Real estate",
  },
  {
    name: "Computer Engineering",
    duration: "3 Years",
    icon: Cpu,
    outcomes: [
      "Web development",
      "Database management",
      "Networking basics",
      "Python programming",
    ],
    career: "IT support, Software testing, Web development",
  },
  {
    name: "Electronics & Communication",
    duration: "3 Years",
    icon: FlaskConical,
    outcomes: [
      "PCB design",
      "Microcontroller programming",
      "Embedded systems",
      "Telecom basics",
    ],
    career: "Telecom companies, Electronics manufacturing",
  },
  {
    name: "Automobile Engineering",
    duration: "3 Years",
    icon: Wrench,
    outcomes: [
      "Engine overhauling",
      "Vehicle diagnostics",
      "Chassis design",
      "EV fundamentals",
    ],
    career: "Auto service centres, OEMs, Transport sector",
  },
];

/* ─── Advantages ─── */
const advantages = [
  {
    icon: Hammer,
    title: "Workshop Hours from Semester One",
    desc: "You don't wait two years to touch a machine. Practical sessions begin in the very first semester — welding, fitting, carpentry, and beyond.",
  },
  {
    icon: Factory,
    title: "Industry-Reviewed Curriculum",
    desc: "Our course content is periodically reviewed with input from local industries and alumni now working in technical roles.",
  },
  {
    icon: Target,
    title: "Affordable, Focused Education",
    desc: "A three-year diploma costs a fraction of a four-year degree. For students who want to start working sooner, this is the most direct path.",
  },
  {
    icon: GraduationCap,
    title: "Clear Path to a Degree",
    desc: "Every diploma graduate can apply for lateral entry into the second year of B.E. programs — at JCT Engineering or any AICTE-approved college.",
  },
];

/* ─── Facilities ─── */
const facilities = [
  {
    title: "Mechanical Workshop",
    desc: "Lathes, milling machines, welding stations, and a dedicated fitting shop where students learn by building actual components.",
    image:
      "/site_assests/mech-img.jpg.jpeg",
  },
  {
    title: "Electrical Lab",
    desc: "Transformers, motor test benches, and PLC trainers. Students wire real circuits and troubleshoot faults as part of their coursework.",
    image:
      "/site_assests/eee-img.jpg.jpeg",
  },
  {
    title: "Computer Lab",
    desc: "Networked workstations with CAD software, programming environments, and simulation tools updated each academic year.",
    image:
      "/site_assests/computer-img1.jpg.jpeg",
  },
  {
    title: "Library & Study Hall",
    desc: "Technical reference books, periodicals, past question papers, and a quiet reading area that stays open until evening.",
    image:
      "/site_assests/facility-bg.jpg.jpeg",
  },
];

export default function PolytechnicPage() {
  return (
    <main className="bg-background text-foreground polytechnic-theme min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO — Split layout (text left + stats right) ═══ */}
      <section className="bg-navy relative flex min-h-[90vh] items-center overflow-hidden text-white md:min-h-screen">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/site_assests/future-banner.webp"
            alt="Polytechnic workshop"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="from-navy/95 via-navy/80 to-polytechnic/40 absolute inset-0 bg-linear-to-r" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B8DE0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 md:px-6 md:pt-40 lg:pt-44">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — Text */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 md:mb-6"
              >
                <span className="border-polytechnic-light/40 bg-polytechnic-light/20 text-polytechnic-muted inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs md:text-sm font-bold tracking-widest uppercase backdrop-blur-md">
                  <Wrench size={14} />
                  Diploma Programs — AICTE Approved
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-6 font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white"
              >
                Learn a Trade. <br />
                <span className="font-normal text-white/70 italic">
                  Build a Career.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mb-8 max-w-lg text-base md:text-lg leading-relaxed text-white/80"
              >
                JCT Polytechnic College offers three-year diploma programs where
                students spend as much time in workshops as they do in
                classrooms. The goal is simple: graduate with skills that
                employers actually need.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="bg-polytechnic-light shadow-polytechnic-light/20 hover:bg-polytechnic h-12 w-full rounded-xl px-8 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 sm:w-auto md:h-14"
                >
                  View Programs <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-xl border-white/20 bg-white/5 px-8 font-bold text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto md:h-14"
                >
                  Download Brochure
                </Button>
              </motion.div>
            </div>

            {/* Right — Key facts panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:mt-0"
            >
              {[
                {
                  value: "1,200+",
                  label: "Students Enrolled",
                  sub: "Across 6 streams",
                },
                {
                  value: "6",
                  label: "Diploma Programs",
                  sub: "AICTE-approved",
                },
                {
                  value: "85%",
                  label: "Placement Rate",
                  sub: "Within 6 months",
                },
                {
                  value: "3 Yrs",
                  label: "Program Duration",
                  sub: "10th standard entry",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-colors hover:bg-white/10"
                >
                  <span className="text-polytechnic-light mb-1 block font-sans text-3xl md:text-4xl font-bold">
                    {stat.value}
                  </span>
                  <h3 className="mb-1 text-xs font-bold tracking-wider text-white/90 uppercase">
                    {stat.label}
                  </h3>
                  <p className="text-xs font-bold text-white/60">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS — Skill & outcome blocks ═══ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-polytechnic mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Programs Offered
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl md:text-5xl font-bold leading-tight">
              Six Streams.{" "}
              <span className="font-normal text-stone-300 italic">
                Clear Outcomes.
              </span>
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-stone-600">
              Each diploma program is structured around what you&apos;ll
              actually be able to do when you finish — not just what you&apos;ll
              know in theory.
            </p>
          </div>

          <DragScroll className="-mx-4 flex snap-x snap-mandatory gap-6 scroll-smooth px-4 pb-8 md:mx-0 md:px-0">
            {diplomaPrograms.map((prog, index) => (
              <motion.div
                key={prog.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group border-border hover:border-polytechnic/30 card-hover-lift flex min-w-62.5 shrink-0 snap-center flex-col justify-between rounded-2xl border bg-white p-8 md:min-w-75"
                draggable={false}
              >
                <div>
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-polytechnic group-hover:bg-polytechnic bg-polytechnic-muted rounded-xl p-2.5 transition-colors group-hover:text-white">
                        <prog.icon size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-navy font-serif text-xl font-bold">
                          {prog.name}
                        </h3>
                        <span className="text-stone-500 text-sm">
                          {prog.duration} — Full Time
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-polytechnic mb-3 block text-[10px] font-bold tracking-[0.15em] uppercase">
                      What You&apos;ll Learn
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {prog.outcomes.slice(0, 3).map((outcome) => (
                        <div
                          key={outcome}
                          className="text-stone-600 flex items-center gap-2 text-sm md:text-base leading-relaxed"
                        >
                          <CheckCircle2
                            size={13}
                            className="text-polytechnic shrink-0"
                          />
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-border mt-auto border-t pt-5">
                  <span className="text-muted-foreground text-[10px] font-bold tracking-[0.15em] uppercase">
                    Career Paths
                  </span>
                  <p className="text-navy mt-1 text-sm font-medium">
                    {prog.career}
                  </p>
                </div>
              </motion.div>
            ))}
          </DragScroll>
        </div>
      </section>

      {/* ═══ WHY POLYTECHNIC — Advantages ═══ */}
      <section className="bg-stone-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-polytechnic mb-4 text-sm font-bold tracking-[0.2em] uppercase">
                  Why JCT Polytechnic
                </h2>
                <h3 className="text-navy mb-6 font-serif text-4xl md:text-5xl font-bold leading-tight">
                  A Practical Start <br />
                  <span className="font-normal text-stone-500 italic">
                    to Working Life.
                  </span>
                </h3>
                <p className="mb-8 text-base md:text-lg leading-relaxed text-stone-600">
                  Not every good career begins with a four-year degree. Our
                  diploma programs offer focused, affordable, workshop-driven
                  training — and a clear path forward, whether you join the
                  workforce or continue studying.
                </p>

                <div className="hidden aspect-4/3 overflow-hidden rounded-2xl bg-stone-200 lg:block">
                  <Image
                    src="/site_assests/mech-img.jpg.jpeg"
                    alt="Students in the polytechnic workshop"
                    width={800}
                    height={600}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>

            <div className="space-y-6 lg:col-span-3">
              {advantages.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:border-accent/20 group flex gap-5 rounded-2xl border border-stone-100 bg-white p-8 transition-all duration-300"
                >
                  <div className="text-primary group-hover:bg-accent/10 group-hover:text-accent h-fit shrink-0 rounded-xl bg-stone-50 p-3 transition-colors">
                    <item.icon size={22} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-navy mb-2 font-serif text-xl font-bold">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-stone-600">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FACILITIES — Bento grid ═══ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-polytechnic mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Facilities
            </h2>
            <h3 className="text-navy font-serif text-4xl md:text-5xl font-bold leading-tight mb-8">
              Where Training{" "}
              <span className="font-normal text-stone-300 italic">Happens</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {facilities.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl ${index === 0 ? "md:row-span-2" : ""}`}
              >
                <div
                  className={`${index === 0 ? "aspect-auto h-full min-h-100" : "aspect-16/10"} relative`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="from-primary/90 via-primary/30 absolute inset-0 bg-linear-to-t to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-8">
                    <h3 className="mb-2 font-serif text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="max-w-md text-base leading-relaxed text-white/90">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PATHWAY — After diploma ═══ */}
      <section className="bg-primary relative overflow-hidden py-12 text-white md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-gold mb-4 text-sm font-bold tracking-[0.2em] uppercase">
                After Your Diploma
              </h2>
              <h3 className="text-white mb-8 font-serif text-4xl md:text-5xl font-bold leading-tight">
                Two Clear Roads{" "}
                <span className="font-normal text-white/60 italic">Forward</span>
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-10 text-left"
              >
                <Briefcase size={28} className="text-accent mb-6" />
                <h3 className="mb-4 font-serif text-2xl font-bold text-white">
                  Start Working
                </h3>
                <p className="mb-6 text-base md:text-lg leading-relaxed text-white/80">
                  Diploma holders are eligible for technical positions in
                  manufacturing, construction, IT support, government
                  departments, and more. Many of our graduates are placed
                  through campus recruitment itself.
                </p>
                <span className="text-accent text-sm font-bold">
                  85% placed within 6 months
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-10 text-left"
              >
                <GraduationCap size={28} className="text-accent mb-6" />
                <h3 className="mb-4 font-serif text-2xl font-bold text-white">
                  Continue to B.E.
                </h3>
                <p className="mb-6 text-base md:text-lg leading-relaxed text-white/80">
                  Through lateral entry, you can join the second year of
                  B.E./B.Tech programs at JCT College of Engineering and
                  Technology or any Anna University-affiliated college. Skip a
                  year, save a year.
                </p>
                <Link
                  href="/institutions/engineering"
                  className="text-accent inline-flex items-center gap-1 text-sm font-bold hover:underline"
                >
                  View Engineering Programs <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ADMISSIONS — Steps + contact form ═══ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-polytechnic mb-4 text-sm font-bold tracking-[0.2em] uppercase">
                  Admissions
                </h2>
                <h3 className="text-primary mb-8 font-serif text-4xl leading-tight md:text-5xl">
                  Simple Entry. <br />
                  <span className="font-normal text-stone-500 italic">
                    Clear Requirements.
                  </span>
                </h3>

                <div className="mb-10 space-y-8">
                  {[
                    {
                      step: "01",
                      title: "Eligibility",
                      desc: "Passed 10th standard (SSLC) with Mathematics and Science from any recognized board.",
                    },
                    {
                      step: "02",
                      title: "Apply",
                      desc: "Through DOTE counseling or directly for management-quota seats. ITI holders eligible for lateral entry.",
                    },
                    {
                      step: "03",
                      title: "Confirm",
                      desc: "Attend document verification with originals and pay the prescribed fee to secure your seat.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <span className="text-polytechnic font-sans text-4xl font-bold">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="text-navy mb-1 font-serif text-xl font-bold">
                          {item.title}
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed text-stone-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="bg-accent text-primary hover:bg-accent/90 shadow-accent/20 h-14 rounded-2xl px-10 font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-stone-100 bg-stone-50 p-8 md:p-10"
            >
              <h3 className="text-primary mb-2 font-serif text-xl">
                Have Questions?
              </h3>
              <p className="mb-6 text-base leading-relaxed text-stone-600">
                Our admissions office responds within one working day.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    className="focus:border-accent focus:ring-accent/50 w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm transition-all outline-none focus:ring-1"
                    placeholder="Your Name"
                  />
                  <input
                    type="tel"
                    className="focus:border-accent focus:ring-accent/50 w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm transition-all outline-none focus:ring-1"
                    placeholder="Phone Number"
                  />
                </div>
                <select className="focus:border-accent focus:ring-accent/50 w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-600 transition-all outline-none focus:ring-1">
                  <option>Select a Diploma Program</option>
                  <option>Mechanical Engineering</option>
                  <option>Electrical & Electronics</option>
                  <option>Civil Engineering</option>
                  <option>Computer Engineering</option>
                  <option>Electronics & Communication</option>
                  <option>Automobile Engineering</option>
                </select>
                <textarea
                  rows={3}
                  className="focus:border-accent focus:ring-accent/50 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm transition-all outline-none focus:ring-1"
                  placeholder="Any questions?"
                />
                <Button className="bg-accent text-primary hover:bg-accent/90 shadow-accent/20 w-full rounded-2xl px-8 py-5 text-sm font-bold shadow-lg transition-all">
                  Send Enquiry <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-4 border-t border-stone-200 pt-6 text-sm sm:flex-row">
                <a
                  href="tel:+919361488801"
                  className="hover:text-primary flex items-center gap-2 text-stone-500 transition-colors"
                >
                  <Phone size={14} className="text-accent" /> +91 93614 88801
                </a>
                <a
                  href="mailto:polytechnic@jct.edu"
                  className="hover:text-primary flex items-center gap-2 text-stone-500 transition-colors"
                >
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
