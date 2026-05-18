"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { metrics as fallbackMetrics } from "@/data/engineering";

type Metric = {
  value: string;
  label: string;
  sub: string;
};

function normalizeDbMetrics(raw: unknown): Metric[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      const r = (entry ?? {}) as Record<string, unknown>;
      const value = typeof r.value === "string" ? r.value : null;
      const label = typeof r.label === "string" ? r.label : null;
      if (!value || !label) return null;
      return {
        value,
        label,
        sub: typeof r.sub === "string" ? r.sub : "",
      } satisfies Metric;
    })
    .filter((x): x is Metric => x !== null);
}

export function EngineeringMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>(fallbackMetrics);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=engineeringMetrics")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizeDbMetrics(res.data);
          if (next.length > 0) setMetrics(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="courses" className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-engineering-light mb-4 text-sm font-bold tracking-[0.2em] uppercase">
            By the Numbers
          </h2>
          <h3 className="mb-6 font-serif text-4xl leading-tight font-bold text-white md:text-5xl">
            Performance That{" "}
            <span className="font-normal text-white/40 italic">Speaks.</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m, index) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10"
            >
              <span className="text-engineering-light mb-1 block font-sans text-4xl font-bold md:text-5xl">
                {m.value}
              </span>
              <span className="mb-1 block text-base font-bold text-white md:text-lg">
                {m.label}
              </span>
              <span className="text-xs font-bold tracking-wider text-white/80 uppercase">
                {m.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
