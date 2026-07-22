import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Accreditations | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Approvals and accreditations of JCT College of Engineering & Technology — NAAC, NBA, AICTE and Anna University affiliations recognising our academic quality.",
};

export default function EngineeringAccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "engineering", path: "/institutions/engineering/accreditations" });
  return { ...SEO_FALLBACK, ...seo };
}
