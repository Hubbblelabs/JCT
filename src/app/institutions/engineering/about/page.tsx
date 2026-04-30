import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import {
  Monitor,
  FlaskConical,
  Clock,
  BookOpen,
  Trophy,
  Bus,
} from "lucide-react";

export default function EngineeringAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Engineering"
        subtitle="An Autonomous Institution"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "About" },
          ]}
        />

        <div className="mt-12 space-y-20">
          {/* 1. About Engineering College */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              About Engineering College
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                JCT College of Engineering and Technology, An Autonomous
                Institution, was established by the Shri Jagannath Educational
                Health and Charitable Trust. Founded by prominent individuals
                dedicated to philanthropy, its goal is to provide education to
                everyone, particularly focusing on underserved and rural
                communities.
              </p>
              <p className="mt-2">
                Located in Pichanur, Coimbatore, the institution has emerged as
                a center of excellence in engineering and technology, offering a
                wide array of specialized undergraduate and postgraduate courses
                tailored to meet modern industry demands.
              </p>
            </div>
          </section>

          {/* 2. Vision & Mission */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Our Vision
              </h2>
              <p className="text-muted-foreground">
                To emerge as a premier center of excellence in engineering
                education and research, fostering innovation and producing
                globally competent professionals with strong ethical values.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                To impart state-of-the-art technical education, encourage
                industry-institute interaction, and cultivate leadership
                qualities that contribute to societal and technological
                advancement.
              </p>
            </div>
          </section>

          {/* 3. Principal Message */}
          <section className="grid items-start gap-8 md:grid-cols-[1fr_2fr]">
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="bg-gold/10 absolute inset-0"></div>
              <span className="text-muted-foreground z-10">
                [Principal Photo]
              </span>
            </div>
            <div>
              <h2 className="text-foreground font-serif text-3xl font-bold">
                Principal&apos;s Message
              </h2>
              <h3 className="text-gold mt-2 text-xl font-medium">
                Dr. S. Manoharan
              </h3>
              <div className="text-muted-foreground mt-4 space-y-4 leading-relaxed">
                <p>
                  &quot;Welcome to JCT College of Engineering and Technology.
                  Our institution stands as a beacon of quality technical
                  education in the region. We are committed to nurturing the
                  potential within every student, providing them with a robust
                  academic foundation and hands-on practical experience.&quot;
                </p>
                <p>
                  Our autonomous status empowers us to continuously update our
                  curriculum to align with the dynamic needs of the global
                  industry, ensuring our graduates are always industry-ready. I
                  invite you to join us in this amazing world of career-oriented
                  technical education.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Accreditation & 5. Affiliations */}
          <section>
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold">
              Approvals & Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                { name: "AICTE", desc: "Approved", logo: "/aicte.png" },
                {
                  name: "NBA",
                  desc: "Accredited Programs",
                  logo: "/nba.png",
                },
                { name: "NAAC", desc: '"A" Grade', logo: "/naac.png" },
                {
                  name: "Anna University",
                  desc: "Affiliated",
                  logo: "/anna.png",
                },
                { name: "UGC", desc: "Recognized", logo: "/ugc.png" },
                { name: "ISO 9001:2015", desc: "Certified", logo: "/iso.png" },
              ].map((acc) => (
                <div
                  key={acc.name}
                  className="bg-surface border-border flex aspect-square flex-col items-center justify-center rounded-xl border p-6 text-center shadow-sm"
                >
                  <div className="relative mb-3 flex h-16 w-full items-center justify-center">
                    <Image
                      src={acc.logo}
                      alt={acc.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-bold">{acc.name}</h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {acc.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Campus Highlights */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Campus Highlights
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Hi-Tech Classrooms",
                  icon: Monitor,
                  desc: "Smart, ICT-enabled classrooms for interactive learning.",
                },
                {
                  title: "Modern Laboratories",
                  icon: FlaskConical,
                  desc: "State-of-the-art labs equipped with the latest technology.",
                },
                {
                  title: "24x7 Campus",
                  icon: Clock,
                  desc: "A secure, vibrant campus alive around the clock.",
                },
                {
                  title: "Extensive Library",
                  icon: BookOpen,
                  desc: "Digital library with thousands of e-journals and books.",
                },
                {
                  title: "Sports Infrastructure",
                  icon: Trophy,
                  desc: "Excellent facilities for both indoor and outdoor sports.",
                },
                {
                  title: "Transport Fleet",
                  icon: Bus,
                  desc: "Extensive bus network covering major routes in Coimbatore and Kerala.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="bg-gold/10 text-gold mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.desc}
                  </p>
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
