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
    return await listPublishedProgramSlugs("polytechnic");
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
    institution: "polytechnic",
    slug,
  });
  if (program) {
    return programMetadata({
      program: program.content,
      path: `/institutions/polytechnic/programs/${slug}`,
      titleSuffix: "JCT Polytechnic College",
    });
  }
  return {};
}

export default async function PolytechnicProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = await getPublishedProgramBySlug({
    institution: "polytechnic",
    slug,
  });
  if (program) {
    return (
      <ProgramPageLayout
        dept={program.content}
        backHref="/institutions/polytechnic"
        backLabel="Back to Polytechnic"
      />
    );
  }

  notFound();
}
