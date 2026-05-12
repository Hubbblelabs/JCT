import Link from "next/link";
import { Banknote, GraduationCap, School } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringAdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Engineering Admissions"
        subtitle="Join JCT College of Engineering and Technology"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Admissions" },
          ]}
        />

        <div className="mt-12 space-y-20">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-16">
              {/* 1. Admission Process */}
              <section>
                <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                  Admission Process
                </h2>
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-gold mb-2 text-xl font-bold">
                      Government Quota (TNEA)
                    </h3>
                    <p className="text-muted-foreground">
                      Admission to B.E/B.Tech degree courses is made through
                      single window counselling based on the rank list published
                      by the Anna University. Students must select our
                      counselling code during the choice filling process.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-gold mb-2 text-xl font-bold">
                      Management Quota
                    </h3>
                    <p className="text-muted-foreground">
                      Admission is based on the marks obtained in the qualifying
                      examination. Students can apply directly online through
                      our application portal or visit the campus admission
                      office.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Lateral Entry */}
              <section>
                <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
                  Lateral Entry (Direct 2nd Year)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Diploma holders and B.Sc graduates (with Mathematics) can
                  apply for direct admission into the second year (3rd semester)
                  of B.E/B.Tech programs.
                </p>
                <ul className="text-muted-foreground list-inside list-disc space-y-2">
                  <li>
                    Must have passed Diploma in Engineering/Technology with at
                    least 50% marks.
                  </li>
                  <li>
                    B.Sc. Degree from a recognized University with at least 50%
                    marks and passed 10+2 with Mathematics.
                  </li>
                </ul>
              </section>

              {/* 4. Fee Structure & 5. Scholarships */}
              <section className="grid gap-6 sm:grid-cols-2">
                <div className="bg-surface border-border rounded-2xl border p-6">
                  <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
                    <Banknote className="text-gold h-6 w-6" /> Fee Structure
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Fees are collected as per the norms prescribed by the
                    Government of Tamil Nadu and the Anna University. We offer
                    transparent fee structures with options for installment
                    payments.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    For detailed fee breakdown by course, please contact the
                    admissions office.
                  </p>
                </div>

                <div className="bg-surface border-border rounded-2xl border p-6">
                  <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
                    <GraduationCap className="text-gold h-6 w-6" /> Scholarships
                  </h3>
                  <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
                    <li>First Generation Graduate Scholarship</li>
                    <li>BC/MBC/SC/ST Government Scholarships</li>
                    <li>
                      JCT Management Merit Scholarship (based on +2 marks)
                    </li>
                    <li>Sports Quota Scholarships</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* 2. Counselling Code Sidebar */}
              <div className="border-gold/30 shadow-gold/5 sticky top-32 rounded-3xl border bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 text-center shadow-xl">
                <div className="bg-gold/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <School className="text-gold h-10 w-10" />
                </div>
                <h3 className="mb-2 text-sm font-medium tracking-wider text-white/80 uppercase">
                  TNEA Counselling Code
                </h3>
                <div className="text-gold mb-4 font-serif text-6xl font-bold">
                  2769
                </div>
                <p className="mb-8 text-sm text-white/70">
                  Select this code to choose JCT College of Engineering and
                  Technology during your counselling session.
                </p>

                {/* 6. Apply CTA */}
                <Link
                  href="/apply-now"
                  className="bg-gold text-navy block w-full rounded-xl py-4 font-bold shadow-lg shadow-black/20 transition-colors hover:bg-[#e8b84a]"
                >
                  Apply Online Now
                </Link>
                <div className="mt-4 text-sm text-white/60">
                  Questions?{" "}
                  <a
                    href="tel:+919361488801"
                    className="text-gold hover:underline"
                  >
                    +91 93614 88801
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
