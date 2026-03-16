import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Scholarships | Admissions | ${siteConfig.name}`,
  description:
    "Explore merit-based and need-based scholarships available at JCT Institutions — tuition fee waivers for deserving students.",
  openGraph: {
    title: `Scholarships | Admissions | ${siteConfig.name}`,
    description:
      "Explore merit-based and need-based scholarships available at JCT Institutions — tuition fee waivers for deserving students.",
    type: "website",
  },
};

export default function ScholarshipsPage() {
  const { schemes } = admissionsData.scholarships;

  return (
    <ContentPageLayout
      title="Scholarships"
      subtitle="We believe financial constraints should never hinder quality education."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Scholarships" },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {schemes.map((scheme) => (
          <div
            key={scheme.name}
            className="border-border hover:border-gold/30 rounded-xl border p-5 transition-colors"
          >
            <div className="mb-3 flex items-center gap-3">
              <GraduationCap size={20} className="text-gold shrink-0" />
              <h3 className="text-foreground font-serif text-lg font-semibold">
                {scheme.name}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">Criteria:</span>{" "}
              {scheme.criteria}
            </p>
            <p className="text-gold mt-2 text-sm font-semibold">
              {scheme.benefit}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
