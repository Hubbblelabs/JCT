import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Central Library | ${siteConfig.name}`,
  description:
    "JCT Central Library — 50,000+ books, digital resources, open-access reading rooms, and modern facilities for students and faculty.",
  openGraph: {
    title: `Central Library | ${siteConfig.name}`,
    description:
      "JCT Central Library — 50,000+ books, digital resources, open-access reading rooms, and modern facilities for students and faculty.",
    type: "website",
  },
};

export default function LibraryPage() {
  const { description, stats, digitalResources, services } = campusData.library;

  const statItems = [
    { label: "Books", value: stats.books.toLocaleString() },
    { label: "Journals", value: `${stats.journals}+` },
    { label: "Magazines", value: `${stats.magazines}+` },
    { label: "E-Books", value: stats.ebooks.toLocaleString() },
    { label: "Project Reports", value: stats.projectReports.toLocaleString() },
  ];

  return (
    <ContentPageLayout
      title="Central Library"
      subtitle="The Knowledge Hub of JCT"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Library" },
      ]}
    >
      <p className="text-muted-foreground mb-10 text-base leading-relaxed">
        {description}
      </p>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="bg-surface border-border rounded-xl border p-5 text-center"
          >
            <p className="text-gold font-serif text-2xl font-bold">
              {item.value}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Digital Resources */}
      <h2 className="text-foreground mb-4 font-serif text-2xl font-semibold">
        Digital Resources
      </h2>
      <div className="mb-10 flex flex-wrap gap-3">
        {digitalResources.map((resource) => (
          <span
            key={resource}
            className="bg-muted text-foreground rounded-full px-4 py-2 text-sm font-medium"
          >
            {resource}
          </span>
        ))}
      </div>

      {/* Services */}
      <h2 className="text-foreground mb-4 font-serif text-2xl font-semibold">
        Library Services
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <li key={service} className="flex items-start gap-3">
            <span className="bg-gold mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
            <span className="text-muted-foreground text-sm leading-relaxed">
              {service}
            </span>
          </li>
        ))}
      </ul>
    </ContentPageLayout>
  );
}
