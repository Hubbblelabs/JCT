import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "About | JCT Polytechnic College, Coimbatore",
  description:
    "Learn about JCT Polytechnic College — offering AICTE-approved diploma programs in Coimbatore, established under the Shri Jagannath Educational Health and Charitable Trust.",
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
  const seo = await seoMetadata({ scope: "polytechnic", path: "/institutions/polytechnic/about" });
  return { ...SEO_FALLBACK, ...seo };
}
