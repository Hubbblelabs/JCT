import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  Eye,
  Settings,
  Handshake,
  Factory,
  Briefcase,
  GraduationCap,
  Star,
} from "lucide-react";

export default function PolytechnicAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Polytechnic"
        subtitle="Developing Quality Professionals"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
            { label: "About" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. About Polytechnic */}
          <section>
            <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
              About JCT Polytechnic College
            </h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Welcome to JCT Polytechnic College. Established by the renowned
                Shri Jagannath Educational Health and Charitable Trust, our
                polytechnic college is dedicated to providing high-quality,
                skill-embedded diploma education to the rural population and
                beyond.
              </p>
              <p>
                We focus on bridging the gap between theoretical learning and
                industrial practices, ensuring that our students graduate as
                technically proficient and highly employable professionals ready
                to meet global standards.
              </p>
            </div>
          </section>

          {/* 3. Vision */}
          <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-10 text-center">
            <div className="bg-gold/20 text-gold mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <Eye size={32} />
            </div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white">
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed text-white/80 italic">
              &quot;Emerge as a leading Institute for Quality and Skill embedded
              Diploma Education.&quot;
            </p>
          </section>

          {/* 2. Principal Message */}
          <section className="grid items-start gap-8 md:grid-cols-[1fr_2fr]">
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <span className="text-muted-foreground z-10">
                [Principal Photo]
              </span>
            </div>
            <div>
              <h2 className="text-foreground font-serif text-3xl font-bold">
                Principal&apos;s Message
              </h2>
              <h3 className="text-gold mt-2 text-xl font-medium">
                Dr. Principal Name
              </h3>
              <div className="text-muted-foreground mt-6 space-y-4 leading-relaxed">
                <p>
                  &quot;Technical education is the backbone of industrial
                  development. At JCT Polytechnic, we aim to deliver an
                  education that is not just about passing exams, but about
                  acquiring deep practical skills and an innovative
                  mindset.&quot;
                </p>
                <p>
                  With our modern labs, experienced faculty, and strong industry
                  connections, we empower young minds to become the driving
                  force behind the nation&apos;s technological progress. We
                  welcome you to experience an education that truly connects,
                  learns, and explores.&quot;
                </p>
              </div>
            </div>
          </section>

          {/* 4. Why JCT Polytechnic */}
          <section>
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold">
              Why JCT Polytechnic?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Skill-Embedded Education",
                  icon: Settings,
                  desc: "Focusing heavily on hands-on practical training rather than just theory.",
                },
                {
                  title: "Strong Industry Tie-ups",
                  icon: Handshake,
                  desc: "Active MoUs and regular corporate interaction for better employability.",
                },
                {
                  title: "Modern Facilities",
                  icon: Factory,
                  desc: "State-of-the-art laboratories and extensive library resources.",
                },
                {
                  title: "Dedicated Placement Cell",
                  icon: Briefcase,
                  desc: "Ensuring lucrative job opportunities with top engineering and manufacturing firms.",
                },
                {
                  title: "Experienced Faculty",
                  icon: GraduationCap,
                  desc: "Learn from mentors with rich academic and industrial backgrounds.",
                },
                {
                  title: "Holistic Development",
                  icon: Star,
                  desc: "Extracurriculars, sports, and life skills for overall growth.",
                },
              ].map((reason, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="text-gold mb-4">
                    <reason.icon size={40} />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-bold">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{reason.desc}</p>
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
