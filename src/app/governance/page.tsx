import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/site";

import {
  ShieldAlert,
  Users,
  Scale,
  Megaphone,
  GraduationCap,
  Heart,
  Zap,
} from "lucide-react";

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

const cells = [
  {
    icon: ShieldAlert,
    name: "Anti-Ragging Cell",
    description:
      "JCT Institutions enforces a zero-tolerance policy against ragging in any form. The Anti-Ragging Committee actively monitors the campus and hostel areas, conducts awareness programs, and ensures swift action against any reported incident. Students can report ragging anonymously through our dedicated helpline.",
    highlights: [
      "24/7 helpline number available",
      "Regular awareness campaigns",
      "Strict action as per UGC regulations",
    ],
  },
  {
    icon: Users,
    name: "SC/ST Cell",
    description:
      "The SC/ST Cell is dedicated to the welfare, advancement, and empowerment of students and staff from Scheduled Caste and Scheduled Tribe communities. The cell ensures access to government scholarships, special coaching, and addresses any grievances related to discrimination.",
    highlights: [
      "Government scholarship facilitation",
      "Special coaching programs",
      "Anti-discrimination grievance redressal",
    ],
  },
  {
    icon: Scale,
    name: "Internal Complaints Committee (ICC)",
    description:
      "Constituted as per the Sexual Harassment of Women at Workplace Act, 2013, the ICC provides a safe and confidential mechanism for addressing complaints of sexual harassment. The committee comprises senior faculty and external members to ensure impartial proceedings.",
    highlights: [
      "Confidential complaint mechanism",
      "As per POSH Act, 2013",
      "Regular sensitization workshops",
    ],
  },
  {
    icon: Megaphone,
    name: "Grievance Redressal Cell",
    description:
      "The Grievance Redressal Cell provides students, faculty, and staff a transparent mechanism to voice concerns related to academic, administrative, or personal matters. All grievances are addressed within a stipulated time frame to ensure satisfaction.",
    highlights: [
      "Online and offline grievance submission",
      "Time-bound resolution",
      "Anonymous reporting option",
    ],
  },
  {
    icon: GraduationCap,
    name: "Women Empowerment Cell",
    description:
      "The Women Empowerment Cell organizes programs, workshops, and seminars focused on the physical, mental, and professional well-being of female students and staff. Activities include self-defense training, legal awareness sessions, and career guidance.",
    highlights: [
      "Self-defense training programs",
      "Legal rights awareness",
      "Professional development workshops",
    ],
  },
  {
    icon: Heart,
    name: "Student Welfare Cell",
    description:
      "The Student Welfare Cell is the backbone of student support at JCT. It addresses the holistic needs of students — from academic support and counseling to financial aid and scholarship guidance. Our trained counselors are available for one-on-one sessions.",
    highlights: [
      "Professional counseling services",
      "Financial aid guidance",
      "Academic support programs",
    ],
  },
  {
    icon: Zap,
    name: "Equal Opportunity Cell",
    description:
      "The Equal Opportunity Cell works to create an inclusive campus environment for students with disabilities and those from economically disadvantaged backgrounds. The cell ensures barrier-free access to all campus facilities and academic resources.",
    highlights: [
      "Barrier-free campus infrastructure",
      "Special accommodations for differently-abled",
      "Inclusive academic programs",
    ],
  },
];

export default function GovernancePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Governance"
        subtitle="Transparency, Safety & Equal Opportunity"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Governance" }]} />

        <div className="mt-12 space-y-20">
          {/* Overview */}
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              Institutional Cells & Committees
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              JCT Institutions has established various statutory and
              institutional cells to ensure a safe, inclusive, and supportive
              environment for all students, faculty, and staff. Each cell
              operates with transparency and commitment to the highest ethical
              standards.
            </p>
          </section>

          {/* Cells */}
          <section className="grid gap-8 md:grid-cols-2">
            {cells.map((cell, i) => (
              <div
                key={i}
                className="bg-surface rounded-3xl border border-white/10 p-8"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                    <cell.icon size={28} className="text-[#FFC917]" />
                  </div>
                  <h3 className="text-foreground font-serif text-xl font-bold">
                    {cell.name}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {cell.description}
                </p>
                <ul className="space-y-2">
                  {cell.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5 shrink-0">✓</span>
                      <span className="text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Contact CTA */}
          <section className="bg-gold text-navy rounded-3xl p-10 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold">
              Need to Report a Concern?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl opacity-90">
              All reports are handled with strict confidentiality. You can reach
              out to the relevant cell directly or contact the administration
              for guidance.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-full bg-[#0a1628] px-8 py-4 font-bold text-white transition-colors hover:bg-[#112240]"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
