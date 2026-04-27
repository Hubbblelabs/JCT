import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Research & Innovation | ${siteConfig.name}`,
  description:
    "Explore research activities at JCT Institutions — Centre of Excellence, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
  openGraph: {
    title: `Research & Innovation | ${siteConfig.name}`,
    description:
      "Explore research activities at JCT Institutions — Centre of Excellence, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
    type: "website",
  },
};

export default function ResearchPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Research & Innovation"
        subtitle="Advancing Knowledge Through Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Research & Innovation" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Overview */}
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              Research at JCT
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              JCT Institutions fosters a vibrant research ecosystem with
              dedicated centres, funded projects, and a strong publication
              record. Our Centre of Excellence and R&D Cell are driving
              innovation and bridging the gap between academic knowledge and
              real-world application.
            </p>
          </section>

          {/* 2. Stats */}
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { stat: "50+", label: "Funded Projects" },
              { stat: "200+", label: "Publications" },
              { stat: "15+", label: "Patents Filed" },
              { stat: "4", label: "Centres of Excellence" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="text-gold mb-2 text-3xl font-bold">
                  {item.stat}
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </section>

          {/* 3. Centre of Excellence & R&D Cell */}
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

          {/* 4. Innovation & Industry Collaboration */}
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

          {/* 5. Research Policy */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
              Research Policy
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              JCT Institutions maintains a comprehensive research policy
              framework that encourages all faculty members and students to
              engage in meaningful research activities. Our policy ensures
              ethical standards, intellectual property protection, and equitable
              recognition of contributions.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "📋",
                  title: "Ethical Standards",
                  desc: "Strict adherence to research ethics and integrity guidelines.",
                },
                {
                  icon: "🔒",
                  title: "IP Protection",
                  desc: "Support for patent filing and intellectual property rights.",
                },
                {
                  icon: "💰",
                  title: "Funding Support",
                  desc: "Seed grants and assistance for externally funded projects.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-white/5 p-6"
                >
                  <div className="mb-3 text-3xl">{item.icon}</div>
                  <h3 className="text-foreground mb-2 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Patents & Publications */}
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

          {/* 7. Funded Projects */}
          <section>
            <h2 className="text-foreground mb-8 font-serif text-3xl font-bold">
              Funded Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "DST-SERB Funded Project",
                  agency: "Department of Science & Technology",
                  amount: "₹12 Lakhs",
                  status: "Ongoing",
                },
                {
                  title: "AICTE Research Promotion Scheme",
                  agency: "AICTE",
                  amount: "₹8 Lakhs",
                  status: "Completed",
                },
                {
                  title: "TNSCST Funded Research",
                  agency: "Tamil Nadu State Council for Science & Technology",
                  amount: "₹5 Lakhs",
                  status: "Ongoing",
                },
                {
                  title: "Industry Collaborative Project",
                  agency: "Gateway Software Solutions",
                  amount: "₹15 Lakhs",
                  status: "Ongoing",
                },
              ].map((project, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-white/10 p-6"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${project.status === "Ongoing" ? "bg-green-500/10 text-green-400" : "bg-white/10 text-white/50"}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-gold font-bold">
                      {project.amount}
                    </span>
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {project.agency}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Workshops & Conferences */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-8 lg:p-12">
            <h2 className="text-foreground mb-8 font-serif text-3xl font-bold">
              Workshops & Conferences
            </h2>
            <div className="space-y-6">
              {[
                {
                  title:
                    "International Conference on Emerging Technologies (ICET)",
                  desc: "Annual flagship conference bringing together researchers, academicians, and industry experts to present and discuss the latest advancements in engineering and technology.",
                },
                {
                  title: "Faculty Development Programme on AI & ML",
                  desc: "A week-long intensive workshop for faculty members to upskill in Artificial Intelligence, Machine Learning, and Deep Learning techniques.",
                },
                {
                  title: "National Workshop on Advanced Manufacturing",
                  desc: "Industry-academia collaborative workshop focusing on CNC machining, additive manufacturing, and Industry 4.0 practices.",
                },
              ].map((event, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-6 border-b border-white/5 pb-6 last:border-0 last:pb-0 md:flex-row"
                >
                  <div className="bg-gold/10 text-gold flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="text-foreground mb-2 text-xl font-bold">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {event.desc}
                    </p>
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
