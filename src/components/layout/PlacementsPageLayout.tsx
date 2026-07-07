"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  Building2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { PublicPlacement } from "@/lib/public-placements";

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

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

function initials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/);
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

function TopRecruiters({ record }: { record: PublicPlacement }) {
  if (record.top_recruiters.length === 0) return null;
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-3">
        <h3 className="text-navy font-serif text-2xl font-bold md:text-3xl">
          Our Recruiters
        </h3>
        <span className="text-sm text-stone-500">
          {record.top_recruiters.length} companies
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {record.top_recruiters.map((r, i) => (
          <RecruiterTile key={`${r.name}-${i}`} name={r.name} logo={r.logo} />
        ))}
      </div>
    </div>
  );
}

// Year switcher pinned at the top of the page — lets visitors jump straight to
// any year's record (current or previous) instead of hunting through an
// accordion at the bottom.
function YearSwitcher({
  records,
  selectedId,
  onSelect,
}: {
  records: PublicPlacement[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (records.length <= 1) return null;
  return (
    <div className="mb-10 flex flex-wrap gap-2">
      {records.map((r) => {
        const active = r._id === selectedId;
        return (
          <button
            key={r._id}
            type="button"
            onClick={() => onSelect(r._id)}
            aria-pressed={active}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              active
                ? "border-navy bg-navy text-white shadow-sm"
                : "border-border text-navy bg-white hover:bg-stone-50"
            }`}
          >
            {r.year}
            {r.is_current && (
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                  active ? "bg-accent text-white" : "bg-accent/10 text-accent"
                }`}
              >
                Latest
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PlacementsPageLayout({
  institution,
  records,
}: {
  institution: string;
  records: PublicPlacement[];
}) {
  const label = INSTITUTION_LABELS[institution] ?? "JCT";
  // The current record is the one flagged is_current, else the newest (records
  // arrive sorted is_current desc, then year desc).
  const current = records.find((r) => r.is_current) ?? records[0] ?? null;
  const [selectedId, setSelectedId] = useState<string>(current?._id ?? "");
  const active = records.find((r) => r._id === selectedId) ?? current ?? null;

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
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

          {records.length === 0 || !active ? (
            <div className="border-border rounded-2xl border border-dashed bg-white py-20 text-center">
              <Briefcase size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-500">
                Placement details will be published here soon.
              </p>
            </div>
          ) : (
            <>
              <YearSwitcher
                records={records}
                selectedId={active._id}
                onSelect={setSelectedId}
              />
              <CurrentYear record={active} />
              <TopRecruiters record={active} />
            </>
          )}
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}
