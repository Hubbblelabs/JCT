import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Hostel Facilities | ${siteConfig.name}`,
  description:
    "JCT Institutions hostel facilities — safe, comfortable accommodation for boys and girls with modern amenities and 24/7 security.",
  openGraph: {
    title: `Hostel Facilities | ${siteConfig.name}`,
    description:
      "JCT Institutions hostel facilities — safe, comfortable accommodation for boys and girls with modern amenities and 24/7 security.",
    type: "website",
  },
};

export default function HostelPage() {
  const { description, features, capacity } = campusData.hostel;

  return (
    <ContentPageLayout
      title="Hostel Facilities"
      subtitle="A Home Away from Home"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Hostel" },
      ]}
    >
      <p className="text-muted-foreground mb-10 text-base leading-relaxed">
        {description}
      </p>

      {/* Capacity stats */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        <div className="bg-surface border-border rounded-xl border p-6 text-center">
          <p className="text-gold font-serif text-4xl font-bold">
            {capacity.boys}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Boys Hostel Capacity
          </p>
        </div>
        <div className="bg-surface border-border rounded-xl border p-6 text-center">
          <p className="text-gold font-serif text-4xl font-bold">
            {capacity.girls}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Girls Hostel Capacity
          </p>
        </div>
      </div>

      {/* Features */}
      <h2 className="text-foreground mb-6 font-serif text-2xl font-semibold">
        Hostel Features
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CheckCircle className="text-gold mt-0.5 h-5 w-5 shrink-0" />
            <span className="text-muted-foreground text-sm leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </ContentPageLayout>
  );
}
