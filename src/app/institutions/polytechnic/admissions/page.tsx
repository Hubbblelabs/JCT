import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PolytechnicAdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Polytechnic Admissions" subtitle="Kickstart Your Technical Career Early" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Polytechnic", href: "/institutions/polytechnic" },
          { label: "Admissions" }
        ]} />

        <div className="mt-12 space-y-20">

          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            <div className="space-y-16">
              {/* 1. How to Join */}
              <section>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">How to Join JCT Polytechnic?</h2>
                <div className="space-y-8">
                  <div className="relative pl-8 border-l-2 border-gold/30">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-gold"></div>
                    <h3 className="font-bold text-xl mb-2 text-white">First Year Diploma (Regular)</h3>
                    <p className="text-muted-foreground mb-2">For candidates who have completed their 10th standard (SSLC/Matriculation/CBSE).</p>
                    <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                      <li>Minimum pass mark required in 10th Std.</li>
                      <li>Duration of the course is 3 Years (6 Semesters).</li>
                    </ul>
                  </div>

                  <div className="relative pl-8 border-l-2 border-gold/30">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-gold"></div>
                    <h3 className="font-bold text-xl mb-2 text-white">Direct Second Year (Lateral Entry)</h3>
                    <p className="text-muted-foreground mb-2">For candidates who have completed their 12th standard (HSC) or 2-year ITI course.</p>
                    <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                      <li>Pass in 12th Std (Academic / Vocational) or ITI (NTC).</li>
                      <li>Duration of the course is 2 Years (4 Semesters).</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. Fees & 3. Scholarships */}
              <section className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                    <span className="text-2xl">💰</span> Fees Structure
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">JCT Polytechnic offers a highly affordable and transparent fee structure to ensure technical education is accessible to all strata of society.</p>
                  <p className="text-sm text-muted-foreground">Instalment payment options and bank loan assistance are provided.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full"></div>
                  <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                    <span className="text-2xl">🎓</span> Scholarships
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">We are committed to supporting meritorious and economically disadvantaged students.</p>
                  <ul className="text-sm text-white/80 list-disc list-inside space-y-1">
                    <li>Government SC/ST/BC/MBC Scholarships</li>
                    <li>First Graduate Scholarship</li>
                    <li>Moovalur Ramamirtham Ammaiyar Scheme (Pudhumai Penn)</li>
                    <li>JCT Management Trust Scholarships</li>
                  </ul>
                </div>
              </section>

              {/* Necessary Documents */}
              <section>
                 <h3 className="font-bold text-xl mb-4">Documents Required for Admission</h3>
                 <div className="bg-surface border border-white/5 p-6 rounded-xl flex flex-wrap gap-3">
                   {["10th / 12th Marksheet", "Transfer Certificate (TC)", "Community Certificate", "Aadhar Card Copy", "Passport Size Photos", "Income Certificate (for scholarships)"].map((doc, i) => (
                     <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm">{doc}</span>
                   ))}
                 </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* 4. Apply CTA Sidebar */}
              <div className="bg-gradient-to-br from-[#0a1628] to-[#112240] border border-gold/30 rounded-3xl p-8 text-center sticky top-32 shadow-xl shadow-gold/5">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-gold">📝</span>
                </div>
                <h3 className="text-white font-bold text-2xl mb-4">Admissions Open 2025-2026</h3>
                <p className="text-sm text-white/70 mb-8">Take the first step towards a successful engineering career. Limited seats available for core branches.</p>

                <Link href="/apply-now" className="block w-full bg-gold text-navy font-bold py-4 rounded-xl hover:bg-[#e8b84a] transition-colors shadow-lg shadow-black/20">
                  Apply Online Now
                </Link>

                <div className="mt-6 pt-6 border-t border-white/10 text-sm text-white/80">
                  Need Help? Call our Admission Desk:<br/>
                  <a href="tel:+919361422201" className="text-gold font-bold text-lg hover:underline mt-2 inline-block">+91 93614 22201</a>
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
