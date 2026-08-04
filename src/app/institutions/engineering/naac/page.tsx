import { getPublishedConfig } from "@/lib/site-config-server";
import { NaacPageLayout } from "@/components/layout/NaacPageLayout";
import { loadHostedSections } from "@/components/layout/HostedContentSections";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

export const revalidate = 3600;

const PATH = "/institutions/engineering/naac";

const DEFAULT: NaacPageValue = NaacPageSchema.parse({});

export default async function EngineeringNaacPage() {
  // The AQAR / best-practices / distinctiveness pages used to be routes of
  // their own; they are now panels of this page's sidebar.
  const [data, sections] = await Promise.all([
    getPublishedConfig("engineeringNaac", NaacPageSchema, DEFAULT),
    loadHostedSections(PATH),
  ]);
  return <NaacPageLayout data={data} sections={sections} />;
}
