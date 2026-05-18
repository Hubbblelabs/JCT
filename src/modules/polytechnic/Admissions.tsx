"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { admissionsCriteria as fallbackCriteria } from "@/data/polytechnic";
import {
  PolyButtonLink,
  PolySection,
  PolySectionHeader,
} from "@/modules/polytechnic/PolyUI";

type Criterion = { title: string; items: string[] };

type AdmissionsConfig = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  criteria: Criterion[];
};

const DEFAULTS: AdmissionsConfig = {
  eyebrow: "Admissions",
  title: "Admission Process",
  description:
    "Simple and transparent admissions aligned with current DOTE and Tamil Nadu polytechnic guidelines.",
  ctaLabel: "Apply Now",
  ctaHref: "https://admissions.jct.ac.in",
  criteria: fallbackCriteria as Criterion[],
};

function normalize(raw: unknown): AdmissionsConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const criteria = Array.isArray(r.criteria)
    ? r.criteria
        .map((c) => {
          const o = (c ?? {}) as Record<string, unknown>;
          const title = typeof o.title === "string" ? o.title : null;
          const items = Array.isArray(o.items)
            ? o.items.filter(
                (s): s is string => typeof s === "string" && s.length > 0,
              )
            : [];
          if (!title || items.length === 0) return null;
          return { title, items } satisfies Criterion;
        })
        .filter((x): x is Criterion => x !== null)
    : [];
  return {
    eyebrow:
      typeof r.eyebrow === "string" && r.eyebrow ? r.eyebrow : DEFAULTS.eyebrow,
    title: typeof r.title === "string" && r.title ? r.title : DEFAULTS.title,
    description:
      typeof r.description === "string" ? r.description : DEFAULTS.description,
    ctaLabel:
      typeof r.ctaLabel === "string" && r.ctaLabel
        ? r.ctaLabel
        : DEFAULTS.ctaLabel,
    ctaHref:
      typeof r.ctaHref === "string" && r.ctaHref ? r.ctaHref : DEFAULTS.ctaHref,
    criteria: criteria.length > 0 ? criteria : DEFAULTS.criteria,
  };
}

export function Admissions() {
  const [config, setConfig] = useState<AdmissionsConfig>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=polytechnicAdmissions")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalize(res.data);
          if (next) setConfig(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const isExternal = config.ctaHref.startsWith("http");

  return (
    <PolySection
      id="admissions"
      tone="subtle"
      className="border-t border-slate-100"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <PolySectionHeader
            eyebrow={config.eyebrow}
            title={config.title}
            description={config.description}
            className="mb-0"
          />
          <PolyButtonLink
            href={config.ctaHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="shrink-0"
          >
            {config.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </PolyButtonLink>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {config.criteria.map((block, index) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-xl border border-slate-200 bg-[#fbfdfc] p-5"
            >
              <h3 className="text-polytechnic-dark mb-3 text-base font-semibold">
                {block.title}
              </h3>
              <ul className="space-y-2.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-polytechnic mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </PolySection>
  );
}
