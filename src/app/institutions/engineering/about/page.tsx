import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EngineeringAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="About JCT Engineering" subtitle="An Autonomous Institution" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Institutions", href: "/institutions" }, { label: "Engineering", href: "/institutions/engineering" }, { label: "About" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. About Engineering College */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">About Engineering College</h2>
            <div className="mt-4 text-muted-foreground leading-relaxed">
              <p>JCT College of Engineering and Technology, An Autonomous Institution, was established by the Shri Jagannath Educational Health and Charitable Trust. Founded by prominent individuals dedicated to philanthropy, its goal is to provide education to everyone, particularly focusing on underserved and rural communities.</p>
              <p className="mt-2">Located in Pichanur, Coimbatore, the institution has emerged as a center of excellence in engineering and technology, offering a wide array of specialized undergraduate and postgraduate courses tailored to meet modern industry demands.</p>
            </div>
          </section>

          {/* 2. Vision & Mission */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground">To emerge as a premier center of excellence in engineering education and research, fostering innovation and producing globally competent professionals with strong ethical values.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground">To impart state-of-the-art technical education, encourage industry-institute interaction, and cultivate leadership qualities that contribute to societal and technological advancement.</p>
            </div>
          </section>

          {/* 3. Principal Message */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className="bg-white/5 rounded-2xl aspect-[3/4] border border-white/10 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gold/10"></div>
              <span className="text-muted-foreground z-10">[Principal Photo]</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Principal&apos;s Message</h2>
              <h3 className="text-xl text-gold mt-2 font-medium">Dr. S. Manoharan</h3>
              <div className="mt-4 text-muted-foreground leading-relaxed space-y-4">
                <p>&quot;Welcome to JCT College of Engineering and Technology. Our institution stands as a beacon of quality technical education in the region. We are committed to nurturing the potential within every student, providing them with a robust academic foundation and hands-on practical experience.&quot;</p>
                <p>Our autonomous status empowers us to continuously update our curriculum to align with the dynamic needs of the global industry, ensuring our graduates are always industry-ready. I invite you to join us in this amazing world of career-oriented technical education.</p>
              </div>
            </div>
          </section>

          {/* 4. Accreditation & 5. Affiliations */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-10">Approvals & Accreditations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'AICTE', desc: 'Approved' },
                { name: 'NBA', desc: 'Accredited Programs' },
                { name: 'NAAC', desc: '"A" Grade' },
                { name: 'Anna University', desc: 'Affiliated' },
                { name: 'UGC', desc: 'Recognized' },
                { name: 'ISO 9001:2015', desc: 'Certified' }
              ].map((acc) => (
                <div key={acc.name} className="bg-surface border border-border p-6 rounded-xl text-center shadow-sm flex flex-col items-center justify-center aspect-square">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                     <span className="text-gold font-bold text-xl">{acc.name[0]}</span>
                  </div>
                  <h3 className="font-bold text-sm">{acc.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{acc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Campus Highlights */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground">Campus Highlights</h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Hi-Tech Classrooms', icon: '🏫', desc: 'Smart, ICT-enabled classrooms for interactive learning.' },
                { title: 'Modern Laboratories', icon: '🔬', desc: 'State-of-the-art labs equipped with the latest technology.' },
                { title: '24x7 Campus', icon: '🕒', desc: 'A secure, vibrant campus alive around the clock.' },
                { title: 'Extensive Library', icon: '📚', desc: 'Digital library with thousands of e-journals and books.' },
                { title: 'Sports Infrastructure', icon: '⚽', desc: 'Excellent facilities for both indoor and outdoor sports.' },
                { title: 'Transport Fleet', icon: '🚌', desc: 'Extensive bus network covering major routes in Coimbatore and Kerala.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
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
