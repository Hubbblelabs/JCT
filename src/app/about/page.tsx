import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="About JCT"
        subtitle="Three Colleges, One Commitment to Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "About JCT" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. About Institution Group */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              About Institution Group
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                JCT Group of Institutions is a premier educational conglomerate
                in Coimbatore comprising three distinguished colleges:
                Engineering, Arts & Science, and Polytechnic.
              </p>
              <p className="mt-2">
                Our commitment to excellence spans across disciplines, providing
                holistic education that empowers students to achieve their
                academic and professional goals.
              </p>
            </div>
          </section>

          {/* 2. Legacy / History Timeline */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Legacy & History Timeline
            </h2>
            <div className="border-gold mt-6 space-y-6 border-l-2 pl-6">
              <div>
                <h3 className="text-lg font-bold">2009</h3>
                <p className="text-muted-foreground">
                  Foundation of JCT College of Engineering and Technology.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold">2014</h3>
                <p className="text-muted-foreground">
                  Establishment of JCT Polytechnic College.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold">2020</h3>
                <p className="text-muted-foreground">
                  Launch of JCT College of Arts & Science.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Vision & Mission */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Our Vision
              </h2>
              <p className="text-muted-foreground">
                To emerge as a center of excellence in education and research,
                producing globally competent professionals with strong ethical
                values.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                To impart quality education, foster innovation, and cultivate
                leadership qualities that contribute to societal development.
              </p>
            </div>
          </section>

          {/* 4. Founder Values */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Founder Values
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Integrity", "Excellence", "Innovation", "Service"].map(
                (value) => (
                  <div
                    key={value}
                    className="bg-surface border-border rounded-xl border p-6 text-center shadow-sm"
                  >
                    <h3 className="text-gold text-lg font-bold">{value}</h3>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* 5. Milestones */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Milestones
            </h2>
            <ul className="text-muted-foreground mt-6 list-inside list-disc space-y-4">
              <li>12,000+ Alumni across the globe.</li>
              <li>Consistently achieving 96% placement records.</li>
              <li>NBA & NAAC Accreditations.</li>
              <li>50+ Programs offered.</li>
            </ul>
          </section>

          {/* 6. Awards / Recognition */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Awards & Recognition
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-border rounded-xl border bg-white/5 p-6"
                >
                  <div className="bg-gold/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <span className="text-gold font-bold">🏆</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">
                    Excellence Award {i}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Recognized for outstanding contributions to education.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Campus Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Campus Overview
            </h2>
            <div className="text-muted-foreground mt-6 leading-relaxed">
              <p>
                Nestled in the serene surroundings of Pichanur, Coimbatore, our
                sprawling campus provides an ideal environment for learning.
                Equipped with state-of-the-art laboratories, a well-stocked
                library, modern hostels, and extensive sports facilities.
              </p>
            </div>
            <div className="mt-6 relative w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/assets/college1.webp"
                alt="JCT Group of Institutions Campus"
                width={2000}
                height={900}
                className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-700 hover:scale-105"
              />
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
