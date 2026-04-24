"use client";

import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { testimonials } from "@/data/polytechnic";

export function Testimonials() {
  const categories = ["Alumni", "Student", "VIP"] as const;

  return (
    <div id="testimonials">
      <CollegeTestimonials
        title="Testimonials"
        subtitle="Voices from our polytechnic community on practical training, industry readiness, and career growth."
        accentColor="#4f617b"
        sectionBgClassName="bg-[#F3F4F6]"
        items={testimonials.map((item, index) => ({
          ...item,
          tag: categories[index % categories.length],
        }))}
      />
    </div>
  );
}
