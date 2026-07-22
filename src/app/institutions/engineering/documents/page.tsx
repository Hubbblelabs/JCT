import { getPublishedConfigValue } from "@/lib/site-config-server";
import { DocumentsPageLayout } from "@/components/layout/DocumentsPageLayout";
import { DocumentsPageSchema } from "@/lib/validation";
import type { DocumentsPageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const DEFAULT: DocumentsPageValue = DocumentsPageSchema.parse({});

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: "/institutions/engineering/documents",
    fallbackTitle:
      "Documents & Downloads | JCT College of Engineering & Technology",
    fallbackDescription:
      "Downloadable documents, disclosures, and forms published by JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function EngineeringDocumentsPage() {
  const value = await getPublishedConfigValue("engineeringDocuments");
  const data =
    value && typeof value === "object"
      ? (value as DocumentsPageValue)
      : DEFAULT;
  return <DocumentsPageLayout data={data} />;
}
