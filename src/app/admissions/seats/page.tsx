import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Available Seats | Admissions | ${siteConfig.name}`,
  description:
    "Check seat availability for Engineering, Arts & Science, and Polytechnic programs at JCT Institutions for the academic year 2026-27.",
  openGraph: {
    title: `Available Seats | Admissions | ${siteConfig.name}`,
    description:
      "Check seat availability for Engineering, Arts & Science, and Polytechnic programs at JCT Institutions for the academic year 2026-27.",
    type: "website",
  },
};

type Program = {
  name: string;
  code: string;
  duration: string;
  intake: number;
};

function SeatsTable({
  title,
  programs,
}: {
  title: string;
  programs: Program[];
}) {
  const totalIntake = programs.reduce((sum, p) => sum + p.intake, 0);

  return (
    <div>
      <h2 className="text-foreground font-serif text-xl font-bold">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b">
              <th className="py-3 pr-4 font-medium">Program</th>
              <th className="py-3 font-medium">Seats</th>
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
                <td className="text-gold py-3 font-semibold">
                  {program.intake}
                </td>
              </tr>
            ))}
            <tr className="border-border border-t">
              <td className="text-foreground py-3 pr-4 font-bold">Total</td>
              <td className="text-gold py-3 font-bold">{totalIntake}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SeatsPage() {
  const { engineering, artsScience, polytechnic } = admissionsData.programs;
  const { note } = admissionsData.seats;

  return (
    <ContentPageLayout
      title="Available Seats"
      subtitle="Seat availability for the academic year 2026-27."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Available Seats" },
      ]}
    >
      <div className="space-y-10">
        <SeatsTable
          title="Engineering (B.E. / B.Tech)"
          programs={engineering}
        />
        <SeatsTable title="Arts & Science (UG)" programs={artsScience} />
        <SeatsTable title="Polytechnic (Diploma)" programs={polytechnic} />

        <p className="text-muted-foreground bg-muted rounded-lg p-4 text-sm">
          {note}
        </p>
      </div>
    </ContentPageLayout>
  );
}
