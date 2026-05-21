"use client";

import { useEffect, useState } from "react";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";

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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/testimonials?institution=engineering")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          setItems(normalizeDb(res.data));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
      </div>
    );
  }

  if (items.length === 0) return null;

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
