"use client";

import { useEffect, useState } from "react";
import { CollegeTestimonials } from "@/components/layout/CollegeTestimonials";

const STATIC_TESTIMONIALS = [
  {
    name: "Priya Krishnan",
    batch: "2024",
    course: "B.E. CSE",
    company: "Infosys",
    quote: "The practical exposure at JCT gave me real confidence. From hackathons to internships, every experience prepared me for my career at Infosys.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni",
  },
  {
    name: "Arjun Raghavan",
    batch: "2023",
    course: "B.E. Mechanical",
    company: "Caterpillar",
    quote: "JCT's engineering labs and faculty mentorship helped me develop real-world problem-solving skills. I landed my dream role straight from campus.",
    avatar: "/avatars/male_avatar.png",
    category: "Student",
  },
  {
    name: "Sneha Patel",
    batch: "2024",
    course: "B.Sc Computer Science",
    company: "TCS",
    quote: "The Arts & Science college provided a perfect blend of theory and practice. The coding bootcamps and placement training made all the difference.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni",
  },
  {
    name: "Karthik Sundaram",
    batch: "2023",
    course: "Diploma — Mechanical",
    company: "TVS Motors",
    quote: "JCT Polytechnic's hands-on approach gave me skills employers value. I was offered a role before even completing my final semester.",
    avatar: "/avatars/male_avatar.png",
    category: "Industry",
  },
  {
    name: "Anjali Devi",
    batch: "2024",
    course: "B.Com (CA)",
    company: "Zoho Corp",
    quote: "The faculty at JCT go beyond textbooks. They helped me prepare for competitive exams, interviews, and real-world business scenarios.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni",
  },
  {
    name: "Muthu Selvan",
    batch: "2024",
    course: "Diploma — Electrical",
    company: "L&T",
    quote: "Hands-on lab sessions and workshop discipline gave me confidence from day one in my trainee role.",
    avatar: "/avatars/male_avatar.png",
    category: "Student",
  },
];

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
  const [items, setItems] = useState<TestimonialItem[]>(STATIC_TESTIMONIALS);

  useEffect(() => {
    fetch("/api/public/testimonials?institution=all")
      .then((r) => r.json())
      .then((res) => {
        if (res.source === "db" && res.data.length > 0) {
          setItems(
            res.data.map((t: Record<string, unknown>) => ({
              name: String(t.name),
              batch: String(t.batch),
              course: String(t.course ?? ""),
              company: String(t.company ?? ""),
              quote: String(t.quote),
              avatar: String(t.avatar ?? "/avatars/male_avatar.png"),
              category: String(t.category ?? "Alumni"),
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

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
