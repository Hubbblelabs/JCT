import type { Metadata } from "next";
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
  Target,
  Lightbulb,
  Award,
  CheckCircle,
  MessageSquareQuote,
  School,
  Star,
  Landmark,
} from "lucide-react";
import { AboutSideNav } from "./AboutSideNav";

export const metadata: Metadata = {
  title: "About | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Learn about JCT College of Engineering and Technology — an autonomous institution offering B.E., B.Tech, M.E., and Ph.D programs in Coimbatore.",
};

const campusHighlights = [
  {
    title: "Hi-Tech Classrooms",
    icon: Monitor,
    desc: "Smart, ICT-enabled classrooms for interactive learning with digital projectors and modern AV systems.",
  },
  {
    title: "Modern Laboratories",
    icon: FlaskConical,
    desc: "State-of-the-art labs equipped with the latest technology aligned to industry standards.",
  },
  {
    title: "24×7 Campus",
    icon: Clock,
    desc: "A secure, vibrant campus alive around the clock with CCTV surveillance and on-campus support.",
  },
  {
    title: "Extensive Library",
    icon: BookOpen,
    desc: "Digital library with thousands of e-journals, books, and online learning resources.",
  },
  {
    title: "Sports Infrastructure",
    icon: Trophy,
    desc: "Excellent facilities for both indoor and outdoor sports nurturing holistic student development.",
  },
  {
    title: "Transport Fleet",
    icon: Bus,
    desc: "Extensive bus network covering major routes across Coimbatore, Palakkad, and surrounding areas.",
  },
];

const accreditations = [
  { name: "AICTE", desc: "Approved", logo: "/aicte.png" },
  { name: "NBA", desc: "Accredited Programs", logo: "/nba.png" },
  { name: "NAAC", desc: '"A" Grade', logo: "/naac.png" },
  { name: "Anna University", desc: "Affiliated", logo: "/anna.png" },
  { name: "UGC", desc: "Recognized", logo: "/ugc.png" },
  { name: "ISO 9001:2015", desc: "Certified", logo: "/iso.png" },
];

export default function EngineeringAboutPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="About JCT Engineering"
        subtitle="An Autonomous Institution Committed to Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "About" },
          ]}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_2fr]">

          {/* ── LEFT: Sticky Side Nav ── */}
          <div className="self-start sticky top-32">
            <AboutSideNav />
          </div>

          {/* ── RIGHT: Main Content ── */}
          <div className="space-y-16">

            {/* 1. About the Institution */}
            <section id="about" className="scroll-mt-28">
              <h2 className="text-foreground mb-4 flex items-center gap-3 font-serif text-3xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <Landmark size={20} />
                </span>
                About the Institution
              </h2>
              <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                <p>
                  JCT College of Engineering and Technology, an Autonomous
                  Institution, was established by the Shri Jagannath
                  Educational Health and Charitable Trust. Founded by
                  prominent individuals dedicated to philanthropy, its goal
                  is to provide education to everyone, particularly focusing
                  on underserved and rural communities.
                </p>
                <p>
                  Located in Pichanur, Coimbatore, the institution has
                  emerged as a center of excellence in engineering and
                  technology, offering a wide array of specialized
                  undergraduate and postgraduate courses tailored to meet
                  modern industry demands.
                </p>
                <p>
                  With over a decade of academic excellence, JCT Engineering
                  has built a strong reputation for producing industry-ready
                  graduates who go on to lead successful careers at top
                  organizations in India and abroad.
                </p>
              </div>
            </section>

            {/* 2. Vision & Mission */}
            <section id="vision" className="scroll-mt-28">
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <Target size={20} />
                </span>
                Vision &amp; Mission
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="bg-gold/15 text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-2 font-bold">Our Vision</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      To emerge as a premier center of excellence in engineering
                      education and research, fostering innovation and producing
                      globally competent professionals with strong ethical values.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="bg-gold/15 text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-2 font-bold">Our Mission</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      To impart state-of-the-art technical education, encourage
                      industry-institute interaction, and cultivate leadership
                      qualities that contribute to societal and technological
                      advancement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Principal's Message */}
            <section id="principal" className="scroll-mt-28">
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <MessageSquareQuote size={20} />
                </span>
                Principal&apos;s Message
              </h2>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="grid gap-8 md:grid-cols-[180px_1fr]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative flex aspect-[3/4] w-full max-w-[160px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <div className="bg-gold/10 absolute inset-0" />
                      <span className="text-muted-foreground z-10 text-sm opacity-40">
                        Photo
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold">Dr. S. Manoharan</p>
                      <p className="text-muted-foreground text-sm">Principal</p>
                    </div>
                  </div>
                  <div className="text-muted-foreground space-y-4 leading-relaxed">
                    <p className="text-foreground/90 border-gold/40 border-l-4 pl-5 text-lg italic">
                      &quot;Welcome to JCT College of Engineering and
                      Technology. Our institution stands as a beacon of
                      quality technical education in the region.&quot;
                    </p>
                    <p>
                      We are committed to nurturing the potential within every
                      student, providing them with a robust academic foundation
                      and hands-on practical experience.
                    </p>
                    <p>
                      Our autonomous status empowers us to continuously update
                      our curriculum to align with the dynamic needs of the
                      global industry, ensuring our graduates are always
                      industry-ready. I invite you to join us in this amazing
                      world of career-oriented technical education.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Approvals & Accreditations */}
            <section id="accreditations" className="scroll-mt-28">
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <Award size={20} />
                </span>
                Approvals &amp; Accreditations
              </h2>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                {accreditations.map((acc) => (
                  <div
                    key={acc.name}
                    className="bg-surface border-border flex flex-col items-center justify-center rounded-xl border p-4 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative mb-3 h-12 w-full">
                      <Image
                        src={acc.logo}
                        alt={acc.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-foreground text-xs font-bold">{acc.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-[10px]">{acc.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Campus Highlights */}
            <section id="campus" className="scroll-mt-28">
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <School size={20} />
                </span>
                Campus Highlights
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {campusHighlights.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <feature.icon size={18} />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">{feature.title}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Why Choose JCT Engineering */}
            <section id="why-jct" className="scroll-mt-28">
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  <Star size={20} />
                </span>
                Why Choose JCT Engineering?
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  "Only college in Coimbatore offering Petroleum & Petrochemical Engineering",
                  "Autonomous status with industry-updated curriculum",
                  "NBA-accredited programs with global quality standards",
                  "98% placement rate with 500+ recruiting partners",
                  "Dedicated Centre of Excellence (COE) for research",
                  "Strong alumni network spanning global organizations",
                  "Industry-integrated internship programs",
                  "Merit scholarships and government financial aid",
                ].map((point, i) => (
                  <span
                    key={i}
                    className="bg-surface flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium"
                  >
                    <CheckCircle size={13} className="text-gold shrink-0" />
                    {point}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
