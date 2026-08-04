import { getPublishedConfig } from "@/lib/site-config-server";
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
      "Downloadable documents, NIRF reports, financial statements and ICT content published by JCT College of Engineering & Technology, Coimbatore.",
  });
}

export default async function EngineeringDocumentsPage() {
  // NIRF, financial statements and ICT content used to be routes of their own;
  // they are now panels of this page's sidebar. Mandatory disclosures and the
  // HR manual went the other way — each has a route of its own now.
  const [data, sections] = await Promise.all([
    getPublishedConfig("engineeringDocuments", DocumentsPageSchema, DEFAULT),
    loadHostedSections(PATH),
  ]);
  return <DocumentsPageLayout data={data} sections={sections} />;
}
