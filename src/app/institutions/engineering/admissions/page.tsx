import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringAdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Engineering Admissions" subtitle="Join JCT College of Engineering and Technology" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Engineering", href: "/institutions/engineering" },
          { label: "Admissions" }
        ]} />

        <div className="mt-12 space-y-20">

          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            <div className="space-y-16">
              {/* 1. Admission Process */}
              <section>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Admission Process</h2>
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h3 className="font-bold text-xl mb-2 text-gold">Government Quota (TNEA)</h3>
                    <p className="text-muted-foreground">Admission to B.E/B.Tech degree courses is made through single window counselling based on the rank list published by the Anna University. Students must select our counselling code during the choice filling process.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h3 className="font-bold text-xl mb-2 text-gold">Management Quota</h3>
                    <p className="text-muted-foreground">Admission is based on the marks obtained in the qualifying examination. Students can apply directly online through our application portal or visit the campus admission office.</p>
                  </div>
                </div>
              </section>

              {/* 3. Lateral Entry */}
              <section>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Lateral Entry (Direct 2nd Year)</h2>
                <p className="text-muted-foreground mb-4">Diploma holders and B.Sc graduates (with Mathematics) can apply for direct admission into the second year (3rd semester) of B.E/B.Tech programs.</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Must have passed Diploma in Engineering/Technology with at least 50% marks.</li>
                  <li>B.Sc. Degree from a recognized University with at least 50% marks and passed 10+2 with Mathematics.</li>
                </ul>
              </section>

              {/* 4. Fee Structure & 5. Scholarships */}
              <section className="grid sm:grid-cols-2 gap-6">
                <div className="bg-surface border border-border p-6 rounded-2xl">
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                    <span>💰</span> Fee Structure
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Fees are collected as per the norms prescribed by the Government of Tamil Nadu and the Anna University. We offer transparent fee structures with options for installment payments.</p>
                  <p className="text-sm text-muted-foreground">For detailed fee breakdown by course, please contact the admissions office.</p>
                </div>

                <div className="bg-surface border border-border p-6 rounded-2xl">
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                    <span>🎓</span> Scholarships
                  </h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                    <li>First Generation Graduate Scholarship</li>
                    <li>BC/MBC/SC/ST Government Scholarships</li>
                    <li>JCT Management Merit Scholarship (based on +2 marks)</li>
                    <li>Sports Quota Scholarships</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* 2. Counselling Code Sidebar */}
              <div className="bg-gradient-to-br from-[#0a1628] to-[#112240] border border-gold/30 rounded-3xl p-8 text-center sticky top-32 shadow-xl shadow-gold/5">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-gold">🏛️</span>
                </div>
                <h3 className="text-white/80 font-medium mb-2 uppercase tracking-wider text-sm">TNEA Counselling Code</h3>
                <div className="text-6xl font-bold text-gold font-serif mb-4">2734</div>
                <p className="text-sm text-white/70 mb-8">Select this code to choose JCT College of Engineering and Technology during your counselling session.</p>

                {/* 6. Apply CTA */}
                <Link href="/apply-now" className="block w-full bg-gold text-navy font-bold py-4 rounded-xl hover:bg-[#e8b84a] transition-colors shadow-lg shadow-black/20">
                  Apply Online Now
                </Link>
                <div className="mt-4 text-sm text-white/60">
                  Questions? <a href="tel:+919361488801" className="text-gold hover:underline">+91 93614 88801</a>
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
