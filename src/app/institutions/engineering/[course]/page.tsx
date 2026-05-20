import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

export default async function LegacyEngineeringCoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  permanentRedirect(`/institutions/engineering/programs/${course}`);
}
