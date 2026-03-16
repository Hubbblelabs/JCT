import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Student Welfare Cell | ${siteConfig.name}`,
  description:
    "The Student Welfare Cell at JCT Institutions supports every student's academic and personal well-being.",
  openGraph: {
    title: `Student Welfare Cell | ${siteConfig.name}`,
    description:
      "The Student Welfare Cell at JCT Institutions supports every student's academic and personal well-being.",
    type: "website",
  },
};

export default function StudentWelfarePage() {
  const { title, subtitle, description, services } =
    governanceData.studentWelfare;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "Student Welfare" },
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
            Services Offered
          </h2>
          <ul className="mt-4 space-y-2">
            {services.map((service) => (
              <li
                key={service}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {service}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
