"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { resolveIcon } from "@/lib/lucide-icon";
import { useSiteConfig } from "@/lib/use-site-config";

type Feature = { icon: string; title: string; description: string };
type WhyChooseJct = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  features: Feature[];
};
type HomeStats = {
  yearsOfExcellence?: string;
  alumni?: string;
  studentsPlaced?: string;
  industryAwards?: string;
};

const CARD_GRADIENTS = [
  "from-blue-50 to-indigo-50",
  "from-emerald-50 to-teal-50",
  "from-violet-50 to-purple-50",
  "from-amber-50 to-yellow-50",
  "from-rose-50 to-pink-50",
  "from-sky-50 to-cyan-50",
];

const COUNTER_FIELDS: { key: keyof HomeStats; label: string }[] = [
  { key: "yearsOfExcellence", label: "Years of Excellence" },
  { key: "alumni", label: "Alumni Worldwide" },
  { key: "studentsPlaced", label: "Students Placed" },
  { key: "industryAwards", label: "Industry Awards" },
];

function normalizeWhy(raw: unknown): WhyChooseJct | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const features = Array.isArray(r.features)
    ? r.features
        .map((f) => {
          const o = (f ?? {}) as Record<string, unknown>;
          const title = typeof o.title === "string" ? o.title : "";
          if (!title) return null;
          return {
            icon: typeof o.icon === "string" ? o.icon : "",
            title,
            description:
              typeof o.description === "string" ? o.description : "",
          } satisfies Feature;
        })
        .filter((x): x is Feature => x !== null)
    : [];
  return {
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : "",
    title: typeof r.title === "string" ? r.title : "",
    titleHighlight:
      typeof r.titleHighlight === "string" ? r.titleHighlight : "",
    description: typeof r.description === "string" ? r.description : "",
    features,
  };
}

export function WhyJCT() {
  const { data: whyData, loading } = useSiteConfig("whyChooseJct");
  const { data: statsData } = useSiteConfig<HomeStats>("homeStats");
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const why = normalizeWhy(whyData);

  const counters = COUNTER_FIELDS.map((f) => ({
    label: f.label,
    value:
      statsData && typeof statsData[f.key] === "string"
        ? (statsData[f.key] as string)
        : "",
  })).filter((c) => c.value.trim().length > 0);

  if (loading) {
    return (
      <section
        aria-busy="true"
        className="section-padding bg-surface"
        id="about"
      >
        <div className="container mx-auto h-96 animate-pulse px-4 md:px-6" />
      </section>
    );
  }

  if (!why) return null;

  return (
    <section id="about" className="section-padding bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-16">
          {why.eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              {why.eyebrow}
            </motion.span>
          )}
          {(why.title || why.titleHighlight) && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
            >
              {why.title}{" "}
              {why.titleHighlight && (
                <span className="text-muted-foreground font-light italic">
                  {why.titleHighlight}
                </span>
              )}
            </motion.h2>
          )}
          {why.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-sans text-base leading-relaxed md:text-lg"
            >
              {why.description}
            </motion.p>
          )}
        </div>

        {/* Features Grid */}
        {why.features.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:mb-20 md:gap-6 lg:grid-cols-3">
            {why.features.map((feature, i) => {
              const Icon = resolveIcon(feature.icon, Award);
              return (
                <motion.div
                  key={`${feature.title}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`group border-border hover:border-gold/30 card-hover-lift rounded-2xl border bg-white p-4 md:p-8 ${!showAllFeatures && i >= 4 ? "hidden sm:block" : ""}`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl bg-linear-to-br md:h-12 md:w-12 ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} mb-3 flex items-center justify-center transition-transform group-hover:scale-110 md:mb-5`}
                  >
                    <Icon size={20} className="text-navy" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-navy mb-1 font-sans text-sm font-semibold md:mb-2 md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed md:text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile Show More */}
        {!showAllFeatures && why.features.length > 4 && (
          <div className="mb-8 text-center sm:hidden">
            <button
              onClick={() => setShowAllFeatures(true)}
              className="text-navy hover:text-gold inline-flex items-center gap-2 font-sans text-sm font-semibold transition-colors"
            >
              Show All Features →
            </button>
          </div>
        )}

        {/* Counter Strip */}
        {counters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-navy noise-overlay relative overflow-hidden rounded-3xl p-8 md:p-12"
          >
            <div className="bg-gold/5 pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full blur-[150px]" />
            <div className="relative z-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {counters.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2 font-sans text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                    {item.value}
                  </div>
                  <div className="font-sans text-xs font-medium text-white/50 md:text-sm">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
