import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Courses | JCT Polytechnic College, Coimbatore",
  description:
    "Browse the courses offered at JCT Polytechnic College, Coimbatore.",
};

// The courses page itself is a client component, so its meta tags live here.
// Admin-managed values win; the fallback above stands when none is set.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "polytechnic", path: "/institutions/polytechnic/courses" });
  return { ...SEO_FALLBACK, ...seo };
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
