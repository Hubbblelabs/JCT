import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentPageLayout } from "@/components/layout/DepartmentPageLayout";
import { artsDepartments } from "@/data/arts-departments";
import { siteConfig } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return artsDepartments.map((dept) => ({ slug: dept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = artsDepartments.find((item) => item.slug === slug);

  if (!dept) {
    return {};
  }

  return {
    title: `${dept.name} | JCT College of Arts and Science`,
    description: dept.about.paragraphs[0],
    alternates: {
      canonical: `${siteConfig.url}/institutions/arts-science/departments/${dept.slug}`,
    },
    openGraph: {
      title: `${dept.name} | JCT College of Arts and Science`,
      description: dept.about.paragraphs[0],
      type: "website",
    },
  };
}

export default async function ArtsDepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = artsDepartments.find((item) => item.slug === slug);

  if (!dept) {
    notFound();
  }

  return (
    <DepartmentPageLayout
      dept={dept}
      backHref="/institutions/arts-science"
      backLabel="Back to Arts & Science"
    />
  );
}