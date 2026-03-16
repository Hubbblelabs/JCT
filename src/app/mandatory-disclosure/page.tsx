import type { Metadata } from "next";
import { SectionPageLayout } from "@/components/layout/SectionPageLayout";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Mandatory Disclosure | ${siteConfig.name}`,
  description:
    "Access mandatory disclosures including code of conduct, policies, ethics handbook, HR manual, and legal documents at JCT Institutions.",
  openGraph: {
    title: `Mandatory Disclosure | ${siteConfig.name}`,
    description:
      "Access mandatory disclosures including code of conduct, policies, ethics handbook, HR manual, and legal documents at JCT Institutions.",
    type: "website",
  },
};

const subPages = [
  {
    name: "Code of Conduct",
    href: "/mandatory-disclosure/code-of-conduct",
    description: "Standards of behavior for students, faculty, and staff.",
  },
  {
    name: "Policies & Regulations",
    href: "/mandatory-disclosure/policies",
    description:
      "Institutional policies governing academic and administrative activities.",
  },
  {
    name: "Professional Ethics",
    href: "/mandatory-disclosure/ethics",
    description: "Guiding principles for ethical conduct.",
  },
  {
    name: "HR Manual",
    href: "/mandatory-disclosure/hr-manual",
    description: "Guidelines for faculty and staff management.",
  },
  {
    name: "Student Satisfaction Survey",
    href: "/mandatory-disclosure/survey",
    description: "Measuring student satisfaction for improvement.",
  },
  {
    name: "Privacy Policy",
    href: "/mandatory-disclosure/privacy",
    description: "How we collect, use, and protect your information.",
  },
  {
    name: "Terms & Conditions",
    href: "/mandatory-disclosure/terms",
    description: "Terms governing the use of our website and services.",
  },
  {
    name: "Disclaimer",
    href: "/mandatory-disclosure/disclaimer",
    description: "Important legal disclaimer.",
  },
];

export default function MandatoryDisclosurePage() {
  return (
    <SectionPageLayout
      title="Mandatory Disclosure"
      subtitle="Transparency & Compliance"
      breadcrumbs={[{ label: "Mandatory Disclosure" }]}
      description="JCT Institutions is committed to transparency and regulatory compliance. Access all mandatory disclosures, institutional policies, and legal documents below."
      subPages={subPages}
    />
  );
}
