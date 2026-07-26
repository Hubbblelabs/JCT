import { getPublishedConfigValue } from "@/lib/site-config-server";
import { DocumentsPageLayout } from "@/components/layout/DocumentsPageLayout";
import { loadHostedSections } from "@/components/layout/HostedContentSections";
import { DocumentsPageSchema } from "@/lib/validation";
import type { DocumentsPageValue } from "@/lib/validation";
import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";

export const revalidate = 86400;

const PATH = "/institutions/engineering/documents";

const DEFAULT: DocumentsPageValue = DocumentsPageSchema.parse({});

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    scope: "engineering",
    path: PATH,
    fallbackTitle:
      "Documents & Downloads | JCT College of Engineering & Technology",
    fallbackDescription:
      "Downloadable documents, disclosures, NIRF reports, financial statements and ICT content published by JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function EngineeringDocumentsPage() {
  // NIRF, financial statements and ICT content used to be routes of their own;
  // they are now panels of this page's sidebar.
  const [value, sections] = await Promise.all([
    getPublishedConfigValue("engineeringDocuments"),
    loadHostedSections(PATH),
  ]);
  const data =
    value && typeof value === "object"
      ? (value as DocumentsPageValue)
      : DEFAULT;
  return <DocumentsPageLayout data={data} sections={sections} />;
}
