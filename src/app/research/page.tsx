import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/site";
import Image from "next/image";
import {
  Lightbulb,
  Handshake,
  Rocket,
  ClipboardList,
  ShieldCheck,
  Coins,
  ScrollText,
  BookOpen,
  ArrowRight,
  FlaskConical,
  Microscope,
  FileText,
  Award,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Research & Innovation | ${siteConfig.name}`,
  description:
    "Explore research activities at JCT Institutions — Centre of Excellence, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
  openGraph: {
    title: `Research & Innovation | ${siteConfig.name}`,
    description:
      "Explore research activities at JCT Institutions — Centre of Excellence, R&D cell, research centres, publications, funded projects, patents, innovation, and workshops.",
    type: "website",
  },
};

export default function ResearchPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Research & Innovation"
        subtitle="Advancing Knowledge Through Excellence"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Research & Innovation" }]} />

        <div className="mt-12 space-y-24">
          {/* 1. Overview */}
          <section className="mx-auto max-w-4xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-foreground mb-6 font-serif text-3xl font-bold md:text-4xl">
                  Research at JCT
                </h2>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  JCT Institutions fosters a vibrant research ecosystem with
                  dedicated centres, funded projects, and a strong publication
                  record.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our Centre of Excellence and R&D Cell are driving innovation
                  and bridging the gap between academic knowledge and real-world
                  application, empowering students and faculty to solve complex
                  global challenges.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "50+", label: "Funded Projects", icon: Award },
                  { stat: "200+", label: "Publications", icon: FileText },
                  { stat: "15+", label: "Patents Filed", icon: ScrollText },
                  { stat: "4", label: "Centres of Excellence", icon: Cpu },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10"
                  >
                    <item.icon className="text-gold mb-3 h-6 w-6" />
                    <div className="text-gold mb-1 text-2xl font-bold">
                      {item.stat}
                    </div>
                    <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Centre of Excellence & R&D Cell */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                  Centre of Excellence
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  JCT College of Engineering and Technology has established
                  advanced Centres of Excellence to bridge the gap between
                  academic curriculum and industry demands. These centres focus
                  on specialized training, research, and product development in
                  cutting-edge technologies.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "AI & Machine Learning",
                    "CNC Machines (CAM)",
                    "Advanced Welding Technology",
                    "Cloud & Azure DevOps",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="text-muted-foreground flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm"
                    >
                      <div className="bg-gold h-2 w-2 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-xl">
                <Image
                  src="/jct-life/computer-lab2.webp"
                  alt="Research Laboratory"
                  width={600}
                  height={350}
                  className="h-[300px] w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-10">
              <div className="bg-gold/20 text-gold mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
                <Microscope className="h-8 w-8" />
              </div>
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Research & Development Cell
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                The R&D Cell encourages faculty and students to undertake
                research projects, publish in high-impact journals, and file
                patents. We provide a conducive environment and funding support
                for innovative ideas.
              </p>

              <div className="mt-auto space-y-4">
                <div className="bg-surface rounded-2xl border border-white/10 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                      Active Research
                    </span>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  </div>
                  <div className="text-foreground text-3xl font-bold">
                    50+ Projects
                  </div>
                  <p className="text-muted-foreground mt-2 font-serif text-sm italic">
                    "Fueling the next generation of technological
                    breakthroughs."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Innovation & Industry Collaboration */}
          <section>
            <div className="mb-12 text-center">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
                Innovation & Industry Collaboration
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
                Empowering the startup spirit and bridging the gap between
                academia and real-world industrial challenges.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Institution's Innovation Council (IIC)",
                  desc: "Recognized by the Ministry of Education, our IIC actively promotes an innovation and startup ecosystem through hackathons and mentorship.",
                  icon: Lightbulb,
                  color: "bg-amber-500/20 text-amber-400",
                },
                {
                  title: "MoUs & Tie-ups",
                  desc: "Strategic partnerships with industry leaders like Gateway Software Solutions and international universities to facilitate technology transfer.",
                  icon: Handshake,
                  color: "bg-blue-500/20 text-blue-400",
                },
                {
                  title: "Incubation Centre",
                  desc: "Supporting student entrepreneurs with seed funding, workspace, and expert guidance to turn prototypes into successful market-ready startups.",
                  icon: Rocket,
                  color: "bg-purple-500/20 text-purple-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1628] to-[#112240] p-8 transition-transform hover:-translate-y-1"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white/95">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Research Policy */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <div className="relative z-10">
              <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
                Research Policy
              </h2>
              <p className="text-muted-foreground mb-10 max-w-3xl text-lg leading-relaxed">
                JCT Institutions maintains a comprehensive research policy
                framework that ensures ethical standards, intellectual property
                protection, and equitable recognition of contributions.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: ClipboardList,
                    title: "Ethical Standards",
                    desc: "Strict adherence to research ethics and integrity guidelines across all disciplines.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "IP Protection",
                    desc: "Dedicated support for patent filing and intellectual property rights management.",
                  },
                  {
                    icon: Coins,
                    title: "Funding Support",
                    desc: "Seed grants and financial assistance for high-potential externally funded projects.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-surface hover:border-gold/30 rounded-2xl border border-white/5 p-6 transition-colors"
                  >
                    <item.icon className="text-gold mb-4 h-8 w-8" />
                    <h3 className="text-foreground mb-2 font-bold">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <div className="bg-gold/5 absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-3xl" />
          </section>

          {/* 6. Patents & Publications */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-8 flex items-center gap-4 font-serif text-2xl font-bold md:text-3xl">
                <div className="bg-gold/10 text-gold flex h-12 w-12 items-center justify-center rounded-xl">
                  <ScrollText className="h-6 w-6" />
                </div>
                Patents Filed
              </h2>
              <div className="space-y-4 text-center sm:text-left">
                {[
                  "Smart IoT Framework for Home and Industrial Security",
                  "Innovative Design Approaches in Modern Machinery",
                  "Wireless Charging Integration in Electric Vehicles",
                  "Value Addition in Food Product Preservation",
                ].map((patent, i) => (
                  <div
                    key={i}
                    className="group bg-surface hover:border-gold/20 rounded-2xl border border-white/5 p-5 transition-all"
                  >
                    <p className="text-foreground mb-2 text-sm leading-relaxed font-semibold">
                      {patent}
                    </p>
                    <div className="text-gold/80 flex items-center gap-2 text-xs font-medium">
                      <div className="bg-gold h-1.5 w-1.5 rounded-full" />
                      Status: Published
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-foreground mb-8 flex items-center gap-4 font-serif text-2xl font-bold md:text-3xl">
                <div className="bg-gold/10 text-gold flex h-12 w-12 items-center justify-center rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                Recent Publications
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Recycling Techniques for Concrete Pavements",
                    source: "IEEE Access",
                  },
                  { title: "AI & ML in Power Systems", source: "Springer" },
                  {
                    title: "Tandem Photoelectrochemical Cell Analysis",
                    source: "Journal of Solar Energy",
                  },
                  {
                    title: "Well Testing in Petroleum Reservoirs",
                    source: "Elsevier",
                  },
                ].map((pub, i) => (
                  <div
                    key={i}
                    className="bg-surface hover:border-gold/20 rounded-2xl border border-white/5 p-5 transition-all"
                  >
                    <p className="text-foreground mb-2 text-sm leading-relaxed font-semibold">
                      {pub.title}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {pub.source}
                      </span>
                      <span className="text-gold rounded bg-white/5 px-2 py-1">
                        2024
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Funded Projects */}
          <section>
            <h2 className="text-foreground mb-10 text-center font-serif text-3xl font-bold md:text-4xl">
              Funded Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "DST-SERB Funded Project",
                  agency: "Department of Science & Technology",
                  amount: "₹12 Lakhs",
                  status: "Ongoing",
                },
                {
                  title: "AICTE Research Promotion Scheme",
                  agency: "AICTE",
                  amount: "₹8 Lakhs",
                  status: "Completed",
                },
                {
                  title: "TNSCST Funded Research",
                  agency: "Tamil Nadu State Council for Science & Technology",
                  amount: "₹5 Lakhs",
                  status: "Ongoing",
                },
                {
                  title: "Industry Collaborative Project",
                  agency: "Gateway Software Solutions",
                  amount: "₹15 Lakhs",
                  status: "Ongoing",
                },
              ].map((project, i) => (
                <div
                  key={i}
                  className="group bg-surface hover:border-gold/30 rounded-2xl border border-white/10 p-8 shadow-lg shadow-black/20 transition-all"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase ${project.status === "Ongoing" ? "bg-green-500/10 text-green-400" : "bg-white/10 text-white/40"}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-gold text-xl font-black">
                      {project.amount}
                    </span>
                  </div>
                  <h3 className="text-foreground group-hover:text-gold mb-3 text-xl leading-tight font-bold transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <div className="bg-gold/30 h-1 w-4 rounded-full" />
                    {project.agency}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Workshops & Conferences */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-8 lg:p-16">
            <h2 className="text-foreground mb-12 font-serif text-3xl font-bold md:text-4xl">
              Workshops & Conferences
            </h2>
            <div className="space-y-10">
              {[
                {
                  title:
                    "International Conference on Emerging Technologies (ICET)",
                  desc: "Annual flagship conference bringing together researchers, academicians, and industry experts to present and discuss the latest advancements in engineering and technology.",
                },
                {
                  title: "Faculty Development Programme on AI & ML",
                  desc: "A week-long intensive workshop for faculty members to upskill in Artificial Intelligence, Machine Learning, and Deep Learning techniques.",
                },
                {
                  title: "National Workshop on Advanced Manufacturing",
                  desc: "Industry-academia collaborative workshop focusing on CNC machining, additive manufacturing, and Industry 4.0 practices.",
                },
              ].map((event, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-8 border-b border-white/5 pb-10 last:border-0 last:pb-0 md:flex-row"
                >
                  <div className="bg-gold flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-black italic">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-foreground mb-4 text-2xl font-bold">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground max-w-4xl text-lg leading-relaxed">
                      {event.desc}
                    </p>
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
