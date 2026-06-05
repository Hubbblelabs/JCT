import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

// The hand-maintained diploma course pages that used to live here were replaced
// by the DB-driven /programs/[slug] detail pages (same pattern engineering
// already uses). The legacy slugs were short forms ("computer", "mechanical"),
// so this map points each at its canonical published program slug; a 308 keeps
// old inbound URLs / bookmarks / search results working.
const SLUG_MAP: Record<string, string> = {
  computer: "computer-technology",
  agricultural: "agricultural-engineering",
  petrochemical: "petrochemical-engineering",
  mechanical: "mechanical-engineering",
  eee: "electrical-electronics",
  civil: "civil-engineering",
};

export default async function LegacyPolyCoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const target = SLUG_MAP[course] ?? course;
  permanentRedirect(`/institutions/polytechnic/programs/${target}`);
}
