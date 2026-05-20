import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import { siteConfig } from "@/data/site";
import {
  getPublishedProgramBySlug,
  listPublishedProgramSlugs,
} from "@/lib/public-programs";

export const dynamicParams = true;

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
    const programData = program.content;
    return {
      title: `${programData.name} | JCT College of Arts and Science`,
      description: programData.about.paragraphs[0] ?? "",
      alternates: {
        canonical: `${siteConfig.url}/institutions/arts-science/programs/${slug}`,
      },
      openGraph: {
        title: `${programData.name} | JCT College of Arts and Science`,
        description: programData.about.paragraphs[0] ?? "",
        type: "website",
      },
    };
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
