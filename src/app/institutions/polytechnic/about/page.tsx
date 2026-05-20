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
    title: "Modern Workshops",
    icon: Monitor,
    desc: "Fully equipped engineering workshops with industry-grade machinery for hands-on practical training.",
  },
  {
    title: "Technical Laboratories",
    icon: FlaskConical,
    desc: "State-of-the-art laboratories aligned to DOTE curriculum standards with modern instruments and equipment.",
  },
  {
    title: "24×7 Campus",
    icon: Clock,
    desc: "A secure campus with round-the-clock CCTV surveillance, hostel facilities, and on-campus support.",
  },
  {
    title: "Library",
    icon: BookOpen,
    desc: "Well-stocked library with technical books, journals, and digital access to NDLI and online resources.",
  },
  {
    title: "Sports Infrastructure",
    icon: Trophy,
    desc: "Comprehensive indoor and outdoor sports facilities to develop holistic skills beyond the classroom.",
  },
  {
    title: "Transport Fleet",
    icon: Bus,
    desc: "Extensive bus network covering Coimbatore, Palakkad, and surrounding regions for convenient daily commuting.",
  },
];

const accreditations = [
  { name: "AICTE", desc: "Approved", logo: "/accreditations/aicte.webp" },
  { name: "UGC", desc: "Recognized", logo: "/accreditations/ugc.webp" },
  { name: "DOTE", desc: "Affiliated", logo: "/accreditations/anna.webp" },
  {
    name: "ISO 9001:2015",
    desc: "Certified",
    logo: "/accreditations/iso.webp",
  },
];

const missionPoints = [
  "State-of-the-art infrastructures for conducive, quality learning.",
  "Skills embedded education for productive careers and higher studies.",
  "Value and ethics integrated technical education.",
  "To promote industry-academia partnerships and continuous professional development.",
  "To develop socially responsible technicians with strong ethical values and discipline.",
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
    desc: "Striving for continuous improvement in technical training, student outcomes, and institutional quality.",
  },
  {
    icon: Handshake,
    title: "Teamwork",
    desc: "Fostering collaborative workshops, inclusive communities, and mutual respect among all stakeholders.",
  },
  {
    icon: Globe,
    title: "Industry Readiness",
    desc: "Preparing diploma graduates for immediate employment with relevant technical skills and work ethics.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    desc: "Encouraging hands-on problem-solving, creative thinking, and practical application of technical knowledge.",
  },
  {
    icon: Heart,
    title: "Social Commitment",
    desc: "Serving society through skill development, community outreach, and environmentally responsible practices.",
  },
];

const management = [
  {
    name: "Shri S. A. Subramanian",
    role: "Founder",
    image: "/about-us-assets/shri.s.a.subramanian.webp",
    bio: "Shri S. A. Subramanian hails from a renowned scholarly family. With a rare and enriching exposure to academic research and industrial experience, he established Shri Jagannath Educational Health and Charitable Trust in 2008 with the objective of providing affordable quality technical education.",
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
    bio: "Mr. R. Durga Shankar holds an M.Sc. Computer Science from Guindy Engineering College. He created a platform for Holistic Learning to impart value-based and quality education, committing himself to producing Industry Ready Professionals and Great Leaders.",
  },
];

/* ─── Page Component ────────────────────────────────────────────────────────── */

export default function PolytechnicAboutPage() {
  const [activeId, setActiveId] = useState<string>("about");

  return (
    <main className="bg-surface text-foreground polytechnic-theme min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Polytechnic"
        subtitle="Empowering Minds with Technical Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
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
                  JCT Polytechnic College was established in Pichanur,
                  Coimbatore in the academic year 2014–2015, under the Shri
                  Jagannath Educational Health and Charitable Trust — a Trust
                  founded with the objective of providing quality education to
                  all, particularly students from rural and underrepresented
                  communities.
                </p>
                <p>
                  The institution is committed to quality and skill-embedded
                  diploma education, combining strong technical foundations,
                  practical training, human values, and career readiness to
                  prepare students for industry and higher studies.
                </p>
                <p>
                  Offering AICTE-approved three-year diploma programs across
                  multiple engineering disciplines, JCT Polytechnic is known for
                  its workshop-driven training, experienced faculty, and strong
                  industry linkages. Students also benefit from the lateral
                  entry pathway to B.E. programs after completing their diploma.
                </p>
              </div>

              {/* Stats bar */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { value: "2014", label: "Established" },
                  { value: "6+", label: "Diploma Programs" },
                  { value: "1500+", label: "Students" },
                  { value: "98%", label: "Placement Rate" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <p className="text-polytechnic text-2xl font-bold md:text-3xl">
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
                <div className="bg-polytechnic/15 text-polytechnic flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    Emerge as a leading Institute for Quality and Skill embedded
                    Diploma Education that empowers students to excel in
                    industry and higher studies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div className="bg-polytechnic/15 text-polytechnic flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
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
                          className="text-polytechnic mt-0.5 shrink-0"
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
                        src="/about-us-assets/dr.s.manoharan.webp"
                        alt="Principal, JCT Polytechnic"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">
                        Prof. Rajkumar, M.E.
                      </p>
                      <p className="text-muted-foreground text-sm">Principal</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        JCT Polytechnic College
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <blockquote className="text-foreground/90 border-polytechnic/50 border-l-4 pl-5 text-base leading-relaxed italic md:text-lg">
                      &quot;It is with great pleasure that I welcome you to our
                      college website. As Principal, I am greatly impressed by
                      the commitment of our management and staff in delivering
                      excellent technical education through state-of-the-art
                      facilities.&quot;
                    </blockquote>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      We promote academic achievement, celebrate co-curricular
                      excellence, and maintain a personal approach to student
                      development by building strong relationships with learners
                      and parents.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      Our institution focuses on individual support and
                      opportunity access, and remains committed to helping every
                      student pursue academic goals with confidence, pride, and
                      enthusiasm.
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
                JCT Polytechnic College is run under the Shri Jagannath
                Educational Health and Charitable Trust, guided by a visionary
                management team committed to advancing technical and vocational
                education in India.
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
                        <p className="text-polytechnic text-xs font-medium md:text-sm">
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
                The Heads of Departments at JCT Polytechnic College bring strong
                technical backgrounds and industry experience, guiding each
                diploma program with a focus on practical excellence.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Prof. T. Hariharan",
                    designation: "Assistant Professor & Head",
                    dept: "Computer Technology",
                    abbr: "CT",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Prof. A. Balaji",
                    designation: "Assistant Professor & Head",
                    dept: "Mechanical Engineering",
                    abbr: "MECH",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Prof. G. Selvi",
                    designation: "Assistant Professor & Head",
                    dept: "Civil Engineering",
                    abbr: "CIVIL",
                    avatar: "/avatars/female_avatar.png",
                  },
                  {
                    name: "Prof. M. Chandran",
                    designation: "Assistant Professor & Head",
                    dept: "Electrical & Electronics Eng.",
                    abbr: "EEE",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Prof. R. Deepa",
                    designation: "Assistant Professor & Head",
                    dept: "Agricultural Engineering",
                    abbr: "AGRI",
                    avatar: "/avatars/female_avatar.png",
                  },
                  {
                    name: "Prof. K. Saravanan",
                    designation: "Assistant Professor & Head",
                    dept: "Petrochemical Engineering",
                    abbr: "PCE",
                    avatar: "/avatars/male_avatar.png",
                  },
                ].map((d) => (
                  <div
                    key={d.abbr}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
                      <Image
                        src={d.avatar}
                        alt={d.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="text-foreground text-sm leading-tight font-bold">
                        {d.name}
                      </h4>
                      <p className="text-polytechnic mt-0.5 text-[11px] font-medium">
                        {d.designation}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px] leading-tight font-medium">
                        {d.dept}
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
                The Governing Council of JCT Polytechnic College comprises
                management representatives, government nominees, and technical
                education experts who provide governance oversight and strategic
                direction.
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        S.No
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Member
                      </th>
                      <th className="text-muted-foreground px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      {
                        name: "Mr. R. Arulselvan",
                        category: "Chairman / Secretary of Trust",
                      },
                      {
                        name: "Mr. R. Gautaman",
                        category: "Vice Chairman / Member of Trust",
                      },
                      {
                        name: "Mr. R. Durga Shankar",
                        category: "Secretary & Managing Trustee",
                      },
                      {
                        name: "Prof. Rajkumar, M.E.",
                        category: "Principal — Member Secretary",
                      },
                      {
                        name: "Nominee — DOTE",
                        category: "Government Nominee",
                      },
                      {
                        name: "Nominee — AICTE",
                        category: "Government Nominee",
                      },
                      { name: "Industry Expert", category: "Industry Nominee" },
                      {
                        name: "Senior Faculty Representative",
                        category: "Faculty Nominee",
                      },
                    ].map((m, i) => (
                      <tr
                        key={i}
                        className="transition-colors hover:bg-white/5"
                      >
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
                    className="hover:border-polytechnic/20 hover:bg-polytechnic/5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors"
                  >
                    <div className="bg-polytechnic/15 text-polytechnic flex h-10 w-10 items-center justify-center rounded-xl">
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
                    <div className="bg-polytechnic/20 text-polytechnic flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
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

            {/* 10. Why Choose JCT Polytechnic */}
            <section
              id="why-jct"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "why-jct"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Star} title="Why Choose JCT Polytechnic?" />
              <div className="flex flex-wrap gap-2.5">
                {[
                  "AICTE-approved 3-year diploma programs with lateral entry to B.E.",
                  "Workshop-driven curriculum with industry-grade machinery",
                  "98% placement rate with strong industry partnerships",
                  "Experienced faculty with academic and practical expertise",
                  "Dedicated Centre of Excellence for skill development",
                  "Merit scholarships and government financial aid available",
                  "ISO 9001:2015 certified quality management system",
                  "Strong alumni network across manufacturing and technical sectors",
                  "Programs in high-demand disciplines including Petrochemical Engineering",
                  "Holistic development through sports, clubs, and cultural events",
                ].map((point, i) => (
                  <span
                    key={i}
                    className="bg-surface flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium md:text-sm"
                  >
                    <CheckCircle
                      size={13}
                      className="text-polytechnic shrink-0"
                    />
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
      <span className="bg-polytechnic/20 text-polytechnic flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon size={20} />
      </span>
      {title}
    </h2>
  );
}
