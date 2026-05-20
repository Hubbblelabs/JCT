import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import { artsPrograms } from "@/data/arts-programs";
import { siteConfig } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return artsPrograms.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = artsPrograms.find((item) => item.slug === slug);

  if (!program) {
    return {};
  }

  return {
    title: `${program.name} | JCT College of Arts and Science`,
    description: program.about.paragraphs[0],
    alternates: {
      canonical: `${siteConfig.url}/institutions/arts-science/programs/${program.slug}`,
    },
    openGraph: {
      title: `${program.name} | JCT College of Arts and Science`,
      description: program.about.paragraphs[0],
      type: "website",
    },
  };
}

export default async function ArtsProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = artsPrograms.find((item) => item.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <ProgramPageLayout
      dept={program}
      backHref="/institutions/arts-science"
      backLabel="Back to Arts & Science"
    />
  );
}
