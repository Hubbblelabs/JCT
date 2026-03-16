import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Workshops & Conferences | ${siteConfig.name}`,
  description:
    "Workshops, conferences, seminars, and FDPs organized by JCT Institutions for knowledge sharing and professional development.",
  openGraph: {
    title: `Workshops & Conferences | ${siteConfig.name}`,
    description:
      "Workshops, conferences, seminars, and FDPs organized by JCT Institutions for knowledge sharing and professional development.",
    type: "website",
  },
};

export default function WorkshopsPage() {
  const { events } = researchData.workshops;

  return (
    <ContentPageLayout
      title="Workshops & Conferences"
      subtitle="Knowledge sharing through academic events and professional development."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Workshops & Conferences" },
      ]}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="text-foreground px-4 py-3 font-semibold">Title</th>
              <th className="text-foreground px-4 py-3 font-semibold">Type</th>
              <th className="text-foreground px-4 py-3 font-semibold">Date</th>
              <th className="text-foreground px-4 py-3 font-semibold">
                Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="border-border border-b">
                <td className="text-foreground px-4 py-3">{event.title}</td>
                <td className="px-4 py-3">
                  <span className="bg-gold/10 text-gold rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {event.type}
                  </span>
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {event.date}
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {event.participants}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
