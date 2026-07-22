import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "About | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Learn about JCT College of Engineering and Technology — an autonomous institution offering B.E., B.Tech, M.E., and Ph.D programs in Coimbatore, established under the Shri Jagannath Educational Health and Charitable Trust.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/about",
  });
  return { ...SEO_FALLBACK, ...seo };
}
