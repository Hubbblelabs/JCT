import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Campus Life | ${siteConfig.name}`,
  description:
    "Experience vibrant campus life at JCT Institutions — world-class facilities, hostels, library, sports, clubs, cultural activities, and more.",
  openGraph: {
    title: `Campus Life | ${siteConfig.name}`,
    description:
      "Experience vibrant campus life at JCT Institutions — world-class facilities, hostels, library, sports, clubs, cultural activities, and more.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Facilities",
    href: "/campus-life/facilities",
    description: "Smart classrooms, WiFi campus, auditorium, and more.",
  },
  {
    name: "Hostel",
    href: "/campus-life/hostel",
    description: "Safe and comfortable accommodation for boys and girls.",
  },
  {
    name: "Library",
    href: "/campus-life/library",
    description: "50,000+ books, digital resources, and modern reading rooms.",
  },
  {
    name: "Laboratories",
    href: "/campus-life/laboratories",
    description: "50+ specialized labs with cutting-edge equipment.",
  },
  {
    name: "Sports & Recreation",
    href: "/campus-life/sports",
    description: "Outdoor and indoor sports facilities with competitive teams.",
  },
  {
    name: "Clubs & Societies",
    href: "/campus-life/clubs",
    description: "Student-led clubs for coding, robotics, arts, and more.",
  },
  {
    name: "Student Activities",
    href: "/campus-life/activities",
    description: "Techfests, culturals, hackathons, and guest lectures.",
  },
  {
    name: "Campus Gallery",
    href: "/campus-life/gallery",
    description: "Glimpses of life at JCT Institutions.",
  },
  {
    name: "News & Events",
    href: "/campus-life/news-events",
    description: "Stay updated with the latest happenings at JCT.",
  },
];

export default function CampusLifePage() {
  return (
    <SectionPageLayout
      title="Campus Life"
      subtitle="Where Learning Meets Living"
      breadcrumbs={[{ label: "Campus Life" }]}
      description="Spread across 50+ acres in Knowledge Park, Pichanur, the JCT campus offers a vibrant environment that nurtures academic excellence, personal growth, and holistic development. From world-class infrastructure to a thriving extracurricular scene, life at JCT is an experience to cherish."
      subPages={subPages}
    />
  );
}
