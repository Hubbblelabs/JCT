import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Courses | JCT College of Arts & Science, Coimbatore",
  description:
    "Browse the courses offered at JCT College of Arts & Science, Coimbatore.",
};

// The courses page itself is a client component, so its meta tags live here.
// Admin-managed values win; the fallback above stands when none is set.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "arts-science", path: "/institutions/arts-science/courses" });
  return { ...SEO_FALLBACK, ...seo };
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
