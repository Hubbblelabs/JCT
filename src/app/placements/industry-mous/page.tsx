import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Industry MoUs | ${siteConfig.name}`,
  description:
    "Explore JCT Institutions' strategic MoU partnerships with TCS, Infosys, Zoho, AWS, Siemens, and other leading organisations.",
  openGraph: {
    title: `Industry MoUs | ${siteConfig.name}`,
    description:
      "Explore JCT Institutions' strategic MoU partnerships with TCS, Infosys, Zoho, AWS, Siemens, and other leading organisations.",
    type: "website",
  },
};

export default function IndustryMousPage() {
  const { partners } = placementsData.mous;

  return (
    <ContentPageLayout
      title={placementsData.mous.title}
      subtitle={placementsData.mous.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Industry MoUs" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-125 text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground py-3 pr-4 font-semibold">
                Company
              </th>
              <th className="text-foreground py-3 pr-4 font-semibold">
                Area of Collaboration
              </th>
              <th className="text-foreground py-3 font-semibold">Year</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr
                key={partner.company}
                className="border-border border-b last:border-0"
              >
                <td className="text-gold py-3 pr-4 font-semibold">
                  {partner.company}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {partner.area}
                </td>
                <td className="text-muted-foreground py-3">{partner.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
