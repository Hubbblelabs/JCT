import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Policies & Regulations | ${siteConfig.name}`,
  description:
    "Institutional policies governing academic and administrative activities at JCT Institutions.",
  openGraph: {
    title: `Policies & Regulations | ${siteConfig.name}`,
    description:
      "Institutional policies governing academic and administrative activities at JCT Institutions.",
    type: "website",
  },
};

export default function PoliciesPage() {
  const { title, subtitle, documents } = complianceData.policies;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Policies" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {documents.map((doc) => (
          <div key={doc.name} className="border-border rounded-xl border p-5">
            <h3 className="text-gold font-sans text-sm font-semibold">
              {doc.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {doc.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
