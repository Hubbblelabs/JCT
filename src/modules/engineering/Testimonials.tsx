"use client";

import { useEffect, useState } from "react";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { testimonials as fallback } from "@/data/engineering";

type Item = {
  quote: string;
  name: string;
  role: string;
  image: string;
  tag?: string;
};

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
        : company ||
          course ||
          (typeof r.batch === "string" ? `Batch ${r.batch}` : "");

    const image =
      (typeof r.avatar === "string" && r.avatar) || "/avatars/male_avatar.png";
    const tag = typeof r.category === "string" ? r.category : "Alumni";

    out.push({ quote, name, role, image, tag });
  }
  return out;
}

export function Testimonials() {
  const [items, setItems] = useState<Item[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/testimonials?institution=engineering")
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
    <div id="life-at-jct">
      <CollegeTestimonials
        title="Testimonials"
        subtitle="Stories from engineering students, alumni, and hiring partners who have experienced JCT's outcome-focused learning."
        accentColor="#D4A024"
        sectionBgClassName="bg-[#F8FAFC]"
        sectionId="testimonials"
        items={items}
      />
    </div>
  );
}
