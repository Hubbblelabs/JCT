import type { Metadata } from "next";
import { getPublishedConfig } from "@/lib/site-config-server";
import { seoMetadata } from "@/lib/seo";
import { AboutPageLayout } from "@/components/layout/AboutPageLayout";
import type { AboutPageValue } from "@/lib/validation";
import { MainAboutSchema } from "@/lib/validation";

export const revalidate = 86400;

const SEO_FALLBACK: Metadata = {
  title: "About Us | JCT Institutions",
  description:
    "Learn about JCT Institutions — our vision, mission, and leadership.",
};

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "main", path: "/about-us" });
  return { ...SEO_FALLBACK, ...seo };
}

const DEFAULT_MAIN_ABOUT: AboutPageValue = MainAboutSchema.parse({
  hero: {
    title: "About JCT Institutions",
    subtitle:
      "Three decades of academic excellence, shaping future-ready professionals in Coimbatore.",
  },
  about: {
    paragraphs: [
      "JCT Institutions is a group of premier educational institutions located in Coimbatore, Tamil Nadu. Established with a vision to provide quality technical and professional education, JCT has been a cornerstone of academic excellence for over three decades.",
      "The group comprises JCT College of Engineering and Technology (Autonomous), JCT College of Arts and Science, and JCT Polytechnic College — each offering a distinct academic pathway while sharing a unified commitment to holistic development.",
    ],
    stats: [
      { value: "30+", label: "Years of Excellence" },
      { value: "3", label: "Institutions" },
      { value: "10,000+", label: "Alumni" },
      { value: "100+", label: "Programs" },
    ],
  },
  visionMission: {
    visionText:
      "To be a globally recognised centre of learning that nurtures innovative thinkers, ethical leaders, and socially responsible professionals.",
    missionPoints: [
      "Deliver outcome-based education aligned with industry and societal needs.",
      "Foster a culture of research, innovation, and entrepreneurship.",
      "Uphold integrity, inclusivity, and excellence in every endeavour.",
      "Build strong industry partnerships to ensure career-ready graduates.",
    ],
    qualityPolicy: "",
  },
  management: {
    description:
      "JCT Institutions is led by a dedicated management team committed to academic excellence and student success.",
    members: [],
  },
}) as AboutPageValue;

export default async function MainAboutPage() {
  const data = await getPublishedConfig(
    "mainAbout",
    MainAboutSchema,
    DEFAULT_MAIN_ABOUT,
  );

  return <AboutPageLayout data={data} institution="main" />;
}
