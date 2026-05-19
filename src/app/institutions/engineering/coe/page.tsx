"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { COESideNav } from "./COESideNav";
import {
  FileText,
  ClipboardList,
  BookOpen,
  Download,
  Users,
  ScrollText,
  Landmark,
  Building2,
  CheckCircle,
  Layers,
  Settings,
  Activity,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export default function COEPage() {
  const [activeId, setActiveId] = useState<string>("overview");

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Controller of Examinations (COE)"
        subtitle="Office of the Controller of Examinations | JCT Engineering"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "COE" },
          ]}
        />

        {/* ── Mobile pill nav ── */}
        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <COESideNav activeId={activeId} setActiveId={setActiveId} />
        </div>

        {/* ── Layout Grid ── */}
        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          
          {/* ── LEFT: Sticky Side Nav (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <COESideNav activeId={activeId} setActiveId={setActiveId} />
            </div>
          </div>

          {/* ── RIGHT: Main Content (Filtered on mobile based on activeId) ── */}
          <div className="mt-8 min-w-0 space-y-16 lg:mt-0">
            
            {/* 1. Overview */}
            <section
              id="overview"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "overview"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Landmark} title="Office of the COE" />
              
              <div className="text-muted-foreground mb-8 space-y-4 text-base leading-relaxed md:text-lg">
                <p>
                  The Office of the Controller of Examinations (CoE) carries the key responsibility of meticulously Planning, Organizing, and Conducting the Continuous Internal Assessments (CIA), Practical / Project Viva-Voce Examinations, and the End Semester Examinations (ESE) for all undergraduate (UG), postgraduate (PG), and research programmes at JCT College of Engineering and Technology.
                </p>
                <p>
                  Under our autonomous stream, the office ensures that the detailed Regulations, Curriculum, and Syllabi are consolidated following approvals from the department Board of Studies (BoS), Standing Committee (SC), Academic Council (AC), and Governing Council (GC). Academic Calendars are precisely structured to set teaching schedules, Continuous Internal Assessment slots, and ESE sessions in alignment with the schedules of Anna University, Chennai.
                </p>
                <p>
                  Assessments are conducted with utmost security, confidentiality, and transparency. The CIA is organized twice or thrice per semester (including a comprehensive Model Examination), while the ESE is conducted at the end of each semester. Backed by a highly dedicated Exam Cell team, the COE office delivers error-free evaluation and graduation processes.
                </p>
              </div>

              {/* Dr. D. Elangovan, Controller Profile */}
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start md:p-8">
                  {/* Photo / Avatar */}
                  <div className="flex flex-col items-center gap-3 sm:w-44 sm:shrink-0">
                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-56 sm:w-44">
                      <Image
                        src="/about-us-assets/Controller.png"
                        alt="Dr. D. Elangovan, Controller of Examinations"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">
                        Dr. D. Elangovan
                      </p>
                      <p className="text-gold text-xs font-semibold">Controller of Examinations</p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        M.E. - Ph.D
                      </p>
                    </div>
                  </div>

                  {/* Profile Message */}
                  <div className="flex-1 space-y-4">
                    <blockquote className="text-blue-500 border-gold/50 border-l-4 pl-5 text-base leading-relaxed italic md:text-lg">
                      &quot;Our office stands dedicated to upholding absolute integrity, confidentiality, and rigorous quality standards under the autonomous regulations of the institution.&quot;
                    </blockquote>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      As an autonomous college, JCT implements a robust assessment system aligned with Outcome Based Education (OBE) and Revised Bloom&apos;s Taxonomy. Our dedicated team ensures timely exam scheduling, absolute transparency, and smooth valuation.
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      We integrate digital frameworks for students database mapping, question paper setter selections, central dummy-number valuation, and web-portal entries, encouraging a highly efficient and standardized evaluation workflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Autonomous Academic Governance */}
              <div className="mt-12">
                <h3 className="text-foreground mb-6 font-serif text-xl font-bold flex items-center gap-2">
                  <Layers size={18} className="text-gold" />
                  Autonomous Academic Governance
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "Board of Studies (BoS)",
                      desc: "Department-level panel revising regulation, curriculum, syllabi and mapping course outcomes.",
                      icon: Users,
                    },
                    {
                      title: "Standing Committee (SC)",
                      desc: "Academic screening panel evaluating syllabus proposals and scrutiny reports for subsequent review.",
                      icon: ScrollText,
                    },
                    {
                      title: "Academic Council (AC)",
                      desc: "Supreme statutory body reviewing & approving academic courses, regulations, and exam policies.",
                      icon: Landmark,
                    },
                    {
                      title: "Governing Council (GC)",
                      desc: "Highest authority ratifying policies, semester budgets, infrastructure, and autonomous operations.",
                      icon: Building2,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:-translate-y-1 duration-300"
                    >
                      <div className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-foreground text-sm font-bold leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Roles & Responsibilities */}
            <section
              id="responsibilities"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "responsibilities"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={ClipboardList} title="Roles & Responsibilities" />
              
              <div className="space-y-8">
                {/* Pre-Exam Phase */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-bold leading-none">Pre-Examination Phase</h3>
                      <span className="text-[10px] text-gold font-bold tracking-wider uppercase">Planning & Preparation</span>
                    </div>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "Preparation of the budget for the semester / academic year to verify exam allocations.",
                      "Updating and mapping student & faculty database including discontinued, debarred, and transferred statuses.",
                      "Configuring choice-based credit system (CBCS) databases, mapped electives, and special courses offered.",
                      "Estimating stationery requirements, practical exam booklets, and sheets with subsequent log follow-ups.",
                      "Administering Model Question Paper preparation by internal faculty for Theory & Blended courses.",
                      "Selecting External & Internal question paper setters for End Semester Exams in line with Revised Bloom's Taxonomy.",
                      "Conducting QP Scrutiny Board Meetings to verify syllabus coverage, ensure question clarity, and audit answer keys.",
                      "Generating, verifying, and releasing hall tickets to eligible registered candidates."
                    ].map((item, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base">
                        <CheckCircle size={15} className="text-gold mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Conduction Phase */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-bold leading-none">Examination Conduction Phase</h3>
                      <span className="text-[10px] text-gold font-bold tracking-wider uppercase">Execution & Monitoring</span>
                    </div>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "Announcing examination calendars, slot structures, and exam sessions approved by the Principal.",
                      "Managing candidate registrations, withdrawal applications, regular and arrear course enrollments under CBCS.",
                      "Scheduling and conducting Semester Practical and Project Viva-Voce Examinations with full lab staff coordination.",
                      "Organizing exam teams with Chief Superintendents (CS), Flying Squads, External/Internal Examiners, and skilled support assistants.",
                      "Arranging alternative examiners and superintendents promptly in case of emergency leaves with prior CS alerts.",
                      "Conduction of End Semester theory exams appointing External & Internal Hall Superintendents (EHS/IHS) and Reserve Superintendents.",
                      "Coordinating with the Anna University Representative (AUR) and Flying Squad squads to maintain absolute exam guidelines.",
                      "Convening meeting boards for booked malpractice cases to determine code violations and enforce actions."
                    ].map((item, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base">
                        <CheckCircle size={15} className="text-gold mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Post-Exam Phase */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-bold leading-none">Post-Examination & Evaluation Phase</h3>
                      <span className="text-[10px] text-gold font-bold tracking-wider uppercase">Valuation & Declaration</span>
                    </div>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "Assigning dummy number codes to answer scripts to maintain complete anonymity during evaluation.",
                      "Implementing the Central Valuation System for theory courses with Chief, External, and Internal Examiners.",
                      "Administering phased web portal marks entry for CIA updates and End Semester practical/theory valuation.",
                      "Consolidating results and convening the Result Passing Board Meeting with the consent of the University Nominee.",
                      "Declaring results to candidates via portal and coordinating photocopying and revaluation announcement cycles.",
                      "Processing Photocopy registration, Revaluation applications, and Challenge Revaluation appeals.",
                      "Preparing, verifying, and issuing detailed Grade Sheets and academic transcripts under autonomous regulations.",
                      "Submitting finalized academic year budgets and scrutiny reports to the Governing Council."
                    ].map((item, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base">
                        <CheckCircle size={15} className="text-gold mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Outcome Based Education */}
            <section
              id="obe"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "obe"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={BookOpen} title="Outcome Based Education (OBE)" />
              
              <div className="border-gold/20 bg-gold/5 rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-gold/15 text-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-bold">
                    TLE Integration & Outcome Focus
                  </h3>
                  <div className="text-muted-foreground space-y-4 text-sm leading-relaxed md:text-base">
                    <p className="font-serif italic text-blue-500">
                      &quot;In a nutshell, our entire Teaching-Learning-Evaluation (TLE) process adopts as well as implements with a focussed Outcome Based Education (OBE) and its associated outcomes.&quot;
                    </p>
                    <p>
                      At JCT College of Engineering and Technology, all assessments—including Continuous Internal Assessments (CIA), practical exams, project work, and End Semester Examinations (ESE)—are mapped strictly to clear Course Outcomes (COs), Program Outcomes (POs), and Program Specific Outcomes (PSOs).
                    </p>
                    <p>
                      This ensures that students acquire not just theoretical concepts, but industry-ready cognitive abilities, problem-solving skills, and global engineering competencies under the autonomous assessment stream.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Circulars & Downloads */}
            <section
              id="downloads"
              className={`scroll-mt-28 transition-all duration-300 ${
                activeId === "downloads"
                  ? "block opacity-100"
                  : "hidden lg:block lg:opacity-100"
              }`}
            >
              <SectionHeading icon={Download} title="Circulars & Downloads" />
              
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                Find the latest autonomous stream academic schedules, revaluation circulars, and application forms from the Controller of Examinations below.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    title: "Academic Circular",
                    desc: "Important notices, semester schedules, slots, and guidelines for regular/arrear candidates.",
                    href: "#",
                  },
                  {
                    title: "Registration of Photo Copy",
                    desc: "Official application form and procedure guidelines to request photocopies of evaluated ESE scripts.",
                    href: "#",
                  },
                  {
                    title: "Registration of Revaluation",
                    desc: "Form and fee guidelines to apply for autonomous answer script revaluation checks.",
                    href: "#",
                  },
                  {
                    title: "Application for Review after Re-Evaluation",
                    desc: "Review request forms for challenge revaluation evaluations with designated board scrutiny.",
                    href: "#",
                  },
                ].map((form, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold/30 group duration-300"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Academic Form</span>
                      <h4 className="text-foreground text-base font-bold mt-1 group-hover:text-gold transition-colors duration-300">
                        {form.title}
                      </h4>
                      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                        {form.desc}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-[10px] text-muted-foreground font-semibold"> </span>
                      <a
                        href={form.href}
                        className="text-gold flex items-center gap-1.5 text-xs font-bold hover:underline"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                  </div>
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
