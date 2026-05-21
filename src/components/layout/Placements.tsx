"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/utils";
import { resolveIcon } from "@/lib/lucide-icon";
import { useSiteConfig } from "@/lib/use-site-config";

type Company = { name: string; logo: string };
type SectionStat = { icon: string; value: string; label: string };
type RecruitersSection = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  stats: SectionStat[];
};

function normalizeSection(raw: unknown): RecruitersSection | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const stats = Array.isArray(r.stats)
    ? r.stats
        .map((s) => {
          const o = (s ?? {}) as Record<string, unknown>;
          const value = typeof o.value === "string" ? o.value : "";
          const label = typeof o.label === "string" ? o.label : "";
          if (!value && !label) return null;
          return {
            icon: typeof o.icon === "string" ? o.icon : "",
            value,
            label,
          } satisfies SectionStat;
        })
        .filter((x): x is SectionStat => x !== null)
    : [];
  return {
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : "",
    title: typeof r.title === "string" ? r.title : "",
    titleHighlight:
      typeof r.titleHighlight === "string" ? r.titleHighlight : "",
    description: typeof r.description === "string" ? r.description : "",
    stats,
  };
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="border-border hover:border-accent/30 flex h-16 w-36 flex-col items-center justify-center rounded-xl border bg-white px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md sm:h-18 sm:w-40 md:h-20 md:w-44">
      <div className="relative h-8 w-full sm:h-9">
        <Image
          src={getImageUrl(company.logo) ?? company.logo}
          alt={company.name}
          fill
          sizes="180px"
          className="object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
          loading="lazy"
        />
      </div>
      <span className="mt-1 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
        {company.name}
      </span>
    </div>
  );
}

export function Placements() {
  const { data: sectionData, loading } = useSiteConfig("recruitersSection");
  const section = normalizeSection(sectionData);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/recruiters")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db" && Array.isArray(res.data)) {
          setCompanies(
            res.data
              .map((r: Record<string, unknown>) => ({
                name: typeof r.name === "string" ? r.name : "",
                logo: typeof r.logo === "string" ? r.logo : "",
              }))
              .filter((c: Company) => c.name && c.logo),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section
        aria-busy="true"
        id="placements"
        className="section-padding bg-surface"
      >
        <div className="container mx-auto h-80 animate-pulse px-4 md:px-6" />
      </section>
    );
  }

  if (!section) return null;

  return (
    <section
      id="placements"
      className="section-padding bg-surface overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center md:mb-16">
          {section.eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent mb-4 inline-block text-sm font-bold tracking-[0.2em] uppercase"
            >
              {section.eyebrow}
            </motion.span>
          )}
          {(section.title || section.titleHighlight) && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl"
            >
              {section.title}{" "}
              {section.titleHighlight && (
                <span className="font-normal text-stone-500 italic">
                  {section.titleHighlight}
                </span>
              )}
            </motion.h2>
          )}
          {section.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-xl text-base leading-relaxed text-stone-600 md:text-lg"
            >
              {section.description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Stats */}
      {section.stats.length > 0 && (
        <div className="container mx-auto mb-14 px-4 md:mb-20 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          >
            {section.stats.map((stat, i) => {
              const Icon = resolveIcon(stat.icon, Building);
              return (
                <motion.div
                  key={`${stat.label}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-border rounded-2xl border bg-white p-4 text-center shadow-sm md:p-6"
                >
                  <Icon
                    size={20}
                    className="text-accent mx-auto mb-2"
                    strokeWidth={1.5}
                  />
                  <span className="text-navy mb-1 block font-sans text-3xl font-bold md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground font-sans text-xs font-bold tracking-wider uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Carousel */}
      {companies.length > 0 && (
        <div className="relative">
          <div className="from-surface pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r to-transparent md:w-32" />
          <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l to-transparent md:w-32" />
          <div className="mb-4">
            <div className="animate-scroll-left flex gap-4">
              {[...companies, ...companies].map((company, i) => (
                <div key={`r1-${i}`} className="shrink-0">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="animate-scroll-right flex gap-4">
              {[
                ...companies.slice().reverse(),
                ...companies.slice().reverse(),
              ].map((company, i) => (
                <div key={`r2-${i}`} className="shrink-0">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
