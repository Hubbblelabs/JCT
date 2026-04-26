import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function CampusLifePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Life @ JCT" subtitle="Vibrant, Diverse, and Enriching" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Campus Life" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Campus Life Intro */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Life at JCT
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                Life at JCT Institutions is a perfect blend of rigorous
                academics and vibrant extracurricular activities. Nestled in the
                serene environment of Pichanur, our campus provides a conducive
                atmosphere for holistic development.
              </p>
              <p className="mt-2">
                From technical symposiums and cultural fests to sports
                tournaments and community service, there&apos;s always something
                happening on campus. We encourage students to explore their
                passions and develop leadership skills outside the classroom.
              </p>
            </div>
          </section>

          {/* 2. Hostel & 3. Transport */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="bg-surface border-border rounded-3xl border p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <span className="text-3xl">🏢</span>
              </div>
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Hostel Facilities
              </h2>
              <p className="text-muted-foreground mb-4">
                A home away from home. We offer separate, secure, and
                well-furnished hostels for boys and girls with all modern
                amenities.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Nutritious and hygienic food (Veg & Non-Veg)</li>
                <li>Wi-Fi enabled premises</li>
                <li>24/7 security and medical assistance</li>
                <li>Recreation rooms and gym facilities</li>
              </ul>
            </div>

            <div className="bg-surface border-border rounded-3xl border p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <span className="text-3xl">🚌</span>
              </div>
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Transport Facilities
              </h2>
              <p className="text-muted-foreground mb-4">
                A vast fleet of buses ensuring safe and comfortable commuting
                for students and staff across various routes.
              </p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>Extensive coverage in Coimbatore & Palakkad</li>
                <li>Experienced drivers and staff</li>
                <li>GPS enabled tracking system</li>
                <li>Punctual and reliable service</li>
              </ul>
            </div>
          </section>

          {/* 4. Sports */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Sports & Athletics
            </h2>
            <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  Physical fitness and sportsmanship are integral to the JCT
                  experience. Our campus boasts excellent sporting
                  infrastructure, encouraging students to participate in inter
                  and intra-college tournaments.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Cricket Ground",
                    "Football Turf",
                    "Basketball Court",
                    "Volleyball",
                    "Indoor Stadium",
                    "Gymnasium",
                  ].map((sport) => (
                    <span
                      key={sport}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <span className="text-muted-foreground">[Sports Image]</span>
              </div>
            </div>
          </section>

          {/* 5. Clubs */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Student Clubs
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Coding Club",
                  icon: "💻",
                  desc: "Hackathons and coding challenges.",
                },
                {
                  name: "Robotics Club",
                  icon: "🤖",
                  desc: "Building the future of automation.",
                },
                {
                  name: "Cultural Club",
                  icon: "🎭",
                  desc: "Music, dance, and dramatic arts.",
                },
                {
                  name: "Eco Club",
                  icon: "🌱",
                  desc: "Sustainability and green initiatives.",
                },
              ].map((club) => (
                <div
                  key={club.name}
                  className="bg-surface border-border hover:border-gold/50 rounded-xl border p-6 transition-colors"
                >
                  <div className="mb-4 text-3xl">{club.icon}</div>
                  <h3 className="mb-2 text-lg font-bold">{club.name}</h3>
                  <p className="text-muted-foreground text-sm">{club.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Student Activities & 7. Events */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Activities & Events
            </h2>
            <div className="mt-8 space-y-8">
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row">
                <div className="bg-surface flex aspect-video w-full shrink-0 items-center justify-center rounded-xl md:w-1/3">
                  <span className="text-muted-foreground text-sm">
                    [TechFest Image]
                  </span>
                </div>
                <div>
                  <h3 className="text-gold mb-2 text-xl font-bold">
                    Annual TechFest - JCTantra
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    A national level technical symposium where minds converge.
                    It features paper presentations, technical quizzes, robotics
                    competitions, and project expos, drawing participation from
                    colleges across the country.
                  </p>
                  <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold">
                    Technical Event
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row">
                <div className="bg-surface flex aspect-video w-full shrink-0 items-center justify-center rounded-xl md:w-1/3">
                  <span className="text-muted-foreground text-sm">
                    [Cultural Image]
                  </span>
                </div>
                <div>
                  <h3 className="text-gold mb-2 text-xl font-bold">
                    Cultural Fest - Dhwani
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The most awaited event of the year, Dhwani is a celebration
                    of art, music, dance, and culture. It provides a massive
                    platform for students to showcase their talents and unwind.
                  </p>
                  <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold">
                    Cultural Event
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row">
                <div className="bg-surface flex aspect-video w-full shrink-0 items-center justify-center rounded-xl md:w-1/3">
                  <span className="text-muted-foreground text-sm">
                    [NSS Image]
                  </span>
                </div>
                <div>
                  <h3 className="text-gold mb-2 text-xl font-bold">
                    NSS & Social Service
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Our students actively engage in community service through
                    the National Service Scheme (NSS). Activities include blood
                    donation camps, rural development programs, and
                    environmental awareness campaigns.
                  </p>
                  <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold">
                    Social Initiative
                  </span>
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
