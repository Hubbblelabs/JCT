import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Vision & Mission | ${siteConfig.name}`,
  description:
    "Discover JCT Institutions' vision to be a globally recognized centre of excellence and our mission to nurture future-ready professionals.",
  openGraph: {
    title: `Vision & Mission | ${siteConfig.name}`,
    description:
      "Discover JCT Institutions' vision to be a globally recognized centre of excellence and our mission to nurture future-ready professionals.",
    type: "website",
  },
};

export default function VisionMissionPage() {
  const { vision, mission, coreValues } = aboutData.visionMission;

  return (
    <ContentPageLayout
      title="Vision & Mission"
      subtitle="Our Guiding Principles"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Vision & Mission" },
      ]}
    >
      <div className="space-y-12">
        {/* Vision */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Our Vision
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            {vision}
          </p>
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Our Mission
          </h2>
          <ul className="mt-4 space-y-3">
            {mission.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-gold/10 text-gold mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground text-base leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Core Values */}
        <section>
          <h2 className="text-foreground font-serif text-2xl font-bold">
            Core Values
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <div key={index} className="border-border rounded-xl border p-5">
                <h3 className="text-gold font-sans text-sm font-semibold">
                  {value.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
