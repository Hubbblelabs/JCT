import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { examinationsData } from "@/data/examinations";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Result Passing Board | ${siteConfig.name}`,
  description:
    "Understand the result passing board process at JCT Institutions — transparent evaluation and result declaration.",
  openGraph: {
    title: `Result Passing Board | ${siteConfig.name}`,
    description:
      "Understand the result passing board process at JCT Institutions — transparent evaluation and result declaration.",
    type: "website",
  },
};

export default function PassingBoardPage() {
  const { title, subtitle, description, process } =
    examinationsData.passingBoard;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Examinations", href: "/examinations" },
        { label: "Result Passing Board" },
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
            Process Steps
          </h2>
          <ol className="mt-4 space-y-4">
            {process.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="bg-gold text-navy flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-muted-foreground pt-0.5 text-sm leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ContentPageLayout>
  );
}
