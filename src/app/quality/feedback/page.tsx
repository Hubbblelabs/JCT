import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { qualityData } from "@/data/quality";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Feedback Systems | ${siteConfig.name}`,
  description:
    "JCT Institutions collects feedback from students, faculty, alumni, employers, and parents to continuously improve quality.",
  openGraph: {
    title: `Feedback Systems | ${siteConfig.name}`,
    description:
      "JCT Institutions collects feedback from students, faculty, alumni, employers, and parents to continuously improve quality.",
    type: "website",
  },
};

export default function FeedbackPage() {
  const { title, subtitle, description, types } = qualityData.feedback;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Quality Assurance", href: "/quality" },
        { label: "Feedback" },
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
            Feedback Types
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((item) => (
              <div
                key={item.type}
                className="border-border rounded-xl border p-5"
              >
                <h3 className="text-gold font-sans text-sm font-semibold">
                  {item.type}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  <span className="text-foreground font-medium">
                    Frequency:
                  </span>{" "}
                  {item.frequency}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
