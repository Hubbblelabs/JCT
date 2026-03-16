import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Academic Council | ${siteConfig.name}`,
  description:
    "Meet the Academic Council of JCT Institutions — the apex body overseeing curriculum, assessment, and academic quality standards.",
  openGraph: {
    title: `Academic Council | ${siteConfig.name}`,
    description:
      "Meet the Academic Council of JCT Institutions — the apex body overseeing curriculum, assessment, and academic quality standards.",
    type: "website",
  },
};

export default function CouncilPage() {
  const { title, subtitle, description, members } = academicsData.council;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Academic Council" },
      ]}
    >
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>

      <div className="mt-8 overflow-x-auto">
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
