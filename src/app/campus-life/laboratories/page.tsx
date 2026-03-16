import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Laboratories | ${siteConfig.name}`,
  description:
    "JCT Institutions has 50+ specialized laboratories across departments, equipped with the latest instruments, software, and research tools.",
  openGraph: {
    title: `Laboratories | ${siteConfig.name}`,
    description:
      "JCT Institutions has 50+ specialized laboratories across departments, equipped with the latest instruments, software, and research tools.",
    type: "website",
  },
};

const labHighlights = [
  {
    title: "Engineering Labs",
    description:
      "Advanced computing, electronics, mechanical workshop, electrical machines, and civil engineering labs with industry-standard equipment.",
  },
  {
    title: "Science Labs",
    description:
      "Well-equipped physics, chemistry, and biology laboratories for practical learning and research experiments.",
  },
  {
    title: "Computer Labs",
    description:
      "High-configuration systems with licensed software including MATLAB, AutoCAD, SolidWorks, and programming environments.",
  },
  {
    title: "Research Labs",
    description:
      "Dedicated research facilities for faculty and postgraduate students working on sponsored and collaborative projects.",
  },
  {
    title: "Language Lab",
    description:
      "Multimedia-enabled language lab for improving communication skills, soft skills, and interview preparation.",
  },
  {
    title: "Innovation & Maker Space",
    description:
      "A collaborative space with 3D printers, IoT kits, and prototyping tools for student-driven innovation projects.",
  },
];

export default function LaboratoriesPage() {
  return (
    <ContentPageLayout
      title="Laboratories"
      subtitle="Where Theory Meets Practice"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Laboratories" },
      ]}
    >
      <p className="text-muted-foreground mb-10 text-base leading-relaxed">
        JCT Institutions houses 50+ specialized laboratories across all
        departments, equipped with the latest instruments, software, and
        research tools. Our labs provide students with hands-on experience and
        practical exposure essential for academic and professional excellence.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {labHighlights.map((lab) => (
          <div
            key={lab.title}
            className="bg-surface border-border rounded-xl border p-6"
          >
            <h3 className="text-foreground font-serif text-lg font-semibold">
              {lab.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {lab.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-muted mt-10 rounded-xl p-6 text-center">
        <p className="text-gold font-serif text-4xl font-bold">50+</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Specialized Laboratories Across Departments
        </p>
      </div>
    </ContentPageLayout>
  );
}
