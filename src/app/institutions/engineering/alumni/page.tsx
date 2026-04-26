import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringAlumniPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="Alumni Network" subtitle="Connecting Past, Present, and Future" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Engineering", href: "/institutions/engineering" },
          { label: "Alumni" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. Alumni Network Overview */}
          <section className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Global Alumni Network</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">The JCT Alumni Association is a vibrant community of over 10,000 graduates spread across the globe. Our alumni are our proudest ambassadors, making significant marks in leading multinational corporations, government sectors, and as successful entrepreneurs.</p>
              <p className="text-muted-foreground leading-relaxed mb-6">We actively engage with our alumni through annual meets, guest lecture series (&quot;Alumni Talk Series&quot;), and mentorship programs, fostering a strong bond between the institution and its past students.</p>
              <a href="https://alumni.jct.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-6 py-3 rounded-full transition-colors">
                Visit Alumni Portal ↗
              </a>
            </div>
            <div className="bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 rounded-full aspect-square flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-gold/5">
              <div className="text-5xl font-bold text-gold mb-2">10K+</div>
              <div className="font-medium text-white/90">Strong Network</div>
            </div>
          </section>

          {/* 2. Achievers & Initiatives */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">Alumni Initiatives</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl mb-4">🎤</div>
                <h3 className="font-bold text-lg mb-2">Alumni Talk Series</h3>
                <p className="text-sm text-muted-foreground">Regular expert sessions where distinguished alumni share industry insights, technical knowledge, and career guidance with current students.</p>
              </div>
              <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl mb-4">🤝</div>
                <h3 className="font-bold text-lg mb-2">Mentorship Program</h3>
                <p className="text-sm text-muted-foreground">Connecting pre-final and final year students with alumni mentors for project guidance, mock interviews, and career counseling.</p>
              </div>
              <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl mb-4">🎉</div>
                <h3 className="font-bold text-lg mb-2">Annual Alumni Meet</h3>
                <p className="text-sm text-muted-foreground">A grand homecoming event organized yearly, bringing together alumni from various batches to reconnect, network, and celebrate their alma mater.</p>
              </div>
            </div>
          </section>

          {/* 3. Testimonials */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">What Our Alumni Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface p-6 rounded-2xl border border-white/5 relative">
                <div className="text-4xl text-gold/20 absolute top-4 right-6 font-serif">&quot;</div>
                <p className="text-muted-foreground italic mb-6 relative z-10 text-sm leading-relaxed">&quot;The foundation I received at JCT Engineering was instrumental in my career. The faculty&apos;s dedication and the state-of-the-art labs provided me with the practical knowledge needed to excel in the software industry. I am proud to be a JCTian.&quot;</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                  <div>
                    <div className="font-bold text-sm text-white/90">Sudeesh B Kannath</div>
                    <div className="text-xs text-gold">Software Consultant, UK</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-white/5 relative">
                <div className="text-4xl text-gold/20 absolute top-4 right-6 font-serif">&quot;</div>
                <p className="text-muted-foreground italic mb-6 relative z-10 text-sm leading-relaxed">&quot;JCT provided me not just with an engineering degree, but with a platform to develop my overall personality. The placement training and the numerous symposiums helped build my confidence, which was key to cracking my core company interview.&quot;</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                  <div>
                    <div className="font-bold text-sm text-white/90">R. Praveen</div>
                    <div className="text-xs text-gold">Mechanical Engineering Batch (2013-2017)</div>
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
