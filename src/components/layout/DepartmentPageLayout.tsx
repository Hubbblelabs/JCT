"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Target,
  Award,
  Users,
  Clipboard,
  FileText,
  FlaskConical,
  Library,
  Calendar,
  Newspaper,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Star,
  Microscope,
  Quote,
  ArrowLeft,
  Trophy,
  Mail,
  Beaker,
  Briefcase,
  Layers,
  Info,
  BookMarked,
  Zap,
} from "lucide-react";
import type { DepartmentData } from "@/types/department";
import { Navbar } from "@/components/layout/Navbar";
import { ArtsScienceNavbar } from "@/modules/arts-science/ArtsScienceNavbar";
import { PolytechnicNavbar } from "@/modules/polytechnic/PolytechnicNavbar";
import { Footer } from "@/components/layout/Footer";

// ─── Tab Definition ──────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "faculty", label: "Faculty & Council", icon: Users },
  { id: "facilities", label: "Facilities", icon: FlaskConical },
  { id: "life", label: "Life & Achievements", icon: Trophy },
  { id: "career", label: "Career & Feedback", icon: TrendingUp },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Shared Micro Utilities ───────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  ac,
  subtitle,
}: {
  icon: ElementType;
  title: string;
  ac: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${ac}18`, border: `1.5px solid ${ac}30` }}
        >
          <Icon className="h-4 w-4" style={{ color: ac }} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 ml-12">{subtitle}</p>}
      <div className="mt-3 h-0.5 w-full bg-gray-100 relative">
        <span className="absolute left-0 top-0 h-0.5 w-16 rounded-full" style={{ backgroundColor: ac }} />
      </div>
    </div>
  );
}

function StatBento({
  label,
  value,
  ac,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  ac: string;
  icon?: ElementType;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${ac}0d 0%, ${ac}05 100%)`,
        border: `1px solid ${ac}20`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
        style={{ backgroundColor: ac }}
      />
      {Icon && (
        <div className="mb-2">
          <Icon className="h-4 w-4 opacity-40" style={{ color: ac }} />
        </div>
      )}
      <p className="text-2xl font-black tracking-tight md:text-3xl" style={{ color: ac }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">{label}</p>
    </div>
  );
}

function Card({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${
        hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  ac,
  variant = "solid",
}: {
  children: React.ReactNode;
  ac: string;
  variant?: "solid" | "outline" | "ghost";
}) {
  const styles =
    variant === "solid"
      ? { backgroundColor: ac, color: "#fff" }
      : variant === "outline"
        ? { border: `1px solid ${ac}40`, color: ac, backgroundColor: `${ac}0a` }
        : { backgroundColor: `${ac}12`, color: ac };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase"
      style={styles}
    >
      {children}
    </span>
  );
}

function BoardTable({
  members,
  ac,
}: {
  members: DepartmentData["advisoryBoard"];
  ac: string;
}) {
  if (!members || members.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: `${ac}08` }}>
            {["Name", "Designation", "Organization", "Role"].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {members.map((m, i) => (
            <tr key={i} className="transition-colors hover:bg-gray-50/70">
              <td className="px-5 py-3.5 font-semibold text-gray-900">{m.name}</td>
              <td className="px-5 py-3.5 text-gray-600">{m.designation}</td>
              <td className="px-5 py-3.5 text-gray-500">{m.organization}</td>
              <td className="px-5 py-3.5">
                {m.role && <Badge ac={ac}>{m.role}</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────

function OverviewTab({ dept, ac, bg }: { dept: DepartmentData; ac: string; bg: string }) {
  return (
    <div className="space-y-14">
      {/* Quick Stats Bento */}
      <FadeUp>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatBento label="Established" value={dept.about.established} ac={ac} icon={Calendar} />
          <StatBento label="Annual Intake" value={dept.about.intake} ac={ac} icon={Users} />
          <StatBento label="Accreditation" value={dept.about.accreditation} ac={ac} icon={Award} />
          <StatBento label="Affiliation" value={dept.about.affiliation} ac={ac} icon={BookMarked} />
        </div>
      </FadeUp>

      {/* About */}
      <section>
        <SectionHeading icon={Info} title="About the Department" ac={ac} />
        <FadeUp delay={0.05}>
          <Card hover={false} className="p-6 sm:p-8">
            <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
              {dept.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Card>
        </FadeUp>
      </section>

      {/* HoD's Desk */}
      <section>
        <SectionHeading icon={GraduationCap} title="HoD's Desk" ac={ac} />
        <FadeUp delay={0.05}>
          <Card hover={false} className="overflow-hidden">
            {/* Header band */}
            <div
              className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-8"
              style={{
                background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 75%, #000) 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: ac }}
              />
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-xl sm:h-20 sm:w-20 sm:text-3xl"
                style={{ backgroundColor: ac, boxShadow: `0 12px 32px ${ac}50` }}
              >
                {dept.hod.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white sm:text-2xl">{dept.hod.name}</p>
                <p className="text-sm font-medium text-white/75">{dept.hod.designation}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/25 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                    {dept.hod.qualification}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: `${ac}50` }}
                  >
                    {dept.hod.experience} experience
                  </span>
                </div>
              </div>
            </div>
            {/* Message */}
            <div className="p-6 sm:p-8">
              <Quote className="mb-4 h-8 w-8 opacity-10" style={{ color: ac }} />
              <div className="space-y-4 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                {dept.hod.message.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </Card>
        </FadeUp>
      </section>

      {/* Vision & Mission */}
      <section>
        <SectionHeading icon={Target} title="Vision & Mission" ac={ac} />
        <div className="grid gap-5 md:grid-cols-2">
          <FadeUp delay={0.05}>
            {/* Vision */}
            <div
              className="relative h-full overflow-hidden rounded-2xl p-7 text-white sm:p-8"
              style={{
                background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 65%, #000) 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
                style={{ backgroundColor: ac }}
              />
              <div className="relative z-10">
                <Badge ac={ac} variant="outline">
                  <Target className="h-3 w-3" /> Vision
                </Badge>
                <p className="mt-5 text-lg font-medium leading-relaxed sm:text-xl">
                  {dept.visionMission.vision}
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            {/* Mission */}
            <Card hover={false} className="h-full p-7 sm:p-8">
              <Badge ac={ac} variant="ghost">
                <CheckCircle2 className="h-3 w-3" /> Mission
              </Badge>
              <ul className="mt-5 space-y-4">
                {dept.visionMission.mission.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 sm:text-[15px]">
                    <div
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {i + 1}
                    </div>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* Program Outcomes */}
      {dept.programOutcomes?.length > 0 && (
        <section>
          <SectionHeading icon={Award} title="Program Outcomes (POs)" ac={ac} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dept.programOutcomes.map((po, idx) => (
              <FadeUp key={po.code} delay={idx * 0.04}>
                <Card className="h-full p-5">
                  <span
                    className="mb-3 inline-block rounded-lg px-3 py-1 text-xs font-black text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {po.code}
                  </span>
                  <h4 className="mb-2 font-bold text-gray-900 line-clamp-2">{po.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-500">{po.description}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Tab: Academics ──────────────────────────────────────────────────────────

function AcademicsTab({ dept, ac }: { dept: DepartmentData; ac: string }) {
  const [activeSemester, setActiveSemester] = useState(0);
  
  // Use regulations from the actual data
  const regulations = dept.curriculum.map(c => c.regulationName);
  const [activeRegulation, setActiveRegulation] = useState(regulations[0] || "");

  const currentRegulationData = dept.curriculum.find(c => c.regulationName === activeRegulation);
  const semesters = currentRegulationData?.semesters || [];

  return (
    <div className="space-y-14">
      {/* Curriculum */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
          <SectionHeading icon={BookOpen} title="Curriculum & Syllabus" ac={ac} />
          
          {regulations.length > 0 && (
            <div className="flex shrink-0 items-center justify-between gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:mt-1">
              {regulations.map((reg) => (
                <button
                  key={reg}
                  onClick={() => {
                    setActiveRegulation(reg);
                    setActiveSemester(0); // Reset to Semester 1 on regulation change
                  }}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-bold transition-all ${
                    activeRegulation === reg 
                      ? "text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 bg-transparent"
                  }`}
                  style={activeRegulation === reg ? { backgroundColor: ac } : {}}
                >
                  {reg}
                </button>
              ))}
            </div>
          )}
        </div>

        <FadeUp>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {semesters.map((sem, i) => (
              <button
                key={sem.semester}
                onClick={() => setActiveSemester(i)}
                className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300"
                style={
                  activeSemester === i
                    ? { backgroundColor: ac, color: "#fff", boxShadow: `0 6px 16px ${ac}35` }
                    : { backgroundColor: "#f3f4f6", color: "#6b7280" }
                }
              >
                Sem {sem.semester}
              </button>
            ))}
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          {semesters[activeSemester] && (
            <motion.div
              key={`${activeRegulation}-${activeSemester}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
            >
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: `${ac}08` }}>
                      {["Code", "Course Name", "Credits", "Type"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {semesters[activeSemester].subjects.map((sub) => (
                      <tr key={sub.code} className="transition-colors hover:bg-gray-50/70">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-gray-400">
                          {sub.code}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{sub.name}</td>
                        <td className="px-5 py-3.5 font-bold" style={{ color: ac }}>
                          {sub.credits}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              sub.type === "Lab"
                                ? "bg-emerald-50 text-emerald-700"
                                : sub.type === "Elective"
                                  ? "bg-violet-50 text-violet-700"
                                  : sub.type === "Project"
                                    ? "bg-orange-50 text-orange-700"
                                    : "bg-sky-50 text-sky-700"
                            }`}
                          >
                            {sub.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Teaching & Learning */}
      <section>
        <SectionHeading icon={Microscope} title="Teaching Learning Process" ac={ac} />
        <FadeUp>
          <Card hover={false} className="mb-6 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
              {dept.teachingLearning.overview}
            </p>
          </Card>
        </FadeUp>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: "Teaching Methods", items: dept.teachingLearning.methods, icon: BookOpen },
            { label: "Tools & Technologies", items: dept.teachingLearning.tools, icon: Zap },
            { label: "Best Practices", items: dept.teachingLearning.practices, icon: Star },
          ].map((col, ci) => (
            <FadeUp key={col.label} delay={ci * 0.08}>
              <Card className="h-full p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${ac}12` }}
                  >
                    <col.icon className="h-4 w-4" style={{ color: ac }} />
                  </div>
                  <span className="text-[11px] font-black tracking-wider text-gray-500 uppercase">
                    {col.label}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <ChevronRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60"
                        style={{ color: ac }}
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Value Added Courses */}
      {dept.valueAddedCourses?.length > 0 && (
        <section>
          <SectionHeading icon={Star} title="Value Added Courses" ac={ac} />
          <div className="grid gap-5 md:grid-cols-2">
            {dept.valueAddedCourses.map((course, ci) => (
              <FadeUp key={course.name} delay={ci * 0.07}>
                <Card className="h-full p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="font-bold text-gray-900">{course.name}</h4>
                    <Badge ac={ac}>{course.hours}</Badge>
                  </div>
                  <div
                    className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: `${ac}0d`, color: ac }}
                  >
                    <Briefcase className="h-3 w-3" />
                    {course.provider}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{course.description}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Tab: Faculty & Council ───────────────────────────────────────────────────

function FacultyTab({ dept, ac }: { dept: DepartmentData; ac: string }) {
  return (
    <div className="space-y-14">
      {/* Faculty Cards (mobile) / Table (md+) */}
      <section>
        <SectionHeading icon={Users} title="Core Faculty" ac={ac} />

        {/* Mobile cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:hidden">
          {dept.faculty.map((f) => (
            <FadeUp key={f.name}>
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {f.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.designation}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <Detail label="Qualification" value={f.qualification} />
                  <Detail label="Experience" value={f.experience} />
                  <Detail label="Specialization" value={f.specialization} />
                  {f.email && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3 opacity-40" style={{ color: ac }} />
                      <span style={{ color: ac }}>{f.email}</span>
                    </div>
                  )}
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* Desktop table */}
        <FadeUp className="hidden md:block">
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: `${ac}08` }}>
                  {["Faculty Member", "Designation", "Qualification", "Experience", "Specialization"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[11px] font-black tracking-wider text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dept.faculty.map((f) => (
                  <tr key={f.name} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                          style={{ backgroundColor: ac }}
                        >
                          {f.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="font-bold text-gray-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">{f.designation}</td>
                    <td className="px-5 py-3.5 text-gray-500">{f.qualification}</td>
                    <td className="px-5 py-3.5 text-gray-500">{f.experience}</td>
                    <td className="px-5 py-3.5 text-gray-500">{f.specialization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </section>

      {/* Advisory Board */}
      {dept.advisoryBoard?.length > 0 && (
        <section>
          <SectionHeading icon={Users} title="Department Advisory Board (DAB)" ac={ac} />
          <FadeUp>
            <BoardTable members={dept.advisoryBoard} ac={ac} />
          </FadeUp>
        </section>
      )}

      {/* PAC */}
      {dept.pac?.length > 0 && (
        <section>
          <SectionHeading icon={Clipboard} title="Program Assessment Committee (PAC)" ac={ac} />
          <FadeUp>
            <BoardTable members={dept.pac} ac={ac} />
          </FadeUp>
        </section>
      )}

      {/* BOS */}
      {dept.bos?.length > 0 && (
        <section>
          <SectionHeading icon={FileText} title="Board of Studies (BOS)" ac={ac} />
          <FadeUp>
            <BoardTable members={dept.bos} ac={ac} />
          </FadeUp>
        </section>
      )}
    </div>
  );
}

// ─── Tab: Facilities ─────────────────────────────────────────────────────────

function FacilitiesTab({ dept, ac }: { dept: DepartmentData; ac: string }) {
  return (
    <div className="space-y-14">
      {/* Labs */}
      <section>
        <SectionHeading icon={Beaker} title="Laboratories & Workspaces" ac={ac} />
        <div className="grid gap-5 md:grid-cols-2">
          {dept.labs.map((lab, li) => (
            <FadeUp key={lab.name} delay={li * 0.07}>
              <Card className="h-full overflow-hidden">
                {/* Lab header */}
                <div
                  className="flex items-center gap-3.5 px-6 py-4"
                  style={{ background: `linear-gradient(135deg, ${ac}12 0%, ${ac}04 100%)` }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"
                    style={{ border: `1px solid ${ac}25` }}
                  >
                    <FlaskConical className="h-5 w-5" style={{ color: ac }} />
                  </div>
                  <h4 className="font-bold text-gray-900">{lab.name}</h4>
                </div>
                <div className="p-6">
                  <p className="mb-5 text-sm leading-relaxed text-gray-600">{lab.description}</p>
                  <p className="mb-2.5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    Equipment & Tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lab.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700"
                        style={{
                          backgroundColor: `${ac}08`,
                          border: `1px solid ${ac}1a`,
                        }}
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Library */}
      <section>
        <SectionHeading icon={Library} title="Department Library" ac={ac} />
        <FadeUp>
          <Card hover={false} className="mb-5 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
              {dept.library.description}
            </p>
          </Card>
        </FadeUp>
        <div className="mb-5 grid grid-cols-3 gap-3">
          <FadeUp delay={0.04}>
            <StatBento label="Volumes & Books" value={dept.library.books.toLocaleString()} ac={ac} />
          </FadeUp>
          <FadeUp delay={0.08}>
            <StatBento label="Journals" value={dept.library.journals} ac={ac} />
          </FadeUp>
          <FadeUp delay={0.12}>
            <StatBento label="Magazines" value={dept.library.magazines} ac={ac} />
          </FadeUp>
        </div>
        <FadeUp delay={0.16}>
          <Card hover={false} className="p-6 sm:p-8">
            <p className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Digital Access & Online Resources
            </p>
            <div className="flex flex-wrap gap-2">
              {dept.library.digitalAccess.map((r) => (
                <span
                  key={r}
                  className="rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: `${ac}0d`, color: ac, border: `1px solid ${ac}20` }}
                >
                  {r}
                </span>
              ))}
            </div>
          </Card>
        </FadeUp>
      </section>
    </div>
  );
}

// ─── Tab: Life & Achievements ────────────────────────────────────────────────

function LifeTab({ dept, ac, bg }: { dept: DepartmentData; ac: string; bg: string }) {
  return (
    <div className="space-y-14">
      <div className="grid gap-14 lg:grid-cols-2">
        {/* Events Timeline */}
        <section>
          <SectionHeading icon={Calendar} title="Events Organized" ac={ac} />
          <div className="relative border-l-2 border-gray-100 pl-6 ml-3">
            {dept.events.map((ev, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="relative mb-8 last:mb-0">
                  <div
                    className="absolute -left-[1.85rem] mt-1 h-5 w-5 rounded-full border-4 border-white shadow-sm"
                    style={{ backgroundColor: ac }}
                  />
                  <Card className="p-5">
                    <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-bold leading-snug text-gray-900">{ev.title}</h4>
                      <Badge ac={ac}>{ev.type}</Badge>
                    </div>
                    <p className="mb-2 text-xs font-semibold text-gray-400">{ev.date}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{ev.description}</p>
                    {ev.resourcePerson && (
                      <div
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                        style={{ backgroundColor: `${ac}08` }}
                      >
                        <span className="font-bold text-gray-500">Resource Person:</span>
                        <span className="font-semibold" style={{ color: ac }}>
                          {ev.resourcePerson}
                        </span>
                      </div>
                    )}
                  </Card>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        <div className="space-y-14">
          {/* Student Achievements */}
          {dept.studentAchievements?.length > 0 && (
            <section>
              <SectionHeading icon={Trophy} title="Student Achievements" ac={ac} />
              <div className="space-y-4">
                {dept.studentAchievements.map((a, i) => (
                  <FadeUp key={i} delay={i * 0.05}>
                    <Card className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${ac}12`, border: `1px solid ${ac}20` }}
                        >
                          <Trophy className="h-4 w-4" style={{ color: ac }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <Badge ac={ac}>{a.year}</Badge>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                          <p className="text-sm font-medium text-gray-700">{a.title}</p>
                          <p className="mt-1 text-xs text-gray-500">{a.detail}</p>
                        </div>
                      </div>
                    </Card>
                  </FadeUp>
                ))}
              </div>
            </section>
          )}

          {/* Faculty Achievements */}
          {dept.facultyAchievements?.length > 0 && (
            <section>
              <SectionHeading icon={Award} title="Faculty Achievements" ac={ac} />
              <div className="space-y-4">
                {dept.facultyAchievements.map((a, i) => (
                  <FadeUp key={i} delay={i * 0.05}>
                    <Card className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${ac}12`, border: `1px solid ${ac}20` }}
                        >
                          <Award className="h-4 w-4" style={{ color: ac }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge ac={ac}>{a.year}</Badge>
                          <p className="mt-1 font-bold text-gray-900 text-sm">{a.name}</p>
                          <p className="text-sm font-medium text-gray-700">{a.title}</p>
                          <p className="mt-1 text-xs text-gray-500">{a.detail}</p>
                        </div>
                      </div>
                    </Card>
                  </FadeUp>
                ))}
              </div>
            </section>
          )}

          {/* Magazine */}
          {dept.magazine && (
            <section>
              <SectionHeading icon={Newspaper} title="Newsletter / Magazine" ac={ac} />
              <FadeUp>
                <Card hover={false} className="overflow-hidden">
                  <div
                    className="relative p-6 text-white sm:p-8"
                    style={{
                      background: `linear-gradient(135deg, ${bg} 0%, color-mix(in srgb, ${bg} 60%, #000) 100%)`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-xl"
                      style={{ backgroundColor: ac }}
                    />
                    <p className="mb-1 text-[10px] font-black tracking-widest text-white/60 uppercase">
                      Department Publication
                    </p>
                    <h3 className="text-2xl font-black">{dept.magazine.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {dept.magazine.description}
                    </p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="mb-5 flex gap-8">
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          Frequency
                        </p>
                        <p className="mt-1 font-bold text-gray-900">{dept.magazine.frequency}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          Latest Issue
                        </p>
                        <p className="mt-1 font-bold text-gray-900">{dept.magazine.latestIssue}</p>
                      </div>
                    </div>
                    <p className="mb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Recent Highlights
                    </p>
                    <ul className="space-y-2.5">
                      {dept.magazine.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <ChevronRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            style={{ color: ac }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </FadeUp>
            </section>
          )}
        </div>
      </div>

      {/* Clubs & Participation */}
      <section>
        <SectionHeading icon={Users} title="Participation & Clubs" ac={ac} />
        <div className="grid gap-5 md:grid-cols-2">
          <FadeUp>
            <Card hover={false} className="p-6 sm:p-8">
              <h4 className="mb-4 font-bold text-gray-900">Student Clubs</h4>
              <div className="flex flex-wrap gap-2">
                {dept.studentParticipation.clubs.map((club) => (
                  <span
                    key={club}
                    className="rounded-xl px-3.5 py-1.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {club}
                  </span>
                ))}
              </div>
            </Card>
          </FadeUp>
          <FadeUp delay={0.08}>
            <Card hover={false} className="p-6 sm:p-8">
              <h4 className="mb-4 font-bold text-gray-900">Faculty Workshops</h4>
              <div className="flex flex-wrap gap-2">
                {dept.facultyParticipation.workshops.map((w) => (
                  <span
                    key={w}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-sm text-gray-700"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </Card>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Career & Feedback ───────────────────────────────────────────────────

function CareerTab({ dept, ac, bg }: { dept: DepartmentData; ac: string; bg: string }) {
  return (
    <div className="space-y-14">
      {/* Career Progression */}
      <section>
        <SectionHeading icon={TrendingUp} title="Career Progression" ac={ac} />
        <FadeUp>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <StatBento
              label="Placement Rate"
              value={dept.careerProgression.placementRate}
              ac={ac}
              icon={TrendingUp}
            />
            <StatBento
              label="Avg. Package"
              value={dept.careerProgression.averagePackage}
              ac={ac}
              icon={Briefcase}
            />
          </div>
        </FadeUp>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Recruiters */}
          <FadeUp delay={0.08}>
            <Card className="h-full p-6 sm:p-8">
              <h5 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <Layers className="h-4 w-4" style={{ color: ac }} />
                Top Recruiters
              </h5>
              <div className="flex flex-wrap gap-2">
                {dept.careerProgression.topRecruiters.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-gray-100 bg-gray-50 px-3.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-200 hover:bg-white"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </Card>
          </FadeUp>

          {/* Higher Studies */}
          <FadeUp delay={0.12}>
            <Card className="h-full p-6 sm:p-8">
              <h5 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <GraduationCap className="h-4 w-4" style={{ color: ac }} />
                Higher Studies
              </h5>
              <ul className="space-y-3">
                {dept.careerProgression.higherStudies.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm text-gray-700">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: ac }}
                    />
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* Feedback */}
      <section>
        <SectionHeading icon={MessageSquare} title="Feedback & Improvements" ac={ac} />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: "Curriculum Feedback", items: dept.feedback.curriculumProcess },
            { label: "Facility Feedback", items: dept.feedback.facilityProcess },
            { label: "Recent Improvements", items: dept.feedback.recentImprovements },
          ].map((col, ci) => (
            <FadeUp key={col.label} delay={ci * 0.08}>
              <Card className="h-full p-6">
                <span
                  className="mb-4 inline-block rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider uppercase"
                  style={{ backgroundColor: `${ac}0d`, color: ac }}
                >
                  {col.label}
                </span>
                <ul className="space-y-4">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                      <div
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                        style={{ backgroundColor: ac }}
                      >
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Small helper used in faculty mobile card ─────────────────────────────────
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-1 text-xs">
      <span className="shrink-0 font-black text-gray-400 uppercase tracking-wide">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

export function DepartmentPageLayout({
  dept,
  backHref,
  backLabel,
}: {
  dept: DepartmentData;
  backHref: string;
  backLabel: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const ac = dept.accentColor;
  const bg = dept.bgColor;

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.collegeTheme;
    root.dataset.collegeTheme = dept.college;
    return () => {
      if (previous) {
        root.dataset.collegeTheme = previous;
      } else {
        delete root.dataset.collegeTheme;
      }
    };
  }, [dept.college]);

  const collegeLabel =
    dept.college === "engineering"
      ? "B.E. Department"
      : dept.college === "arts-science"
        ? "UG Program"
        : "Diploma Program";

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab dept={dept} ac={ac} bg={bg} />;
      case "academics":
        return <AcademicsTab dept={dept} ac={ac} />;
      case "faculty":
        return <FacultyTab dept={dept} ac={ac} />;
      case "facilities":
        return <FacilitiesTab dept={dept} ac={ac} />;
      case "life":
        return <LifeTab dept={dept} ac={ac} bg={bg} />;
      case "career":
        return <CareerTab dept={dept} ac={ac} bg={bg} />;
      default:
        return null;
    }
  };

  return (
    <>
      {dept.college === "arts-science" ? (
        <ArtsScienceNavbar forceSolidOnTop />
      ) : dept.college === "polytechnic" ? (
        <PolytechnicNavbar forceSolidOnTop />
      ) : (
        <Navbar />
      )}

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="relative min-h-[480px] overflow-hidden pt-28 pb-14 md:min-h-[540px]" style={{ backgroundColor: bg }}>
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src={dept.heroImage}
            alt={dept.name}
            fill
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/40" />
          {/* Glow orb 1 */}
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-[90px] animate-pulse"
            style={{ backgroundColor: ac }}
          />
          {/* Glow orb 2 */}
          <div
            className="absolute left-1/3 bottom-0 h-56 w-56 rounded-full opacity-15 blur-[70px]"
            style={{ backgroundColor: ac }}
          />
          {/* Subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* <Link
              href={backHref}
              className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link> */}
          </motion.div>

          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <span
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] backdrop-blur-sm"
                style={{
                  backgroundColor: `${ac}35`,
                  color: "#fff",
                  borderColor: `${ac}55`,
                }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {collegeLabel} · {dept.about.intake} Seats
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {dept.name}
            </motion.h1>

            {/* Meta pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-white/70"
            >
              {[
                { label: "Est.", value: dept.about.established },
                { label: "Affiliation", value: dept.about.affiliation },
                { label: "Accreditation", value: dept.about.accreditation },
              ].map((item, i) =>
                item.value ? (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-white/30" />}
                    <span>
                      {item.label && <span className="opacity-60 mr-1">{item.label}</span>}
                      <span className="font-semibold text-white">{item.value}</span>
                    </span>
                  </div>
                ) : null
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Main Layout with Sidebar ──────────────────────────────────── */}
      <main className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* ── Floating Sidebar (Tabs) ──────────────────────────────── */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24 z-40 lg:rounded-2xl lg:bg-white lg:p-3 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:border lg:border-slate-200/60">
                <nav className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide lg:flex-col lg:items-stretch lg:gap-1 lg:pb-0">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex w-full shrink-0 items-center justify-center lg:justify-start gap-2.5 rounded-full lg:rounded-xl px-5 py-2.5 lg:px-4 lg:py-3.5 text-sm font-semibold transition-all duration-300 ${
                          isActive ? "" : "hover:bg-slate-200/50 lg:hover:bg-slate-50 text-slate-600"
                        }`}
                        style={isActive ? { color: ac } : {}}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "opacity-60"}`}
                        />
                        <span className="whitespace-nowrap">{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute inset-0 z-[-1] rounded-full lg:rounded-xl"
                            style={{ backgroundColor: `${ac}12`, border: `1.5px solid ${ac}25` }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ── Tab Content Container ───────────────────────────────── */}
            <div className="flex-1 min-w-0 pb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
