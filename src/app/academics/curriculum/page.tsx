import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Curriculum & Syllabus | ${siteConfig.name}`,
  description:
    "Learn about the industry-aligned curriculum and syllabus at JCT Institutions — designed in consultation with academic experts and industry leaders.",
  openGraph: {
    title: `Curriculum & Syllabus | ${siteConfig.name}`,
    description:
      "Learn about the industry-aligned curriculum and syllabus at JCT Institutions — designed in consultation with academic experts and industry leaders.",
    type: "website",
  },
};

const highlights = [
  "Curriculum aligned with Anna University and Bharathiar University guidelines",
  "Regular updates based on industry trends and employer feedback",
  "Value-added courses in communication, soft skills, and emerging technologies",
  "Hands-on labs, workshops, and project-based learning",
  "Industry internships integrated into the academic schedule",
  "Choice-Based Credit System (CBCS) for flexible learning paths",
];

export default function CurriculumPage() {
  const { title, subtitle, description } = academicsData.curriculum;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Curriculum & Syllabus" },
      ]}
    >
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>

      <h3 className="text-foreground mt-8 font-serif text-lg font-semibold">
        Curriculum Highlights
      </h3>

      <ul className="mt-4 space-y-3">
        {highlights.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="bg-gold mt-1.5 h-2 w-2 shrink-0 rounded-full" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </ContentPageLayout>
  );
}
