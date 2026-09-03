"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import { resolveIcon } from "@/lib/lucide-icon";
import { useSiteConfig } from "@/lib/use-site-config";

type CareerService = {
  icon: string;
  title: string;
  description: string;
};

type CareerCentreConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  services: CareerService[];
  ctaLabel: string;
  ctaHref: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalize(raw: unknown): CareerCentreConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const services = Array.isArray(r.services)
    ? r.services
        .map((s) => {
          const o = (s ?? {}) as Record<string, unknown>;
          const title = str(o.title).trim();
          if (!title) return null;
          return {
            icon: str(o.icon),
            title,
            description: str(o.description),
          } satisfies CareerService;
        })
        .filter((s): s is CareerService => s !== null)
    : [];

  return {
    enabled: r.enabled !== false,
    eyebrow: str(r.eyebrow),
    title: str(r.title),
    titleHighlight: str(r.titleHighlight),
    description: str(r.description),
    services,
    ctaLabel: str(r.ctaLabel),
    ctaHref: str(r.ctaHref),
  };
}

export function CareerDevelopmentCentre() {
  const { data } = useSiteConfig("artsScienceCareerCentre");
  const config = normalize(data);

  if (!config || !config.enabled || config.services.length === 0) return null;

  const showCta = config.ctaLabel.length > 0 && config.ctaHref.length > 0;
  const isExternal = config.ctaHref.startsWith("http");

  return (
    <section
      id="career-development-centre"
      className="relative overflow-hidden border-t border-slate-200 bg-slate-50 py-20 md:py-28"
    >
      <div className="bg-arts-science/5 pointer-events-none absolute -top-40 -right-40 h-120 w-120 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {config.eyebrow && (
            <h2 className="text-arts-science-accent mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              {config.eyebrow}
            </h2>
          )}
          {(config.title || config.titleHighlight) && (
            <h3 className="text-arts-science font-serif text-4xl leading-tight font-bold md:text-5xl">
              {config.title}
              {config.titleHighlight && (
                <>
                  {config.title ? " " : ""}
                  <span className="text-arts-science-accent">
                    {config.titleHighlight}
                  </span>
                </>
              )}
            </h3>
          )}
          {config.description && (
            <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
              {config.description}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {config.services.map((service, i) => {
            const Icon = resolveIcon(service.icon, Target);
            return (
              <motion.article
                key={`${service.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (i % 4) * 0.05 }}
                className="border-arts-science/10 hover:border-arts-science-accent/30 flex h-full flex-col rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <span className="bg-arts-science/5 text-arts-science mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="text-arts-science text-lg leading-snug font-semibold">
                  {service.title}
                </h4>
                {service.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                )}
              </motion.article>
            );
          })}
        </div>

        {showCta && (
          <div className="mt-10 flex justify-center">
            <Link
              href={config.ctaHref}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="bg-arts-science hover:bg-arts-science-accent inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all"
            >
              {config.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
