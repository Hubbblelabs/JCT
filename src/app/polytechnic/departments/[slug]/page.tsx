import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentPageLayout } from "@/components/layout/DepartmentPageLayout";
import { polytechnicDepartments } from "@/data/polytechnic-departments";

export const dynamicParams = false;

export function generateStaticParams() {
  return polytechnicDepartments.map((dept) => ({ slug: dept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = polytechnicDepartments.find((item) => item.slug === slug);

  if (!dept) {
    return {};
  }

  return {
    title: `${dept.name} | JCT Polytechnic College`,
    description: dept.about.paragraphs[0],
    openGraph: {
      title: `${dept.name} | JCT Polytechnic College`,
      description: dept.about.paragraphs[0],
      type: "website",
    },
  };
}

export default async function PolytechnicDepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = polytechnicDepartments.find((item) => item.slug === slug);

  if (!dept) {
    notFound();
  }

  return (
    <DepartmentPageLayout
      dept={dept}
      backHref="/polytechnic"
      backLabel="Back to Polytechnic"
    />
  );
}
