import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { placementsData } from "@/data/placements";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Placement Statistics | ${siteConfig.name}`,
  description:
    "View year-wise placement statistics at JCT Institutions including placement percentages, highest and average packages.",
  openGraph: {
    title: `Placement Statistics | ${siteConfig.name}`,
    description:
      "View year-wise placement statistics at JCT Institutions including placement percentages, highest and average packages.",
    type: "website",
  },
};

export default function PlacementStatisticsPage() {
  const { yearWise } = placementsData.statistics;

  return (
    <ContentPageLayout
      title={placementsData.statistics.title}
      subtitle={placementsData.statistics.subtitle}
      breadcrumbs={[
        { label: "Training & Placement", href: "/placements" },
        { label: "Placement Statistics" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground py-3 pr-4 font-semibold">Year</th>
              <th className="text-foreground py-3 pr-4 font-semibold">
                Students Placed
              </th>
              <th className="text-foreground py-3 pr-4 font-semibold">
                Eligible
              </th>
              <th className="text-foreground py-3 pr-4 font-semibold">
                Placement %
              </th>
              <th className="text-foreground py-3 pr-4 font-semibold">
                Highest Package
              </th>
              <th className="text-foreground py-3 font-semibold">
                Average Package
              </th>
            </tr>
          </thead>
          <tbody>
            {yearWise.map((row) => (
              <tr
                key={row.year}
                className="border-border border-b last:border-0"
              >
                <td className="text-gold py-3 pr-4 font-semibold">
                  {row.year}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {row.placed}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {row.eligible}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {row.percentage}
                </td>
                <td className="text-muted-foreground py-3 pr-4">
                  {row.highest}
                </td>
                <td className="text-muted-foreground py-3">{row.average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
