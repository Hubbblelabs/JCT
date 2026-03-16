import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Prospectus | Admissions | ${siteConfig.name}`,
  description:
    "Download the official JCT Institutions prospectus with details on programs, campus facilities, fee structure, and admissions process.",
  openGraph: {
    title: `Prospectus | Admissions | ${siteConfig.name}`,
    description:
      "Download the official JCT Institutions prospectus with details on programs, campus facilities, fee structure, and admissions process.",
    type: "website",
  },
};

export default function ProspectusPage() {
  return (
    <ContentPageLayout
      title="Prospectus"
      subtitle="Download our official prospectus for complete details."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Prospectus" },
      ]}
    >
      <div className="space-y-8">
        <p className="text-muted-foreground text-base leading-relaxed">
          The JCT Institutions prospectus contains comprehensive information
          about our programs, campus facilities, faculty, fee structure,
          scholarships, placement records, and the admissions process. Download
          your copy to learn everything you need to make an informed decision.
        </p>

        <div className="border-border rounded-xl border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gold/10 rounded-lg p-3">
              <FileText size={28} className="text-gold" />
            </div>
            <div>
              <h2 className="text-foreground font-serif text-lg font-bold">
                JCT Institutions Prospectus 2026-27
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                PDF &middot; Includes program details, fee structure, campus
                information, and admission guidelines.
              </p>
              <a
                href="/prospectus-2026-27.pdf"
                className="bg-gold text-navy hover:bg-gold-light mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-sans text-sm font-bold transition-colors"
              >
                <Download size={16} />
                Download Prospectus
              </a>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          For a printed copy, visit the admissions office or contact us at{" "}
          <a
            href={`mailto:${siteConfig.contact.admissionsEmail}`}
            className="text-gold hover:underline"
          >
            {siteConfig.contact.admissionsEmail}
          </a>
          .
        </p>
      </div>
    </ContentPageLayout>
  );
}
