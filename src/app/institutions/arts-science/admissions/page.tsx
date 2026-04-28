import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { ArtsScienceNavbar } from "@/modules/arts-science/ArtsScienceNavbar";

export const metadata: Metadata = {
  title: "Admissions | JCT College of Arts & Science, Coimbatore",
  description:
    "Admissions open at JCT College of Arts & Science. Explore UG programs, eligibility criteria, scholarships, and apply online.",
  openGraph: {
    title: "Admissions | JCT College of Arts & Science, Coimbatore",
    description:
      "Admissions open at JCT College of Arts & Science. Explore UG programs, eligibility criteria, scholarships, and apply online.",
    type: "website",
  },
};

export default function ArtsScienceAdmissionsPage() {
  return (
    <main className="bg-background text-foreground arts-science-theme min-h-screen">
      <ArtsScienceNavbar forceSolidOnTop />
      <PageHero
        title="Admissions"
        subtitle="Begin Your Journey at JCT Arts & Science"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            {
              label: "Arts & Science",
              href: "/institutions/arts-science",
            },
            { label: "Admissions" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Admission Overview
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
              JCT College of Arts &amp; Science offers a vibrant range of
              undergraduate programs in Computer Science, Commerce, Business
              Administration, and Humanities. Our admission process is
              transparent and merit-based, welcoming students from all academic
              backgrounds.
            </p>
          </section>

          {/* Programs */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Programs Offered
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "B.Sc. Computer Science",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
                {
                  name: "B.Sc. AI & Machine Learning",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
                {
                  name: "BCA",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
                {
                  name: "B.Com (Computer Applications)",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
                {
                  name: "B.B.A",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
                {
                  name: "B.A. English Literature",
                  duration: "3 Years",
                  intake: "60 Seats",
                },
              ].map((prog, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-white/10 p-6"
                >
                  <h3 className="text-foreground mb-3 font-bold">
                    {prog.name}
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      ⏱ {prog.duration}
                    </span>
                    <span className="text-muted-foreground">
                      👥 {prog.intake}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility */}
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
                      B.Sc. Computer Science / AI & ML
                    </td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 with Mathematics / Computer Science as one of
                      the subjects
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">BCA</td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 from any stream from a recognized board
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">
                      B.Com / B.B.A
                    </td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 with Commerce or any stream from a recognized
                      board
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">B.A. English</td>
                    <td className="border border-white/10 p-3">
                      Pass in 10+2 from any stream from a recognized board
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Application Process */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              How to Apply
            </h2>
            <div className="mt-6 flex flex-col gap-6 md:flex-row">
              {[
                {
                  step: 1,
                  title: "Submit Application",
                  desc: "Fill out the online application form with your personal and academic details.",
                },
                {
                  step: 2,
                  title: "Upload Documents",
                  desc: "Upload scanned copies of mark sheets, community certificate, and transfer certificate.",
                },
                {
                  step: 3,
                  title: "Counseling",
                  desc: "Attend the counseling session (online or in-person) for seat allotment.",
                },
                {
                  step: 4,
                  title: "Join & Succeed",
                  desc: "Complete fee payment and join the JCT Arts & Science family!",
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

          {/* Scholarships */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Scholarships
              </h2>
              <p className="text-muted-foreground mb-4">
                Various merit and government scholarships are available to help
                students pursue their education without financial burden.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Merit Scholarship for top rankers</li>
                <li>BC/MBC/SC/ST Government Scholarships</li>
                <li>First Graduate Scholarship</li>
                <li>Sports Achiever Scholarship</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Fee Structure
              </h2>
              <p className="text-muted-foreground mb-4">
                Our fee structure is affordable and aligned with government
                norms. Flexible payment options are available.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Transparent government-regulated fees</li>
                <li>Installment payment options</li>
                <li>Education loan assistance</li>
              </ul>
            </div>
          </section>

          {/* Apply CTA */}
          <section className="bg-gold text-navy rounded-3xl p-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold">
              Ready to Join JCT Arts &amp; Science?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl opacity-90">
              Admissions are open for the upcoming academic year. Apply today
              and begin your journey to excellence.
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
