import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Admissions" subtitle="Your Journey to Excellence Starts Here" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Admissions" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Admission Overview */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Admission Overview</h2>
            <div className="mt-4 text-muted-foreground leading-relaxed">
              <p>Welcome to the Admissions Portal of JCT Institutions. We offer a diverse range of programs across Engineering, Arts & Science, and Polytechnic disciplines.</p>
              <p className="mt-2">Our admission process is designed to be transparent, merit-based, and accessible to students from all backgrounds. Explore our programs and take the first step towards a successful career.</p>
            </div>
          </section>

          {/* 2. Courses by Institution */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Courses by Institution</h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div className="border border-border p-6 rounded-xl bg-white/5">
                <h3 className="font-bold text-xl text-gold mb-4">Engineering College</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>B.E. Computer Science</li>
                  <li>B.E. Mechanical Engineering</li>
                  <li>B.Tech Artificial Intelligence</li>
                  <li>B.E. Electronics & Communication</li>
                </ul>
              </div>
              <div className="border border-border p-6 rounded-xl bg-white/5">
                <h3 className="font-bold text-xl text-gold mb-4">Arts & Science</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>B.Sc. Computer Science</li>
                  <li>B.Com (Computer Applications)</li>
                  <li>B.B.A</li>
                  <li>B.A. English Literature</li>
                </ul>
              </div>
              <div className="border border-border p-6 rounded-xl bg-white/5">
                <h3 className="font-bold text-xl text-gold mb-4">Polytechnic</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Diploma in Mechanical</li>
                  <li>Diploma in Civil</li>
                  <li>Diploma in Automobile</li>
                  <li>Diploma in EEE</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Eligibility Criteria */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Eligibility Criteria</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-white/10">
                <thead>
                  <tr className="bg-white/5">
                    <th className="border border-white/10 p-3 font-bold">Program</th>
                    <th className="border border-white/10 p-3 font-bold">Eligibility</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="border border-white/10 p-3">B.E. / B.Tech</td>
                    <td className="border border-white/10 p-3">Pass in 10+2 with Physics, Chemistry, and Mathematics (Minimum 50% aggregate)</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Arts & Science (UG)</td>
                    <td className="border border-white/10 p-3">Pass in 10+2 or equivalent from a recognized board</td>
                  </tr>
                  <tr>
                    <td className="border border-white/10 p-3">Polytechnic Diploma</td>
                    <td className="border border-white/10 p-3">Pass in 10th Standard or equivalent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. How to Apply */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">How to Apply</h2>
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              {[
                { step: 1, title: 'Online Registration', desc: 'Fill out the online application form with basic details.' },
                { step: 2, title: 'Document Upload', desc: 'Upload scanned copies of required academic documents.' },
                { step: 3, title: 'Application Review', desc: 'Our admissions team will review your application.' },
                { step: 4, title: 'Admission Offer', desc: 'Receive your admission offer and complete fee payment.' }
              ].map((s) => (
                <div key={s.step} className="flex-1 bg-surface border border-border p-6 rounded-xl relative">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-lg border-4 border-surface">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-lg mt-2">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Required Documents */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Required Documents</h2>
            <ul className="mt-4 list-disc list-inside text-muted-foreground grid sm:grid-cols-2 gap-2">
              <li>10th Mark Sheet</li>
              <li>12th Mark Sheet (for UG)</li>
              <li>Transfer Certificate (TC)</li>
              <li>Community Certificate</li>
              <li>Aadhar Card Copy</li>
              <li>Passport Size Photographs</li>
            </ul>
          </section>

          {/* 6. Scholarships & 7. Fee Support */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Scholarships</h2>
              <p className="text-muted-foreground mb-4">We offer merit-based scholarships to outstanding students and special scholarships for sports achievers. Government scholarships for eligible categories are also facilitated.</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Merit Scholarship (Based on 12th marks)</li>
                <li>Sports Quota Scholarship</li>
                <li>First Graduate Scholarship</li>
              </ul>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Fee Support & Loans</h2>
              <p className="text-muted-foreground mb-4">JCT provides assistance in securing educational loans from nationalized and private banks. We offer flexible payment options to ease the financial burden on parents.</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Bank Loan Assistance Letters</li>
                <li>Installment Payment Options</li>
              </ul>
            </div>
          </section>

          {/* 8. FAQ */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {[
                { q: "Is hostel accommodation available?", a: "Yes, we have separate hostels for boys and girls with modern amenities." },
                { q: "Do you provide transport facilities?", a: "Yes, our buses ply across major routes in Coimbatore and neighboring districts." },
                { q: "What is the counseling code for Engineering?", a: "Our TNEA counseling code is 2734." }
              ].map((faq, i) => (
                <div key={i} className="border border-white/10 p-4 rounded-lg bg-surface">
                  <h3 className="font-bold text-lg text-white">{faq.q}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Apply CTA */}
          <section className="bg-gold text-navy p-12 rounded-3xl text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Ready to Shape Your Future?</h2>
            <p className="mb-8 max-w-2xl mx-auto opacity-90">Admissions are now open for the upcoming academic year. Apply online today and join the JCT family.</p>
            <Link href="/apply-now" className="inline-block bg-[#0a1628] text-white px-8 py-4 rounded-full font-bold hover:bg-[#112240] transition-colors">
              Apply Now
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
