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
    const programData = program.content;
    return {
      title: `${programData.name} | JCT College of Engineering & Technology`,
      description: programData.about.paragraphs[0] ?? "",
      alternates: {
        canonical: `${siteConfig.url}/institutions/engineering/programs/${slug}`,
      },
      openGraph: {
        title: `${programData.name} | JCT College of Engineering & Technology`,
        description: programData.about.paragraphs[0] ?? "",
        type: "website",
      },
    };
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
