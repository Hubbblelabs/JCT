"use client";

import { useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Users,
  FlaskConical,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  Briefcase,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getImageUrl } from "@/lib/utils";
import type { Section, TabsProgram } from "@/lib/program-tabs";

export type { Section, Tab, TabsProgram } from "@/lib/program-tabs";
export { isTabsContent, normalizeTabsContent } from "@/lib/program-tabs";

const ICONS: Record<string, ElementType> = {
  overview: BookOpen,
  bookOpen: BookOpen,
  academics: GraduationCap,
  graduationCap: GraduationCap,
  faculty: Users,
  users: Users,
  facilities: FlaskConical,
  flaskConical: FlaskConical,
  life: Trophy,
  trophy: Trophy,
  career: TrendingUp,
  trendingUp: TrendingUp,
  image: ImageIcon,
  message: MessageSquare,
  briefcase: Briefcase,
  mail: Mail,
};

type Props = {
  dept: TabsProgram;
  backHref: string;
  backLabel: string;
};

export function TabsProgramLayout({ dept, backHref, backLabel }: Props) {
  const tabs = Array.isArray(dept.tabs) ? dept.tabs : [];
  const [active, setActive] = useState<string>(tabs[0]?.id ?? "");
  const accent = dept.accentColor ?? "#0F4C81";

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />

      <section
        className="relative isolate flex h-72 items-end overflow-hidden md:h-80"
        style={{ backgroundColor: accent }}
      >
        {dept.heroImage && (
          <Image
            src={getImageUrl(dept.heroImage) ?? dept.heroImage}
            alt={dept.name}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 pb-10 md:px-6">
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-white/85 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white md:text-5xl">
            {dept.name}
          </h1>
          {dept.shortName && (
            <p className="mt-1 text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
              {dept.shortName}
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:px-6 md:py-12">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {tabs.map((tab) => {
              const Icon = ICONS[tab.icon ?? tab.id] ?? BookOpen;
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive ? `${accent}12` : "transparent",
                    color: isActive ? accent : "#334155",
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: accent }} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="border-b border-slate-200 pb-3 font-serif text-2xl font-bold text-slate-900 md:text-3xl">
                {activeTab.label}
              </h2>
              {activeTab.sections.map((section, i) => (
                <SectionRenderer key={i} section={section} accent={accent} />
              ))}
              {activeTab.sections.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
                  No content yet for this tab.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function SectionRenderer({
  section,
  accent,
}: {
  section: Section;
  accent: string;
}) {
  if (section.kind === "richText") {
    return (
      <div
        className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-6 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: section.html }}
      />
    );
  }

  if (section.kind === "stats") {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4 text-center"
          >
            <div
              className="font-serif text-2xl font-bold md:text-3xl"
              style={{ color: accent }}
            >
              {item.value}
            </div>
            <div className="mt-1 text-sm font-medium text-slate-700">
              {item.label}
            </div>
            {item.sub && (
              <div className="mt-1 text-xs text-slate-400">{item.sub}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "list") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {section.title && (
          <h3 className="mb-3 text-base font-semibold text-slate-800">
            {section.title}
          </h3>
        )}
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: accent }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.kind === "cards") {
    return (
      <div className="space-y-3">
        {section.title && (
          <h3 className="text-base font-semibold text-slate-800">
            {section.title}
          </h3>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {item.image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={getImageUrl(item.image) ?? item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="mb-1 font-semibold text-slate-800">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === "image") {
    return (
      <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={getImageUrl(section.src) ?? section.src}
            alt={section.caption ?? ""}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
        {section.caption && (
          <figcaption className="px-4 py-2 text-sm text-slate-500">
            {section.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (section.kind === "people") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100">
              {item.image && (
                <Image
                  src={getImageUrl(item.image) ?? item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="truncate font-semibold text-slate-800">
                {item.name}
              </h4>
              <p className="text-sm" style={{ color: accent }}>
                {item.title}
              </p>
              {item.qualifications && (
                <p className="mt-1 text-xs text-slate-500">
                  {item.qualifications}
                </p>
              )}
              {item.email && (
                <a
                  href={`mailto:${item.email}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:underline"
                >
                  <Mail size={12} /> {item.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
