import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const ugPrograms = [
  {
    name: "Artificial Intelligence and Data Science",
    slug: "ai-ds",
    duration: "4 Years",
  },
  {
    name: "Computer Science & Business Systems",
    slug: "csbs",
    duration: "4 Years",
  },
  {
    name: "Biotechnology and Biochemical Engineering",
    slug: "btbce",
    duration: "4 Years",
  },
  { name: "Food Technology", slug: "ft", duration: "4 Years" },
  { name: "Petroleum Engineering", slug: "pe", duration: "4 Years" },
  { name: "Computer Science & Engineering", slug: "cse", duration: "4 Years" },
  {
    name: "Electronics and Communication Engineering",
    slug: "ece",
    duration: "4 Years",
  },
  {
    name: "Electrical and Electronics Engineering",
    slug: "eee",
    duration: "4 Years",
  },
  { name: "Mechanical Engineering", slug: "mech", duration: "4 Years" },
  { name: "Civil Engineering", slug: "civil", duration: "4 Years" },
  { name: "Petrochemical Technology", slug: "pct", duration: "4 Years" },
];

const pgPrograms = [
  { name: "Structural Engineering", slug: "structural", duration: "2 Years" },
  {
    name: "Power Electronics and Drives",
    slug: "power-electronics",
    duration: "2 Years",
  },
  {
    name: "CSE (Artificial Intelligence & Machine Learning)",
    slug: "cse-aiml",
    duration: "2 Years",
  },
];

export default function EngineeringProgramsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Engineering Programs"
        subtitle="Explore Our Undergraduate and Postgraduate Courses"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Programs" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. UG Programs & 3. Departments */}
          <section>
            <h2 className="text-foreground mb-2 font-serif text-3xl font-bold">
              Undergraduate (UG) Programs
            </h2>
            <p className="text-muted-foreground mb-8">
              B.E. / B.Tech degrees offered across various cutting-edge
              departments.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ugPrograms.map((prog) => (
                <Link
                  key={prog.slug}
                  href={`/institutions/engineering/${prog.slug}`}
                  className="hover:border-gold/50 group block rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors"
                >
                  <div className="bg-surface text-gold mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    🎓
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{prog.name}</h3>
                  <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
                    <span>Duration: {prog.duration}</span>
                    <span className="text-gold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. PG Programs */}
          <section>
            <h2 className="text-foreground mb-2 font-serif text-3xl font-bold">
              Postgraduate (PG) & Doctoral Programs
            </h2>
            <p className="text-muted-foreground mb-8">
              M.E. and Ph.D. degrees for advanced specialization and research.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pgPrograms.map((prog) => (
                <Link
                  key={prog.slug}
                  href={`/institutions/engineering/${prog.slug}`}
                  className="hover:border-gold/50 group block rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors"
                >
                  <div className="bg-surface text-gold mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    🔬
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{prog.name}</h3>
                  <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
                    <span>Duration: {prog.duration}</span>
                    <span className="text-gold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
              <div className="from-gold/10 border-gold/30 flex flex-col justify-center rounded-2xl border bg-gradient-to-br to-transparent p-6">
                <h3 className="text-gold mb-2 text-lg font-bold">
                  Ph.D. Programmes
                </h3>
                <p className="text-muted-foreground text-sm">
                  Offered in Electrical and Electronics Engineering.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Intake Details */}
          <section className="bg-surface border-border rounded-3xl border p-8">
            <h2 className="text-foreground mb-6 font-serif text-2xl font-bold">
              Intake Details & Approval
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="text-muted-foreground border-b border-white/10">
                    <th className="pb-3 font-medium">Program Type</th>
                    <th className="pb-3 font-medium">Total Courses</th>
                    <th className="pb-3 font-medium">Approval</th>
                    <th className="pb-3 font-medium">Affiliation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 font-bold">B.E. / B.Tech (UG)</td>
                    <td className="py-4">11 Courses</td>
                    <td className="py-4 text-green-400">AICTE Approved</td>
                    <td className="py-4">Anna University</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 font-bold">M.E. (PG)</td>
                    <td className="py-4">3 Courses</td>
                    <td className="py-4 text-green-400">AICTE Approved</td>
                    <td className="py-4">Anna University</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">Ph.D.</td>
                    <td className="py-4">1 Course</td>
                    <td className="py-4 text-green-400">AICTE Approved</td>
                    <td className="py-4">Anna University</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Career Scope */}
          <section className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Career Scope & Opportunities
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Engineering graduates from JCT are highly sought after by top
                  multinational companies, core engineering firms, and emerging
                  startups.
                </p>
                <p>
                  Our curriculum is designed not just for academic excellence
                  but for employability. We integrate modern skills like AI,
                  IoT, and Data Analytics across all branches to ensure our
                  students are ready for Industry 4.0.
                </p>
                <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
                  <li>Global placement opportunities</li>
                  <li>Entrepreneurship and Incubation support</li>
                  <li>Pathways to higher education abroad</li>
                  <li>Research and Development roles</li>
                </ul>
              </div>
            </div>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="bg-gold/5 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
              <div>
                <div className="text-gold mb-2 text-5xl font-bold">100%</div>
                <div className="mb-4 text-xl font-medium">
                  Placement Assistance
                </div>
                <p className="text-muted-foreground text-sm">
                  Dedicated Training and Placement Cell working round the clock.
                </p>
              </div>
            </div>
          </section>

          {/* 6. CTA */}
          <section className="from-gold/20 border-gold/30 rounded-3xl border bg-gradient-to-r to-[#0a1628] p-10 text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              Ready to start your Engineering Journey?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
              Admissions for the current academic year are open. Check your
              eligibility and apply online today to secure your seat.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/admissions"
                className="rounded-full border border-white/20 px-6 py-3 font-medium transition-colors hover:bg-white/10"
              >
                View Admission Process
              </Link>
              <Link
                href="/apply-now"
                className="bg-gold text-navy rounded-full px-8 py-3 font-bold transition-colors hover:bg-[#e8b84a]"
              >
                Apply Now
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
