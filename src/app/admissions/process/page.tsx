import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Admission Process | Admissions | ${siteConfig.name}`,
  description:
    "Follow our simple, transparent, and student-friendly 7-step admission process to join JCT Institutions, Coimbatore.",
  openGraph: {
    title: `Admission Process | Admissions | ${siteConfig.name}`,
    description:
      "Follow our simple, transparent, and student-friendly 7-step admission process to join JCT Institutions, Coimbatore.",
    type: "website",
  },
};

export default function ProcessPage() {
  const { steps } = admissionsData.admissionProcess;

  return (
    <ContentPageLayout
      title="Admission Process"
      subtitle="Simple, transparent, and student-friendly admission process."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Admission Process" },
      ]}
    >
      <div className="relative space-y-0">
        {steps.map((item, index) => (
          <div key={item.step} className="relative flex gap-5 pb-8 last:pb-0">
            {/* Vertical line */}
            {index < steps.length - 1 && (
              <div className="bg-border absolute top-10 bottom-0 left-5 w-px" />
            )}

            {/* Step number circle */}
            <div className="bg-gold text-navy z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold">
              {item.step}
            </div>

            {/* Content */}
            <div className="pt-1.5">
              <h3 className="text-foreground font-serif text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
