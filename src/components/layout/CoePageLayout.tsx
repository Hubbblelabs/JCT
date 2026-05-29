"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { CoePageValue } from "@/lib/validation";
import { PageBlocksRenderer } from "@/components/shared/PageBlocksRenderer";
import {
  resolveSidebarItems,
  type ResolvedSidebarItem,
  type SidebarNavDefault,
} from "@/lib/sidebar-nav";

// ─── Editable sections ───────────────────────────────────────────────────────

export type CoeEditableSection =
  | "hero"
  | "overview"
  | "responsibilities"
  | "obe"
  | "downloads"
  | "sidebar"
  | "customContent";

export const COE_SECTION_LABELS: Record<CoeEditableSection, string> = {
  hero: "Hero",
  overview: "Office of the COE (Overview)",
  responsibilities: "Roles & Responsibilities",
  obe: "Outcome Based Education",
  downloads: "Circulars & Downloads",
  sidebar: "Sidebar (Quick Facts & CTA)",
  customContent: "Custom Content",
};

export const COE_SECTION_ORDER: CoeEditableSection[] = [
  "hero",
  "overview",
  "responsibilities",
  "obe",
  "downloads",
  "sidebar",
  "customContent",
];

// Position-based icons — cannot be persisted in the DB.
const GOVERNANCE_ICONS: LucideIcon[] = [Users, ScrollText, Landmark, Building2];
const PHASE_ICONS: LucideIcon[] = [Settings, Activity, FileText];

export const COE_NAV_DEFAULTS: SidebarNavDefault[] = [
  { anchor: "overview", navLabel: "Overview", icon: FileText },
  {
    anchor: "responsibilities",
    navLabel: "Roles & Responsibilities",
    icon: ClipboardList,
  },
  { anchor: "obe", navLabel: "Outcome Based Education", icon: BookOpen },
  { anchor: "downloads", navLabel: "Circulars & Downloads", icon: Download },
];

const imgUrl = (v: string) => getImageUrl(v) || v || "/avatars/male_avatar.png";

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
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

function CoeSideNav({
  data,
  activeId,
  setActiveId,
  editable,
  onEditSection,
}: {
  data: CoePageValue;
  activeId: string;
  setActiveId: (id: string) => void;
  editable?: boolean;
  onEditSection?: (section: CoeEditableSection) => void;
}) {
  const navItems: ResolvedSidebarItem[] = resolveSidebarItems(
    COE_NAV_DEFAULTS,
    data.sidebar.navItems,
  );
  const builtins = navItems.filter((n) => !n.customHref);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    const observers: IntersectionObserver[] = [];
    builtins.forEach(({ anchor }) => {
      const el = document.getElementById(anchor);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(anchor);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [setActiveId, builtins]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset =
      typeof window !== "undefined" && window.innerWidth >= 1024 ? 120 : 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile pill bar */}
      <EditableRegion
        as="div"
        section="sidebar"
        label={COE_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden"
      >
        <div className="flex w-max gap-2">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "border-gold bg-gold/15 text-gold"
                : "text-muted-foreground hover:text-foreground border-white/10 bg-white/5 hover:border-white/20"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  onClick={editable ? (e) => e.preventDefault() : undefined}
                  className={cls}
                >
                  <Icon size={13} className="shrink-0" />
                  {it.navLabel}
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                onClick={editable ? undefined : () => handleClick(it.anchor)}
                className={cls}
              >
                <Icon size={13} className="shrink-0" />
                {it.navLabel}
              </button>
            );
          })}
        </div>
      </EditableRegion>

      {/* Desktop sticky sidebar — whole card is editable as "sidebar" section */}
      <EditableRegion
        as="div"
        section="sidebar"
        label={COE_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="bg-surface border-border hidden rounded-3xl border p-6 lg:block"
      >
        <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold tracking-wider uppercase">
          On This Page
        </h3>
        <nav className="space-y-1">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
              isActive
                ? "bg-gold/15 text-gold"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`;
            const iconCls = `shrink-0 transition-colors ${
              isActive
                ? "text-gold"
                : "text-muted-foreground group-hover:text-foreground"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  onClick={editable ? (e) => e.preventDefault() : undefined}
                  className={cls}
                >
                  <Icon size={16} className={iconCls} />
                  <span>{it.navLabel}</span>
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                onClick={editable ? undefined : () => handleClick(it.anchor)}
                className={cls}
              >
                <Icon size={16} className={iconCls} />
                <span>{it.navLabel}</span>
                {isActive && (
                  <span className="bg-gold ml-auto h-1.5 w-1.5 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold tracking-wider uppercase">
            COE Quick Facts
          </h3>
          <div className="space-y-3">
            {data.sidebar.quickFacts.map((fact, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {fact.label}
                </span>
                <span className="text-foreground text-sm font-bold">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        {data.sidebar.ctaLabel && (
          <Link
            href={data.sidebar.ctaHref || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={editable ? (e) => e.preventDefault() : undefined}
            className="bg-gold text-navy mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center font-bold transition-colors hover:bg-[#e8b84a]"
          >
            {data.sidebar.ctaLabel}
            <ChevronRight size={16} />
          </Link>
        )}
      </EditableRegion>
    </>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function CoePageLayout({
  data,
  editable = false,
  onEditSection,
}: {
  data: CoePageValue;
  editable?: boolean;
  onEditSection?: (section: CoeEditableSection) => void;
}) {
  const [activeId, setActiveId] = useState<string>("overview");

  const sectionVis = (anchor: string) =>
    editable
      ? "block"
      : activeId === anchor
        ? "block opacity-100"
        : "hidden lg:block lg:opacity-100";

  const ctrl = data.overview.controller;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={COE_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero title={data.hero.title} subtitle={data.hero.subtitle} />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "COE" },
          ]}
        />

        <div id="mobile-nav-container" className="mt-8 lg:hidden">
          <CoeSideNav
            data={data}
            activeId={activeId}
            setActiveId={setActiveId}
            editable={editable}
            onEditSection={onEditSection}
          />
        </div>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:grid-cols-[300px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <CoeSideNav
                data={data}
                activeId={activeId}
                setActiveId={setActiveId}
                editable={editable}
                onEditSection={onEditSection}
              />
            </div>
          </div>

          <div className="mt-8 min-w-0 space-y-16 lg:mt-0">
            {/* 1. Overview */}
            <EditableRegion
              as="section"
              id="overview"
              section="overview"
              label={COE_SECTION_LABELS.overview}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("overview")}`}
            >
              <SectionHeading icon={Landmark} title="Office of the COE" />

              <div className="text-muted-foreground mb-8 space-y-4 text-base leading-relaxed md:text-lg">
                {data.overview.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Controller profile */}
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start md:p-8">
                  <div className="flex flex-col items-center gap-3 sm:w-44 sm:shrink-0">
                    <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-56 sm:w-44">
                      <Image
                        src={imgUrl(ctrl.image)}
                        alt={ctrl.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 144px, 176px"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">{ctrl.name}</p>
                      <p className="text-gold text-xs font-semibold">
                        {ctrl.title}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">
                        {ctrl.qual}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <blockquote className="border-gold/50 border-l-4 pl-5 text-base leading-relaxed text-blue-500 italic md:text-lg">
                      &quot;{ctrl.quote}&quot;
                    </blockquote>
                    {ctrl.messages.map((msg, i) => (
                      <p
                        key={i}
                        className="text-muted-foreground text-sm leading-relaxed md:text-base"
                      >
                        {msg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Autonomous Academic Governance */}
              <div className="mt-12">
                <h3 className="text-foreground mb-6 flex items-center gap-2 font-serif text-xl font-bold">
                  <Layers size={18} className="text-gold" />
                  Autonomous Academic Governance
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {data.overview.governance.map((item, index) => {
                    const Icon =
                      GOVERNANCE_ICONS[index % GOVERNANCE_ICONS.length];
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                      >
                        <div className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-foreground text-sm leading-tight font-bold">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </EditableRegion>

            {/* 2. Roles & Responsibilities */}
            <EditableRegion
              as="section"
              id="responsibilities"
              section="responsibilities"
              label={COE_SECTION_LABELS.responsibilities}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("responsibilities")}`}
            >
              <SectionHeading
                icon={ClipboardList}
                title="Roles & Responsibilities"
              />
              <div className="space-y-8">
                {data.responsibilities.phases.map((phase, phaseIdx) => {
                  const PhaseIcon = PHASE_ICONS[phaseIdx % PHASE_ICONS.length];
                  return (
                    <div
                      key={phaseIdx}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"
                    >
                      <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                          <PhaseIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-foreground text-lg leading-none font-bold">
                            {phase.name}
                          </h3>
                          <span className="text-gold text-[10px] font-bold tracking-wider uppercase">
                            {phase.subtitle}
                          </span>
                        </div>
                      </div>
                      <ul className="space-y-3.5">
                        {phase.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base"
                          >
                            <CheckCircle
                              size={15}
                              className="text-gold mt-0.5 shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </EditableRegion>

            {/* 3. Outcome Based Education */}
            <EditableRegion
              as="section"
              id="obe"
              section="obe"
              label={COE_SECTION_LABELS.obe}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("obe")}`}
            >
              <SectionHeading
                icon={BookOpen}
                title="Outcome Based Education (OBE)"
              />
              <div className="border-gold/20 bg-gold/5 flex flex-col items-start gap-6 rounded-3xl border p-6 md:flex-row md:p-8">
                <div className="bg-gold/15 text-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-bold">
                    {data.obe.heading}
                  </h3>
                  <div className="text-muted-foreground space-y-4 text-sm leading-relaxed md:text-base">
                    {data.obe.quote && (
                      <p className="font-serif text-blue-500 italic">
                        &quot;{data.obe.quote}&quot;
                      </p>
                    )}
                    {data.obe.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </EditableRegion>

            {/* 4. Circulars & Downloads */}
            <EditableRegion
              as="section"
              id="downloads"
              section="downloads"
              label={COE_SECTION_LABELS.downloads}
              editable={editable}
              onEditSection={onEditSection}
              className={`scroll-mt-28 transition-all duration-300 ${sectionVis("downloads")}`}
            >
              <SectionHeading icon={Download} title="Circulars & Downloads" />
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed md:text-base">
                {data.downloads.description}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {data.downloads.forms.map((form, index) => (
                  <div
                    key={index}
                    className="hover:border-gold/30 group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10"
                  >
                    <div>
                      <span className="text-gold text-[10px] font-bold tracking-wider uppercase">
                        Academic Form
                      </span>
                      <h4 className="text-foreground group-hover:text-gold mt-1 text-base font-bold transition-colors duration-300">
                        {form.title}
                      </h4>
                      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                        {form.desc}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-end border-t border-white/5 pt-4">
                      <a
                        href={form.href || "#"}
                        target={form.href ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={
                          editable || !form.href
                            ? (e) => e.preventDefault()
                            : undefined
                        }
                        className="text-gold flex items-center gap-1.5 text-xs font-bold hover:underline"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </EditableRegion>
          </div>
        </div>
      </div>

      {/* ── Custom Content ── */}
      {(editable || (data.customBlocks && data.customBlocks.length > 0)) && (
        <EditableRegion
          section="customContent"
          label="Custom Content"
          editable={editable}
          onEditSection={onEditSection}
          className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"
        >
          {editable && (!data.customBlocks || data.customBlocks.length === 0) ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
              Click to add custom content blocks
            </div>
          ) : (
            <PageBlocksRenderer blocks={data.customBlocks ?? []} />
          )}
        </EditableRegion>
      )}

      {!editable && <Footer />}
    </main>
  );
}
