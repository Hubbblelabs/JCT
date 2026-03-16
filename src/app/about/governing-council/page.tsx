import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Governing Council | ${siteConfig.name}`,
  description:
    "Meet the Governing Council of JCT Institutions — distinguished leaders guiding academic and administrative direction.",
  openGraph: {
    title: `Governing Council | ${siteConfig.name}`,
    description:
      "Meet the Governing Council of JCT Institutions — distinguished leaders guiding academic and administrative direction.",
    type: "website",
  },
};

export default function GoverningCouncilPage() {
  const { members } = aboutData.governingCouncil;

  return (
    <ContentPageLayout
      title="Governing Council"
      subtitle="Distinguished Leaders Guiding Our Direction"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Governing Council" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground py-3 pr-4 font-semibold">Name</th>
              <th className="text-foreground py-3 pr-4 font-semibold">Role</th>
              <th className="text-foreground py-3 font-semibold">
                Organization
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-border border-b last:border-0">
                <td className="text-foreground py-3 pr-4 font-medium">
                  {member.name}
                </td>
                <td className="text-gold py-3 pr-4">{member.role}</td>
                <td className="text-muted-foreground py-3">
                  {member.organization}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
