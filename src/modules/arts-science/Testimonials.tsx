"use client";

import { useEffect, useState } from "react";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { testimonials as fallback } from "@/data/arts-science";

type Item = {
  quote: string;
  name: string;
  role: string;
  image: string;
  tag?: string;
};

const CATEGORIES = ["Alumni", "Student", "INDUSTRY"] as const;

function normalizeDb(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return [];
  const out: Item[] = [];
  for (const entry of raw) {
    const r = (entry ?? {}) as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name : null;
    const quote = typeof r.quote === "string" ? r.quote : null;
    if (!name || !quote) continue;

    const course = typeof r.course === "string" ? r.course : "";
    const company = typeof r.company === "string" ? r.company : "";
    const role =
      course && company
        ? `${course} at ${company}`
        : company || course || (typeof r.batch === "string" ? `Batch ${r.batch}` : "");

    const image =
      (typeof r.avatar === "string" && r.avatar) ||
      "/avatars/male_avatar.png";
    const tag = typeof r.category === "string" ? r.category : "Alumni";

    out.push({ quote, name, role, image, tag });
  }
  return out;
}

export function Testimonials() {
  const initial: Item[] = fallback.map((item, index) => ({
    ...item,
    tag: CATEGORIES[index % CATEGORIES.length],
  }));
  const [items, setItems] = useState<Item[]>(initial);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/testimonials?institution=arts-science")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizeDb(res.data);
          if (next.length > 0) setItems(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="testimonials">
      <CollegeTestimonials
        title="Testimonials"
        subtitle="Hear directly from our graduates about how their experiences on campus prepared them for the challenges of tomorrow."
        accentColor="var(--color-arts-science-accent)"
        sectionBgClassName="bg-[#F8F8F8]"
        items={items}
      />
    </div>
  );
}
