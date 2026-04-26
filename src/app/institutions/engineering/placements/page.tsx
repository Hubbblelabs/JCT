import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringPlacementsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Engineering Placements"
        subtitle="Empowering Careers, Securing Futures"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Placements" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. Placement Overview & 5. Placement Stats */}
          <section className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Placement Overview
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Department of Training and Placement at JCT College of
                Engineering and Technology is dedicated to ensuring a seamless
                transition for students from academia to the corporate world. We
                boast a robust industry-institute interaction and facilitate
                numerous placement drives annually.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our comprehensive training programs ensure that students are
                equipped with the latest technical skills, aptitude, and soft
                skills required to crack interviews at top-tier multinational
                companies and core engineering firms.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "100%", label: "Placement Assistance" },
                { stat: "10K+", label: "Students Graduated" },
                { stat: "1000+", label: "Campus Placements" },
                { stat: "50+", label: "Top Recruiters" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <div className="text-gold mb-2 text-3xl font-bold">
                    {item.stat}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Recruiters */}
          <section>
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold">
              Our Valuable Recruiters
            </h2>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center lg:p-12">
              <p className="text-muted-foreground mb-10">
                We are proud to host esteemed companies for our campus
                recruitment drives.
              </p>
              <div className="flex flex-wrap justify-center gap-6 opacity-80 lg:gap-10">
                {[
                  "ZOHO",
                  "TCS",
                  "L&T",
                  "TVS",
                  "American Megatrends",
                  "SPIC",
                  "Byjus",
                  "Parle",
                  "Cryoviva",
                  "Asahi India Glass",
                  "Brakes India",
                  "Infosys",
                ].map((company, i) => (
                  <div
                    key={i}
                    className="text-foreground bg-surface rounded-xl border border-white/10 px-6 py-3 font-bold"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Internship Cell & 4. Placement Training */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <div className="bg-gold/20 text-gold mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl">
                🚀
              </div>
              <h3 className="text-foreground mb-4 text-2xl font-bold">
                Internship Cell
              </h3>
              <p className="text-muted-foreground mb-4">
                Our dedicated internship cell bridges the gap between
                theoretical knowledge and practical application. We facilitate
                summer and winter internships across various industries, giving
                students hands-on experience before they graduate.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
                <li>In-plant training support</li>
                <li>Industry exposure visits</li>
                <li>Project-based internships</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
              <div className="bg-gold/20 text-gold mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl">
                🎯
              </div>
              <h3 className="text-foreground mb-4 text-2xl font-bold">
                Placement Training
              </h3>
              <p className="text-muted-foreground mb-4">
                Training is an ongoing process at JCT, starting from the first
                year. We bring in industry experts and specialized training
                agencies to prepare our students.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
                <li>Communication & Soft Skills</li>
                <li>Quantitative Aptitude & Logical Reasoning</li>
                <li>Technical Bootcamps & Coding practice</li>
                <li>Mock Interviews & Group Discussions</li>
              </ul>
            </div>
          </section>

          {/* 6. Success Stories */}
          <section>
            <h2 className="text-foreground mb-10 font-serif text-3xl font-bold">
              Student Success Stories
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Arun Kumar",
                  course: "Computer Science",
                  company: "ZOHO",
                  quote:
                    "The rigorous training and mock interviews conducted by the placement cell were crucial in helping me secure a position at ZOHO.",
                },
                {
                  name: "Priya R",
                  course: "Petrochemical",
                  company: "SPIC",
                  quote:
                    "JCT's strong industry connections and dedicated faculty guidance made my dream of working in a core petrochemical company a reality.",
                },
                {
                  name: "Mohammed Tariq",
                  course: "Mechanical",
                  company: "L&T",
                  quote:
                    "The practical exposure through internships and the continuous support from the TPO enabled me to crack the L&T recruitment drive.",
                },
              ].map((story, i) => (
                <div
                  key={i}
                  className="bg-surface border-border relative rounded-3xl border p-8"
                >
                  <div className="text-gold/20 absolute top-4 left-6 font-serif text-5xl">
                    &quot;
                  </div>
                  <p className="text-muted-foreground relative z-10 mb-6 italic">
                    &quot;{story.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-gold flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-bold">
                      {story.name[0]}
                    </div>
                    <div>
                      <div className="text-foreground font-bold">
                        {story.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {story.course} • Placed at{" "}
                        <span className="text-gold font-medium">
                          {story.company}
                        </span>
                      </div>
                    </div>
                  </div>
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
