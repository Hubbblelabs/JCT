import type { Metadata } from "next";
import {
  BookOpen,
  Users,
  FlaskConical,
  TrendingUp,
  Award,
  Heart,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { admissionsData } from "@/data/admissions";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Why Choose JCT? | Admissions | ${siteConfig.name}`,
  description:
    "Discover why JCT Institutions is the right choice — industry-aligned curriculum, experienced faculty, modern labs, strong placements, and affordable education.",
  openGraph: {
    title: `Why Choose JCT? | Admissions | ${siteConfig.name}`,
    description:
      "Discover why JCT Institutions is the right choice — industry-aligned curriculum, experienced faculty, modern labs, strong placements, and affordable education.",
    type: "website",
  },
};

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  BookOpen,
  Users,
  FlaskConical,
  TrendingUp,
  Award,
  Heart,
  IndianRupee,
  MapPin,
};

export default function WhyJCTPage() {
  const { reasons } = admissionsData.whyJCT;

  return (
    <ContentPageLayout
      title="Why Choose JCT?"
      subtitle="Discover what makes JCT Institutions the right choice for your future."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Why Choose JCT?" },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {reasons.map((reason) => {
          const Icon = iconMap[reason.icon];
          return (
            <div
              key={reason.title}
              className="border-border hover:border-gold/30 rounded-xl border p-5 transition-colors"
            >
              <div className="mb-3 flex items-center gap-3">
                {Icon && <Icon size={22} className="text-gold shrink-0" />}
                <h3 className="text-foreground font-serif text-lg font-semibold">
                  {reason.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>
    </ContentPageLayout>
  );
}
