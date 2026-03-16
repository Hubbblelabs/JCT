import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Academics | ${siteConfig.name}`,
  description:
    "Explore academic programs, departments, regulations, and resources at JCT Institutions — shaping future-ready professionals since 2009.",
  openGraph: {
    title: `Academics | ${siteConfig.name}`,
    description:
      "Explore academic programs, departments, regulations, and resources at JCT Institutions — shaping future-ready professionals since 2009.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Programs Offered",
    href: "/academics/programs",
    description: "Undergraduate, postgraduate, and diploma programs.",
  },
  {
    name: "Departments",
    href: "/academics/departments",
    description: "Explore departments across our three institutions.",
  },
  {
    name: "Academic Calendar",
    href: "/academics/calendar",
    description: "Key dates and schedules for the academic year.",
  },
  {
    name: "Academic Regulations",
    href: "/academics/regulations",
    description: "Attendance, grading, and examination guidelines.",
  },
  {
    name: "Curriculum & Syllabus",
    href: "/academics/curriculum",
    description: "Industry-aligned curriculum and course structure.",
  },
  {
    name: "Academic Council",
    href: "/academics/council",
    description: "Members overseeing academic quality and standards.",
  },
];

export default function AcademicsPage() {
  return (
    <SectionPageLayout
      title="Academics"
      subtitle="Excellence in Teaching, Learning & Research"
      breadcrumbs={[{ label: "Academics" }]}
      description="JCT Institutions offers a wide range of academic programs across Engineering, Arts & Science, and Polytechnic colleges. Discover our curriculum, academic policies, and the council that upholds our standards."
      subPages={subPages}
    />
  );
}
