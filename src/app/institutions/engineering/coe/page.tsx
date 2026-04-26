import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringCOEPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Research & Centre of Excellence" subtitle="Fostering Innovation and Academic Research" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Engineering", href: "/institutions/engineering" },
          { label: "Centre of Excellence" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. Centre of Excellence & 2. Research Cell */}
          <section className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Centre of Excellence</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">JCT College of Engineering and Technology has established advanced Centres of Excellence to bridge the gap between academic curriculum and industry demands. These centres focus on specialized training, research, and product development in cutting-edge technologies.</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>CoE in Artificial Intelligence & Machine Learning</li>
                <li>CoE for CNC Machines (CAM Laboratory)</li>
                <li>Advanced Welding Technology Centre</li>
                <li>Cloud Computing & Azure DevOps Lab</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Research & Development Cell</h2>
              <p className="text-muted-foreground mb-6">The R&D Cell encourages faculty and students to undertake research projects, publish in high-impact journals, and file patents. We provide a conducive environment and funding support for innovative ideas.</p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-surface p-4 rounded-xl text-center border border-white/5">
                   <div className="text-2xl font-bold text-gold">50+</div>
                   <div className="text-xs text-white/70">Funded Projects</div>
                 </div>
                 <div className="bg-surface p-4 rounded-xl text-center border border-white/5">
                   <div className="text-2xl font-bold text-gold">200+</div>
                   <div className="text-xs text-white/70">Publications</div>
                 </div>
              </div>
            </div>
          </section>

          {/* 3. Innovation Labs & 4. Industry Tie-ups */}
          <section>
             <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">Innovation & Industry Collaboration</h2>
             <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 rounded-3xl border border-white/10">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-2xl">💡</div>
                 <h3 className="font-bold text-xl mb-3">Institution&apos;s Innovation Council (IIC)</h3>
                 <p className="text-sm text-muted-foreground">Recognized by the Ministry of Education, our IIC actively promotes an innovation and startup ecosystem among students through hackathons and mentorship.</p>
               </div>
               <div className="bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 rounded-3xl border border-white/10">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-2xl">🤝</div>
                 <h3 className="font-bold text-xl mb-3">MoUs & Tie-ups</h3>
                 <p className="text-sm text-muted-foreground">We have active Memorandum of Understandings (MoUs) with leading companies like Gateway Software Solutions, Airtas Environics, and various international universities to facilitate technology transfer and research.</p>
               </div>
               <div className="bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 rounded-3xl border border-white/10">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-2xl">🚀</div>
                 <h3 className="font-bold text-xl mb-3">Incubation Centre</h3>
                 <p className="text-sm text-muted-foreground">Supporting student entrepreneurs by providing seed funding, workspace, and legal/ethical guidance to turn prototypes into successful startups.</p>
               </div>
             </div>
          </section>

          {/* 5. Patents & 6. Publications */}
          <section className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">📜</span>
                Patents Filed
              </h2>
              <div className="space-y-4">
                {[
                  "Smart IoT Framework for Home and Industrial Security with Real-Time Monitoring",
                  "Innovative Design Approaches in Modern Machinery",
                  "Wireless Charging Technology Integration in Electric Vehicles",
                  "Value Addition & Innovation in Food Product Preservation"
                ].map((patent, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-xl bg-surface">
                    <p className="font-medium text-sm text-white/90">{patent}</p>
                    <div className="text-xs text-gold mt-2">Status: Published</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">📚</span>
                Recent Publications
              </h2>
              <div className="space-y-4">
                {[
                  "Recent Advances in Recycling Techniques for Concrete Pavements - IEEE Access",
                  "Artificial Intelligence and Machine Learning in Power Systems - Springer",
                  "Performance Analysis of Tandem Photoelectrochemical Cell for Solar Water Splitting",
                  "Understanding Well Testing Implications in Petroleum Reservoirs - Elsevier"
                ].map((pub, i) => (
                  <div key={i} className="p-4 border border-white/10 rounded-xl bg-surface">
                    <p className="font-medium text-sm text-white/90">{pub}</p>
                    <div className="text-xs text-muted-foreground mt-2 flex justify-between">
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
