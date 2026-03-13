"use client";

import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";
import { testimonials } from "@/data/polytechnic";

export function Testimonials() {
  const categories = ["Alumini", "Student", "VIP"] as const;

  return (
    <CollegeTestimonials
      title="Testimonials"
      subtitle="Voices from our polytechnic community on practical training, industry readiness, and career growth."
      accentColor="#FFB300"
      sectionBgClassName="bg-[#F3F4F6]"
      items={testimonials.map((item, index) => ({
        ...item,
        tag: categories[index % categories.length],
      }))}
    />
  );
}
