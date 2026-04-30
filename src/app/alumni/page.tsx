import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import {
  Users,
  Presentation,
  Handshake,
  Quote,
  ArrowRight,
  GraduationCap,
  Globe,
} from "lucide-react";

export default function EngineeringAlumniPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Alumni Network"
        subtitle="Connecting Past, Present, and Future"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Alumni" }]} />

        <div className="mt-12 space-y-24">
          {/* 1. Alumni Network Overview */}
          <section className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="bg-gold/10 text-gold mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <Globe className="h-4 w-4" />
                <span>Global Community</span>
              </div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold md:text-4xl">
                Our Global Alumni Network
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                The JCT Alumni Association is a vibrant community of over 10,000
                graduates spread across the globe. Our alumni are our proudest
                ambassadors, making significant marks in leading multinational
                corporations, government sectors, and as successful
                entrepreneurs.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We actively engage with our alumni through annual meets, guest
                lecture series ("Alumni Talk Series"), and mentorship programs,
                fostering a strong bond between the institution and its past
                students.
              </p>
              <a
                href="https://alumni.jct.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gold hover:bg-gold/90 hover:shadow-gold/20 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-black transition-all hover:shadow-lg"
              >
                Visit Alumni Portal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="relative">
              <div className="relative z-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src="/assets/alumni.webp"
                  alt="JCT Alumni Network"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Floating Stat Card */}
              <div className="bg-surface/90 absolute -bottom-6 -left-6 z-20 hidden rounded-2xl border border-white/10 p-8 shadow-xl backdrop-blur-md md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-gold/20 text-gold flex h-12 w-12 items-center justify-center rounded-xl">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-gold text-3xl font-bold">10K+</div>
                    <div className="text-foreground/70 text-sm font-medium tracking-wider uppercase">
                      Strong Network
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="bg-gold/5 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
              <div className="bg-gold/10 absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />
            </div>
          </section>

          {/* 2. Achievers & Initiatives */}
          <section>
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
                Alumni Initiatives
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                We bridge the gap between academia and industry through various
                collaborative programs led by our experienced graduates.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Alumni Talk Series",
                  desc: "Regular expert sessions where distinguished alumni share industry insights, technical knowledge, and career guidance with current students.",
                  icon: Presentation,
                  color: "bg-blue-500/10 text-blue-500",
                },
                {
                  title: "Mentorship Program",
                  desc: "Connecting pre-final and final year students with alumni mentors for project guidance, mock interviews, and career counseling.",
                  icon: Handshake,
                  color: "bg-gold/10 text-gold",
                },
                {
                  title: "Annual Alumni Meet",
                  desc: "A grand homecoming event organized yearly, bringing together alumni from various batches to reconnect, network, and celebrate.",
                  icon: Users,
                  color: "bg-green-500/10 text-green-500",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-surface hover:border-gold/30 relative overflow-hidden rounded-2xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${item.color}`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="bg-gold/5 group-hover:bg-gold/10 absolute -right-2 -bottom-2 h-20 w-20 rounded-full blur-2xl transition-all" />
                </div>
              ))}
            </div>
          </section>

          {/* 3. Testimonials */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-16">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Quote className="h-32 w-32" />
            </div>

            <h2 className="text-foreground relative z-10 mb-12 text-center font-serif text-3xl font-bold md:text-4xl">
              Voice of Our Alumni
            </h2>

            <div className="relative z-10 grid gap-10 md:grid-cols-2">
              {[
                {
                  quote:
                    "The foundation I received at JCT Engineering was instrumental in my career. The faculty's dedication and the state-of-the-art labs provided me with the practical knowledge needed to excel in the software industry. I am proud to be a JCTian.",
                  name: "Sudeesh B Kannath",
                  role: "Software Consultant, UK",
                  image: "/site_assests/logo-1.webp", // Placeholder or real image
                },
                {
                  quote:
                    "JCT provided me not just with an engineering degree, but with a platform to develop my overall personality. The placement training and the numerous symposiums helped build my confidence, which was key to cracking my core company interview.",
                  name: "R. Praveen",
                  role: "Mechanical Engineering (2013-2017)",
                  image: "/site_assests/logo-2.webp", // Placeholder or real image
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-surface/50 flex flex-col rounded-2xl border border-white/5 p-8 backdrop-blur-sm"
                >
                  <div className="text-gold mb-6">
                    <Quote className="fill-gold/20 h-8 w-8" />
                  </div>
                  <p className="text-muted-foreground mb-8 flex-grow text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="border-gold/30 relative h-14 w-14 overflow-hidden rounded-full border-2 bg-white/10">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover opacity-60"
                      />
                    </div>
                    <div>
                      <div className="text-foreground font-bold">
                        {testimonial.name}
                      </div>
                      <div className="text-gold text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
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
