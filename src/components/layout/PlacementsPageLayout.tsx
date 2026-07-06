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
  GraduationCap,
  ChevronDown,
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

type StatDef = {
  key: keyof PublicPlacement;
  label: string;
  icon: typeof Award;
  suffix?: string;
};

// Headline stats shown as big cards for the current year.
const HEADLINE_STATS: StatDef[] = [
  { key: "placement_percentage", label: "Placement Rate", icon: TrendingUp, suffix: "%" },
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
  const headline = HEADLINE_STATS.filter(
    (s) => Number(record[s.key]) > 0,
  );
  const packages = PACKAGE_STATS.filter((s) => String(record[s.key]).trim());

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
            Latest Results
          </span>
          <h2 className="text-navy mt-1 font-serif text-3xl font-bold md:text-4xl">
            {record.year}
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
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {headline.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-border rounded-2xl border bg-white p-5 text-center shadow-sm md:p-6"
              >
                <Icon
                  size={22}
                  className="text-accent mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <span className="text-navy block font-sans text-3xl font-bold md:text-4xl">
                  {String(record[stat.key])}
                  {stat.suffix}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-bold tracking-wider uppercase">
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
                className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm"
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

function TopRecruiters({ record }: { record: PublicPlacement }) {
  if (record.top_recruiters.length === 0) return null;
  return (
    <div className="mt-16">
      <h3 className="text-navy mb-6 font-serif text-2xl font-bold md:text-3xl">
        Top Recruiters
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {record.top_recruiters.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            className="border-border flex h-24 flex-col items-center justify-center gap-2 rounded-xl border bg-white p-3 text-center transition-shadow hover:shadow-md"
          >
            {r.logo ? (
              <div className="relative h-10 w-full">
                <Image
                  src={r.logo}
                  alt={r.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <Building2 size={22} className="text-stone-300" />
            )}
            {r.name && (
              <span className="text-[11px] font-semibold text-stone-500">
                {r.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotablePlacements({ record }: { record: PublicPlacement }) {
  if (record.notable_placements.length === 0) return null;
  return (
    <div className="mt-16">
      <h3 className="text-navy mb-6 font-serif text-2xl font-bold md:text-3xl">
        Notable Placements
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {record.notable_placements.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="border-border flex gap-4 rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="bg-navy/5 relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-navy/40 flex h-full w-full items-center justify-center">
                  <GraduationCap size={24} />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-navy font-bold">{p.name}</p>
              {p.program && (
                <p className="text-xs text-stone-500">{p.program}</p>
              )}
              {p.company && (
                <p className="text-accent mt-1 text-sm font-semibold">
                  {p.company}
                </p>
              )}
              {p.package && (
                <p className="text-sm font-bold text-stone-700">{p.package}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PastYear({ record }: { record: PublicPlacement }) {
  const [open, setOpen] = useState(false);
  const rows: { label: string; value: string }[] = [
    { label: "Placement Rate", value: record.placement_percentage ? `${record.placement_percentage}%` : "" },
    { label: "Students Placed", value: record.students_placed ? String(record.students_placed) : "" },
    { label: "Offers Made", value: record.offers_made ? String(record.offers_made) : "" },
    { label: "Companies Visited", value: record.companies_visited ? String(record.companies_visited) : "" },
    { label: "Highest Package", value: record.highest_package },
    { label: "Average Package", value: record.average_package },
    { label: "Median Package", value: record.median_package },
  ].filter((r) => r.value);

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-navy font-serif text-xl font-bold">
          {record.year}
        </span>
        <span className="flex items-center gap-3 text-sm text-stone-500">
          {record.placement_percentage > 0 && (
            <span className="text-accent font-bold">
              {record.placement_percentage}% placed
            </span>
          )}
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div className="border-border border-t px-5 py-4">
          {record.summary && (
            <p className="mb-4 text-sm text-stone-600">{record.summary}</p>
          )}
          {rows.length > 0 && (
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    {r.label}
                  </dt>
                  <dd className="text-navy mt-1 text-lg font-bold">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {record.top_recruiters.length > 0 && (
            <p className="mt-4 text-sm text-stone-500">
              <span className="font-semibold text-stone-700">Recruiters: </span>
              {record.top_recruiters.map((r) => r.name).filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      )}
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
  const past = records.filter((r) => r !== current);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <PageHero
        title="Placements"
        subtitle={`Career outcomes at JCT ${label}`}
      />
      <div className="section-padding bg-surface">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <Breadcrumb
              items={[
                { label, href: `/institutions/${institution}` },
                { label: "Placements" },
              ]}
            />
          </div>

          {records.length === 0 ? (
            <div className="border-border rounded-2xl border border-dashed bg-white py-20 text-center">
              <Briefcase size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-500">
                Placement details will be published here soon.
              </p>
            </div>
          ) : (
            <>
              {current && (
                <>
                  <CurrentYear record={current} />
                  <TopRecruiters record={current} />
                  <NotablePlacements record={current} />
                </>
              )}

              {past.length > 0 && (
                <div className="mt-20">
                  <h2 className="text-navy mb-6 font-serif text-3xl font-bold md:text-4xl">
                    Previous Years
                  </h2>
                  <div className="space-y-3">
                    {past.map((r) => (
                      <PastYear key={r._id} record={r} />
                    ))}
                  </div>
                </div>
              )}
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
