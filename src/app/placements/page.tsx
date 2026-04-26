import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PlacementsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Placements"
        subtitle="Empowering Careers, Shaping Futures"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Placements" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Placement Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Placement Overview
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                The Training and Placement Cell at JCT Institutions acts as a
                bridge between students and the corporate world. We are
                dedicated to providing comprehensive training and placement
                assistance to ensure our students land their dream jobs.
              </p>
              <p className="mt-2">
                Our strong industry-academia linkage helps in organizing campus
                recruitment drives, bringing top-tier companies to our campus
                every year.
              </p>
            </div>
          </section>

          {/* 2. Placement Statistics */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Placement Statistics
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Placement Rate", value: "96%" },
                { label: "Top Recruiters", value: "250+" },
                { label: "Total Offers", value: "1500+" },
                { label: "Highest Package", value: "12 LPA" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface border-border rounded-xl border p-6 text-center shadow-sm"
                >
                  <div className="text-gold mb-2 text-4xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Top Recruiters */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Top Recruiters
            </h2>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-muted-foreground mb-8">
                We are proud to partner with some of the world&apos;s leading
                companies.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                {[
                  "TCS",
                  "Infosys",
                  "Wipro",
                  "Cognizant",
                  "HCL",
                  "Tech Mahindra",
                  "Amazon",
                  "IBM",
                ].map((company) => (
                  <div
                    key={company}
                    className="rounded-lg bg-white/10 px-6 py-3 text-lg font-bold"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Highest Packages */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Highest Packages
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {[
                {
                  package: "12 LPA",
                  company: "Leading Product MNC",
                  role: "Software Development Engineer",
                },
                {
                  package: "10 LPA",
                  company: "Global Tech Giant",
                  role: "Data Scientist",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-6"
                >
                  <div className="bg-gold/20 border-gold/30 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border">
                    <span className="text-gold text-xl font-bold">🏆</span>
                  </div>
                  <div>
                    <div className="text-foreground text-2xl font-bold">
                      {item.package}
                    </div>
                    <div className="mt-1 font-medium">{item.role}</div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {item.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Training Process */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Our Training Process
            </h2>
            <div className="relative mt-8 ml-4 space-y-8 border-l-2 border-white/10 pl-8">
              {[
                {
                  title: "Aptitude & Soft Skills",
                  desc: "Continuous training from the first year focusing on quantitative aptitude, logical reasoning, and communication skills.",
                },
                {
                  title: "Technical Training",
                  desc: "Specialized bootcamps on emerging technologies like AI, Full Stack Development, and Core Engineering subjects.",
                },
                {
                  title: "Mock Interviews",
                  desc: "Rigorous mock interview sessions conducted by industry experts to build confidence.",
                },
                {
                  title: "Company Specific Training",
                  desc: "Tailored preparation modules based on the recruitment patterns of visiting companies.",
                },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-gold border-surface absolute top-1 -left-[41px] h-5 w-5 rounded-full border-4" />
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Student Success Stories */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Student Success Stories
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface border-border rounded-xl border p-6"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xs">
                      Photo
                    </div>
                    <div>
                      <h4 className="font-bold">Student Name {i}</h4>
                      <p className="text-gold text-xs">Placed at Top MNC</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    &quot;The placement cell provided immense support and
                    guidance throughout my journey. The technical and soft skill
                    training was instrumental in securing my dream job.&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
