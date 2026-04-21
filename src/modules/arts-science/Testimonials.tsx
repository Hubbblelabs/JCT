"use client";

import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { testimonials } from "@/data/arts-science";

export function Testimonials() {
  const categories = ["Alumni", "Student", "VIP"] as const;

  return (
    <div id="testimonials">
      <CollegeTestimonials
        title="Testimonials"
        subtitle="Hear directly from our graduates about how their experiences on campus prepared them for the challenges of tomorrow."
        accentColor="var(--color-arts-science-accent)"
        sectionBgClassName="bg-[#F8F8F8]"
        items={testimonials.map((item, index) => ({
          ...item,
          tag: categories[index % categories.length],
        }))}
      />
    </div>
  );
}
