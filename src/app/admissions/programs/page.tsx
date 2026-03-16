import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Programs Offered | Admissions | ${siteConfig.name}`,
  description:
    "Explore 50+ programs across Engineering, Arts & Science, and Polytechnic streams at JCT Institutions, Coimbatore.",
  openGraph: {
    title: `Programs Offered | Admissions | ${siteConfig.name}`,
    description:
      "Explore 50+ programs across Engineering, Arts & Science, and Polytechnic streams at JCT Institutions, Coimbatore.",
    type: "website",
  },
};

type Program = {
  name: string;
  code: string;
  duration: string;
  intake: number;
};

function ProgramSection({
  title,
  programs,
}: {
  title: string;
  programs: Program[];
}) {
  return (
    <div>
      <h2 className="text-foreground font-serif text-xl font-bold">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b">
              <th className="py-3 pr-4 font-medium">Program</th>
              <th className="py-3 pr-4 font-medium">Code</th>
              <th className="py-3 pr-4 font-medium">Duration</th>
              <th className="py-3 font-medium">Intake</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr
                key={program.code}
                className="border-border border-b last:border-0"
              >
                <td className="text-foreground py-3 pr-4 font-medium">
                  {program.name}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {program.code}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {program.duration}
                </td>
                <td className="text-gold py-3 font-semibold">
                  {program.intake}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  const { engineering, artsScience, polytechnic } = admissionsData.programs;

  return (
    <ContentPageLayout
      title="Programs Offered"
      subtitle="50+ programs across Engineering, Arts & Science, and Polytechnic streams."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Programs Offered" },
      ]}
    >
      <div className="space-y-10">
        <ProgramSection
          title="Engineering (B.E. / B.Tech)"
          programs={engineering}
        />
        <ProgramSection title="Arts & Science (UG)" programs={artsScience} />
        <ProgramSection title="Polytechnic (Diploma)" programs={polytechnic} />
      </div>
    </ContentPageLayout>
  );
}
