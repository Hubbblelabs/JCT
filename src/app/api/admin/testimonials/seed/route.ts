import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";

const TESTIMONIALS = [
  {
    name: "Priya Krishnan",
    batch: "2024",
    course: "B.E. CSE",
    company: "Infosys",
    quote: "The practical exposure at JCT gave me real confidence. From hackathons to internships, every experience prepared me for my career at Infosys.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni" as const,
    institution: "engineering" as const,
  },
  {
    name: "Arjun Raghavan",
    batch: "2023",
    course: "B.E. Mechanical",
    company: "Caterpillar",
    quote: "JCT's engineering labs and faculty mentorship helped me develop real-world problem-solving skills. I landed my dream role straight from campus.",
    avatar: "/avatars/male_avatar.png",
    category: "Alumni" as const,
    institution: "engineering" as const,
  },
  {
    name: "Sneha Patel",
    batch: "2024",
    course: "B.Sc Computer Science",
    company: "TCS",
    quote: "The Arts & Science college provided a perfect blend of theory and practice. The coding bootcamps and placement training made all the difference.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni" as const,
    institution: "arts-science" as const,
  },
  {
    name: "Karthik Sundaram",
    batch: "2023",
    course: "Diploma — Mechanical",
    company: "TVS Motors",
    quote: "JCT Polytechnic's hands-on approach gave me skills employers value. I was offered a role before even completing my final semester.",
    avatar: "/avatars/male_avatar.png",
    category: "Alumni" as const,
    institution: "polytechnic" as const,
  },
  {
    name: "Anjali Devi",
    batch: "2024",
    course: "B.Com (CA)",
    company: "Zoho Corp",
    quote: "The faculty at JCT go beyond textbooks. They helped me prepare for competitive exams, interviews, and real-world business scenarios.",
    avatar: "/avatars/female_avatar.png",
    category: "Alumni" as const,
    institution: "arts-science" as const,
  },
  {
    name: "Muthu Selvan",
    batch: "2024",
    course: "Diploma — Electrical",
    company: "L&T",
    quote: "Hands-on lab sessions and workshop discipline gave me confidence from day one in my trainee role.",
    avatar: "/avatars/male_avatar.png",
    category: "Alumni" as const,
    institution: "polytechnic" as const,
  },
];

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();

    let seeded = 0;
    for (let i = 0; i < TESTIMONIALS.length; i++) {
      const t = TESTIMONIALS[i];
      await Testimonial.findOneAndUpdate(
        { name: t.name, batch: t.batch },
        { $setOnInsert: { ...t, sort_order: i } },
        { upsert: true },
      );
      seeded++;
    }

    return json({ message: `Seeded ${seeded} testimonials` });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
