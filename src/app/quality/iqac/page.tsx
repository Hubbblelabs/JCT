import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { qualityData } from "@/data/quality";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `IQAC | ${siteConfig.name}`,
  description:
    "The Internal Quality Assurance Cell at JCT Institutions drives continuous quality improvement across all academic and administrative processes.",
  openGraph: {
    title: `IQAC | ${siteConfig.name}`,
    description:
      "The Internal Quality Assurance Cell at JCT Institutions drives continuous quality improvement across all academic and administrative processes.",
    type: "website",
  },
};

export default function IqacPage() {
  const { title, subtitle, description, functions, reports } = qualityData.iqac;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Quality Assurance", href: "/quality" },
        { label: "IQAC" },
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
            Functions
          </h2>
          <ul className="mt-4 space-y-2">
            {functions.map((fn) => (
              <li
                key={fn}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {fn}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Reports & Documents
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reports.map((report) => (
              <div
                key={report.title}
                className="border-border rounded-xl border p-5"
              >
                <h3 className="text-foreground font-sans text-sm font-semibold">
                  {report.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Year: {report.year}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
