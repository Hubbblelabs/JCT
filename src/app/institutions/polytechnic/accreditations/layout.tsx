import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

const SEO_FALLBACK: Metadata = {
  title: "Accreditations | JCT Polytechnic College, Coimbatore",
  description:
    "Approvals and accreditations of JCT Polytechnic College — AICTE approval and DOTE affiliation recognising our diploma programmes.",
};

export default function PolytechnicAccreditationsLayout({
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
    scope: "polytechnic",
    path: "/institutions/polytechnic/accreditations",
  });
  return { ...SEO_FALLBACK, ...seo };
}
