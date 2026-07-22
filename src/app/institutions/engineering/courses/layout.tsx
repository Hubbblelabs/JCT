import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Courses | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Browse the courses offered at JCT College of Engineering & Technology, Coimbatore.",
};

// The courses page itself is a client component, so its meta tags live here.
// Admin-managed values win; the fallback above stands when none is set.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/courses",
  });
  return { ...SEO_FALLBACK, ...seo };
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
