import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

// The hand-maintained course pages that used to live here were replaced by the
// DB-driven /programs/[slug] detail pages (same pattern engineering already
// uses). This shim 308-redirects any old inbound URL to its canonical program
// so external links / bookmarks / search results keep working.
const SLUG_MAP: Record<string, string> = {
  // Legacy "Legacy Path" entry consolidated into the supply-chain program.
  "bcom-logistics": "bcom-logistics-supply-chain",
};

export default async function LegacyArtsCoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const target = SLUG_MAP[course] ?? course;
  permanentRedirect(`/institutions/arts-science/programs/${target}`);
}
