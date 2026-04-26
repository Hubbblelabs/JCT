import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ArtsScienceAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="About JCT Arts & Science" subtitle="Empowering Minds, Shaping Futures" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Arts & Science", href: "/institutions/arts-science" },
          { label: "About" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. About College */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">About JCT College of Arts and Science</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Welcome to JCT College of Arts and Science. Shri Jagannath Educational Health and Charitable Trust was established by renowned and philanthropic people with an objective of providing education to all especially the down trodden and rural population.</p>
              <p>We are dedicated to offering an outstanding academic environment that nurtures intellectual curiosity and personal growth. Our institution is built on a foundation of excellence, innovation, and inclusivity.</p>
            </div>
          </section>

          {/* 2. Vision & Mission */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full"></div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground relative z-10">To be a premier institution of higher learning that fosters academic excellence, critical thinking, and social responsibility, empowering students to become visionary leaders and global citizens.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full"></div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground relative z-10">To provide inclusive and holistic education through innovative teaching, cutting-edge research, and robust industry partnerships, equipping our students with the skills and values needed to thrive in a dynamic world.</p>
            </div>
          </section>

          {/* 3. Principal Message */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start bg-surface border border-white/5 p-8 rounded-3xl">
            <div className="bg-white/5 rounded-2xl aspect-[3/4] border border-white/10 flex items-center justify-center overflow-hidden relative">
              <span className="text-muted-foreground z-10">[Principal Photo]</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Principal&apos;s Message</h2>
              <h3 className="text-xl text-gold mt-2 font-medium">Dr. Principal Name</h3>
              <div className="mt-6 text-muted-foreground leading-relaxed space-y-4">
                <p>&quot;Education at JCT College of Arts and Science is about igniting minds and inspiring hearts. We strive to create an engaging learning ecosystem where students are encouraged to explore beyond the curriculum.&quot;</p>
                <p>Our experienced faculty, modern infrastructure, and industry-aligned programs ensure that our graduates are well-prepared to tackle real-world challenges. We invite you to be a part of our vibrant academic community and shape your future with us.&quot;</p>
              </div>
            </div>
          </section>

          {/* 4. Why Choose JCT Arts */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-10">Why to Join JCT?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Result Oriented Education', icon: '🎯', desc: 'Focusing on academic excellence and measurable outcomes.' },
                { title: 'Innovative Learning Practice', icon: '💡', desc: 'Modern pedagogical tools and interactive sessions.' },
                { title: 'Student Centric Growth', icon: '🌱', desc: 'Personalized attention and holistic development.' },
                { title: 'Interdisciplinary Model', icon: '🔄', desc: 'Bridging gaps between various fields of study.' }
              ].map((reason, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center hover:border-gold/30 transition-colors">
                  <div className="w-16 h-16 mx-auto bg-surface rounded-full flex items-center justify-center text-2xl mb-4 border border-white/5">
                    {reason.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white/90">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.desc}</p>
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
