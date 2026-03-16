import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Programs Offered | ${siteConfig.name}`,
  description:
    "Browse undergraduate, postgraduate, and diploma programs offered across JCT Engineering, Arts & Science, and Polytechnic colleges.",
  openGraph: {
    title: `Programs Offered | ${siteConfig.name}`,
    description:
      "Browse undergraduate, postgraduate, and diploma programs offered across JCT Engineering, Arts & Science, and Polytechnic colleges.",
    type: "website",
  },
};

const institutions = [
  {
    name: "JCT College of Engineering & Technology",
    href: "/engineering",
    description:
      "B.E. / B.Tech and M.E. / M.Tech programs in core and emerging engineering disciplines.",
  },
  {
    name: "JCT College of Arts & Science",
    href: "/arts-science",
    description:
      "B.Sc., B.Com., BBA, BCA, M.Sc., and other undergraduate and postgraduate programs.",
  },
  {
    name: "JCT Polytechnic College",
    href: "/polytechnic",
    description:
      "Diploma programs in engineering and technology for a strong technical foundation.",
  },
];

export default function ProgramsPage() {
  const { title, subtitle } = academicsData.programs;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Programs Offered" },
      ]}
    >
      <p className="text-muted-foreground text-sm leading-relaxed">
        JCT Institutions offers a diverse portfolio of programs across three
        colleges. Select an institution below to explore available courses and
        departments.
      </p>

      <div className="mt-8 space-y-4">
        {institutions.map((inst) => (
          <Link
            key={inst.href}
            href={inst.href}
            className="border-border bg-surface hover:border-gold/30 group flex items-center justify-between rounded-xl border p-5 transition-colors"
          >
            <div>
              <h3 className="text-foreground group-hover:text-gold font-serif text-base font-semibold transition-colors">
                {inst.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {inst.description}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-muted-foreground group-hover:text-gold shrink-0 transition-colors"
            />
          </Link>
        ))}
      </div>
    </ContentPageLayout>
  );
}
