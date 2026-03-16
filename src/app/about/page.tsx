import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description:
    "Learn about JCT Institutions — our vision, mission, history, leadership, and commitment to academic excellence since 2009.",
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description:
      "Learn about JCT Institutions — our vision, mission, history, leadership, and commitment to academic excellence since 2009.",
    type: "website",
  },
};

const subPages = [
  {
    name: "About the Institution",
    href: "/about/institution",
    description: "Our story, campus, and academic standing.",
  },
  {
    name: "Vision & Mission",
    href: "/about/vision-mission",
    description: "Our guiding principles and core values.",
  },
  {
    name: "Chairman's Message",
    href: "/about/chairmans-message",
    description: "A word from our Chairman.",
  },
  {
    name: "Principal's Message",
    href: "/about/principals-message",
    description: "A word from our Principal.",
  },
  {
    name: "History",
    href: "/about/history",
    description: "Key milestones in our journey.",
  },
  {
    name: "Leadership",
    href: "/about/leadership",
    description: "Meet our leadership team.",
  },
  {
    name: "Organizational Structure",
    href: "/about/organizational-structure",
    description: "Our governance framework.",
  },
  {
    name: "Governing Council",
    href: "/about/governing-council",
    description: "Members guiding our direction.",
  },
  {
    name: "Strategic Plan",
    href: "/about/strategic-plan",
    description: "Our roadmap for 2024–2029.",
  },
];

export default function AboutPage() {
  return (
    <SectionPageLayout
      title="About JCT"
      subtitle="Three Colleges, One Commitment to Excellence"
      breadcrumbs={[{ label: "About JCT" }]}
      description="JCT Group of Institutions is a premier educational conglomerate in Coimbatore comprising three distinguished colleges. Explore our heritage, leadership, and vision for the future."
      subPages={subPages}
    />
  );
}
