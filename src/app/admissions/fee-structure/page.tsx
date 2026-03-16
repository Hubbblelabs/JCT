import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Fee Structure | Admissions | ${siteConfig.name}`,
  description:
    "View the fee structure for Engineering, Arts & Science, and Polytechnic programs at JCT Institutions, Coimbatore.",
  openGraph: {
    title: `Fee Structure | Admissions | ${siteConfig.name}`,
    description:
      "View the fee structure for Engineering, Arts & Science, and Polytechnic programs at JCT Institutions, Coimbatore.",
    type: "website",
  },
};

type FeeRow = {
  program: string;
  annual: string;
  hostel: string;
};

function FeeTable({ title, fees }: { title: string; fees: FeeRow[] }) {
  return (
    <div>
      <h2 className="text-foreground font-serif text-xl font-bold">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b">
              <th className="py-3 pr-4 font-medium">Program</th>
              <th className="py-3 pr-4 font-medium">Annual Fee</th>
              <th className="py-3 font-medium">Hostel Fee</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((row) => (
              <tr
                key={row.program}
                className="border-border border-b last:border-0"
              >
                <td className="text-foreground py-3 pr-4 font-medium">
                  {row.program}
                </td>
                <td className="text-gold py-3 pr-4 font-semibold">
                  {row.annual}
                </td>
                <td className="text-muted-foreground py-3">{row.hostel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FeeStructurePage() {
  const { engineering, artsScience, polytechnic, note } =
    admissionsData.feeStructure;

  return (
    <ContentPageLayout
      title="Fee Structure"
      subtitle="Transparent and competitive fees for quality education."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Fee Structure" },
      ]}
    >
      <div className="space-y-10">
        <FeeTable title="Engineering (B.E. / B.Tech)" fees={engineering} />
        <FeeTable title="Arts & Science (UG)" fees={artsScience} />
        <FeeTable title="Polytechnic (Diploma)" fees={polytechnic} />

        <p className="text-muted-foreground bg-muted rounded-lg p-4 text-sm">
          {note}
        </p>
      </div>
    </ContentPageLayout>
  );
}
