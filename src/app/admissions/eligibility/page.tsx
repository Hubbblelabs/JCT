import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Eligibility Criteria | Admissions | ${siteConfig.name}`,
  description:
    "Check the eligibility criteria for Engineering, Arts & Science, and Polytechnic admissions at JCT Institutions, Coimbatore.",
  openGraph: {
    title: `Eligibility Criteria | Admissions | ${siteConfig.name}`,
    description:
      "Check the eligibility criteria for Engineering, Arts & Science, and Polytechnic admissions at JCT Institutions, Coimbatore.",
    type: "website",
  },
};

function EligibilityCard({
  title,
  degree,
  requirements,
}: {
  title: string;
  degree: string;
  requirements: string[];
}) {
  return (
    <div className="border-border rounded-xl border p-6">
      <h2 className="text-foreground font-serif text-xl font-bold">{title}</h2>
      <p className="text-gold mt-1 text-sm font-semibold">{degree}</p>
      <ul className="mt-4 space-y-3">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle size={18} className="text-gold mt-0.5 shrink-0" />
            <span className="text-muted-foreground text-sm leading-relaxed">
              {req}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EligibilityPage() {
  const { engineering, artsScience, polytechnic } = admissionsData.eligibility;

  return (
    <ContentPageLayout
      title="Eligibility Criteria"
      subtitle="Meet the requirements and start your journey at JCT."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Eligibility Criteria" },
      ]}
    >
      <div className="space-y-6">
        <EligibilityCard
          title="Engineering"
          degree={engineering.degree}
          requirements={engineering.requirements}
        />
        <EligibilityCard
          title="Arts & Science"
          degree={artsScience.degree}
          requirements={artsScience.requirements}
        />
        <EligibilityCard
          title="Polytechnic"
          degree={polytechnic.degree}
          requirements={polytechnic.requirements}
        />
      </div>
    </ContentPageLayout>
  );
}
