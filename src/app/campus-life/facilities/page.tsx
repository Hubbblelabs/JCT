import type { Metadata } from "next";
import {
  Monitor,
  BookOpen,
  FlaskConical,
  Building,
  Dumbbell,
  Bus,
  Wifi,
  Heart,
  UtensilsCrossed,
  Theater,
} from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { campusData } from "@/data/campus";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Campus Facilities | ${siteConfig.name}`,
  description:
    "Explore JCT Institutions' campus facilities — smart classrooms, labs, library, hostel, sports complex, WiFi campus, and more.",
  openGraph: {
    title: `Campus Facilities | ${siteConfig.name}`,
    description:
      "Explore JCT Institutions' campus facilities — smart classrooms, labs, library, hostel, sports complex, WiFi campus, and more.",
    type: "website",
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  BookOpen,
  FlaskConical,
  Building,
  Dumbbell,
  Bus,
  Wifi,
  Heart,
  UtensilsCrossed,
  Theater,
};

export default function FacilitiesPage() {
  const { overview, facilities } = campusData.facilities;

  return (
    <ContentPageLayout
      title="Campus Facilities"
      subtitle="World-Class Infrastructure"
      breadcrumbs={[
        { label: "Campus Life", href: "/campus-life" },
        { label: "Facilities" },
      ]}
    >
      <p className="text-muted-foreground mb-10 text-base leading-relaxed">
        {overview}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => {
          const Icon = iconMap[facility.icon];
          return (
            <div
              key={facility.title}
              className="bg-surface border-border rounded-xl border p-6"
            >
              {Icon && (
                <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon className="text-gold h-6 w-6" />
                </div>
              )}
              <h3 className="text-foreground font-serif text-lg font-semibold">
                {facility.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {facility.description}
              </p>
            </div>
          );
        })}
      </div>
    </ContentPageLayout>
  );
}
