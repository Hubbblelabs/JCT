import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentPageLayout } from "@/components/layout/DepartmentPageLayout";
import { engineeringDepartments } from "@/data/engineering-departments";

export const dynamicParams = false;

export function generateStaticParams() {
  return engineeringDepartments.map((dept) => ({ slug: dept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = engineeringDepartments.find((item) => item.slug === slug);

  if (!dept) {
    return {};
  }

  return {
    title: `${dept.name} | JCT College of Engineering & Technology`,
    description: dept.about.paragraphs[0],
    openGraph: {
      title: `${dept.name} | JCT College of Engineering & Technology`,
      description: dept.about.paragraphs[0],
      type: "website",
    },
  };
}

export default async function EngineeringDepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = engineeringDepartments.find((item) => item.slug === slug);

  if (!dept) {
    notFound();
  }

  return (
    <DepartmentPageLayout
      dept={dept}
      backHref="/institutions/engineering"
      backLabel="Back to Engineering"
    />
  );
}
