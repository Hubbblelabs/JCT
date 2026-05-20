import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramPageLayout } from "@/components/layout/ProgramPageLayout";
import { polytechnicPrograms } from "@/data/polytechnic-programs";
import { siteConfig } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return polytechnicPrograms.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = polytechnicPrograms.find((item) => item.slug === slug);

  if (!program) {
    return {};
  }

  return {
    title: `${program.name} | JCT Polytechnic College`,
    description: program.about.paragraphs[0],
    alternates: {
      canonical: `${siteConfig.url}/institutions/polytechnic/programs/${program.slug}`,
    },
    openGraph: {
      title: `${program.name} | JCT Polytechnic College`,
      description: program.about.paragraphs[0],
      type: "website",
    },
  };
}

export default async function PolytechnicProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = polytechnicPrograms.find((item) => item.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <ProgramPageLayout
      dept={program}
      backHref="/institutions/polytechnic"
      backLabel="Back to Polytechnic"
    />
  );
}
