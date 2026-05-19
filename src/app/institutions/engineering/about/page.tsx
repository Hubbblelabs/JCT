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
    title: "Hi-Tech Classrooms",
    icon: Monitor,
    desc: "Smart, ICT-enabled classrooms with digital projectors and modern AV systems for interactive learning.",
  },
  {
    title: "Modern Laboratories",
    icon: FlaskConical,
    desc: "State-of-the-art labs equipped with the latest technology aligned to industry standards.",
  },
  {
    title: "24×7 Campus",
    icon: Clock,
    desc: "A secure, vibrant campus alive around the clock with CCTV surveillance and on-campus support.",
  },
  {
    title: "Extensive Library",
    icon: BookOpen,
    desc: "Digital library with thousands of e-journals, books, and online learning resources including NDLI.",
  },
  {
    title: "Sports Infrastructure",
    icon: Trophy,
    desc: "Excellent facilities for indoor and outdoor sports nurturing holistic student development.",
  },
  {
    title: "Transport Fleet",
    icon: Bus,
    desc: "Extensive bus network covering major routes across Coimbatore, Palakkad, and surrounding areas.",
  },
];

const accreditations = [
  { name: "AICTE", desc: "Approved", logo: "/accreditations/aicte.webp" },
  {
    name: "NBA",
    desc: "Accredited Programs",
    logo: "/accreditations/nba.webp",
  },
  { name: "NAAC", desc: '"A" Grade', logo: "/accreditations/naac.webp" },
  {
    name: "Anna University",
    desc: "Affiliated",
    logo: "/accreditations/anna.webp",
  },
  { name: "UGC", desc: "Recognized", logo: "/accreditations/ugc.webp" },
  {
    name: "ISO 9001:2015",
    desc: "Certified",
    logo: "/accreditations/iso.webp",
  },
];

const missionPoints = [
  "To provide quality technical education that meets global standards and industry needs.",
  "To encourage research, innovation and entrepreneurship among students and faculty.",
  "To build strong industry-institute interaction for practical skill development.",
  "To cultivate leadership qualities, ethical values, and social responsibility.",
  "To promote inclusive education accessible to students from all socioeconomic backgrounds.",
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
    desc: "Preparing graduates to compete and contribute in an interconnected, technology-driven global society.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    desc: "Encouraging creative thinking, problem-solving, and the application of technology to real-world challenges.",
  },
  {
    icon: Heart,
    title: "Social Commitment",
    desc: "Serving society through community outreach, value-based education, and environmentally responsible practices.",
  },
];

const leadership = [
  {
    name: "Shri S. A. Subramanian",
    role: "Founder",
    image: "/about-us-assets/shri.s.a.subramanian.webp",
    bio: "Shri S. A. Subramanian hails from a renowned scholarly family and did his post graduation in English. He distinguished himself as both an academic and industrial innovator. With a rare and enriching exposure to academic research and industrial experience, Sri Subramanian established Shri Jagannath Educational Health and Charitable Trust in 2008 with the objective of providing affordable quality technical education.",
  },
  {
    name: "Mr. R. Arulselvan",
    role: "Chairman",
    image: "/about-us-assets/mr.r.arulselvan.webp",
    bio: "Mr. R. Arulselvan holds a B.E. (Production Engineering) from Guindy Engineering College and an MBA from De Montfort University, United Kingdom. He is also an Accredited Building Practitioner specialising in Residential and Commercial construction. Through his experience in running business enterprises in India and overseas, he plays a pivotal role in developing JCT as a leading engineering institution.",
  },
  {
    name: "Mr. R. Gautaman",
    role: "Vice Chairman",
    image: "/about-us-assets/mr.r.gautaman.webp",
    bio: "Mr. R. Gautaman holds a B.E. (ECE) from Thiagarajar College of Engineering and an MBA from RMIT University, Melbourne. He is a Registered Building Practitioner in Victoria (Australia) and an Ex Banker with experience in Retail Banking and Financial Planning. He encourages a focus on quality in education, infrastructure, and the holistic personality development of students.",
  },
  {
    name: "Mr. R. Durga Shankar",
    role: "Secretary & Managing Trustee",
    image: "/about-us-assets/mr.r.durga-shankar.webp",
    bio: 'Mr. R. Durga Shankar holds an M.Sc. Computer Science from Guindy Engineering College. He created a platform for Holistic Learning to impart value-based and quality education, committing himself to producing Industry Ready Professionals and Great Leaders. His maxim: "Technical skills with communication skills is a gateway to the globalised market of technology and engineering."',
  },
];

/* ─── Page Component ────────────────────────────────────────────────────────── */

export default function EngineeringAboutPage() {
  const [activeId, setActiveId] = useState<string>("about");

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Engineering"
        subtitle="An Autonomous Institution Committed to Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "About" },
          ]}
        />

        {/* ── Mobile pill nav ── */}
        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <AboutSideNav activeId={activeId} setActiveId={setActiveId} />
        </div>

        {/* ── Layout Grid ── */}
        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          {/* ── LEFT: Sticky Side Nav (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <AboutSideNav activeId={activeId} setActiveId={setActiveId} />
            </div>
          </div>

          {/* ── RIGHT: Main Content (Filtered on mobile based on activeId) ── */}
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
                  JCT College of Engineering and Technology is an Autonomous
                  Institution established by the Shri Jagannath Educational
                  Health and Charitable Trust. The Trust was founded in 2008 by
                  prominent philanthropists with the objective of providing
                  affordable quality technical education — especially to
                  students from underserved and rural communities.
                </p>
                <p>
                  Located in Pichanur, Coimbatore — Tamil Nadu, the institution
                  has grown into a recognized center of excellence in
                  engineering and technology. It offers a wide array of
                  specialized undergraduate and postgraduate courses tailored to
                  meet the demands of modern industry, including programs unique
                  to the region such as Petroleum Engineering and Petrochemical
                  Technology.
                </p>
                <p>
                  With over a decade of academic excellence, JCT Engineering has
                  built a strong reputation for producing industry-ready
                  graduates who lead successful careers at top organizations
                  across India and abroad. The institution is proud of its
                  autonomous status, which empowers continuous curriculum
                  innovation aligned with global industry trends.
                </p>
              </div>

              {/* Stats bar */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { value: "2009", label: "Established" },
                  { value: "11+", label: "Departments" },
                  { value: "3000+", label: "Students" },
                  { value: "98%", label: "Placement Rate" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <p className="text-gold text-2xl font-bold md:text-3xl">
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

              {/* Vision card */}
              <div className="mb-4 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    To emerge as a premier center of excellence in engineering
                    education and research, fostering innovation and producing
                    globally competent professionals with strong ethical values
                    and social commitment.
                  </p>
                </div>
              </div>

              {/* Mission card */}
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <div className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
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
                          className="text-gold mt-0.5 shrink-0"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quality Policy */}
              <div className="border-gold/20 bg-gold/5 mt-4 rounded-2xl border p-5 md:p-6">
                <h3 className="text-foreground mb-2 flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck size={18} className="text-gold" />
                  Quality Policy
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                  JCT College of Engineering and Technology is committed to
                  provide quality technical education that meets the
                  requirements of students, industry, and society. The
                  institution continually improves its infrastructure, teaching
                  methodologies, and research activities through systematic
                  review and stakeholder feedback, ensuring compliance with
                  regulatory standards and preparing globally competitive
                  graduates.
                </p>
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
                  {/* Photo */}
                  <div className="flex flex-col items-center gap-3 sm:w-44 sm:shrink-0">
                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-56 sm:w-44">
                      <Image
                        src="/about-us-assets/dr.s.manoharan.webp"
                        alt="Dr. S. Manoharan, Principal"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">
                        Dr. S. Manoharan
                      </p>
                      <p className="text-muted-foreground text-sm">Principal</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        JCT College of Engineering & Technology
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1 space-y-4">
                    <blockquote className="text-foreground/90 border-gold/50 border-l-4 pl-5 text-base leading-relaxed italic md:text-lg">
                      &quot;Welcome to JCT College of Engineering and
                      Technology. Our institution stands as a beacon of quality
                      technical education in the region, committed to shaping
                      the engineers of tomorrow.&quot;
                    </blockquote>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      We are committed to nurturing the potential within every
                      student, providing them with a robust academic foundation
                      and hands-on practical experience. Our dedicated faculty
                      continuously update the curriculum to stay aligned with
                      the dynamic needs of the global industry.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      Our autonomous status empowers us to introduce
                      industry-relevant electives, research initiatives, and
                      interdisciplinary programs. The state-of-the-art
                      infrastructure, experienced faculty, and strong industry
                      linkages ensure that JCT graduates are always
                      industry-ready. I invite you to join us in this journey of
                      excellence.
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
                JCT College is run under the Shri Jagannath Educational Health
                and Charitable Trust, guided by a visionary management team
                committed to transforming technical education in India.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {leadership.map((person) => (
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
                        <p className="text-gold text-xs font-medium md:text-sm">
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
                The Heads of Departments at JCT College of Engineering and
                Technology bring decades of academic excellence and industry
                experience, ensuring each department delivers world-class
                technical education.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Dr. G. Rajiv",
                    designation: "Professor & Head",
                    dept: "Computer Science & Engineering",
                    abbr: "CSE",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. S. Kavitha",
                    designation: "Associate Professor & Head",
                    dept: "Electronics & Communication Eng.",
                    abbr: "ECE",
                    avatar: "/avatars/female_avatar.png",
                  },
                  {
                    name: "Dr. P. Mohan",
                    designation: "Professor & Head",
                    dept: "Electrical & Electronics Eng.",
                    abbr: "EEE",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. K. Venkat",
                    designation: "Professor & Head",
                    dept: "Mechanical Engineering",
                    abbr: "MECH",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. M. Suresh",
                    designation: "Professor & Head",
                    dept: "Civil Engineering",
                    abbr: "CE",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. R. Anitha",
                    designation: "Associate Professor & Head",
                    dept: "Bio-Tech & Bio-Chemical Eng.",
                    abbr: "BT",
                    avatar: "/avatars/female_avatar.png",
                  },
                  {
                    name: "Dr. S. Praveen",
                    designation: "Assistant Professor & Head",
                    dept: "Food Technology",
                    abbr: "FT",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. L. Albert",
                    designation: "Professor & Head",
                    dept: "Petroleum Engineering",
                    abbr: "PE",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. J. Jerome",
                    designation: "Professor & Head",
                    dept: "Petrochemical Technology",
                    abbr: "PCT",
                    avatar: "/avatars/male_avatar.png",
                  },
                  {
                    name: "Dr. T. Sandhya",
                    designation: "Associate Professor & Head",
                    dept: "AI & Data Science",
                    abbr: "AI&DS",
                    avatar: "/avatars/female_avatar.png",
                  },
                  {
                    name: "Dr. V. Rajesh",
                    designation: "Associate Professor & Head",
                    dept: "CS & Business Systems",
                    abbr: "CSBS",
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
                      <h4 className="text-foreground text-sm font-bold leading-tight">
                        {d.name}
                      </h4>
                      <p className="text-[11px] font-medium text-gold mt-0.5">
                        {d.designation}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px] font-medium leading-tight">
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
                The Governing Council of JCT College of Engineering and
                Technology comprises distinguished academicians, industry
                leaders, and government nominees who provide strategic direction
                and governance oversight.
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
                        name: "Dr. S. Manoharan",
                        category: "Principal — Member Secretary",
                      },
                      {
                        name: "Nominee — Anna University",
                        category: "University Nominee",
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

            {/* 5. Core Values */}
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
                    className="hover:border-gold/20 hover:bg-gold/5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors"
                  >
                    <div className="bg-gold/15 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
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

            {/* 6. Approvals & Accreditations */}
            <section
              id="accreditations"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "accreditations"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Award} title="Approvals & Accreditations" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
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
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 120px"
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

            {/* 7. Campus Highlights */}
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
                    <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
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

            {/* 8. Why Choose JCT Engineering */}
            <section
              id="why-jct"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "why-jct"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Star} title="Why Choose JCT Engineering?" />
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Only college in Coimbatore offering Petroleum & Petrochemical Engineering",
                  "Autonomous status enabling industry-updated curriculum",
                  "NBA-accredited programs with global quality standards",
                  "98% placement rate with 500+ recruiting partners",
                  "Dedicated Centre of Excellence (COE) for research",
                  "Strong alumni network spanning global organizations",
                  "Industry-integrated internship and live project programs",
                  "Merit scholarships and government financial aid available",
                  "ISO 9001:2015 certified quality management system",
                  "Unique specializations not available at other colleges",
                ].map((point, i) => (
                  <span
                    key={i}
                    className="bg-surface flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium md:text-sm"
                  >
                    <CheckCircle size={13} className="text-gold shrink-0" />
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
      <span className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon size={20} />
      </span>
      {title}
    </h2>
  );
}
