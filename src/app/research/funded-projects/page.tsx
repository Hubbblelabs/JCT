import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Funded Projects | ${siteConfig.name}`,
  description:
    "Government and industry-funded research projects at JCT Institutions with over ₹1.5 Crore in total funding.",
  openGraph: {
    title: `Funded Projects | ${siteConfig.name}`,
    description:
      "Government and industry-funded research projects at JCT Institutions with over ₹1.5 Crore in total funding.",
    type: "website",
  },
};

export default function FundedProjectsPage() {
  const { projects, totalFunding } = researchData.fundedProjects;

  return (
    <ContentPageLayout
      title="Funded Projects"
      subtitle="Research projects supported by government and industry funding."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Funded Projects" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base">
            Total Funding Secured:{" "}
            <span className="text-gold font-bold">{totalFunding}</span>
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="border-border rounded-xl border p-6">
              <h3 className="text-foreground font-serif text-lg font-bold">
                {project.title}
              </h3>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-muted-foreground">
                  Funding Agency:{" "}
                  <span className="text-foreground font-semibold">
                    {project.agency}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Amount:{" "}
                  <span className="text-gold font-semibold">
                    {project.amount}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Principal Investigator:{" "}
                  <span className="text-foreground font-semibold">
                    {project.pi}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Duration:{" "}
                  <span className="text-foreground font-semibold">
                    {project.duration}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentPageLayout>
  );
}
