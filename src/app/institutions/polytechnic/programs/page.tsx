import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PolytechnicProgramsPage() {
  const courses = [
    { name: "Computer Technology", slug: "computer", icon: "💻", desc: "Foundation in software, hardware, and networking technologies to build an IT career." },
    { name: "Agricultural Engineering", slug: "agricultural", icon: "🚜", desc: "Emphasis on agro-industries and technical solutions for rural farming and agriculture." },
    { name: "Petrochemical Engineering", slug: "petrochemical", icon: "🧪", desc: "Imparting knowledge in oil and gas processing, refining, and chemical production." },
    { name: "Mechanical Engineering", slug: "mechanical", icon: "⚙️", desc: "Creating outstanding engineers with advanced knowledge in machinery and manufacturing." },
    { name: "Electrical and Electronics Engineering", slug: "eee", icon: "⚡", desc: "Developing quality engineers with high technical knowledge in electrical systems." },
    { name: "Civil Engineering", slug: "civil", icon: "🏗️", desc: "Building the foundations of infrastructure, construction, and structural design." }
  ];

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Polytechnic Diploma Programs" subtitle="Build Practical Skills for Industry Success" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Polytechnic", href: "/institutions/polytechnic" },
          { label: "Programs" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. Diploma Courses & 3. Course Cards */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4 text-center">Our Diploma Courses</h2>
            <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto">We offer AICTE approved and DOTE affiliated 3-year diploma programs tailored to meet the dynamic demands of core engineering industries.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.slug} href={`/institutions/polytechnic/${course.slug}`} className="group bg-surface border border-white/10 rounded-3xl p-6 hover:border-gold/50 transition-all hover:-translate-y-1 block relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:bg-gold/10 transition-colors"></div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">
                    {course.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white/90 group-hover:text-gold transition-colors relative z-10 pr-4">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 relative z-10">{course.desc}</p>
                  <div className="flex items-center text-gold text-sm font-medium relative z-10">
                    View Details <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. After 10th Join Polytechnic */}
          <section className="bg-gradient-to-br from-[#0a1628] to-[#112240] border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Why Join Polytechnic After 10th?</h2>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>Choosing a diploma course right after your 10th standard is a smart decision for students who have a clear career goal in technical fields.</p>
                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span><strong>Early Specialization:</strong> Start learning core engineering subjects 2 years ahead of your peers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span><strong>Practical Focus:</strong> Diploma courses heavily emphasize hands-on lab work over purely theoretical academics.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span><strong>Faster Employment:</strong> You become job-ready in just 3 years and can start earning earlier.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span><strong>Lateral Entry to B.E/B.Tech:</strong> You can directly join the 2nd year of an Engineering degree later if you choose to pursue higher studies.</span>
                    </li>
                  </ul>
                </div>
                <Link href="/institutions/polytechnic/admissions" className="inline-block mt-8 bg-gold text-navy font-bold px-8 py-3 rounded-full hover:bg-[#e8b84a] transition-colors">
                  Learn About Admissions
                </Link>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                 <div className="text-6xl mb-6">🎯</div>
                 <h3 className="font-bold text-xl mb-2 text-white">Your Pathway to Engineering</h3>
                 <p className="text-sm text-muted-foreground mb-6">10th Std → 3 Year Diploma → Job OR Direct 2nd Year B.E/B.Tech</p>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-1/2 h-full bg-gold"></div>
                 </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
