"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { resolveIcon } from "@/lib/lucide-icon";
import { useSiteConfig } from "@/lib/use-site-config";

type AddOnGroup = {
  icon: string;
  title: string;
  description: string;
  items: string[];
};

type AddOnProgramsConfig = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  groups: AddOnGroup[];
  ctaLabel: string;
  ctaHref: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalize(raw: unknown): AddOnProgramsConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const groups = Array.isArray(r.groups)
    ? r.groups
        .map((g) => {
          const o = (g ?? {}) as Record<string, unknown>;
          const title = str(o.title).trim();
          if (!title) return null;
          const items = Array.isArray(o.items)
            ? o.items
                .filter((s): s is string => typeof s === "string")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
            : [];
          return {
            icon: str(o.icon),
            title,
            description: str(o.description),
            items,
          } satisfies AddOnGroup;
        })
        .filter((g): g is AddOnGroup => g !== null)
    : [];

  return {
    enabled: r.enabled !== false,
    eyebrow: str(r.eyebrow),
    title: str(r.title),
    titleHighlight: str(r.titleHighlight),
    description: str(r.description),
    groups,
    ctaLabel: str(r.ctaLabel),
    ctaHref: str(r.ctaHref),
  };
}

export function AddOnPrograms() {
  const { data } = useSiteConfig("artsScienceAddOnPrograms");
  const config = normalize(data);

  if (!config || !config.enabled || config.groups.length === 0) return null;

  const showCta = config.ctaLabel.length > 0 && config.ctaHref.length > 0;
  const isExternal = config.ctaHref.startsWith("http");

  return (
    <section
      id="add-on-programs"
      className="relative overflow-hidden border-t border-slate-200 bg-white py-20 md:py-28"
    >
      <div className="bg-arts-science-accent/5 pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-[110px]" />
      <div className="bg-arts-science/5 pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-[110px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
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
          </div>
          {config.description && (
            <p className="max-w-sm text-base leading-relaxed text-stone-600 md:text-lg">
              {config.description}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {config.groups.map((group, i) => {
            const Icon = resolveIcon(group.icon, Sparkles);
            return (
              <motion.article
                key={`${group.title}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="border-arts-science/10 group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="bg-arts-science-accent/10 text-arts-science-accent inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-arts-science text-xl leading-snug font-semibold md:text-2xl">
                      {group.title}
                    </h4>
                    {group.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                {group.items.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item, k) => (
                      <li
                        key={`${item}-${k}`}
                        className="border-arts-science/15 text-arts-science rounded-full border bg-slate-50 px-3.5 py-1.5 text-sm font-medium"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            );
          })}
        </div>

        {showCta && (
          <div className="mt-10">
            <Link
              href={config.ctaHref}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-arts-science-accent hover:bg-arts-science-accent inline-flex items-center gap-2 rounded-full border border-current px-5 py-2 text-sm font-semibold transition-all hover:text-white"
            >
              {config.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
