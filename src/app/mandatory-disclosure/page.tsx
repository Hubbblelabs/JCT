import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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

const disclosures = [
  {
    icon: "📖",
    name: "Code of Conduct",
    description:
      "The Code of Conduct sets the standards of behavior expected of all students, faculty, and staff at JCT Institutions. It covers academic integrity, professional behavior, campus etiquette, and the consequences of misconduct.",
  },
  {
    icon: "📋",
    name: "Policies & Regulations",
    description:
      "Institutional policies governing academic activities, examination procedures, leave regulations, fee refund policy, and all administrative processes. Updated regularly to align with UGC and Anna University guidelines.",
  },
  {
    icon: "🧭",
    name: "Professional Ethics",
    description:
      "Our Professional Ethics handbook outlines the guiding principles for ethical conduct in academic and research activities. It covers intellectual integrity, conflict of interest, and responsible use of institutional resources.",
  },
  {
    icon: "👥",
    name: "HR Manual",
    description:
      "The HR Manual provides comprehensive guidelines for faculty and staff management including recruitment procedures, service conditions, appraisal processes, leave policies, and disciplinary procedures.",
  },
  {
    icon: "📊",
    name: "Student Satisfaction Survey",
    description:
      "As mandated by NAAC and UGC, we conduct regular Student Satisfaction Surveys to measure and improve the quality of our services. The results are used to drive data-backed improvements across all departments.",
  },
  {
    icon: "🔒",
    name: "Privacy Policy",
    description:
      "This policy governs how JCT Institutions collects, uses, stores, and protects the personal information of students, faculty, staff, and website visitors, in compliance with applicable data protection laws.",
  },
  {
    icon: "📝",
    name: "Terms & Conditions",
    description:
      "The terms governing the use of our website, digital portals, and institutional services. By accessing our platforms, users agree to these terms which include acceptable use, intellectual property rights, and limitations of liability.",
  },
  {
    icon: "⚠️",
    name: "Disclaimer",
    description:
      "While JCT Institutions makes every effort to ensure the accuracy of information on this website, we provide this disclaimer to address potential inaccuracies, third-party links, and limitations on our liability.",
  },
];

export default function MandatoryDisclosurePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Mandatory Disclosure"
        subtitle="Transparency & Compliance"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Mandatory Disclosure" }]} />

        <div className="mt-12 space-y-12">
          {/* Overview */}
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              Institutional Transparency
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              JCT Institutions is committed to transparency and regulatory
              compliance. All mandatory disclosures, institutional policies, and
              legal documents are made available below in accordance with
              regulatory requirements from UGC, AICTE, Anna University, and
              NAAC.
            </p>
          </section>

          {/* Disclosures Grid */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {disclosures.map((item, i) => (
              <div
                key={i}
                className="bg-surface rounded-3xl border border-white/10 p-8"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="text-foreground font-serif text-xl font-bold">
                    {item.name}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </section>

          {/* Statutory Compliance */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <h2 className="text-foreground mb-6 font-serif text-2xl font-bold">
              Statutory Compliance
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              JCT Institutions complies with all applicable regulatory
              requirements mandated by:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "University Grants Commission (UGC)",
                "All India Council for Technical Education (AICTE)",
                "Anna University, Chennai",
                "National Assessment & Accreditation Council (NAAC)",
              ].map((body, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-xl border border-white/5 p-4 text-center"
                >
                  <p className="text-foreground text-sm font-medium">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact for Documents */}
          <section className="bg-gold text-navy rounded-3xl p-10 text-center">
            <h2 className="mb-4 font-serif text-2xl font-bold">
              Need a Specific Document?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl opacity-90">
              For certified copies of any institutional documents or regulatory
              filings, please contact our Administration Office.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-full bg-[#0a1628] px-8 py-4 font-bold text-white transition-colors hover:bg-[#112240]"
            >
              Contact Administration
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
