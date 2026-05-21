"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useSiteConfig } from "@/lib/use-site-config";
import React from "react";

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
  const { data, loading } = useSiteConfig("engineeringAdmissions");
  const config = normalize(data);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  if (loading) {
    return (
      <section className="border-t border-slate-200 bg-slate-50 py-20 md:py-24">
        <div className="container mx-auto flex justify-center px-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
        </div>
      </section>
    );
  }

  if (!config) return null;

  const isExternal = config.ctaHref.startsWith("http");
  const telHref = config.phone
    ? `tel:${config.phone.replace(/[^0-9+]/g, "")}`
    : "";
  const hasContact = config.phone || config.email || config.address;

  return (
    <section
      id="admissions"
      className="group/section relative overflow-hidden border-t border-slate-200 bg-slate-50 py-20 md:py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Background Textures & Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="bg-engineering-light/10 absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />

        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
            maskImage: `radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="bg-engineering-light absolute inset-0 mask-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] mask-size-[24px_24px]" />
        </div>
      </div>
      <div className="bg-engineering-light/5 absolute -top-40 -right-40 h-120 w-120 rounded-full blur-[100px]" />
      <div className="bg-engineering-light/5 absolute -bottom-40 -left-40 h-120 w-120 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs backdrop-blur-md md:p-10">
          <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              {config.eyebrow && (
                <h2 className="text-engineering-light mb-3 text-xs font-bold tracking-[0.2em] uppercase">
                  {config.eyebrow}
                </h2>
              )}
              {config.title && (
                <h3 className="text-engineering-dark font-serif text-3xl leading-tight font-bold md:text-4xl">
                  {config.title}
                </h3>
              )}
              {config.description && (
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  {config.description}
                </p>
              )}
            </div>
            {config.ctaLabel && config.ctaHref && (
              <a
                href={config.ctaHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex h-12 w-full shrink-0 items-center justify-center self-start rounded-full px-8 text-sm font-bold tracking-wide transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto md:self-end"
                style={{ backgroundColor: "#d4a024", color: "#081323" }}
              >
                {config.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>

          {config.criteria.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {config.criteria.map((block, index) => (
                <motion.article
                  key={block.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 transition-shadow duration-300 hover:shadow-xs"
                >
                  <h4 className="text-engineering-dark mb-4 border-b border-slate-100 pb-2 font-serif text-[1.1rem] font-bold">
                    {block.title}
                  </h4>
                  <ul className="space-y-3">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[0.925rem] leading-relaxed text-slate-600"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-engineering-light mt-0.5 shrink-0"
                        />
                        <span>{item}</span>
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
              className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50/30 p-5 text-sm md:grid-cols-3 md:gap-6"
            >
              {config.phone && (
                <a
                  href={telHref}
                  className="text-engineering-dark hover:text-engineering-light flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Phone
                    size={16}
                    className="text-engineering-light shrink-0"
                  />
                  <span>{config.phone}</span>
                </a>
              )}
              {config.email && (
                <a
                  href={`mailto:${config.email}`}
                  className="text-engineering-dark hover:text-engineering-light flex items-center gap-2.5 font-medium transition-colors"
                >
                  <Mail
                    size={16}
                    className="text-engineering-light shrink-0"
                  />
                  <span>{config.email}</span>
                </a>
              )}
              {config.address && (
                <div className="text-engineering-dark flex items-start gap-2.5 font-medium">
                  <MapPin
                    size={16}
                    className="text-engineering-light mt-0.5 shrink-0"
                  />
                  <span>{config.address}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
