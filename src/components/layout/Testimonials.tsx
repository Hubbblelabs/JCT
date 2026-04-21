"use client";

import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";

const testimonials = [
  {
    name: "Priya Krishnan",
    batch: "B.E. CSE, 2024",
    company: "Infosys",
    quote:
      "The practical exposure at JCT gave me real confidence. From hackathons to internships, every experience prepared me for my career at Infosys.",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    name: "Arjun Raghavan",
    batch: "B.E. Mechanical, 2023",
    company: "Caterpillar",
    quote:
      "JCT's engineering labs and faculty mentorship helped me develop real-world problem-solving skills. I landed my dream role straight from campus.",
    avatar: "https://i.pravatar.cc/150?u=arjun",
  },
  {
    name: "Sneha Patel",
    batch: "B.Sc Computer Science, 2024",
    company: "TCS",
    quote:
      "The Arts & Science college provided a perfect blend of theory and practice. The coding bootcamps and placement training made all the difference.",
    avatar: "https://i.pravatar.cc/150?u=sneha",
  },
  {
    name: "Karthik Sundaram",
    batch: "Diploma — Mechanical, 2023",
    company: "TVS Motors",
    quote:
      "JCT Polytechnic's hands-on approach gave me skills employers value. I was offered a role before even completing my final semester.",
    avatar: "https://i.pravatar.cc/150?u=karthik",
  },
  {
    name: "Anjali Devi",
    batch: "B.Com (CA), 2024",
    company: "Zoho Corp",
    quote:
      "The faculty at JCT go beyond textbooks. They helped me prepare for competitive exams, interviews, and real-world business scenarios.",
    avatar: "https://i.pravatar.cc/150?u=anjali",
  },
  {
    name: "Muthu Selvan",
    batch: "Diploma — Electrical, 2024",
    company: "L&T",
    quote:
      "Hands-on lab sessions and workshop discipline gave me confidence from day one in my trainee role.",
    avatar: "https://i.pravatar.cc/150?u=muthu",
  },
];

export function Testimonials() {
  const categories = ["Alumni", "Student", "VIP"] as const;

  return (
    <CollegeTestimonials
      title="Testimonials"
      subtitle="Stories from Engineering, Arts & Science, and Polytechnic graduates who built strong careers with JCT."
      accentColor="#0F4C81"
      sectionBgClassName="bg-[#F5F5F5]"
      items={testimonials.map((item, index) => ({
        quote: item.quote,
        name: item.name,
        role: `${item.batch} · ${item.company}`,
        image: item.avatar,
        tag: categories[index % categories.length],
      }))}
    />
  );
}
