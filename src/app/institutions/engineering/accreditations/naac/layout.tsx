import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "NAAC | JCT College of Engineering & Technology, Coimbatore",
  description:
    "NAAC accreditation at JCT College of Engineering & Technology — Self Study Report, Data Validation and Verification, and the full set of appeal and criterion-wise supporting documents.",
};

export default function EngineeringNaacLayout({
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
    path: "/institutions/engineering/accreditations/naac",
  });
  return { ...SEO_FALLBACK, ...seo };
}
