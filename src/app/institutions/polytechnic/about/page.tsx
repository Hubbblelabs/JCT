import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PolytechnicAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero title="About JCT Polytechnic" subtitle="Developing Quality Professionals" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Polytechnic", href: "/institutions/polytechnic" },
          { label: "About" }
        ]} />

        <div className="mt-12 space-y-20">

          {/* 1. About Polytechnic */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">About JCT Polytechnic College</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Welcome to JCT Polytechnic College. Established by the renowned Shri Jagannath Educational Health and Charitable Trust, our polytechnic college is dedicated to providing high-quality, skill-embedded diploma education to the rural population and beyond.</p>
              <p>We focus on bridging the gap between theoretical learning and industrial practices, ensuring that our students graduate as technically proficient and highly employable professionals ready to meet global standards.</p>
            </div>
          </section>

          {/* 3. Vision */}
          <section className="bg-gradient-to-br from-[#0a1628] to-[#112240] p-10 rounded-3xl border border-white/10 text-center max-w-4xl mx-auto">
             <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center text-3xl mb-6">
               👁️
             </div>
             <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Vision</h2>
             <p className="text-lg text-white/80 leading-relaxed italic">&quot;Emerge as a leading Institute for Quality and Skill embedded Diploma Education.&quot;</p>
          </section>

          {/* 2. Principal Message */}
          <section className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className="bg-white/5 rounded-2xl aspect-[3/4] border border-white/10 flex items-center justify-center overflow-hidden relative">
              <span className="text-muted-foreground z-10">[Principal Photo]</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Principal&apos;s Message</h2>
              <h3 className="text-xl text-gold mt-2 font-medium">Dr. Principal Name</h3>
              <div className="mt-6 text-muted-foreground leading-relaxed space-y-4">
                <p>&quot;Technical education is the backbone of industrial development. At JCT Polytechnic, we aim to deliver an education that is not just about passing exams, but about acquiring deep practical skills and an innovative mindset.&quot;</p>
                <p>With our modern labs, experienced faculty, and strong industry connections, we empower young minds to become the driving force behind the nation&apos;s technological progress. We welcome you to experience an education that truly connects, learns, and explores.&quot;</p>
              </div>
            </div>
          </section>

          {/* 4. Why JCT Polytechnic */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-10">Why JCT Polytechnic?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Skill-Embedded Education', icon: '🛠️', desc: 'Focusing heavily on hands-on practical training rather than just theory.' },
                { title: 'Strong Industry Tie-ups', icon: '🤝', desc: 'Active MoUs and regular corporate interaction for better employability.' },
                { title: 'Modern Facilities', icon: '🏭', desc: 'State-of-the-art laboratories and extensive library resources.' },
                { title: 'Dedicated Placement Cell', icon: '💼', desc: 'Ensuring lucrative job opportunities with top engineering and manufacturing firms.' },
                { title: 'Experienced Faculty', icon: '👨‍🏫', desc: 'Learn from mentors with rich academic and industrial backgrounds.' },
                { title: 'Holistic Development', icon: '🌟', desc: 'Extracurriculars, sports, and life skills for overall growth.' }
              ].map((reason, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="text-4xl mb-4">{reason.icon}</div>
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
