import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function LeadershipPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Leadership" subtitle="Guiding Our Journey to Excellence" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Leadership" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Chairman Message */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className="bg-white/5 rounded-2xl aspect-[3/4] border border-white/10 flex items-center justify-center">
              <span className="text-muted-foreground">[Chairman Photo]</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Chairman Message</h2>
              <h3 className="text-xl text-gold mt-2 font-medium">Shri. S. A. Subramanian</h3>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4">
                <p>&quot;Education is the most powerful weapon which you can use to change the world. At JCT, we believe in empowering our students with the knowledge, skills, and values required to excel in the global landscape.&quot;</p>
                <p>Our commitment is not just towards academic excellence, but holistic development. We strive to create an environment that fosters innovation, critical thinking, and social responsibility.</p>
              </div>
            </div>
          </section>

          {/* 2. Trustee Profiles */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Trustee Profiles</h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-white/5 flex items-center justify-center">
                    <span className="text-muted-foreground">[Trustee {i} Photo]</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg">Trustee Name {i}</h3>
                    <p className="text-gold text-sm font-medium">Position</p>
                    <p className="mt-4 text-muted-foreground text-sm line-clamp-3">A brief description of the trustee&apos;s background, contributions to the institution, and vision for the future of education at JCT.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Principal / Directors */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Principals & Directors</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-8">
              <div className="flex gap-6 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="w-24 h-24 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">[Photo]</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Dr. Principal Name</h3>
                  <p className="text-gold text-sm">Principal, Engineering</p>
                  <p className="mt-2 text-muted-foreground text-sm">Leading the engineering college with a focus on innovation and research-driven learning methodologies.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="w-24 h-24 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">[Photo]</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Dr. Director Name</h3>
                  <p className="text-gold text-sm">Principal, Arts & Science</p>
                  <p className="mt-2 text-muted-foreground text-sm">Driving academic excellence and holistic development in the arts and science domains.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Leadership Philosophy */}
          <section className="bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 md:p-12 rounded-3xl border border-white/10">
            <h2 className="font-serif text-3xl font-bold text-white text-center">Leadership Philosophy</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gold text-xl">🎯</span>
                </div>
                <h3 className="text-white font-bold mb-2">Student-Centric</h3>
                <p className="text-white/70 text-sm">Placing the growth and success of our students at the heart of every decision we make.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gold text-xl">💡</span>
                </div>
                <h3 className="text-white font-bold mb-2">Innovation-Driven</h3>
                <p className="text-white/70 text-sm">Fostering a culture of continuous learning, research, and adaptation to new technologies.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gold text-xl">🤝</span>
                </div>
                <h3 className="text-white font-bold mb-2">Inclusive Growth</h3>
                <p className="text-white/70 text-sm">Ensuring equitable opportunities and supporting the holistic development of all community members.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
