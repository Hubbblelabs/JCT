import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringCOEPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Research & Centre of Excellence"
        subtitle="Fostering Innovation and Academic Research"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Centre of Excellence" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. Centre of Excellence & 2. Research Cell */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Centre of Excellence
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                JCT College of Engineering and Technology has established
                advanced Centres of Excellence to bridge the gap between
                academic curriculum and industry demands. These centres focus on
                specialized training, research, and product development in
                cutting-edge technologies.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-2">
                <li>CoE in Artificial Intelligence & Machine Learning</li>
                <li>CoE for CNC Machines (CAM Laboratory)</li>
                <li>Advanced Welding Technology Centre</li>
                <li>Cloud Computing & Azure DevOps Lab</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Research & Development Cell
              </h2>
              <p className="text-muted-foreground mb-6">
                The R&D Cell encourages faculty and students to undertake
                research projects, publish in high-impact journals, and file
                patents. We provide a conducive environment and funding support
                for innovative ideas.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-xl border border-white/5 p-4 text-center">
                  <div className="text-gold text-2xl font-bold">50+</div>
                  <div className="text-muted-foreground text-xs">
                    Funded Projects
                  </div>
                </div>
                <div className="bg-surface rounded-xl border border-white/5 p-4 text-center">
                  <div className="text-gold text-2xl font-bold">200+</div>
                  <div className="text-muted-foreground text-xs">
                    Publications
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Innovation Labs & 4. Industry Tie-ups */}
          <section>
            <h2 className="text-foreground mb-8 text-center font-serif text-3xl font-bold">
              Innovation & Industry Collaboration
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  💡
                </div>
                <h3 className="mb-3 text-xl font-bold">
                  Institution&apos;s Innovation Council (IIC)
                </h3>
                <p className="text-muted-foreground text-sm">
                  Recognized by the Ministry of Education, our IIC actively
                  promotes an innovation and startup ecosystem among students
                  through hackathons and mentorship.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  🤝
                </div>
                <h3 className="mb-3 text-xl font-bold">MoUs & Tie-ups</h3>
                <p className="text-muted-foreground text-sm">
                  We have active Memorandum of Understandings (MoUs) with
                  leading companies like Gateway Software Solutions, Airtas
                  Environics, and various international universities to
                  facilitate technology transfer and research.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  🚀
                </div>
                <h3 className="mb-3 text-xl font-bold">Incubation Centre</h3>
                <p className="text-muted-foreground text-sm">
                  Supporting student entrepreneurs by providing seed funding,
                  workspace, and legal/ethical guidance to turn prototypes into
                  successful startups.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Patents & 6. Publications */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  📜
                </span>
                Patents Filed
              </h2>
              <div className="space-y-4">
                {[
                  "Smart IoT Framework for Home and Industrial Security with Real-Time Monitoring",
                  "Innovative Design Approaches in Modern Machinery",
                  "Wireless Charging Technology Integration in Electric Vehicles",
                  "Value Addition & Innovation in Food Product Preservation",
                ].map((patent, i) => (
                  <div
                    key={i}
                    className="bg-surface rounded-xl border border-white/10 p-4"
                  >
                    <p className="text-foreground text-sm font-medium">
                      {patent}
                    </p>
                    <div className="text-gold mt-2 text-xs">
                      Status: Published
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  📚
                </span>
                Recent Publications
              </h2>
              <div className="space-y-4">
                {[
                  "Recent Advances in Recycling Techniques for Concrete Pavements - IEEE Access",
                  "Artificial Intelligence and Machine Learning in Power Systems - Springer",
                  "Performance Analysis of Tandem Photoelectrochemical Cell for Solar Water Splitting",
                  "Understanding Well Testing Implications in Petroleum Reservoirs - Elsevier",
                ].map((pub, i) => (
                  <div
                    key={i}
                    className="bg-surface rounded-xl border border-white/10 p-4"
                  >
                    <p className="text-foreground text-sm font-medium">{pub}</p>
                    <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                      <span>International Journal</span>
                      <span>2024</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
