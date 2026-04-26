import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PolytechnicProgramsPage() {
  const courses = [
    {
      name: "Computer Technology",
      slug: "computer",
      icon: "💻",
      desc: "Foundation in software, hardware, and networking technologies to build an IT career.",
    },
    {
      name: "Agricultural Engineering",
      slug: "agricultural",
      icon: "🚜",
      desc: "Emphasis on agro-industries and technical solutions for rural farming and agriculture.",
    },
    {
      name: "Petrochemical Engineering",
      slug: "petrochemical",
      icon: "🧪",
      desc: "Imparting knowledge in oil and gas processing, refining, and chemical production.",
    },
    {
      name: "Mechanical Engineering",
      slug: "mechanical",
      icon: "⚙️",
      desc: "Creating outstanding engineers with advanced knowledge in machinery and manufacturing.",
    },
    {
      name: "Electrical and Electronics Engineering",
      slug: "eee",
      icon: "⚡",
      desc: "Developing quality engineers with high technical knowledge in electrical systems.",
    },
    {
      name: "Civil Engineering",
      slug: "civil",
      icon: "🏗️",
      desc: "Building the foundations of infrastructure, construction, and structural design.",
    },
  ];

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Polytechnic Diploma Programs"
        subtitle="Build Practical Skills for Industry Success"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
            { label: "Programs" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. Diploma Courses & 3. Course Cards */}
          <section>
            <h2 className="text-foreground mb-4 text-center font-serif text-3xl font-bold">
              Our Diploma Courses
            </h2>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-center">
              We offer AICTE approved and DOTE affiliated 3-year diploma
              programs tailored to meet the dynamic demands of core engineering
              industries.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/institutions/polytechnic/${course.slug}`}
                  className="group bg-surface hover:border-gold/50 relative block overflow-hidden rounded-3xl border border-white/10 p-6 transition-all hover:-translate-y-1"
                >
                  <div className="group-hover:bg-gold/10 absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-white/5 transition-colors"></div>
                  <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    {course.icon}
                  </div>
                  <h3 className="text-foreground group-hover:text-gold relative z-10 mb-3 pr-4 text-xl font-bold transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-muted-foreground relative z-10 mb-6 text-sm">
                    {course.desc}
                  </p>
                  <div className="text-gold relative z-10 flex items-center text-sm font-medium">
                    View Details{" "}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. After 10th Join Polytechnic */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 lg:p-12">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 font-serif text-3xl font-bold text-white">
                  Why Join Polytechnic After 10th?
                </h2>
                <div className="space-y-4 leading-relaxed text-white/80">
                  <p>
                    Choosing a diploma course right after your 10th standard is
                    a smart decision for students who have a clear career goal
                    in technical fields.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span>
                        <strong>Early Specialization:</strong> Start learning
                        core engineering subjects 2 years ahead of your peers.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span>
                        <strong>Practical Focus:</strong> Diploma courses
                        heavily emphasize hands-on lab work over purely
                        theoretical academics.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span>
                        <strong>Faster Employment:</strong> You become job-ready
                        in just 3 years and can start earning earlier.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold font-bold">✓</span>
                      <span>
                        <strong>Lateral Entry to B.E/B.Tech:</strong> You can
                        directly join the 2nd year of an Engineering degree
                        later if you choose to pursue higher studies.
                      </span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/institutions/polytechnic/admissions"
                  className="bg-gold text-navy mt-8 inline-block rounded-full px-8 py-3 font-bold transition-colors hover:bg-[#e8b84a]"
                >
                  Learn About Admissions
                </Link>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <div className="mb-6 text-6xl">🎯</div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Your Pathway to Engineering
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  10th Std → 3 Year Diploma → Job OR Direct 2nd Year B.E/B.Tech
                </p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="bg-gold h-full w-1/2"></div>
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
