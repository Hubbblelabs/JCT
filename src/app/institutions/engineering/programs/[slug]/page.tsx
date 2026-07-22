import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import {
  getPublishedProgramBySlug,
  listPublishedProgramSlugs,
} from "@/lib/public-programs";
import { programMetadata } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    return await listPublishedProgramSlugs("engineering");
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getPublishedProgramBySlug({
    institution: "engineering",
    slug,
  });
  if (program) {
    return programMetadata({
      program: program.content,
      path: `/institutions/engineering/programs/${slug}`,
      titleSuffix: "JCT College of Engineering & Technology",
    });
  }
  return {};
}

export default async function EngineeringProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = await getPublishedProgramBySlug({
    institution: "engineering",
    slug,
  });
  if (program) {
    return (
      <ProgramPageLayout
        dept={program.content}
        backHref="/institutions/engineering"
        backLabel="Back to Engineering"
      />
    );
  }

  notFound();
}
