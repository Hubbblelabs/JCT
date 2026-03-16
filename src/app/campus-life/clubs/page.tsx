import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Clubs & Societies | ${siteConfig.name}`,
  description:
    "Join student-led clubs at JCT Institutions — Coding Club, Robotics Club, NSS, Entrepreneurship Cell, and more.",
  openGraph: {
    title: `Clubs & Societies | ${siteConfig.name}`,
    description:
      "Join student-led clubs at JCT Institutions — Coding Club, Robotics Club, NSS, Entrepreneurship Cell, and more.",
    type: "website",
  },
};

export default function ClubsPage() {
  const { clubs } = campusData.clubs;

  return (
    <ContentPageLayout
      title="Clubs & Societies"
      subtitle="Where Passion Meets Purpose"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Clubs" },
      ]}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {clubs.map((club) => (
          <div
            key={club.name}
            className="bg-surface border-border rounded-xl border p-6"
          >
            <h3 className="text-foreground font-serif text-lg font-semibold">
              {club.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {club.description}
            </p>
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
              <Users className="h-4 w-4" />
              <span>{club.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </ContentPageLayout>
  );
}
