import Link from "next/link";
import { Banknote, GraduationCap, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PolytechnicAdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Polytechnic Admissions"
        subtitle="Kickstart Your Technical Career Early"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
            { label: "Admissions" },
          ]}
        />

        <div className="mt-12 space-y-20">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-16">
              {/* 1. How to Join */}
              <section>
                <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                  How to Join JCT Polytechnic?
                </h2>
                <div className="space-y-8">
                  <div className="border-gold/30 relative border-l-2 pl-8">
                    <div className="bg-gold absolute top-0 left-[-9px] h-4 w-4 rounded-full"></div>
                    <h3 className="text-foreground mb-2 text-xl font-bold">
                      First Year Diploma (Regular)
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For candidates who have completed their 10th standard
                      (SSLC/Matriculation/CBSE).
                    </p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                      <li>Minimum pass mark required in 10th Std.</li>
                      <li>Duration of the course is 3 Years (6 Semesters).</li>
                    </ul>
                  </div>

                  <div className="border-gold/30 relative border-l-2 pl-8">
                    <div className="bg-gold absolute top-0 left-[-9px] h-4 w-4 rounded-full"></div>
                    <h3 className="text-foreground mb-2 text-xl font-bold">
                      Direct Second Year (Lateral Entry)
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      For candidates who have completed their 12th standard
                      (HSC) or 2-year ITI course.
                    </p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                      <li>
                        Pass in 12th Std (Academic / Vocational) or ITI (NTC).
                      </li>
                      <li>Duration of the course is 2 Years (4 Semesters).</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. Fees & 3. Scholarships */}
              <section className="grid gap-6 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-white/5"></div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
                    <Banknote className="text-gold h-6 w-6" /> Fees Structure
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    JCT Polytechnic offers a highly affordable and transparent
                    fee structure to ensure technical education is accessible to
                    all strata of society.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Instalment payment options and bank loan assistance are
                    provided.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="bg-gold/10 absolute top-0 right-0 h-24 w-24 rounded-bl-full"></div>
                  <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
                    <GraduationCap className="text-gold h-6 w-6" /> Scholarships
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    We are committed to supporting meritorious and economically
                    disadvantaged students.
                  </p>
                  <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                    <li>Government SC/ST/BC/MBC Scholarships</li>
                    <li>First Graduate Scholarship</li>
                    <li>
                      Moovalur Ramamirtham Ammaiyar Scheme (Pudhumai Penn)
                    </li>
                    <li>JCT Management Trust Scholarships</li>
                  </ul>
                </div>
              </section>

              {/* Necessary Documents */}
              <section>
                <h3 className="mb-4 text-xl font-bold">
                  Documents Required for Admission
                </h3>
                <div className="bg-surface flex flex-wrap gap-3 rounded-xl border border-white/5 p-6">
                  {[
                    "10th / 12th Marksheet",
                    "Transfer Certificate (TC)",
                    "Community Certificate",
                    "Aadhar Card Copy",
                    "Passport Size Photos",
                    "Income Certificate (for scholarships)",
                  ].map((doc, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* 4. Apply CTA Sidebar */}
              <div className="border-gold/30 shadow-gold/5 sticky top-32 rounded-3xl border bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 text-center shadow-xl">
                <div className="bg-gold/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <ClipboardCheck className="text-gold h-10 w-10" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Admissions Open 2025-2026
                </h3>
                <p className="mb-8 text-sm text-white/70">
                  Take the first step towards a successful engineering career.
                  Limited seats available for core branches.
                </p>

                <Link
                  href="/apply-now"
                  className="bg-gold text-navy block w-full rounded-xl py-4 font-bold shadow-lg shadow-black/20 transition-colors hover:bg-[#e8b84a]"
                >
                  Apply Online Now
                </Link>

                <div className="mt-6 border-t border-white/10 pt-6 text-sm text-white/80">
                  Need Help? Call our Admission Desk:
                  <br />
                  <a
                    href="tel:+919361422201"
                    className="text-gold mt-2 inline-block text-lg font-bold hover:underline"
                  >
                    +91 93614 22201
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
