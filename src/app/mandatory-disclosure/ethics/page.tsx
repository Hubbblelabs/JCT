import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { complianceData } from "@/data/compliance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Professional Ethics | ${siteConfig.name}`,
  description:
    "Guiding principles for ethical conduct in academic and professional life at JCT Institutions.",
  openGraph: {
    title: `Professional Ethics | ${siteConfig.name}`,
    description:
      "Guiding principles for ethical conduct in academic and professional life at JCT Institutions.",
    type: "website",
  },
};

export default function EthicsPage() {
  const { title, subtitle, principles } = complianceData.ethics;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
        { label: "Professional Ethics" },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {principles.map((principle) => (
          <div
            key={principle.title}
            className="border-border rounded-xl border p-5"
          >
            <h3 className="text-gold font-sans text-sm font-semibold">
              {principle.title}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
