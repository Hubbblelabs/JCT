import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringLifePage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Life @ JCT Engineering"
        subtitle="Experience a Vibrant and Enriching Campus Environment"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Life @ JCT" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 6. Student Life Intro */}
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              A Holistic Student Life
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At JCT College of Engineering and Technology, we believe education
              goes beyond textbooks. Our sprawling campus at Pichanur provides a
              serene, yet vibrant setting where students can explore their
              passions, engage in extracurricular activities, and develop
              lifelong friendships.
            </p>
          </section>

          {/* 1. Hostel & 2. Sports */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="bg-gold/10 absolute top-0 right-0 h-32 w-32 rounded-bl-full"></div>
              <h3 className="text-foreground relative z-10 mb-4 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="text-3xl">🏢</span> Hostel Life
              </h3>
              <p className="text-muted-foreground relative z-10 mb-6">
                We provide excellent residential facilities separate for boys
                and girls. The hostels are designed as a &quot;home away from
                home&quot; with modern amenities, ensuring a safe, comfortable,
                and conducive environment for study and personal growth.
              </p>
              <ul className="text-muted-foreground relative z-10 list-inside list-disc space-y-2 text-sm">
                <li>Spacious, well-ventilated rooms</li>
                <li>Hygienic mess serving nutritious food</li>
                <li>Wi-Fi connectivity & 24/7 security</li>
                <li>Indoor recreation and gym facilities</li>
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="bg-gold/10 absolute top-0 right-0 h-32 w-32 rounded-bl-full"></div>
              <h3 className="text-foreground relative z-10 mb-4 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="text-3xl">⚽</span> Sports & Athletics
              </h3>
              <p className="text-muted-foreground relative z-10 mb-6">
                Physical fitness is integral to the JCT experience. Our students
                consistently bring laurels in Anna University Zonal tournaments
                and state-level championships. We provide top-notch
                infrastructure for various sports.
              </p>
              <div className="relative z-10 flex flex-wrap gap-2">
                {[
                  "Football",
                  "Volleyball",
                  "Kabaddi",
                  "Power Lifting",
                  "Badminton",
                  "Athletics",
                  "Cricket",
                ].map((sport) => (
                  <span
                    key={sport}
                    className="bg-surface rounded-md border border-white/10 px-3 py-1 text-xs font-medium"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Clubs */}
          <section>
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold">
              Student Clubs & Cells
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "National Service Scheme (NSS)",
                  icon: "🤝",
                  desc: "Engaging in community service, blood donation camps, and social awareness programs.",
                },
                {
                  name: "Fine Arts Club",
                  icon: "🎭",
                  desc: "A platform for students to showcase their talents in music, dance, and arts.",
                },
                {
                  name: "Women Empowerment Cell",
                  icon: "👩‍🎓",
                  desc: "Organizing programs, self-defense workshops, and seminars for female students.",
                },
                {
                  name: "Technical Associations",
                  icon: "💻",
                  desc: "Department-specific clubs fostering technical knowledge through symposiums and hackathons.",
                },
              ].map((club, i) => (
                <div
                  key={i}
                  className="bg-surface hover:border-gold/30 rounded-2xl border border-white/10 p-6 text-center transition-colors"
                >
                  <div className="mb-4 text-4xl">{club.icon}</div>
                  <h3 className="text-foreground mb-2 font-bold">
                    {club.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {club.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Events */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-8 lg:p-12">
            <h2 className="text-foreground mb-8 font-serif text-3xl font-bold">
              Flagship Events
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "JFINAGLES - National Level Technical Symposium",
                  desc: "An annual mega technical fest where students from across the country participate in paper presentations, project expos, and technical quizzes. Departments like CSE, Mech, ECE, and EEE host specialized events like Tarang, Takshak, and Dhruvaz.",
                },
                {
                  title: "Cultural & Sports Day",
                  desc: "A grand celebration of arts and athletics, featuring performances, inter-college tournaments, and the awarding of the &apos;Park Alumni Trophy&apos; to outstanding athletes.",
                },
                {
                  title: "Smart India Hackathon (Internal)",
                  desc: "A rigorous coding and hardware hackathon where students develop innovative solutions for real-world problems, preparing them for the national stage.",
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

          {/* 5. Gallery */}
          <section>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-foreground font-serif text-3xl font-bold">
                Campus Gallery
              </h2>
              <a
                href="/media"
                className="text-gold text-sm font-medium hover:underline"
              >
                View Media Center →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <span className="text-muted-foreground text-xs">
                    [Campus Image {i}]
                  </span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"></div>
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
