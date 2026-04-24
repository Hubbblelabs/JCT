import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { researchData } from "@/data/research";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `R&D Cell | ${siteConfig.name}`,
  description:
    "The R&D Cell at JCT coordinates all research activities — project proposals, funding applications, publication tracking, and collaboration facilitation.",
  openGraph: {
    title: `R&D Cell | ${siteConfig.name}`,
    description:
      "The R&D Cell at JCT coordinates all research activities — project proposals, funding applications, publication tracking, and collaboration facilitation.",
    type: "website",
  },
};

export default function RndCellPage() {
  const { description, functions } = researchData.rndCell;

  return (
    <ContentPageLayout
      title="Research & Development Cell"
      subtitle="The nerve centre of research activities at JCT."
      breadcrumbs={[
        { label: "Research", href: "/research" },
        { label: "R&D Cell" },
      ]}
    >
      <div className="space-y-10 md:space-y-12">
        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-foreground font-serif text-2xl font-bold">
            About the R&D Cell
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            {description}
          </p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Functions
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {functions.map((fn, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
              >
                <span className="bg-gold/10 text-gold mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground text-base leading-relaxed">
                  {fn}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
