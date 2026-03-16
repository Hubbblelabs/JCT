import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Academic Calendar | ${siteConfig.name}`,
  description:
    "View the academic calendar for JCT Institutions — key dates, examinations, events, and semester schedules for the 2025-26 academic year.",
  openGraph: {
    title: `Academic Calendar | ${siteConfig.name}`,
    description:
      "View the academic calendar for JCT Institutions — key dates, examinations, events, and semester schedules for the 2025-26 academic year.",
    type: "website",
  },
};

export default function CalendarPage() {
  const { title, subtitle, events } = academicsData.calendar;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Academic Calendar" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground py-3 pr-4 font-semibold">
                Period
              </th>
              <th className="text-foreground py-3 font-semibold">
                Event / Activity
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((item, index) => (
              <tr key={index} className="border-border border-b last:border-0">
                <td className="text-gold py-3 pr-4 font-medium whitespace-nowrap">
                  {item.period}
                </td>
                <td className="text-muted-foreground py-3">{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
