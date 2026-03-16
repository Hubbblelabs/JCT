import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { qualityData } from "@/data/quality";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Accreditations & Recognitions | ${siteConfig.name}`,
  description:
    "JCT Institutions holds accreditations from NAAC, NBA, AICTE, and affiliations with Anna University and Bharathiar University.",
  openGraph: {
    title: `Accreditations & Recognitions | ${siteConfig.name}`,
    description:
      "JCT Institutions holds accreditations from NAAC, NBA, AICTE, and affiliations with Anna University and Bharathiar University.",
    type: "website",
  },
};

export default function AccreditationsPage() {
  const { title, subtitle, items } = qualityData.accreditations;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Quality Assurance", href: "/quality" },
        { label: "Accreditations" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="border-border rounded-xl border p-5">
            <h3 className="text-gold font-sans text-sm font-semibold">
              {item.name}
            </h3>
            <p className="text-foreground mt-1 text-xs font-medium">
              {item.body}
            </p>
            {"grade" in item && (
              <p className="text-gold mt-1 text-xs">
                Grade: {(item as { grade: string }).grade}
              </p>
            )}
            {"programs" in item && (
              <p className="text-muted-foreground mt-1 text-xs">
                Programs: {(item as { programs: string }).programs}
              </p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              Year: {item.year}
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
