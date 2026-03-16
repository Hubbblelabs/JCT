import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Publications | ${siteConfig.name}`,
  description:
    "Scholarly publications by JCT faculty and students — Scopus, Web of Science, and UGC-listed journals.",
  openGraph: {
    title: `Publications | ${siteConfig.name}`,
    description:
      "Scholarly publications by JCT faculty and students — Scopus, Web of Science, and UGC-listed journals.",
    type: "website",
  },
};

export default function PublicationsPage() {
  const { stats, recentPublications } = researchData.publications;

  return (
    <ContentPageLayout
      title="Publications"
      subtitle="Scholarly contributions by JCT faculty and students."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "Publications" },
      ]}
    >
      <div className="space-y-12">
        {/* Stats */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Publication Statistics
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Papers", value: stats.totalPapers },
              { label: "Scopus Indexed", value: stats.scopusIndexed },
              { label: "Web of Science", value: stats.webOfScience },
              { label: "UGC Listed", value: stats.ugcListed },
            ].map((stat, index) => (
              <div
                key={index}
                className="border-border rounded-xl border p-5 text-center"
              >
                <p className="text-gold font-serif text-3xl font-bold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Publications Table */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Recent Publications
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Title
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Authors
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Journal
                  </th>
                  <th className="text-foreground px-4 py-3 font-semibold">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPublications.map((pub, index) => (
                  <tr key={index} className="border-border border-b">
                    <td className="text-foreground px-4 py-3">{pub.title}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {pub.authors}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {pub.journal}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {pub.year}
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
