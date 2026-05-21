"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { resolveIcon } from "@/lib/lucide-icon";
import { useSiteConfig } from "@/lib/use-site-config";

type Pathway = {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};
type HomeAdmissions = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  pathways: Pathway[];
  applyLabel: string;
  applyHref: string;
  prospectusLabel: string;
  prospectusUrl: string;
};

const CARD_GRADIENTS = [
  "from-emerald-50 to-teal-50",
  "from-blue-50 to-indigo-50",
  "from-rose-50 to-pink-50",
  "from-amber-50 to-yellow-50",
  "from-violet-50 to-purple-50",
  "from-sky-50 to-cyan-50",
];

function resolveUrl(raw: string): string {
  if (!raw) return "";
  return raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/")
    ? raw
    : `/api/public/images/${raw}`;
}

function normalize(raw: unknown): HomeAdmissions | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : "");
  const pathways = Array.isArray(r.pathways)
    ? r.pathways
        .map((p) => {
          const o = (p ?? {}) as Record<string, unknown>;
          const title = typeof o.title === "string" ? o.title : "";
          if (!title) return null;
          return {
            icon: typeof o.icon === "string" ? o.icon : "",
            title,
            description:
              typeof o.description === "string" ? o.description : "",
            ctaLabel: typeof o.ctaLabel === "string" ? o.ctaLabel : "",
            ctaHref: typeof o.ctaHref === "string" ? o.ctaHref : "",
          } satisfies Pathway;
        })
        .filter((x): x is Pathway => x !== null)
    : [];
  return {
    eyebrow: str("eyebrow"),
    title: str("title"),
    titleHighlight: str("titleHighlight"),
    description: str("description"),
    pathways,
    applyLabel: str("applyLabel"),
    applyHref: str("applyHref"),
    prospectusLabel: str("prospectusLabel"),
    prospectusUrl: str("prospectusUrl"),
  };
}

export function AdmissionsCTA() {
  const { data, loading } = useSiteConfig("homeAdmissions");
  const cfg = normalize(data);

  if (loading) {
    return (
      <section
        aria-busy="true"
        id="admissions"
        className="bg-surface pb-10 md:pb-16"
      >
        <div className="container mx-auto h-96 animate-pulse px-4 md:px-6" />
      </section>
    );
  }

  if (!cfg) return null;

  const prospectusUrl = resolveUrl(cfg.prospectusUrl);

  return (
    <section id="admissions" className="bg-surface pb-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 text-center md:mb-10">
            {cfg.eyebrow && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
              >
                {cfg.eyebrow}
              </motion.span>
            )}
            {(cfg.title || cfg.titleHighlight) && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
              >
                {cfg.title}{" "}
                {cfg.titleHighlight && (
                  <span className="text-muted-foreground font-light italic">
                    {cfg.titleHighlight}
                  </span>
                )}
              </motion.h2>
            )}
            {cfg.description && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mx-auto max-w-2xl font-sans text-base leading-relaxed"
              >
                {cfg.description}
              </motion.p>
            )}
          </div>

          {cfg.pathways.length > 0 && (
            <div className="scrollbar-hide mb-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-4 pb-4 md:mb-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
              {cfg.pathways.map((item, i) => {
                const Icon = resolveIcon(item.icon, GraduationCap);
                const isExternal = item.ctaHref.startsWith("http");
                return (
                  <motion.div
                    key={`${item.title}-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-[85vw] shrink-0 snap-center sm:w-[50vw] md:w-auto"
                  >
                    <div className="group border-border hover:border-gold/30 card-hover-lift h-full rounded-2xl border bg-white p-5 md:p-8">
                      <div
                        className={`h-12 w-12 rounded-xl bg-linear-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} mb-5 flex items-center justify-center transition-transform group-hover:scale-110`}
                      >
                        <Icon
                          size={22}
                          className="text-navy"
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-navy mb-3 font-serif text-xl">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 font-sans text-sm leading-relaxed">
                        {item.description}
                      </p>
                      {item.ctaLabel && item.ctaHref && (
                        <Link
                          href={item.ctaHref}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-navy hover:text-gold inline-flex items-center gap-1 font-sans text-sm font-semibold transition-colors group-hover:gap-2"
                        >
                          {item.ctaLabel} <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {(cfg.applyLabel || (cfg.prospectusLabel && prospectusUrl)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center gap-3 sm:flex-row"
            >
              {cfg.applyLabel && cfg.applyHref && (
                <Link
                  href={cfg.applyHref}
                  target={
                    cfg.applyHref.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    cfg.applyHref.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="bg-navy hover:bg-navy-light shadow-navy/20 inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 font-sans text-base font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {cfg.applyLabel} <ArrowRight size={16} />
                </Link>
              )}
              {cfg.prospectusLabel && prospectusUrl && (
                <a
                  href={prospectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-navy hover:bg-muted inline-flex h-14 items-center justify-center rounded-full border-2 px-8 font-sans text-base font-semibold transition-all"
                >
                  {cfg.prospectusLabel}
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
