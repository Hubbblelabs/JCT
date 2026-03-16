import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Leadership | ${siteConfig.name}`,
  description:
    "Meet the leadership team at JCT Institutions — experienced educators and administrators guiding our vision for excellence.",
  openGraph: {
    title: `Leadership | ${siteConfig.name}`,
    description:
      "Meet the leadership team at JCT Institutions — experienced educators and administrators guiding our vision for excellence.",
    type: "website",
  },
};

export default function LeadershipPage() {
  const { members } = aboutData.leadership;

  return (
    <ContentPageLayout
      title="Leadership & Management"
      subtitle="Guided by Experience, Driven by Vision"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Leadership" },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => (
          <div key={index} className="border-border rounded-xl border p-5">
            <h3 className="text-foreground font-serif text-base font-semibold">
              {member.name}
            </h3>
            <p className="text-gold mt-1 text-sm font-medium">
              {member.designation}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              {member.qualification}
            </p>
            <p className="text-muted-foreground text-xs">{member.experience}</p>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
