import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringAlumniPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Alumni Network"
        subtitle="Connecting Past, Present, and Future"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Alumni" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. Alumni Network Overview */}
          <section className="grid items-center gap-12 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Our Global Alumni Network
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The JCT Alumni Association is a vibrant community of over 10,000
                graduates spread across the globe. Our alumni are our proudest
                ambassadors, making significant marks in leading multinational
                corporations, government sectors, and as successful
                entrepreneurs.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We actively engage with our alumni through annual meets, guest
                lecture series (&quot;Alumni Talk Series&quot;), and mentorship
                programs, fostering a strong bond between the institution and
                its past students.
              </p>
              <a
                href="https://alumni.jct.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground bg-surface inline-block rounded-full border border-white/20 px-6 py-3 font-medium transition-colors hover:bg-white"
              >
                Visit Alumni Portal ↗
              </a>
            </div>
            <div className="from-gold/20 border-gold/30 shadow-gold/5 flex aspect-square flex-col items-center justify-center rounded-full border bg-gradient-to-br to-transparent p-8 text-center shadow-2xl">
              <div className="text-gold mb-2 text-5xl font-bold">10K+</div>
              <div className="text-foreground font-medium">Strong Network</div>
            </div>
          </section>

          {/* 2. Achievers & Initiatives */}
          <section>
            <h2 className="text-foreground mb-8 text-center font-serif text-3xl font-bold">
              Alumni Initiatives
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-surface rounded-2xl border border-white/10 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                  🎤
                </div>
                <h3 className="mb-2 text-lg font-bold">Alumni Talk Series</h3>
                <p className="text-muted-foreground text-sm">
                  Regular expert sessions where distinguished alumni share
                  industry insights, technical knowledge, and career guidance
                  with current students.
                </p>
              </div>
              <div className="bg-surface rounded-2xl border border-white/10 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                  🤝
                </div>
                <h3 className="mb-2 text-lg font-bold">Mentorship Program</h3>
                <p className="text-muted-foreground text-sm">
                  Connecting pre-final and final year students with alumni
                  mentors for project guidance, mock interviews, and career
                  counseling.
                </p>
              </div>
              <div className="bg-surface rounded-2xl border border-white/10 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                  🎉
                </div>
                <h3 className="mb-2 text-lg font-bold">Annual Alumni Meet</h3>
                <p className="text-muted-foreground text-sm">
                  A grand homecoming event organized yearly, bringing together
                  alumni from various batches to reconnect, network, and
                  celebrate their alma mater.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Testimonials */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold">
              What Our Alumni Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-surface relative rounded-2xl border border-white/5 p-6">
                <div className="text-gold/20 absolute top-4 right-6 font-serif text-4xl">
                  &quot;
                </div>
                <p className="text-muted-foreground relative z-10 mb-6 text-sm leading-relaxed italic">
                  &quot;The foundation I received at JCT Engineering was
                  instrumental in my career. The faculty&apos;s dedication and
                  the state-of-the-art labs provided me with the practical
                  knowledge needed to excel in the software industry. I am proud
                  to be a JCTian.&quot;
                </p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="h-10 w-10 rounded-full bg-white/10"></div>
                  <div>
                    <div className="text-foreground text-sm font-bold">
                      Sudeesh B Kannath
                    </div>
                    <div className="text-gold text-xs">
                      Software Consultant, UK
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface relative rounded-2xl border border-white/5 p-6">
                <div className="text-gold/20 absolute top-4 right-6 font-serif text-4xl">
                  &quot;
                </div>
                <p className="text-muted-foreground relative z-10 mb-6 text-sm leading-relaxed italic">
                  &quot;JCT provided me not just with an engineering degree, but
                  with a platform to develop my overall personality. The
                  placement training and the numerous symposiums helped build my
                  confidence, which was key to cracking my core company
                  interview.&quot;
                </p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="h-10 w-10 rounded-full bg-white/10"></div>
                  <div>
                    <div className="text-foreground text-sm font-bold">
                      R. Praveen
                    </div>
                    <div className="text-gold text-xs">
                      Mechanical Engineering Batch (2013-2017)
                    </div>
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
