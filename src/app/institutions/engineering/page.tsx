import type { Metadata } from "next";
import EngineeringPage from "@/modules/engineering/EngineeringPage";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering",
    fallbackTitle:
      "Engineering | JCT College of Engineering & Technology, Coimbatore",
    fallbackDescription:
      "JCT College of Engineering & Technology offers AICTE-approved B.E./B.Tech programs in CSE, ECE, Mechanical, Civil, EEE & IT. Anna University affiliated. NBA accredited. 98% placement rate.",
    fallbackOgDescription:
      "AICTE-approved B.E./B.Tech programs with industry-aligned curriculum. NBA accredited. 98% placement rate.",
  });
}

export default function Page() {
  return <EngineeringPage />;
}
