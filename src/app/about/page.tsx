import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="About JCT" subtitle="Three Colleges, One Commitment to Excellence" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "About JCT" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. About Institution Group */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">About Institution Group</h2>
            <div className="mt-4 text-muted-foreground leading-relaxed">
              <p>JCT Group of Institutions is a premier educational conglomerate in Coimbatore comprising three distinguished colleges: Engineering, Arts & Science, and Polytechnic.</p>
              <p className="mt-2">Our commitment to excellence spans across disciplines, providing holistic education that empowers students to achieve their academic and professional goals.</p>
            </div>
          </section>

          {/* 2. Legacy / History Timeline */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Legacy & History Timeline</h2>
            <div className="mt-6 border-l-2 border-gold pl-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg">2009</h3>
                <p className="text-muted-foreground">Foundation of JCT College of Engineering and Technology.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg">2014</h3>
                <p className="text-muted-foreground">Establishment of JCT Polytechnic College.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg">2020</h3>
                <p className="text-muted-foreground">Launch of JCT College of Arts & Science.</p>
              </div>
            </div>
          </section>

          {/* 3. Vision & Mission */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground">To emerge as a center of excellence in education and research, producing globally competent professionals with strong ethical values.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground">To impart quality education, foster innovation, and cultivate leadership qualities that contribute to societal development.</p>
            </div>
          </section>

          {/* 4. Founder Values */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Founder Values</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Integrity', 'Excellence', 'Innovation', 'Service'].map((value) => (
                <div key={value} className="bg-surface border border-border p-6 rounded-xl text-center shadow-sm">
                  <h3 className="font-bold text-lg text-gold">{value}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Milestones */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Milestones</h2>
            <ul className="mt-6 space-y-4 text-muted-foreground list-disc list-inside">
              <li>12,000+ Alumni across the globe.</li>
              <li>Consistently achieving 96% placement records.</li>
              <li>NBA & NAAC Accreditations.</li>
              <li>50+ Programs offered.</li>
            </ul>
          </section>

          {/* 6. Awards / Recognition */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Awards & Recognition</h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border p-6 rounded-xl bg-white/5">
                  <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-gold font-bold">🏆</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Excellence Award {i}</h3>
                  <p className="text-muted-foreground text-sm">Recognized for outstanding contributions to education.</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Campus Overview */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Campus Overview</h2>
            <div className="mt-6 text-muted-foreground">
              <p>Nestled in the serene surroundings of Pichanur, Coimbatore, our sprawling campus provides an ideal environment for learning. Equipped with state-of-the-art laboratories, a well-stocked library, modern hostels, and extensive sports facilities.</p>
            </div>
            <div className="mt-6 h-64 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
              <span className="text-muted-foreground">[Campus Image Placeholder]</span>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
