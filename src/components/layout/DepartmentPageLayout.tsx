"use client";

import { useEffect, useState, type ElementType } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Star,
  Microscope,
  Quote,
} from "lucide-react";
import type { DepartmentData } from "@/types/department";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SIDEBAR_ITEMS = [
  { id: "about", label: "About the Department", icon: BookOpen },
  { id: "hod", label: "HoD's Desk", icon: GraduationCap },
  { id: "vision-mission", label: "Vision & Mission", icon: Target },
  { id: "program-outcomes", label: "Program Outcomes (POs)", icon: Award },
  { id: "advisory-board", label: "Department Advisory Board", icon: Users },
  { id: "pac", label: "Program Assessment Committee", icon: Clipboard },
  { id: "bos", label: "Board of Studies", icon: FileText },
  { id: "curriculum", label: "Curriculum & Syllabus", icon: BookOpen },
  { id: "teaching", label: "Teaching Learning Process", icon: Microscope },
  { id: "value-added", label: "Value Added Courses", icon: Star },
  { id: "faculty", label: "Faculty Details", icon: Users },
  { id: "labs", label: "Laboratories", icon: FlaskConical },
  { id: "library", label: "Department Library", icon: Library },
  { id: "events", label: "Events Organized", icon: Calendar },
  { id: "student-participation", label: "Student Participation", icon: Users },
  { id: "faculty-participation", label: "Faculty Participation", icon: Users },
  { id: "student-achievements", label: "Student Achievements", icon: Award },
  { id: "faculty-achievements", label: "Faculty Achievements", icon: Award },
  { id: "magazine", label: "Dept. Magazine / Newsletter", icon: Newspaper },
  { id: "career", label: "Career Progression", icon: TrendingUp },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
] as const;

function SectionHeading({
  id,
  icon: Icon,
  title,
  accentColor,
}: {
  id: string;
  icon: ElementType;
  title: string;
  accentColor: string;
}) {
  return (
    <div id={id} className="mb-8 scroll-mt-28">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div
        className="h-0.5 w-16 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

function SidebarItem({
  item,
  active,
  accentColor,
  index,
  onClick,
}: {
  item: (typeof SIDEBAR_ITEMS)[number];
  active: boolean;
  accentColor: string;
  index: number;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        active
          ? "font-semibold text-white shadow-md"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
      style={active ? { backgroundColor: accentColor } : {}}
    >
      <span
        className={`w-5 shrink-0 text-xs font-bold ${active ? "text-white/50" : "text-gray-300"}`}
      >
        {String(index).padStart(2, "0")}
      </span>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-sm leading-tight">{item.label}</span>
    </button>
  );
}

function BoardTable({
  members,
  accentColor,
}: {
  members: DepartmentData["advisoryBoard"];
  accentColor: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: `${accentColor}12` }}>
            {["Name", "Designation", "Organization", "Role"].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
              <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
              <td className="px-4 py-3 text-gray-700">{m.designation}</td>
              <td className="px-4 py-3 text-gray-600">{m.organization}</td>
              <td className="px-4 py-3">
                {m.role && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {m.role}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AchievementGrid({
  achievements,
  accentColor,
}: {
  achievements: DepartmentData["studentAchievements"];
  accentColor: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {achievements.map((a, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Award className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: accentColor }}>
                {a.year}
              </span>
              <h4 className="mt-0.5 font-bold text-gray-900">{a.name}</h4>
              <p className="text-sm font-medium text-gray-700">{a.title}</p>
              <p className="mt-1 text-xs text-gray-500">{a.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DepartmentPageLayout({
  dept,
  backHref,
  backLabel,
}: {
  dept: DepartmentData;
  backHref: string;
  backLabel: string;
}) {
  const [activeId, setActiveId] = useState<string>("about");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSemester, setActiveSemester] = useState(0);
  const ac = dept.accentColor;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SIDEBAR_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-15% 0px -80% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden py-24 pt-36"
        style={{ backgroundColor: dept.bgColor }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={dept.heroImage}
            alt={dept.name}
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/20" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            ← {backLabel}
          </Link>
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: `${ac}25`,
              color: ac,
              borderColor: `${ac}40`,
            }}
          >
            {dept.college === "engineering"
              ? "B.E. Department"
              : dept.college === "arts-science"
                ? "UG Program"
                : "Diploma Program"}{" "}
            · {dept.about.intake} Intake
          </div>
          <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            {dept.name}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <span>Est. {dept.about.established}</span>
            <span>·</span>
            <span>{dept.about.affiliation}</span>
            <span>·</span>
            <span>{dept.about.accreditation}</span>
          </div>
        </div>
      </header>

      {/* ── Mobile topbar ── */}
      <div className="sticky top-16 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold text-gray-700">
          {SIDEBAR_ITEMS.find((i) => i.id === activeId)?.label ?? "Navigate"}
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: ac }}
        >
          <Menu className="h-4 w-4" /> Sections
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-80 overflow-y-auto bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-bold text-gray-900">Department Sections</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-3">
                {SIDEBAR_ITEMS.map((item, i) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    active={activeId === item.id}
                    accentColor={ac}
                    index={i + 1}
                    onClick={() => scrollTo(item.id)}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen bg-gray-50">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-100 bg-white py-4">
            <div className="mb-1 px-4 pb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Department Sections
              </p>
            </div>
            <nav className="px-3">
              {SIDEBAR_ITEMS.map((item, i) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  active={activeId === item.id}
                  accentColor={ac}
                  index={i + 1}
                  onClick={() => scrollTo(item.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1 px-4 py-12 md:px-8 lg:px-12">

          {/* 1 ── About */}
          <section className="mb-16">
            <SectionHeading id="about" icon={BookOpen} title="About the Department" accentColor={ac} />
            <div className="space-y-4 leading-relaxed text-gray-700">
              {dept.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Established", value: dept.about.established },
                { label: "Intake", value: `${dept.about.intake} Seats` },
                { label: "Accreditation", value: dept.about.accreditation },
                { label: "Affiliation", value: dept.about.affiliation },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                >
                  <p className="text-lg font-black text-gray-900">{s.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2 ── HoD's Desk */}
          <section className="mb-16">
            <SectionHeading id="hod" icon={GraduationCap} title="HoD's Desk" accentColor={ac} />
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="shrink-0 text-center">
                  <div
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-black text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {dept.hod.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <p className="mt-3 text-sm font-bold text-gray-900">{dept.hod.name}</p>
                  <p className="text-xs text-gray-500">{dept.hod.designation}</p>
                  <p className="text-xs text-gray-400">{dept.hod.qualification}</p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: ac }}>
                    {dept.hod.experience}
                  </p>
                </div>
                <div className="flex-1">
                  <Quote className="mb-3 h-7 w-7 opacity-20" style={{ color: ac }} />
                  <div className="space-y-3 leading-relaxed text-gray-700">
                    {dept.hod.message.map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 ── Vision & Mission */}
          <section className="mb-16">
            <SectionHeading id="vision-mission" icon={Target} title="Vision & Mission" accentColor={ac} />
            <div className="grid gap-6 md:grid-cols-2">
              <div
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: ac }}
              >
                <p className="mb-3 text-xs font-bold uppercase tracking-widest opacity-70">
                  Vision
                </p>
                <p className="text-lg font-semibold leading-relaxed">
                  {dept.visionMission.vision}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: ac }}
                >
                  Mission
                </p>
                <ul className="space-y-2">
                  {dept.visionMission.mission.map((m, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: ac }}
                      />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4 ── Program Outcomes */}
          <section className="mb-16">
            <SectionHeading id="program-outcomes" icon={Award} title="Program Outcomes (POs)" accentColor={ac} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dept.programOutcomes.map((po) => (
                <div
                  key={po.code}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <span
                    className="mb-2 inline-block rounded-md px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {po.code}
                  </span>
                  <h4 className="mb-1 font-bold text-gray-900">{po.title}</h4>
                  <p className="text-sm text-gray-600">{po.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5 ── Advisory Board */}
          <section className="mb-16">
            <SectionHeading id="advisory-board" icon={Users} title="Department Advisory Board (DAB)" accentColor={ac} />
            <BoardTable members={dept.advisoryBoard} accentColor={ac} />
          </section>

          {/* 6 ── PAC */}
          <section className="mb-16">
            <SectionHeading id="pac" icon={Clipboard} title="Program Assessment Committee (PAC)" accentColor={ac} />
            <BoardTable members={dept.pac} accentColor={ac} />
          </section>

          {/* 7 ── BOS */}
          <section className="mb-16">
            <SectionHeading id="bos" icon={FileText} title="Board of Studies (BOS)" accentColor={ac} />
            <BoardTable members={dept.bos} accentColor={ac} />
          </section>

          {/* 8 ── Curriculum */}
          <section className="mb-16">
            <SectionHeading id="curriculum" icon={BookOpen} title="Curriculum & Syllabus" accentColor={ac} />
            <div className="mb-5 flex flex-wrap gap-2">
              {dept.curriculum.map((sem, i) => (
                <button
                  key={sem.semester}
                  onClick={() => setActiveSemester(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    activeSemester === i
                      ? "text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                  style={activeSemester === i ? { backgroundColor: ac } : {}}
                >
                  Semester {sem.semester}
                </button>
              ))}
            </div>
            {dept.curriculum[activeSemester] && (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: `${ac}10` }}>
                      {["Code", "Subject", "Credits", "Type"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dept.curriculum[activeSemester].subjects.map((sub, i) => (
                      <tr
                        key={sub.code}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">
                          {sub.code}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {sub.name}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {sub.credits}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              sub.type === "Lab"
                                ? "bg-green-100 text-green-700"
                                : sub.type === "Elective"
                                  ? "bg-purple-100 text-purple-700"
                                  : sub.type === "Project"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
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
            )}
          </section>

          {/* 9 ── Teaching Learning */}
          <section className="mb-16">
            <SectionHeading id="teaching" icon={Microscope} title="Teaching Learning Process" accentColor={ac} />
            <p className="mb-6 leading-relaxed text-gray-700">
              {dept.teachingLearning.overview}
            </p>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { label: "Teaching Methods", items: dept.teachingLearning.methods },
                { label: "Tools & Technologies", items: dept.teachingLearning.tools },
                { label: "Best Practices", items: dept.teachingLearning.practices },
              ].map((col) => (
                <div
                  key={col.label}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <p
                    className="mb-3 text-xs font-bold uppercase tracking-widest"
                    style={{ color: ac }}
                  >
                    {col.label}
                  </p>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-gray-700">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: ac }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 10 ── Value Added Courses */}
          <section className="mb-16">
            <SectionHeading id="value-added" icon={Star} title="Value Added Courses" accentColor={ac} />
            <div className="grid gap-5 md:grid-cols-2">
              {dept.valueAddedCourses.map((course) => (
                <div
                  key={course.name}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h4 className="font-bold text-gray-900">{course.name}</h4>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {course.hours}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-gray-400">{course.provider}</p>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 11 ── Faculty */}
          <section className="mb-16">
            <SectionHeading id="faculty" icon={Users} title="Faculty Details" accentColor={ac} />
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: `${ac}10` }}>
                    {["Name", "Designation", "Qualification", "Experience", "Specialization"].map(
                      (h) => (
                        <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dept.faculty.map((f, i) => (
                    <tr key={f.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: ac }}
                          >
                            {f.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{f.designation}</td>
                      <td className="px-4 py-3 text-gray-600">{f.qualification}</td>
                      <td className="px-4 py-3 text-gray-600">{f.experience}</td>
                      <td className="px-4 py-3 text-gray-600">{f.specialization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 12 ── Labs */}
          <section className="mb-16">
            <SectionHeading id="labs" icon={FlaskConical} title="Laboratories" accentColor={ac} />
            <div className="grid gap-5 md:grid-cols-2">
              {dept.labs.map((lab) => (
                <div
                  key={lab.name}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h4 className="mb-2 font-bold text-gray-900">{lab.name}</h4>
                  <p className="mb-4 text-sm text-gray-600">{lab.description}</p>
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: ac }}
                  >
                    Equipment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lab.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="rounded-md px-2 py-1 text-xs text-gray-700"
                        style={{ backgroundColor: `${ac}12` }}
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 13 ── Library */}
          <section className="mb-16">
            <SectionHeading id="library" icon={Library} title="Department Library" accentColor={ac} />
            <p className="mb-6 leading-relaxed text-gray-700">{dept.library.description}</p>
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                { label: "Books", value: dept.library.books.toLocaleString() },
                { label: "Journals", value: dept.library.journals },
                { label: "Magazines", value: dept.library.magazines },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                >
                  <p className="text-3xl font-black" style={{ color: ac }}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: ac }}
              >
                Digital Access & Online Resources
              </p>
              <div className="flex flex-wrap gap-2">
                {dept.library.digitalAccess.map((r) => (
                  <span
                    key={r}
                    className="rounded-lg px-3 py-1.5 text-sm text-gray-700"
                    style={{ backgroundColor: `${ac}12` }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 14 ── Events */}
          <section className="mb-16">
            <SectionHeading id="events" icon={Calendar} title="Events Organized" accentColor={ac} />
            <div
              className="relative border-l-2 pl-6"
              style={{ borderColor: `${ac}30` }}
            >
              {dept.events.map((ev, i) => (
                <div key={i} className="relative mb-8 last:mb-0">
                  <div
                    className="absolute -left-6.5 h-4 w-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: ac }}
                  />
                  <div className="ml-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900">{ev.title}</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: ac }}
                        >
                          {ev.type}
                        </span>
                        <span className="text-xs text-gray-400">{ev.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{ev.description}</p>
                    {ev.resourcePerson && (
                      <p className="mt-2 text-xs font-semibold text-gray-500">
                        Resource Person: {ev.resourcePerson}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 15 ── Student Participation */}
          <section className="mb-16">
            <SectionHeading id="student-participation" icon={Users} title="Student Participation" accentColor={ac} />
            <div className="mb-6">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: ac }}
              >
                Clubs & Associations
              </p>
              <div className="flex flex-wrap gap-2">
                {dept.studentParticipation.clubs.map((club) => (
                  <span
                    key={club}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: ac }}
                  >
                    {club}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {dept.studentParticipation.highlights.map((h) => (
                <div
                  key={h.title}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <span className="text-xs font-bold" style={{ color: ac }}>
                    {h.year}
                  </span>
                  <h4 className="mb-2 mt-1 font-bold text-gray-900">{h.title}</h4>
                  <p className="text-sm text-gray-600">{h.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 16 ── Faculty Participation */}
          <section className="mb-16">
            <SectionHeading id="faculty-participation" icon={Users} title="Faculty Participation" accentColor={ac} />
            <div className="mb-8">
              <p
                className="mb-4 text-xs font-bold uppercase tracking-widest"
                style={{ color: ac }}
              >
                Conferences & Paper Presentations
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: `${ac}10` }}>
                      {["Faculty", "Conference / Event", "Venue", "Year"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dept.facultyParticipation.conferences.map((c, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">{c.faculty}</td>
                        <td className="px-4 py-3 text-gray-700">{c.title}</td>
                        <td className="px-4 py-3 text-gray-600">{c.venue}</td>
                        <td className="px-4 py-3 text-gray-600">{c.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: ac }}
              >
                Workshops & FDPs Attended
              </p>
              <div className="flex flex-wrap gap-2">
                {dept.facultyParticipation.workshops.map((w) => (
                  <span
                    key={w}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 17 ── Student Achievements */}
          <section className="mb-16">
            <SectionHeading id="student-achievements" icon={Award} title="Student Achievements" accentColor={ac} />
            <AchievementGrid achievements={dept.studentAchievements} accentColor={ac} />
          </section>

          {/* 18 ── Faculty Achievements */}
          <section className="mb-16">
            <SectionHeading id="faculty-achievements" icon={Award} title="Faculty Achievements" accentColor={ac} />
            <AchievementGrid achievements={dept.facultyAchievements} accentColor={ac} />
          </section>

          {/* 19 ── Magazine */}
          <section className="mb-16">
            <SectionHeading id="magazine" icon={Newspaper} title="Department Magazine / Newsletter" accentColor={ac} />
            <div
              className="overflow-hidden rounded-2xl border-2"
              style={{ borderColor: `${ac}30` }}
            >
              <div className="p-6 text-white" style={{ backgroundColor: ac }}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">
                  Department Publication
                </p>
                <h3 className="mb-1 text-2xl font-black">{dept.magazine.name}</h3>
                <p className="opacity-80">{dept.magazine.description}</p>
              </div>
              <div className="bg-white p-6">
                <div className="mb-6 flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Frequency</p>
                    <p className="font-semibold text-gray-900">{dept.magazine.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Latest Issue</p>
                    <p className="font-semibold text-gray-900">{dept.magazine.latestIssue}</p>
                  </div>
                </div>
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: ac }}
                >
                  Recent Highlights
                </p>
                <ul className="space-y-2">
                  {dept.magazine.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-gray-700">
                      <ChevronRight
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: ac }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 20 ── Career Progression */}
          <section className="mb-16">
            <SectionHeading id="career" icon={TrendingUp} title="Career Progression" accentColor={ac} />
            <div className="mb-8 grid grid-cols-2 gap-4">
              {[
                { label: "Placement Rate", value: dept.careerProgression.placementRate },
                { label: "Avg. Package", value: dept.careerProgression.averagePackage },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border-2 p-5 text-center"
                  style={{ borderColor: `${ac}30` }}
                >
                  <p className="text-3xl font-black" style={{ color: ac }}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: ac }}
                >
                  Top Recruiters
                </p>
                <div className="flex flex-wrap gap-2">
                  {dept.careerProgression.topRecruiters.map((r) => (
                    <span
                      key={r}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                      style={{ backgroundColor: ac }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <p
                  className="mb-3 text-xs font-bold uppercase tracking-widest"
                  style={{ color: ac }}
                >
                  Higher Studies
                </p>
                <ul className="space-y-2">
                  {dept.careerProgression.higherStudies.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-gray-700">
                      <ChevronRight
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: ac }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 21 ── Feedback */}
          <section className="mb-16">
            <SectionHeading id="feedback" icon={MessageSquare} title="Feedback (Curriculum / Facility)" accentColor={ac} />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Curriculum Feedback Process", items: dept.feedback.curriculumProcess },
                { label: "Facility Feedback Process", items: dept.feedback.facilityProcess },
                { label: "Recent Improvements", items: dept.feedback.recentImprovements },
              ].map((col) => (
                <div
                  key={col.label}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <p
                    className="mb-3 text-xs font-bold uppercase tracking-widest"
                    style={{ color: ac }}
                  >
                    {col.label}
                  </p>
                  <ol className="space-y-3">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: ac }}
                        >
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
