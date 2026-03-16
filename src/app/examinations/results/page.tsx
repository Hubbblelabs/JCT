import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { examinationsData } from "@/data/examinations";
import { siteConfig } from "@/data/site";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: `Examination Results | ${siteConfig.name}`,
  description:
    "Access your semester examination results through university portals — Anna University, Bharathiar University, and DOTE.",
  openGraph: {
    title: `Examination Results | ${siteConfig.name}`,
    description:
      "Access your semester examination results through university portals — Anna University, Bharathiar University, and DOTE.",
    type: "website",
  },
};

export default function ResultsPage() {
  const { title, subtitle, description, links } = examinationsData.results;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Examinations", href: "/examinations" },
        { label: "Results" },
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
            Result Portals
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-gold/30 group flex items-center justify-between rounded-xl border p-5 transition-colors"
              >
                <span className="text-foreground group-hover:text-gold font-sans text-sm font-semibold transition-colors">
                  {link.name}
                </span>
                <ExternalLink
                  size={16}
                  className="text-muted-foreground group-hover:text-gold shrink-0 transition-colors"
                />
              </a>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
