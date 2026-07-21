"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Check,
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  Building2,
  FileText,
  Star,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageBlocksRenderer } from "@/components/shared/PageBlocksRenderer";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import {
  resolveSidebarItems,
  type ResolvedSidebarItem,
  type SidebarNavDefault,
} from "@/lib/sidebar-nav";
import type { PageBodySection, PlacementInfoValue } from "@/lib/validation";
import type {
  PublicPlacement,
  PublicNotablePlacement,
  PublicCompanyPlacement,
} from "@/lib/public-placements";

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

// Sections the admin editor can select. The year-wise data (stats, recruiters,
// students, company-wise) is not here — it lives on the Placement records and
// is edited under /admin/placements.
export type PlacementEditableSection =
  "process" | "tpo" | "mou" | "why-recruit" | "sidebar";

export const PLACEMENT_SECTION_LABELS: Record<
  PlacementEditableSection,
  string
> = {
  process: "Placement Process",
  tpo: "TPO Contacts",
  mou: "MoUs & Collaborations",
  "why-recruit": "Why Recruit at JCT",
  sidebar: "Sidebar Navigation",
};

type EditProps = {
  editable?: boolean;
  onEditSection?: (section: string) => void;
};

// In the editor an empty section still has to be clickable — otherwise there's
// no way to add its first entry.
function EmptyHint({ children }: { children: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
      {children}
    </div>
  );
}

// Sidebar entries in the order the page renders them. Admins can relabel,
// reorder, hide, or extend this list via the `sidebar.navItems` override on the
// <college>PlacementInfo site-config key.
export const PLACEMENT_NAV_DEFAULTS: SidebarNavDefault[] = [
  { anchor: "process", navLabel: "Placement Process", icon: ClipboardList },
  { anchor: "tpo", navLabel: "TPO Contacts", icon: Phone },
  { anchor: "mou", navLabel: "MoUs & Collaborations", icon: FileText },
  { anchor: "why-recruit", navLabel: "Why Recruit at JCT", icon: Star },
  { anchor: "overview", navLabel: "Placement Highlights", icon: TrendingUp },
  { anchor: "recruiters", navLabel: "Our Recruiters", icon: Building2 },
  { anchor: "achievers", navLabel: "Placed Students", icon: GraduationCap },
  {
    anchor: "company-wise",
    navLabel: "Placements by Company",
    icon: Briefcase,
  },
];

// Deterministic brand-ish gradients for recruiter/notable monograms so a card
// without a logo/photo still reads as a designed element, never a broken image.
const MONOGRAM_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-rose-600",
  "from-lime-500 to-emerald-600",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function gradientFor(name: string): string {
  return MONOGRAM_GRADIENTS[hashString(name) % MONOGRAM_GRADIENTS.length];
}

// Honorifics carry no identity — without stripping them every TPO officer's
// monogram would read "MR" or "DR".
const HONORIFICS = new Set(["mr", "mrs", "ms", "dr", "prof", "shri", "smt"]);

function initials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => !HONORIFICS.has(w.toLowerCase()));
  if (words.length === 0 || !words[0]) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

type StatDef = {
  key: keyof PublicPlacement;
  label: string;
  icon: typeof Award;
  suffix?: string;
};

// Headline stats shown as big cards for the current year.
const HEADLINE_STATS: StatDef[] = [
  {
    key: "placement_percentage",
    label: "Placement Rate",
    icon: TrendingUp,
    suffix: "%",
  },
  { key: "students_placed", label: "Students Placed", icon: Users },
  { key: "offers_made", label: "Offers Made", icon: Briefcase },
  { key: "companies_visited", label: "Companies Visited", icon: Building2 },
];

const PACKAGE_STATS: StatDef[] = [
  { key: "highest_package", label: "Highest Package", icon: Award },
  { key: "average_package", label: "Average Package", icon: BarChart3 },
  { key: "median_package", label: "Median Package", icon: BarChart3 },
];

// ─── Shared bits ─────────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  meta,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="bg-accent/10 text-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div>
          {eyebrow && (
            <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="text-navy mt-0.5 font-serif text-2xl font-bold md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      {meta && <span className="text-sm text-stone-500">{meta}</span>}
    </div>
  );
}

function Monogram({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradientFor(
        name,
      )} font-bold text-white shadow-sm ${className}`}
    >
      {initials(name)}
    </div>
  );
}

// ─── Sidebar navigation ──────────────────────────────────────────────────────

function PlacementSideNav({
  items,
  activeId,
  onNavigate,
  records,
  selectedId,
  onSelectYear,
  editable,
  onEditSection,
}: {
  items: ResolvedSidebarItem[];
  activeId: string;
  onNavigate: (anchor: string) => void;
  records: PublicPlacement[];
  selectedId: string;
  onSelectYear: (id: string) => void;
} & EditProps) {
  // The year list is the entry point to the year-wise data: the current year is
  // selected by default (records arrive is_current-first) and past years sit
  // under it, so visitors switch years from the sidebar instead of a separate
  // row above the stats.
  const pastYears = records.filter((r) => !r.is_current);
  const currentYears = records.filter((r) => r.is_current);

  return (
    <>
      {/* Mobile: horizontally scrollable pill bar */}
      <div className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden">
        <div className="flex w-max gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              isActive
                ? "border-navy bg-navy text-white"
                : "border-border text-navy bg-white hover:bg-stone-50"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
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
                type="button"
                onClick={() => onNavigate(it.anchor)}
                className={cls}
              >
                <Icon size={13} className="shrink-0" />
                {it.navLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: current year + past-year dropdown */}
      {records.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 lg:hidden">
          {currentYears.map((r) => (
            <YearButton
              key={r._id}
              record={r}
              active={r._id === selectedId}
              onSelect={onSelectYear}
              className="w-auto"
            />
          ))}
          {pastYears.length > 0 && (
            <PastYearSelect
              records={pastYears}
              selectedId={selectedId}
              onSelect={onSelectYear}
            />
          )}
        </div>
      )}

      {/* Desktop: sticky "On This Page" card */}
      <EditableRegion
        as="nav"
        section="sidebar"
        label={PLACEMENT_SECTION_LABELS.sidebar}
        editable={editable}
        onEditSection={onEditSection}
        className="border-border hidden rounded-2xl border bg-white p-5 shadow-sm lg:block"
      >
        <h3 className="text-navy border-border mb-4 border-b pb-3 text-xs font-bold tracking-[0.15em] uppercase">
          On This Page
        </h3>
        <div className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = !it.customHref && activeId === it.anchor;
            const cls = `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              isActive ? "bg-navy text-white" : "text-navy hover:bg-stone-50"
            }`;
            const iconCls = `shrink-0 ${
              isActive ? "text-accent" : "text-stone-400"
            }`;
            if (it.customHref) {
              return (
                <Link
                  key={it.id}
                  href={it.customHref}
                  target={it.isExternal ? "_blank" : undefined}
                  rel={it.isExternal ? "noopener noreferrer" : undefined}
                  className={cls}
                >
                  <Icon size={16} className={iconCls} />
                  <span className="min-w-0 flex-1">{it.navLabel}</span>
                  {it.isExternal && (
                    <ExternalLink
                      size={12}
                      className="shrink-0 text-stone-300"
                    />
                  )}
                </Link>
              );
            }
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onNavigate(it.anchor)}
                className={cls}
              >
                <Icon size={16} className={iconCls} />
                <span className="min-w-0 flex-1">{it.navLabel}</span>
                {isActive && (
                  <span className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {records.length > 0 && (
          <div className="border-border mt-5 border-t pt-5">
            <h3 className="text-navy mb-3 text-xs font-bold tracking-[0.15em] uppercase">
              Placement Data
            </h3>
            <div className="space-y-1">
              {currentYears.map((r) => (
                <YearButton
                  key={r._id}
                  record={r}
                  active={r._id === selectedId}
                  onSelect={onSelectYear}
                />
              ))}
            </div>
            {pastYears.length > 0 && (
              <div className="mt-3">
                <PastYearSelect
                  records={pastYears}
                  selectedId={selectedId}
                  onSelect={onSelectYear}
                />
              </div>
            )}
          </div>
        )}
      </EditableRegion>
    </>
  );
}

function YearButton({
  record,
  active,
  onSelect,
  className = "w-full",
}: {
  record: PublicPlacement;
  active: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(record._id)}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${className} ${
        active
          ? "bg-accent/10 text-accent ring-accent/30 ring-1"
          : "border-border text-navy border hover:bg-stone-50"
      }`}
    >
      <CalendarDays
        size={16}
        className={`shrink-0 ${active ? "text-accent" : "text-stone-400"}`}
      />
      <span className="min-w-0 flex-1">{record.year}</span>
      {record.is_current && (
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
            active ? "bg-accent text-white" : "bg-accent/10 text-accent"
          }`}
        >
          Latest
        </span>
      )}
    </button>
  );
}

// Past years collapse into a dropdown so the sidebar stays short no matter how
// many academic years accumulate. Hand-rolled rather than a native <select> so
// each year can carry its placement rate — and so it matches the page's card
// styling instead of the OS widget. Implements the listbox keyboard contract
// (arrows / Home / End / Enter / Escape) that <select> would have given us.
function PastYearSelect({
  records,
  selectedId,
  onSelect,
}: {
  records: PublicPlacement[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Opens upward when the panel wouldn't fit below — the sidebar sits low on
  // the page once it's pinned.
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedIdx = records.findIndex((r) => r._id === selectedId);
  const selected = selectedIdx >= 0 ? records[selectedIdx] : null;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const panelHeight = Math.min(records.length * 52 + 16, 264);

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setDropUp(below < panelHeight + 16 && rect.top > below);
    }
    setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
    setOpen(true);
  };

  const commit = (i: number) => {
    const record = records[i];
    if (!record) return;
    onSelect(record._id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % records.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + records.length) % records.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(records.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
          selected
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border text-navy bg-white hover:border-stone-300 hover:bg-stone-50"
        } ${open ? "ring-accent/20 ring-2" : ""}`}
      >
        <CalendarDays
          size={16}
          className={`shrink-0 ${selected ? "text-accent" : "text-stone-400"}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
            Past Years
          </span>
          <span className="block text-sm font-semibold">
            {selected ? selected.year : `${records.length} earlier batches`}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-stone-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Past years"
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{ maxHeight: panelHeight }}
            className={`border-border absolute right-0 left-0 z-30 overflow-y-auto rounded-xl border bg-white p-1.5 shadow-xl ${
              dropUp ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {records.map((r, i) => {
              const isSelected = r._id === selectedId;
              const isActive = i === activeIndex;
              return (
                <li key={r._id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => commit(i)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      isSelected
                        ? "bg-accent/10 text-accent"
                        : isActive
                          ? "text-navy bg-stone-100"
                          : "text-navy"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {r.year}
                      </span>
                      {r.placement_percentage > 0 && (
                        <span className="block text-[11px] text-stone-400">
                          {r.placement_percentage}% placed
                          {r.students_placed > 0 &&
                            ` · ${r.students_placed} students`}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Check size={15} className="text-accent shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CMS-backed sections ─────────────────────────────────────────────────────

function MouSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["mou"] } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="mou"
      section="mou"
      label={PLACEMENT_SECTION_LABELS.mou}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={FileText}
        eyebrow="Industry Partnerships"
        title={data.heading || "MoUs & Collaborations"}
        meta={
          data.items.length > 0
            ? `${data.items.length} ${data.items.length === 1 ? "partner" : "partners"}`
            : undefined
        }
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.items.length === 0 && editable && (
        <EmptyHint>Click to add MoUs</EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.items.map((m, i) => {
          const logo = getImageUrl(m.logo);
          const card = (
            <div className="border-border flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center gap-3">
                {logo ? (
                  <div className="relative h-10 w-10 shrink-0">
                    <Image
                      src={logo}
                      alt={m.organization}
                      fill
                      sizes="40px"
                      className="rounded-lg object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Monogram
                    name={m.organization || "MoU"}
                    className="h-10 w-10 shrink-0 rounded-lg text-xs"
                  />
                )}
                <h3 className="text-navy min-w-0 font-serif text-base font-bold">
                  {m.organization}
                </h3>
                {m.href && (
                  <ExternalLink size={14} className="ml-auto text-stone-300" />
                )}
              </div>
              {m.purpose && (
                <p className="text-sm leading-relaxed text-stone-600">
                  {m.purpose}
                </p>
              )}
              {(m.signedOn || m.validity) && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                  {m.signedOn && (
                    <span className="flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-stone-500">
                      <CalendarDays size={11} /> Signed {m.signedOn}
                    </span>
                  )}
                  {m.validity && (
                    <span className="bg-accent/10 text-accent rounded-full px-2.5 py-1 text-[11px] font-bold">
                      Valid {m.validity}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
          return m.href ? (
            <Link
              key={`${m.organization}-${i}`}
              href={m.href}
              target={/^https?:\/\//i.test(m.href) ? "_blank" : undefined}
              rel={
                /^https?:\/\//i.test(m.href) ? "noopener noreferrer" : undefined
              }
              className="block"
            >
              {card}
            </Link>
          ) : (
            <div key={`${m.organization}-${i}`}>{card}</div>
          );
        })}
      </div>
    </EditableRegion>
  );
}

function WhyRecruitSection({
  data,
  label,
  editable,
  onEditSection,
}: {
  data: PlacementInfoValue["whyRecruit"];
  label: string;
} & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="why-recruit"
      section="why-recruit"
      label={PLACEMENT_SECTION_LABELS["why-recruit"]}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Star}
        eyebrow="For Recruiters"
        title={data.heading || `Why Recruit at JCT ${label}`}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.points.length === 0 && editable && (
        <EmptyHint>Click to add reasons to recruit here</EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.points.map((p, i) => (
          <motion.div
            key={`${p.title}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.06 }}
            className="border-border h-full rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
              <CheckCircle2 size={19} strokeWidth={1.75} />
            </div>
            <h3 className="text-navy font-serif text-base font-bold">
              {p.title}
            </h3>
            {p.desc && (
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {p.desc}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </EditableRegion>
  );
}

function TpoSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["tpo"] } & EditProps) {
  const { office } = data;
  const hasOffice = !!(office.address || office.phone || office.email);
  return (
    <EditableRegion
      as="section"
      id="tpo"
      section="tpo"
      label={PLACEMENT_SECTION_LABELS.tpo}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={Phone}
        eyebrow="Get In Touch"
        title={data.heading || "Training & Placement Cell"}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}

      {hasOffice && (
        <div className="from-navy to-navy/85 mb-6 grid grid-cols-1 gap-5 rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg sm:grid-cols-3">
          {office.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Office
                </span>
                <span className="text-sm leading-relaxed whitespace-pre-line">
                  {office.address}
                </span>
              </div>
            </div>
          )}
          {office.phone && (
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Phone
                </span>
                <a
                  href={`tel:${office.phone.replace(/\s+/g, "")}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {office.phone}
                </a>
              </div>
            </div>
          )}
          {office.email && (
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-white/60 uppercase">
                  Email
                </span>
                <a
                  href={`mailto:${office.email}`}
                  className="text-sm font-semibold break-all hover:underline"
                >
                  {office.email}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {data.contacts.length === 0 && editable && (
        <EmptyHint>Click to add placement officers</EmptyHint>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.contacts.map((c, i) => {
          const photo = getImageUrl(c.image);
          return (
            <div
              key={`${c.name}-${i}`}
              className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {data.showPhotos &&
                (photo ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-50">
                    <Image
                      src={photo}
                      alt={c.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Monogram
                    name={c.name || "TPO"}
                    className="h-14 w-14 shrink-0 rounded-xl text-base"
                  />
                ))}
              <div className="min-w-0">
                <h3 className="text-navy text-sm font-bold">{c.name}</h3>
                {c.designation && (
                  <p className="text-xs text-stone-500">{c.designation}</p>
                )}
                <div className="mt-2 space-y-1">
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, "")}`}
                      className="text-navy flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <Phone size={11} className="text-accent shrink-0" />
                      {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="text-navy flex items-center gap-1.5 text-xs font-semibold break-all hover:underline"
                    >
                      <Mail size={11} className="text-accent shrink-0" />
                      {c.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </EditableRegion>
  );
}

function ProcessSection({
  data,
  editable,
  onEditSection,
}: { data: PlacementInfoValue["process"] } & EditProps) {
  return (
    <EditableRegion
      as="section"
      id="process"
      section="process"
      label={PLACEMENT_SECTION_LABELS.process}
      editable={editable}
      onEditSection={onEditSection}
      className="scroll-mt-28"
    >
      <SectionHeading
        icon={ClipboardList}
        eyebrow="How It Works"
        title={data.heading || "Placement Process"}
        meta={data.steps.length > 0 ? `${data.steps.length} steps` : undefined}
      />
      {data.description && (
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-stone-600">
          {data.description}
        </p>
      )}
      {data.steps.length === 0 && editable && (
        <EmptyHint>Click to add the placement process steps</EmptyHint>
      )}
      <ol className="relative space-y-4 border-l-2 border-dashed border-stone-200 pl-6 md:pl-8">
        {data.steps.map((step, i) => (
          <motion.li
            key={`${step.title}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i, 5) * 0.06 }}
            className="border-border relative rounded-2xl border bg-white p-5 shadow-sm"
          >
            <span className="bg-navy absolute top-6 -left-[2.15rem] flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md md:-left-[2.65rem]">
              {i + 1}
            </span>
            <h3 className="text-navy font-serif text-base font-bold">
              {step.title}
            </h3>
            {step.desc && (
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                {step.desc}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </EditableRegion>
  );
}

// ─── Year-wise placement data ────────────────────────────────────────────────

function CurrentYear({ record }: { record: PublicPlacement }) {
  const headline = HEADLINE_STATS.filter((s) => Number(record[s.key]) > 0);
  const packages = PACKAGE_STATS.filter((s) => String(record[s.key]).trim());

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
            {record.is_current ? "Latest Results" : "Placement Record"}
          </span>
          <h2 className="text-navy mt-1 font-serif text-3xl font-bold md:text-4xl">
            Class of {record.year}
          </h2>
        </div>
        {record.total_students > 0 && (
          <p className="text-sm text-stone-500">
            {record.students_placed} of {record.total_students} eligible
            students placed
          </p>
        )}
      </div>

      {record.summary && (
        <p className="mb-10 max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">
          {record.summary}
        </p>
      )}

      {headline.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {headline.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="from-navy to-navy/85 relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-center shadow-lg md:p-6"
              >
                <div className="bg-accent/20 absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl" />
                <Icon
                  size={22}
                  className="text-accent relative mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <span className="relative block font-sans text-3xl font-bold text-white md:text-4xl">
                  {String(record[stat.key])}
                  {stat.suffix}
                </span>
                <span className="relative mt-1 block text-xs font-bold tracking-wider text-white/70 uppercase">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {packages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {packages.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="bg-accent/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <Icon size={22} className="text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-navy block font-sans text-2xl font-bold">
                    {String(record[stat.key])}
                  </span>
                  <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecruiterTile({ name, logo }: { name: string; logo: string | null }) {
  // Brand logos come from an external CDN and aren't guaranteed to exist for
  // every recruiter — if one 404s, fall back to a designed monogram so the
  // grid never shows a broken image.
  const [failed, setFailed] = useState(false);
  const showLogo = logo && !failed;
  return (
    <div className="border-border group flex h-28 flex-col items-center justify-center gap-2.5 rounded-2xl border bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {showLogo ? (
        <div className="relative h-11 w-full">
          <Image
            src={logo}
            alt={name}
            fill
            sizes="160px"
            className="object-contain"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <Monogram name={name} className="h-11 w-11 rounded-xl text-sm" />
      )}
      <span className="line-clamp-2 text-[11px] leading-tight font-semibold text-stone-500">
        {name}
      </span>
    </div>
  );
}

function StudentCard({ student }: { student: PublicNotablePlacement }) {
  // Photo comes from the media library; if it's missing or 404s, fall back to a
  // designed monogram so the card never shows a broken image.
  const [failed, setFailed] = useState(false);
  const showPhoto = student.image && !failed;
  return (
    <div className="border-border group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex aspect-square items-center justify-center bg-stone-50">
        {showPhoto ? (
          <Image
            src={student.image!}
            alt={student.name}
            fill
            sizes="(max-width: 640px) 33vw, 160px"
            className="object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <Monogram
            name={student.name}
            className="h-12 w-12 rounded-xl text-base"
          />
        )}
        {student.package && (
          <span className="bg-navy absolute right-1.5 bottom-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
            {student.package}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <h4 className="text-navy line-clamp-1 text-sm font-bold">
          {student.name}
        </h4>
        {student.program && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-500">
            {student.program}
          </p>
        )}
        {student.company && (
          <div className="mt-auto flex items-center gap-1 pt-2">
            <Building2 size={11} className="text-accent shrink-0" />
            <span className="text-navy line-clamp-1 text-xs font-semibold">
              {student.company}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacedStudents({ record }: { record: PublicPlacement }) {
  return (
    <section id="achievers" className="scroll-mt-28">
      <SectionHeading
        icon={GraduationCap}
        eyebrow="Our Achievers"
        title="Placed Students"
        meta={`${record.notable_placements.length} students`}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
        {record.notable_placements.map((s, i) => (
          <motion.div
            key={`${s.name}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05 }}
          >
            <StudentCard student={s} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TopRecruiters({ record }: { record: PublicPlacement }) {
  return (
    <section id="recruiters" className="scroll-mt-28">
      <SectionHeading
        icon={Building2}
        eyebrow="Hiring Partners"
        title="Our Recruiters"
        meta={`${record.top_recruiters.length} companies`}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {record.top_recruiters.map((r, i) => (
          <RecruiterTile key={`${r.name}-${i}`} name={r.name} logo={r.logo} />
        ))}
      </div>
    </section>
  );
}

function CompanyLogo({ company }: { company: PublicCompanyPlacement }) {
  const [failed, setFailed] = useState(false);
  const showLogo = company.logo && !failed;
  return showLogo ? (
    <div className="relative h-9 w-9 shrink-0">
      <Image
        src={company.logo!}
        alt={company.company}
        fill
        sizes="40px"
        className="rounded-lg object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  ) : (
    <Monogram
      name={company.company}
      className="h-9 w-9 shrink-0 rounded-lg text-xs"
    />
  );
}

// Company-wise placed students: one card per recruiter, listing every student
// it hired with their program and package. Sits alongside the recruiter grid so
// visitors can see who was placed where.
function CompanyPlacements({ record }: { record: PublicPlacement }) {
  const totalStudents = record.company_placements.reduce(
    (sum, c) => sum + c.students.length,
    0,
  );
  return (
    <section id="company-wise" className="scroll-mt-28">
      <SectionHeading
        icon={Briefcase}
        eyebrow="Company-wise"
        title="Placements by Company"
        meta={`${totalStudents} students · ${record.company_placements.length} companies`}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {record.company_placements.map((c, i) => (
          <div
            key={`${c.company}-${i}`}
            className="border-border flex flex-col rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3 border-b border-stone-100 pb-3">
              <CompanyLogo company={c} />
              <div className="min-w-0">
                <h4 className="text-navy line-clamp-1 font-serif text-base font-bold">
                  {c.company}
                </h4>
                <span className="text-xs text-stone-400">
                  {c.students.length}{" "}
                  {c.students.length === 1 ? "student" : "students"} placed
                </span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {c.students.map((s, j) => (
                <li
                  key={`${s.name}-${j}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-navy line-clamp-1 text-sm font-semibold">
                      {s.name}
                    </p>
                    {s.program && (
                      <p className="line-clamp-1 text-[11px] text-stone-500">
                        {s.program}
                      </p>
                    )}
                  </div>
                  {s.package && (
                    <span className="bg-accent/10 text-accent shrink-0 rounded-full px-2.5 py-1 text-xs font-bold">
                      {s.package}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PlacementsPageLayout({
  institution,
  records,
  info,
  editable = false,
  onEditSection,
}: {
  institution: string;
  records: PublicPlacement[];
  info: PlacementInfoValue;
} & EditProps) {
  const label = INSTITUTION_LABELS[institution] ?? "JCT";
  // The current record is the one flagged is_current, else the newest (records
  // arrive sorted is_current desc, then year desc).
  const current = records.find((r) => r.is_current) ?? records[0] ?? null;
  const [selectedId, setSelectedId] = useState<string>(current?._id ?? "");
  const active = records.find((r) => r._id === selectedId) ?? current ?? null;

  // A built-in nav entry only appears once its section actually has content —
  // an empty MoU list or a college with no placement records must not leave a
  // dead anchor in the sidebar.
  // In the admin editor every CMS section is always shown, empty or not —
  // otherwise there'd be nothing to click to fill it in.
  const present = useMemo(() => {
    const set = new Set<string>();
    if (editable || info.mou.items.length > 0) set.add("mou");
    if (editable || info.whyRecruit.points.length > 0) set.add("why-recruit");
    if (
      editable ||
      info.tpo.contacts.length > 0 ||
      info.tpo.office.address ||
      info.tpo.office.phone ||
      info.tpo.office.email
    )
      set.add("tpo");
    if (editable || info.process.steps.length > 0) set.add("process");
    if (active) {
      set.add("overview");
      if (active.top_recruiters.length > 0) set.add("recruiters");
      if (active.notable_placements.length > 0) set.add("achievers");
      if (active.company_placements.length > 0) set.add("company-wise");
    }
    return set;
  }, [info, active, editable]);

  const navItems = useMemo(
    () =>
      resolveSidebarItems(PLACEMENT_NAV_DEFAULTS, info.sidebar.navItems).filter(
        (it) => it.customHref || it.customSection || present.has(it.anchor),
      ),
    [info.sidebar.navItems, present],
  );

  const customSections = navItems.filter((it) => it.customSection);
  const [activeId, setActiveId] = useState<string>("");

  // Scroll-spy: highlight the sidebar entry whose section is in view. Keyed on
  // the anchor list so the observers are rebuilt only when the nav changes,
  // not on every render.
  const anchorKey = navItems
    .filter((it) => !it.customHref)
    .map((it) => it.anchor)
    .join(",");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const anchors = anchorKey ? anchorKey.split(",") : [];
    if (anchors.length === 0) return;
    setActiveId((prev) => (prev && anchors.includes(prev) ? prev : anchors[0]));
    const observers: IntersectionObserver[] = [];
    for (const anchor of anchors) {
      const el = document.getElementById(anchor);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(anchor);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((obs) => obs.disconnect());
  }, [anchorKey]);

  const handleNavigate = (anchor: string) => {
    setActiveId(anchor);
    const el = document.getElementById(anchor);
    if (!el) return;
    const offset = window.innerWidth >= 1024 ? 120 : 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Switching years from the sidebar swaps the record in place; on mobile the
  // year pills sit above the content, so jump to the stats the choice affects.
  const handleSelectYear = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) handleNavigate("overview");
  };

  const isEmpty = records.length === 0 && present.size === 0;

  // No `overflow-x-hidden` here: `overflow-x: hidden` computes overflow-y to
  // `auto`, which makes <main> the sticky sidebar's scroll container — the
  // sidebar would then scroll away with the page instead of pinning.
  return (
    <main className="bg-background text-foreground min-h-screen">
      {!editable && <Navbar />}
      <PageHero
        title="Placements"
        subtitle={`Career outcomes at JCT ${label}`}
      />
      <div className="section-padding bg-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label, href: `/institutions/${institution}` },
                { label: "Placements" },
              ]}
            />
          </div>

          {isEmpty ? (
            <div className="border-border rounded-2xl border border-dashed bg-white py-20 text-center">
              <Briefcase size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-500">
                Placement details will be published here soon.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 lg:hidden">
                <PlacementSideNav
                  items={navItems}
                  activeId={activeId}
                  onNavigate={handleNavigate}
                  records={records}
                  selectedId={active?._id ?? ""}
                  onSelectYear={handleSelectYear}
                  editable={editable}
                  onEditSection={onEditSection}
                />
              </div>

              <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10 xl:grid-cols-[300px_1fr] xl:gap-12">
                {/* `sticky` needs the grid item to be its own box, not stretched
                    to the row height — hence `items-start` above. */}
                <div className="sticky top-24 hidden lg:block">
                  <PlacementSideNav
                    items={navItems}
                    activeId={activeId}
                    onNavigate={handleNavigate}
                    records={records}
                    selectedId={active?._id ?? ""}
                    onSelectYear={handleSelectYear}
                    editable={editable}
                    onEditSection={onEditSection}
                  />
                </div>

                <div className="min-w-0 space-y-16">
                  {present.has("process") && (
                    <ProcessSection
                      data={info.process}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("tpo") && (
                    <TpoSection
                      data={info.tpo}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("mou") && (
                    <MouSection
                      data={info.mou}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}
                  {present.has("why-recruit") && (
                    <WhyRecruitSection
                      data={info.whyRecruit}
                      label={label}
                      editable={editable}
                      onEditSection={onEditSection}
                    />
                  )}

                  {active && (
                    <>
                      <section id="overview" className="scroll-mt-28">
                        <CurrentYear record={active} />
                      </section>
                      {present.has("recruiters") && (
                        <TopRecruiters record={active} />
                      )}
                      {present.has("achievers") && (
                        <PlacedStudents record={active} />
                      )}
                      {present.has("company-wise") && (
                        <CompanyPlacements record={active} />
                      )}
                    </>
                  )}

                  {/* Custom in-page sections defined by admins in the sidebar editor */}
                  {customSections.map((sec) => (
                    <EditableRegion
                      key={sec.id}
                      as="section"
                      id={sec.anchor}
                      section={`custom:${sec.anchor}`}
                      label={sec.navLabel}
                      editable={editable}
                      onEditSection={onEditSection}
                      className="scroll-mt-28"
                    >
                      <SectionHeading icon={sec.icon} title={sec.navLabel} />
                      {editable && (sec.blocks?.length ?? 0) === 0 ? (
                        <EmptyHint>Click to add content blocks</EmptyHint>
                      ) : (
                        <PageBlocksRenderer
                          blocks={
                            (sec.blocks ?? []) as unknown as PageBodySection[]
                          }
                        />
                      )}
                    </EditableRegion>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {!editable && (
        <div id="footer">
          <Footer />
        </div>
      )}
    </main>
  );
}
