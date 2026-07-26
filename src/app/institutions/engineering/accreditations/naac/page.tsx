import { getPublishedConfigValue } from "@/lib/site-config-server";
import { NaacPageLayout } from "@/components/layout/NaacPageLayout";
import { loadHostedSections } from "@/components/layout/HostedContentSections";
import { NaacPageSchema } from "@/lib/validation";
import type { NaacPageValue } from "@/lib/validation";

export const revalidate = 3600;

const PATH = "/institutions/engineering/accreditations/naac";

const DEFAULT: NaacPageValue = NaacPageSchema.parse({});

export default async function EngineeringNaacPage() {
  // The AQAR / best-practices / distinctiveness pages used to be routes of
  // their own; they are now panels of this page's sidebar.
  const [value, sections] = await Promise.all([
    getPublishedConfigValue("engineeringNaac"),
    loadHostedSections(PATH),
  ]);
  const data =
    value && typeof value === "object" ? (value as NaacPageValue) : DEFAULT;
  return <NaacPageLayout data={data} sections={sections} />;
}
