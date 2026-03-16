import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Patents | ${siteConfig.name}`,
  description:
    "Intellectual property contributions from JCT researchers — patents filed and granted.",
  openGraph: {
    title: `Patents | ${siteConfig.name}`,
    description:
      "Intellectual property contributions from JCT researchers — patents filed and granted.",
    type: "website",
  },
};

export default function PatentsPage() {
  const { filed, granted, patents } = researchData.patents;

  return (
    <ContentPageLayout
      title="Patents"
      subtitle="Intellectual property contributions from JCT researchers."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Patents" },
      ]}
    >
      <div className="space-y-12">
        {/* Stats */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Patent Statistics
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border-border rounded-xl border p-5 text-center">
              <p className="text-gold font-serif text-3xl font-bold">{filed}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Patents Filed
              </p>
            </div>
            <div className="border-border rounded-xl border p-5 text-center">
              <p className="text-gold font-serif text-3xl font-bold">
                {granted}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Patents Granted
              </p>
            </div>
          </div>
        </section>

        {/* Patents Table */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Patent Details
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Title
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Inventors
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {patents.map((patent, index) => (
                  <tr key={index} className="border-border border-b">
                    <td className="text-foreground px-4 py-3">
                      {patent.title}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {patent.inventors}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          patent.status === "Granted"
                            ? "bg-gold/10 text-gold rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            : "bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        }
                      >
                        {patent.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {patent.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
