import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
import { SiteChrome } from "@/components/layout/SiteChrome";

const SEO_FALLBACK: Metadata = {
  title: "Accreditations | JCT Institutions, Coimbatore",
  description:
    "Approvals and accreditations across JCT Institutions — recognitions from NAAC, NBA, AICTE and other statutory bodies for our Engineering, Arts & Science, and Polytechnic colleges.",
};

export default function AccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "main", path: "/accreditations" });
  return { ...SEO_FALLBACK, ...seo };
}
