import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ArtsScienceProgramsPage() {
  const courses = [
    { name: "B.Sc Computer Science", slug: "bsc-computer-science", icon: "💻", desc: "Foundational technology for building a rich and fulfilling information society." },
    { name: "B.Sc Artificial Intelligence & Machine Learning", slug: "bsc-ai-ml", icon: "🤖", desc: "Prepare with skills to perform intelligent data analysis in real-world applications." },
    { name: "BCA (Bachelor of Computer Applications)", slug: "bca", icon: "🖥️", desc: "Start a career in computers and its applications with required foundational skills." },
    { name: "B.Com Logistics and Supply Chain Management", slug: "bcom-logistics", icon: "📊", desc: "Focusing on quality education in Commerce through conceptual and practical knowledge." },
    { name: "BBA Logistics", slug: "bba-logistics", icon: "🚢", desc: "Covering concepts and processes involved in logistics and shipping related domains." }
  ];

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Arts & Science Programs" subtitle="Discover Your Passion, Build Your Career" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Arts & Science", href: "/institutions/arts-science" },
          { label: "Programs" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. UG Courses & 3. Departments */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Undergraduate Courses</h2>
            <p className="text-muted-foreground mb-8">Explore our diverse range of UG programs across Computer Science, Commerce, and Management departments.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.slug} href={`/institutions/arts-science/${course.slug}`} className="group bg-surface border border-white/10 rounded-3xl p-6 hover:border-gold/50 transition-all hover:-translate-y-1 block">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {course.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white/90 group-hover:text-gold transition-colors line-clamp-2 min-h-[56px]">{course.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">{course.desc}</p>
                  <div className="flex items-center text-gold text-sm font-medium">
                    View Course Details <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. PG Courses (Placeholder as per structure request, though specific ones weren't in the scraped data) */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Postgraduate Courses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We are continuously expanding our academic offerings. Stay tuned for upcoming Postgraduate programs designed to offer advanced specialization in Commerce and Computer Sciences.</p>
          </section>

          {/* 4. Faculty Highlights & 5. Labs */}
          <section className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="text-3xl">👨‍🏫</span> Faculty Highlights
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">Our faculty comprises experienced academicians and industry professionals dedicated to student success. They employ innovative learning practices and focus on result-oriented education.</p>
                <ul className="space-y-4">
                  {['Expertise in emerging tech like AI & ML', 'Strong background in Logistics & Shipping', 'Focus on interdisciplinary research', 'Mentorship and career guidance'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 bg-surface border border-white/5 p-4 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-gold"></div>
                      <span className="text-sm font-medium text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="text-3xl">💻</span> Modern Laboratories
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">We provide state-of-the-art computer centres and specialized labs to ensure hands-on practical training aligns with theoretical knowledge.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface border border-white/5 p-6 rounded-xl text-center">
                    <div className="text-2xl mb-2">🖥️</div>
                    <div className="font-bold text-sm">Advanced Computer Labs</div>
                  </div>
                  <div className="bg-surface border border-white/5 p-6 rounded-xl text-center">
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="font-bold text-sm">AI & ML Research Lab</div>
                  </div>
                  <div className="bg-surface border border-white/5 p-6 rounded-xl text-center">
                    <div className="text-2xl mb-2">🌐</div>
                    <div className="font-bold text-sm">Networking Lab</div>
                  </div>
                  <div className="bg-surface border border-white/5 p-6 rounded-xl text-center">
                    <div className="text-2xl mb-2">🗣️</div>
                    <div className="font-bold text-sm">Communication Lab</div>
                  </div>
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
