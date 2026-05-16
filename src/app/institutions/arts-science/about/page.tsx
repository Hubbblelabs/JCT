"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import {
  Monitor,
  FlaskConical,
  Clock,
  BookOpen,
  Trophy,
  Bus,
  Target,
  Lightbulb,
  Award,
  CheckCircle,
  MessageSquareQuote,
  School,
  Star,
  Landmark,
  Heart,
  Users,
  ShieldCheck,
  Handshake,
  Gem,
  Rocket,
  Globe,
  Briefcase,
} from "lucide-react";
import { AboutSideNav } from "./AboutSideNav";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const campusHighlights = [
  {
    title: "Modern Classrooms",
    icon: Monitor,
    desc: "ICT-enabled classrooms with digital projectors and modern AV systems for interactive and engaging learning sessions.",
  },
  {
    title: "Science Laboratories",
    icon: FlaskConical,
    desc: "Well-equipped science and computer laboratories aligned with the latest academic and industry requirements.",
  },
  {
    title: "24×7 Campus",
    icon: Clock,
    desc: "A safe and vibrant campus with round-the-clock CCTV surveillance and on-campus support staff.",
  },
  {
    title: "Digital Library",
    icon: BookOpen,
    desc: "Rich library with e-journals, digital books, and online learning resources including NDLI access for all students.",
  },
  {
    title: "Sports Facilities",
    icon: Trophy,
    desc: "Comprehensive indoor and outdoor sports infrastructure for holistic development of every student.",
  },
  {
    title: "Transport Network",
    icon: Bus,
    desc: "Extensive bus routes covering Coimbatore, Palakkad, and surrounding districts for convenient daily commuting.",
  },
];

const accreditations = [
  { name: "UGC", desc: "Recognized", logo: "/accreditations/ugc.webp" },
  { name: "NAAC", desc: '"A" Grade', logo: "/accreditations/naac.webp" },
  {
    name: "Bharathiar University",
    desc: "Affiliated",
    logo: "/accreditations/anna.webp",
  },
  {
    name: "ISO 9001:2015",
    desc: "Certified",
    logo: "/accreditations/iso.webp",
  },
];

const missionPoints = [
  "To impart knowledge, values, and professional education through strong theoretical basics and hands-on training.",
  "To serve students through leadership, entrepreneurship, teamwork, quality, ethics, and mutual respect.",
  "To provide opportunities for long-term interaction with academia and industry.",
  "To create new knowledge through innovation and research and continuously adopt meaningful technological developments.",
  "To foster holistic development by promoting critical thinking, creativity, and problem-solving skills.",
  "To nurture socially responsible citizens who contribute meaningfully to society and the nation.",
];

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "Upholding the highest standards of honesty and transparency in all academic and administrative activities.",
  },
  {
    icon: Gem,
    title: "Excellence",
    desc: "Striving for continuous improvement in teaching, research, and student outcomes across all disciplines.",
  },
  {
    icon: Handshake,
    title: "Teamwork",
    desc: "Fostering collaborative learning, inclusive communities, and mutual respect among all stakeholders.",
  },
  {
    icon: Globe,
    title: "Global Vision",
    desc: "Preparing graduates to compete and contribute in an interconnected, knowledge-driven global society.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    desc: "Encouraging creative thinking, problem-solving, and the application of knowledge to real-world challenges.",
  },
  {
    icon: Heart,
    title: "Social Commitment",
    desc: "Serving society through community outreach, value-based education, and environmentally responsible practices.",
  },
];

const management = [
  {
    name: "Shri S. A. Subramanian",
    role: "Founder",
    image: "/about-us-assets/shri.s.a.subramanian.webp",
    bio: "Shri S. A. Subramanian hails from a renowned scholarly family. With a rare and enriching exposure to academic research and industrial experience, he established Shri Jagannath Educational Health and Charitable Trust in 2008 with the objective of providing affordable quality education.",
  },
  {
    name: "Mr. R. Arulselvan",
    role: "Chairman",
    image: "/about-us-assets/mr.r.arulselvan.webp",
    bio: "Mr. R. Arulselvan holds a B.E. (Production Engineering) from Guindy Engineering College and an MBA from De Montfort University, United Kingdom. Through his experience in running business enterprises in India and overseas, he plays a pivotal role in developing JCT as a leading institution.",
  },
  {
    name: "Mr. R. Gautaman",
    role: "Vice Chairman",
    image: "/about-us-assets/mr.r.gautaman.webp",
    bio: "Mr. R. Gautaman holds a B.E. (ECE) from Thiagarajar College of Engineering and an MBA from RMIT University, Melbourne. He encourages a focus on quality in education, infrastructure, and the holistic personality development of students.",
  },
  {
    name: "Mr. R. Durga Shankar",
    role: "Secretary & Managing Trustee",
    image: "/about-us-assets/mr.r.durga-shankar.webp",
    bio: 'Mr. R. Durga Shankar holds an M.Sc. Computer Science from Guindy Engineering College. He created a platform for Holistic Learning to impart value-based and quality education, committing himself to producing Industry Ready Professionals and Great Leaders.',
  },
];

/* ─── Page Component ────────────────────────────────────────────────────────── */

export default function ArtsScienceAboutPage() {
  const [activeId, setActiveId] = useState<string>("about");

  return (
    <main className="bg-surface text-foreground arts-science-theme min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Arts & Science"
        subtitle="Fostering Creativity and Scientific Inquiry"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Arts & Science", href: "/institutions/arts-science" },
            { label: "About" },
          ]}
        />

        {/* Mobile pill nav */}
        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <AboutSideNav activeId={activeId} setActiveId={setActiveId} />
        </div>

        {/* Layout Grid */}
        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          {/* Sticky Side Nav (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <AboutSideNav activeId={activeId} setActiveId={setActiveId} />
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8 min-w-0 space-y-16 lg:mt-0">

            {/* 1. About the Institution */}
            <section
              id="about"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "about"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Landmark} title="About the Institution" />
              <div className="text-muted-foreground space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  JCT College of Arts & Science was established in 2024 at
                  Pichanur, Coimbatore, under the Shri Jagannath Educational
                  Health and Charitable Trust — a Trust founded with the
                  objective of delivering quality education especially to
                  students from rural and underserved communities.
                </p>
                <p>
                  JCTCAS combines interdisciplinary learning, modern
                  laboratories, digital access, and value-based education to
                  help students build strong academic foundations, industry
                  readiness, and responsible citizenship.
                </p>
                <p>
                  Offering a range of undergraduate programs in Computer
                  Science, Artificial Intelligence, Commerce, and Business
                  Administration, the college is committed to producing
                  graduates who are globally competitive, ethically grounded,
                  and community-focused.
                </p>
              </div>

              {/* Stats bar */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { value: "2024", label: "Established" },
                  { value: "5+", label: "Programs" },
                  { value: "2500+", label: "Students" },
                  { value: "95%", label: "Placement Rate" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <p className="text-arts-science-accent text-2xl font-bold md:text-3xl">
                      {s.value}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Vision & Mission */}
            <section
              id="vision"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "vision"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Target} title="Vision & Mission" />

              <div className="mb-4 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    To emerge as a premier institute for attaining global
                    excellence in the field of education and training and
                    produce professionals of world standards to face the global
                    environment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-bold">
                    Our Mission
                  </h3>
                  <ul className="space-y-2">
                    {missionPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed md:text-base"
                      >
                        <CheckCircle
                          size={15}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Principal's Message */}
            <section
              id="principal"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "principal"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading
                icon={MessageSquareQuote}
                title="Principal's Message"
              />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start md:p-8">
                  <div className="flex flex-col items-center gap-3 sm:w-44 sm:shrink-0">
                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-56 sm:w-44">
                      <Image
                        src="/about-us-assets/dr.s.anbarasu.webp"
                        alt="Dr. S. Anbarasu, Principal"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">
                        Dr. S. Anbarasu
                      </p>
                      <p className="text-muted-foreground text-sm">Principal</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        JCT College of Arts & Science
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <blockquote className="text-foreground/90 border-l-4 border-orange-400/50 pl-5 text-base leading-relaxed italic md:text-lg">
                      &quot;Education is the most powerful weapon which you can
                      use to change the world. At JCTCAS, we continuously update
                      our practices to match dynamic societal changes and
                      technological progress, while staying true to our motto:
                      Educate, Empower and Elevate.&quot;
                    </blockquote>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      Our dedicated faculty and state-of-the-art infrastructure
                      create a vibrant teaching-learning environment where
                      students are at the center of co-curricular and
                      extra-curricular growth.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      Through seminars, workshops, clubs, and sports, we help
                      learners build leadership and professional skills, and we
                      remain committed to providing an inspiring learning
                      experience for every student.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Management */}
            <section
              id="management"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "management"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Briefcase} title="Management" />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                JCT College of Arts & Science is run under the Shri Jagannath
                Educational Health and Charitable Trust, guided by a visionary
                management team committed to transforming higher education in
                India.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {management.map((person) => (
                  <div
                    key={person.name}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover object-top"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-bold md:text-base">
                          {person.name}
                        </p>
                        <p className="text-arts-science-accent text-xs font-medium md:text-sm">
                          {person.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
                      {person.bio}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Administration — HOD */}
            <section
              id="hod"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "hod"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={BookOpen} title="Administration — HOD" />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                The Heads of Departments at JCT College of Arts & Science bring
                strong academic backgrounds and industry experience, ensuring
                each program delivers quality, industry-relevant education.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { dept: "B.Sc Computer Science", abbr: "CS" },
                  { dept: "B.Sc Artificial Intelligence & Machine Learning", abbr: "AI&ML" },
                  { dept: "BCA", abbr: "BCA" },
                  { dept: "B.Com (Computer Applications)", abbr: "B.Com" },
                  { dept: "BBA", abbr: "BBA" },
                ].map((d) => (
                  <div
                    key={d.abbr}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-xs font-bold text-orange-500">
                      {d.abbr}
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-semibold leading-snug md:text-sm">
                        {d.dept}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        Head of Department
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Governing Council */}
            <section
              id="governing-council"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "governing-council"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Users} title="Governing Council" />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                The Governing Council of JCT College of Arts & Science comprises
                distinguished academicians, industry experts, and government
                nominees who provide strategic direction and governance oversight.
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Member
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { name: "Mr. R. Arulselvan", category: "Chairman / Secretary of Trust" },
                      { name: "Mr. R. Gautaman", category: "Vice Chairman / Member of Trust" },
                      { name: "Mr. R. Durga Shankar", category: "Secretary & Managing Trustee" },
                      { name: "Dr. S. Anbarasu", category: "Principal — Member Secretary" },
                      { name: "Nominee — Bharathiar University", category: "University Nominee" },
                      { name: "Nominee — UGC", category: "Government Nominee" },
                      { name: "Industry Expert", category: "Industry Nominee" },
                      { name: "Senior Faculty Representative", category: "Faculty Nominee" },
                    ].map((m, i) => (
                      <tr key={i} className="transition-colors hover:bg-white/5">
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {i + 1}
                        </td>
                        <td className="text-foreground px-4 py-3 font-medium">
                          {m.name}
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-xs">
                          {m.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Core Values */}
            <section
              id="core-values"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "core-values"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Heart} title="Core Values" />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {coreValues.map((val) => (
                  <div
                    key={val.title}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-orange-400/20 hover:bg-orange-500/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                      <val.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1.5 text-sm font-bold md:text-base">
                        {val.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Approvals & Accreditations */}
            <section
              id="accreditations"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "accreditations"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Award} title="Approvals & Accreditations" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {accreditations.map((acc) => (
                  <div
                    key={acc.name}
                    className="bg-surface border-border flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-10 w-full">
                      <Image
                        src={acc.logo}
                        alt={acc.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, 150px"
                      />
                    </div>
                    <div>
                      <h3 className="text-foreground text-xs font-bold">
                        {acc.name}
                      </h3>
                      <p className="text-muted-foreground mt-0.5 text-[10px]">
                        {acc.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Campus Highlights */}
            <section
              id="campus"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "campus"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={School} title="Campus Highlights" />
              <div className="grid gap-3 sm:grid-cols-2">
                {campusHighlights.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
                      <feature.icon size={18} />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold md:text-base">
                        {feature.title}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed md:text-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. Why Choose JCT Arts & Science */}
            <section
              id="why-jct"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "why-jct"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading
                icon={Star}
                title="Why Choose JCT Arts & Science?"
              />
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Interdisciplinary programs combining arts, science, and technology",
                  "Modern laboratories and digital learning infrastructure",
                  "Strong placement cell with 95%+ placement record",
                  "Value-based, holistic education for all-round development",
                  "Industry-linked internship and live project programs",
                  "Merit scholarships and government financial aid available",
                  "ISO 9001:2015 certified quality management system",
                  "Dedicated clubs for arts, sports, and cultural activities",
                  "Experienced faculty with academic and industry credentials",
                  "Affordable quality education for all socioeconomic backgrounds",
                ].map((point, i) => (
                  <span
                    key={i}
                    className="bg-surface flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium md:text-sm"
                  >
                    <CheckCircle size={13} className="shrink-0 text-orange-500" />
                    {point}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

/* ─── Shared Sub-component ──────────────────────────────────────────────────── */

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <h2 className="text-foreground mb-5 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
        <Icon size={20} />
      </span>
      {title}
    </h2>
  );
}
