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
    return await listPublishedProgramSlugs("arts-science");
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
    institution: "arts-science",
    slug,
  });
  if (program) {
    return programMetadata({
      program: program.content,
      path: `/institutions/arts-science/programs/${slug}`,
      titleSuffix: "JCT College of Arts and Science",
    });
  }
  return {};
}

export default async function ArtsProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = await getPublishedProgramBySlug({
    institution: "arts-science",
    slug,
  });
  if (program) {
    return (
      <ProgramPageLayout
        dept={program.content}
        backHref="/institutions/arts-science"
        backLabel="Back to Arts & Science"
      />
    );
  }

  notFound();
}
