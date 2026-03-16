import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Governance | ${siteConfig.name}`,
  description:
    "Explore the governance structure and institutional cells at JCT Institutions — committed to transparency, safety, and equal opportunity.",
  openGraph: {
    title: `Governance | ${siteConfig.name}`,
    description:
      "Explore the governance structure and institutional cells at JCT Institutions — committed to transparency, safety, and equal opportunity.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Anti-Ragging Cell",
    href: "/governance/anti-ragging",
    description: "Zero tolerance towards ragging in any form.",
  },
  {
    name: "SC/ST Cell",
    href: "/governance/sc-st-cell",
    description: "Ensuring welfare and advancement of SC/ST students.",
  },
  {
    name: "Internal Complaints Committee",
    href: "/governance/icc",
    description: "Addressing workplace harassment complaints.",
  },
  {
    name: "Grievance Redressal Cell",
    href: "/governance/grievance",
    description: "Your concerns matter to us.",
  },
  {
    name: "Women Empowerment Cell",
    href: "/governance/women-empowerment",
    description: "Empowering women through education and support.",
  },
  {
    name: "Student Welfare Cell",
    href: "/governance/student-welfare",
    description: "Supporting student academic and personal well-being.",
  },
  {
    name: "Equal Opportunity Cell",
    href: "/governance/equal-opportunity",
    description: "Creating an inclusive campus for all.",
  },
];

export default function GovernancePage() {
  return (
    <SectionPageLayout
      title="Governance"
      subtitle="Transparency, Safety & Equal Opportunity"
      breadcrumbs={[{ label: "Governance" }]}
      description="JCT Institutions has established various statutory and institutional cells to ensure a safe, inclusive, and supportive environment for all students, faculty, and staff."
      subPages={subPages}
    />
  );
}
