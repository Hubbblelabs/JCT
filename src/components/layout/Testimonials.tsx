"use client";

import { useEffect, useState } from "react";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";

interface TestimonialItem {
  name: string;
  batch: string;
  course: string;
  company: string;
  quote: string;
  avatar: string;
  category: string;
}

export function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/testimonials?institution=all")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db" && Array.isArray(res.data)) {
          setItems(
            res.data.map((t: Record<string, unknown>) => ({
              name: String(t.name ?? ""),
              batch: String(t.batch ?? ""),
              course: String(t.course ?? ""),
              company: String(t.company ?? ""),
              quote: String(t.quote ?? ""),
              avatar: String(t.avatar ?? "/avatars/male_avatar.png"),
              category: String(t.category ?? "Alumni"),
            })),
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section
        aria-busy="true"
        className="bg-[#F5F5F5] py-20"
      >
        <div className="container mx-auto h-72 px-4" />
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <CollegeTestimonials
      title="Testimonials"
      subtitle="Stories from Engineering, Arts & Science, and Polytechnic graduates who built strong careers with JCT."
      accentColor="#0F4C81"
      sectionBgClassName="bg-[#F5F5F5]"
      items={items.map((item) => ({
        quote: item.quote,
        name: item.name,
        role: `${item.batch}${item.course ? ` · ${item.course}` : ""}${item.company ? ` · ${item.company}` : ""}`,
        image: item.avatar,
        tag: item.category as "Alumni" | "Student" | "INDUSTRY",
      }))}
    />
  );
}
