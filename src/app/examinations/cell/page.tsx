import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { examinationsData } from "@/data/examinations";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Examination Cell | ${siteConfig.name}`,
  description:
    "Learn about the Examination Cell at JCT Institutions — responsible for planning, coordination, and execution of all examinations.",
  openGraph: {
    title: `Examination Cell | ${siteConfig.name}`,
    description:
      "Learn about the Examination Cell at JCT Institutions — responsible for planning, coordination, and execution of all examinations.",
    type: "website",
  },
};

export default function ExamCellPage() {
  const { title, subtitle, description, functions, team } =
    examinationsData.cell;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Examinations", href: "/examinations" },
        { label: "Examination Cell" },
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
            Exam Cell Team
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="border-border rounded-xl border p-5"
              >
                <h3 className="text-foreground font-sans text-sm font-semibold">
                  {member.name}
                </h3>
                <p className="text-gold mt-1 text-xs font-medium">
                  {member.role}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {member.contact}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
