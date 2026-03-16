import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Women Empowerment Cell | ${siteConfig.name}`,
  description:
    "The Women Empowerment Cell at JCT Institutions promotes gender equality, safety, and empowerment through various programs.",
  openGraph: {
    title: `Women Empowerment Cell | ${siteConfig.name}`,
    description:
      "The Women Empowerment Cell at JCT Institutions promotes gender equality, safety, and empowerment through various programs.",
    type: "website",
  },
};

export default function WomenEmpowermentPage() {
  const { title, subtitle, description, activities } =
    governanceData.womenEmpowerment;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "Women Empowerment" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base leading-relaxed">
            {description}
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Activities & Initiatives
          </h2>
          <ul className="mt-4 space-y-2">
            {activities.map((activity) => (
              <li
                key={activity}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {activity}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
