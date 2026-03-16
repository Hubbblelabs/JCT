import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Examinations | ${siteConfig.name}`,
  description:
    "Access examination cell information, results, passing board details, and exam notifications at JCT Institutions.",
  openGraph: {
    title: `Examinations | ${siteConfig.name}`,
    description:
      "Access examination cell information, results, passing board details, and exam notifications at JCT Institutions.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Examination Cell",
    href: "/examinations/cell",
    description: "Planning, coordination, and execution of examinations.",
  },
  {
    name: "Result Passing Board",
    href: "/examinations/passing-board",
    description: "Transparent evaluation and result declaration process.",
  },
  {
    name: "Examination Results",
    href: "/examinations/results",
    description: "Access semester results and grade sheets.",
  },
  {
    name: "Exam Notifications",
    href: "/examinations/notifications",
    description: "Important examination announcements and schedules.",
  },
];

export default function ExaminationsPage() {
  return (
    <SectionPageLayout
      title="Examinations"
      subtitle="Fair, Transparent & Efficient Examination Processes"
      breadcrumbs={[{ label: "Examinations" }]}
      description="The Examination division at JCT Institutions manages all aspects of internal and university examinations — from scheduling and evaluation to result publication and notifications."
      subPages={subPages}
    />
  );
}
