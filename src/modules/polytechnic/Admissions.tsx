"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { useSiteConfig } from "@/lib/use-site-config";
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
  phone: string;
  email: string;
  address: string;
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
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : "",
    title: typeof r.title === "string" ? r.title : "",
    description: typeof r.description === "string" ? r.description : "",
    ctaLabel: typeof r.ctaLabel === "string" ? r.ctaLabel : "",
    ctaHref: typeof r.ctaHref === "string" ? r.ctaHref : "",
    criteria,
    phone: typeof r.phone === "string" ? r.phone : "",
    email: typeof r.email === "string" ? r.email : "",
    address: typeof r.address === "string" ? r.address : "",
  };
}

export function Admissions() {
  const { data, loading } = useSiteConfig("polytechnicAdmissions");
  const config = normalize(data);

  if (loading) {
    return (
      <PolySection
        id="admissions"
        tone="subtle"
        className="border-t border-slate-100"
      >
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
        </div>
      </PolySection>
    );
  }

  if (!config) return null;

  const isExternal = config.ctaHref.startsWith("http");
  const hasContact = config.phone || config.email || config.address;

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
          {config.ctaLabel && config.ctaHref && (
            <PolyButtonLink
              href={config.ctaHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="shrink-0"
            >
              {config.ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </PolyButtonLink>
          )}
        </div>

        {config.criteria.length > 0 && (
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
        )}

        {hasContact && (
          <div
            id="contact"
            className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm md:grid-cols-3 md:gap-4"
          >
            {config.phone && (
              <a
                href={`tel:${config.phone.replace(/[^0-9+]/g, "")}`}
                className="text-polytechnic-dark hover:text-polytechnic flex items-center gap-2"
              >
                <Phone size={15} className="text-polytechnic" /> {config.phone}
              </a>
            )}
            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="text-polytechnic-dark hover:text-polytechnic flex items-center gap-2"
              >
                <Mail size={15} className="text-polytechnic" /> {config.email}
              </a>
            )}
            {config.address && (
              <div className="text-polytechnic-dark flex items-start gap-2">
                <MapPin
                  size={15}
                  className="text-polytechnic mt-0.5 shrink-0"
                />
                <span>{config.address}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </PolySection>
  );
}
