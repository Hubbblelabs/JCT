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
    const programData = program.content;
    return {
      title: `${programData.name} | JCT Polytechnic College`,
      description: programData.about.paragraphs[0] ?? "",
      alternates: {
        canonical: `${siteConfig.url}/institutions/polytechnic/programs/${slug}`,
      },
      openGraph: {
        title: `${programData.name} | JCT Polytechnic College`,
        description: programData.about.paragraphs[0] ?? "",
        type: "website",
      },
    };
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
