"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Beaker } from "lucide-react";
import { useSiteConfig } from "@/lib/use-site-config";

type Facility = {
  title: string;
  desc?: string;
};

function normalizeDbFacilities(raw: unknown): Facility[] {
  if (!Array.isArray(raw)) return [];
  const out: Facility[] = [];
  for (const entry of raw) {
    const r = (entry ?? {}) as Record<string, unknown>;
    const title =
      typeof r.title === "string"
        ? r.title
        : typeof r.name === "string"
          ? r.name
          : null;
    if (!title) continue;
    out.push({
      title,
      desc:
        typeof r.desc === "string"
          ? r.desc
          : typeof r.description === "string"
            ? r.description
            : "",
    });
  }
  return out;
}

function normalizeHighlights(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 0);
}

export function EngineeringResearch() {
  const { data: facData, loading: facLoading } = useSiteConfig(
    "engineeringFacilities",
  );
  const { data: hlData, loading: hlLoading } = useSiteConfig(
    "engineeringResearchHighlights",
  );

  const facilities = normalizeDbFacilities(facData);
  const highlights = normalizeHighlights(hlData);
  const loading = facLoading || hlLoading;

  if (loading) {
    return (
      <section className="bg-stone-50 py-10 md:py-14">
        <div className="container mx-auto flex justify-center px-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
        </div>
      </section>
    );
  }

  if (facilities.length === 0 && highlights.length === 0) return null;

  return (
    <section id="research" className="bg-stone-50 py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-engineering mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Research & Innovation
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
              Where Theory <br />
              <span className="font-normal text-stone-300 italic">
                Meets Application
              </span>
            </h3>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              Faculty-led research, student projects, and industry collaboration
              come together through the Research & Innovation Cell.
            </p>

            {highlights.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="text-accent mt-1 shrink-0"
                    />
                    <p className="text-sm leading-relaxed text-stone-600 md:text-[15px]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-primary rounded-2xl p-5">
              <p className="mb-1 text-sm font-bold text-white/80">
                Student Innovation Challenge
              </p>
              <p className="font-serif text-base font-bold text-white md:text-lg">
                140+ student projects showcased across the last 3 innovation
                expos.
              </p>
            </div>
          </div>

          {facilities.length > 0 && (
            <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 md:mx-0 md:grid md:w-full md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
              {facilities.map((fac, index) => (
                <motion.div
                  key={fac.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="hover:border-accent/20 group w-[75vw] shrink-0 snap-center rounded-2xl border border-stone-100 bg-white p-5 transition-all duration-300 hover:shadow-md sm:w-[45vw] md:w-auto"
                >
                  <div className="flex flex-col gap-3">
                    <div className="text-primary group-hover:bg-accent/10 group-hover:text-accent w-fit shrink-0 rounded-xl bg-stone-50 p-3 transition-colors">
                      <Beaker size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-navy mb-0 font-serif text-xl leading-snug font-bold">
                        {fac.title}
                      </h3>
                      {fac.desc && (
                        <p className="mt-1 text-sm leading-relaxed text-stone-600">
                          {fac.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
