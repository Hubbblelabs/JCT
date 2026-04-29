import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Admissions | ${siteConfig.name}`,
  description:
    "Admissions open at JCT Institutions. Explore programs, eligibility, scholarships, fee structure, and the application process.",
  openGraph: {
    title: `Admissions | ${siteConfig.name}`,
    description:
      "Admissions open at JCT Institutions. Explore programs, eligibility, scholarships, and the application process.",
    type: "website",
  },
};

export default function AdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Admissions"
        subtitle="Your Journey to Excellence Starts Here"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Admissions" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Admission Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Admission Overview
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                Welcome to the Admissions Portal of JCT Institutions. We offer a
                diverse range of programs across Engineering, Arts &amp;
                Science, and Polytechnic disciplines.
              </p>
              <p className="mt-2">
                Our admission process is designed to be transparent,
                merit-based, and accessible to students from all backgrounds.
                Explore our programs and take the first step towards a
                successful career.
              </p>
            </div>
          </section>

          {/* 2. Programs by Institution */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Programs by Institution
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3 md:grid-rows-2">
              {/* Engineering Card - 2/3 Width, 2/2 Height */}
              <div className="border-border flex flex-col rounded-xl border bg-white/5 p-6 md:col-span-2 md:row-span-2 lg:p-8">
                <h3 className="text-gold mb-6 text-2xl font-bold">
                  Engineering College
                </h3>

                <div className="mb-4">
                  <div className="text-foreground/90 mb-3 text-sm font-extrabold tracking-widest uppercase">
                    UG COURSES
                  </div>
                  <ul className="text-muted-foreground grid grid-cols-1 gap-x-8 gap-y-1.5 text-[14px] sm:grid-cols-2">
                    <li>B.Tech. Artificial Intelligence And Data Science</li>
                    <li>B.Tech. Bio-Technology and Bio-Chemical Engineering</li>
                    <li>B.Tech. Petrochemical Technology</li>
                    <li>B.Tech. Food Technology</li>
                    <li>B.E. Petroleum Engineering</li>
                    <li>B.Tech. Computer Science and Business Systems</li>
                    <li>B.E. Electrical and Electronics Engineering</li>
                    <li>B.E. Electronics and Communication Engineering</li>
                    <li>B.E. Computer Science & Engineering</li>
                    <li>B.E. Civil Engineering</li>
                    <li>B.E. Mechanical Engineering</li>
                  </ul>
                </div>

                <div className="mt-auto border-t border-white/5 pt-6">
                  <div className="text-foreground/90 mb-3 text-sm font-extrabold tracking-widest uppercase">
                    PG COURSES & RESEARCH
                  </div>
                  <ul className="text-muted-foreground grid grid-cols-1 gap-x-8 gap-y-1.5 text-[14px] sm:grid-cols-2">
                    <li>M.E. Structural Engineering</li>
                    <li>M.E. Power Electronics and Drives</li>
                    <li>
                      M.E. CSE (Artificial Intelligence & Machine Learning)
                    </li>
                    <li>Ph.D. Electrical and Electronics Engineering</li>
                  </ul>
                </div>
              </div>

              {/* Arts & Science Card - 1/3 Width, 1/2 Height */}
              <div className="border-border rounded-xl border bg-white/5 p-6 md:col-span-1 md:row-span-1">
                <h3 className="text-gold mb-4 text-xl font-bold">
                  Arts &amp; Science
                </h3>
                <ul className="text-muted-foreground space-y-1.5 text-[14px]">
                  <li>B.Sc Computer Science</li>
                  <li>B.Sc Artificial Intelligence and Machine Learning</li>
                  <li>BCA (Bachelor of Computer Applications)</li>
                  <li>B.Com Logistics and Supply chain Management</li>
                  <li>BBA Logistics</li>
                </ul>
              </div>

              {/* Polytechnic Card - 1/3 Width, 1/2 Height */}
              <div className="border-border rounded-xl border bg-white/5 p-6 md:col-span-1 md:row-span-1">
                <h3 className="text-gold mb-4 text-xl font-bold">
                  Polytechnic
                </h3>
                <ul className="text-muted-foreground space-y-1.5 text-[14px]">
                  <li>Diploma in Computer Technology</li>
                  <li>Diploma in Agricultural Engineering</li>
                  <li>Diploma in Petrochemical Engineering</li>
                  <li>Diploma in Mechanical Engineering</li>
                  <li>Diploma in Electrical and Electronics Engineering</li>
                  <li>Diploma in Civil Engineering</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Eligibility Criteria */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Eligibility Criteria
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse border border-white/10 text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="border border-white/10 p-3 font-bold">
                      Program
                    </th>
                    <th className="border border-white/10 p-3 font-bold">
                      Eligibility
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="border border-white/10 p-3">
                      B.E. / B.Tech
                    </td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 with Physics, Chemistry, and Mathematics
                      (Minimum 50% aggregate)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">
                      Arts &amp; Science (UG)
                    </td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 or equivalent from a recognized board
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">
                      Polytechnic Diploma
                    </td>
                    <td className="border border-white/10 p-3">
                      Pass in 10th Standard or equivalent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. How to Apply */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              How to Apply
            </h2>
            <p className="text-muted-foreground mt-4">
              Candidates can apply for their desired programs through both
              online and offline modes. You can either register through our
              online portal or visit our college campus directly to collect and
              submit the application form in person.
            </p>
            <div className="mt-8 flex flex-col gap-6 md:flex-row">
              {[
                {
                  step: 1,
                  title: "Registration (Online or Offline)",
                  desc: "Register via the online portal or visit the campus admission office.",
                },
                {
                  step: 2,
                  title: "Document Submission",
                  desc: "Upload scanned copies online or submit physical copies at the office.",
                },
                {
                  step: 3,
                  title: "Application Review",
                  desc: "Our admissions team will review your application and documents.",
                },
                {
                  step: 4,
                  title: "Admission Offer",
                  desc: "Receive your admission offer and complete the fee payment process.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-surface border-border relative flex-1 rounded-xl border p-6"
                >
                  <div className="bg-gold text-navy border-surface absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full border-4 text-lg font-bold">
                    {s.step}
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Required Documents */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Required Documents
            </h2>
            <ul className="text-muted-foreground mt-4 grid list-inside list-disc gap-2 sm:grid-cols-2">
              <li>10th Mark Sheet</li>
              <li>12th Mark Sheet (for UG)</li>
              <li>Transfer Certificate (TC)</li>
              <li>Community Certificate</li>
              <li>Aadhar Card Copy</li>
              <li>Passport Size Photographs</li>
            </ul>
          </section>

          {/* 6. Scholarships & 7. Fee Support */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Scholarships
              </h2>
              <p className="text-muted-foreground mb-4">
                We offer merit-based scholarships to outstanding students and
                special scholarships for sports achievers. Government
                scholarships for eligible categories are also facilitated.
              </p>
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                <li>Merit Scholarship (Based on 12th marks)</li>
                <li>Sports Quota Scholarship</li>
                <li>First Graduate Scholarship</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Fee Support &amp; Loans
              </h2>
              <p className="text-muted-foreground mb-4">
                JCT provides assistance in securing educational loans from
                nationalized and private banks. We offer flexible payment
                options to ease the financial burden on parents.
              </p>
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                <li>Bank Loan Assistance Letters</li>
                <li>Installment Payment Options</li>
              </ul>
            </div>
          </section>

          {/* 8. FAQ */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: "Is hostel accommodation available?",
                  a: "Yes, we have separate hostels for boys and girls with modern amenities.",
                },
                {
                  q: "Do you provide transport facilities?",
                  a: "Yes, our buses ply across major routes in Coimbatore and neighboring districts.",
                },
                {
                  q: "What is the counseling code for Engineering?",
                  a: "Our TNEA counseling code is 2734.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-lg border border-white/10 p-4"
                >
                  <h3 className="text-foreground text-lg font-bold">{faq.q}</h3>
                  <p className="text-muted-foreground mt-2">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Apply CTA */}
          <section className="bg-gold text-navy rounded-3xl p-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold">
              Ready to Shape Your Future?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl opacity-90">
              Admissions are now open for the upcoming academic year. Apply
              online or visit our campus today to join the JCT family.
            </p>
            <Link
              href="/apply-now"
              className="inline-block rounded-full bg-[#0a1628] px-8 py-4 font-bold text-white transition-colors hover:bg-[#112240]"
            >
              Apply Now
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
