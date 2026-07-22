import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Accreditations | JCT College of Arts & Science, Coimbatore",
  description:
    "Approvals and accreditations of JCT College of Arts & Science — NAAC and affiliating-university recognitions reflecting our academic standards.",
};

export default function ArtsScienceAccreditationsLayout({
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
    scope: "arts-science",
    path: "/institutions/arts-science/accreditations",
  });
  return { ...SEO_FALLBACK, ...seo };
}
