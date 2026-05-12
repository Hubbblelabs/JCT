import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/site";
import {
  BarChart3,
  Search,
  TrendingUp,
  GraduationCap,
  MessageSquare,
  Award,
  User,
  Users,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Quality Assurance | ${siteConfig.name}`,
  description:
    "Discover JCT Institutions' commitment to quality — accreditations, IQAC initiatives, feedback systems, and awards.",
  openGraph: {
    title: `Quality Assurance | ${siteConfig.name}`,
    description:
      "Discover JCT Institutions' commitment to quality — accreditations, IQAC initiatives, feedback systems, and awards.",
    type: "website",
  },
};

export default function QualityPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Quality Assurance"
        subtitle="Committed to Excellence in Education"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Quality Assurance" }]} />

        <div className="mt-12 space-y-20">
          {/* Overview */}
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
              Our Commitment to Quality
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              JCT Institutions is committed to maintaining the highest standards
              of quality in education, infrastructure, and governance. Our
              quality assurance framework encompasses accreditations, continuous
              improvement processes, and stakeholder feedback.
            </p>
          </section>

          {/* Accreditations */}
          <section>
            <h2 className="text-foreground mb-8 font-serif text-3xl font-bold">
              Accreditations & Recognitions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  logo: "/naac.png",
                  name: "NAAC",
                  detail:
                    "Accredited by the National Assessment and Accreditation Council (NAAC), affirming our commitment to quality education.",
                  badge: "Accredited",
                },
                {
                  logo: "/nba.png",
                  name: "NBA",
                  detail:
                    "Multiple programs accredited by the National Board of Accreditation (NBA), validating our engineering curriculum quality.",
                  badge: "Accredited",
                },
                {
                  logo: "/anna.png",
                  name: "Anna University",
                  detail:
                    "Affiliated to Anna University, one of India's premier technical universities, ensuring curriculum standards.",
                  badge: "Affiliated",
                },
                {
                  logo: "/bharathiar_university.png",
                  name: "Bharathiar University",
                  detail:
                    "Our Arts and Science courses are affiliated with Bharathiar University, ensuring academic excellence and recognition.",
                  badge: "Affiliated",
                },
                {
                  logo: "/aicte.png",
                  name: "AICTE",
                  detail:
                    "Approved by All India Council for Technical Education (AICTE), meeting all statutory requirements.",
                  badge: "Approved",
                },
                {
                  logo: "/ugc.png",
                  name: "UGC",
                  detail:
                    "Recognized under University Grants Commission, ensuring academic standards and research quality.",
                  badge: "Recognized",
                },
                {
                  logo: "/dote.png",
                  name: "DOTE",
                  detail:
                    "Directorate of Technical Education (DOTE) approval for technical and polytechnic programs.",
                  badge: "Approved",
                },
                {
                  logo: "/iso.png",
                  name: "ISO 9001:2015",
                  detail:
                    "Certified for quality management systems ensuring consistent service delivery across all departments.",
                  badge: "Certified",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-surface hover:border-gold/30 flex flex-col rounded-2xl border border-white/10 p-6 transition-colors"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                      <Image
                        src={item.logo}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="bg-gold/10 text-gold rounded-full px-3 py-1 text-xs font-medium">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground flex-grow text-sm">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* IQAC */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 lg:p-12">
            <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
              Internal Quality Assurance Cell (IQAC)
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The IQAC is the nerve centre of quality assurance at JCT
              Institutions. Constituted as per NAAC guidelines, it facilitates a
              quality culture across all departments through systematic
              planning, monitoring, and continuous improvement of academic and
              administrative processes.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  title: "Annual Quality Reports",
                  desc: "Preparing and submitting Annual Quality Assurance Reports (AQAR) to NAAC.",
                },
                {
                  icon: Search,
                  title: "Academic Audits",
                  desc: "Conducting regular academic and administrative audits to identify improvement areas.",
                },
                {
                  icon: TrendingUp,
                  title: "Benchmarking",
                  desc: "Comparing practices with best-in-class institutions nationally and internationally.",
                },
                {
                  icon: GraduationCap,
                  title: "Faculty Development",
                  desc: "Organizing FDPs and workshops to enhance teaching-learning quality.",
                },
                {
                  icon: MessageSquare,
                  title: "Feedback Analysis",
                  desc: "Systematic collection and analysis of feedback from all stakeholders.",
                },
                {
                  icon: Award,
                  title: "Best Practices",
                  desc: "Identifying and institutionalizing best practices for sustained quality.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-white/5 p-5"
                >
                  <div className="mb-3 text-2xl">
                    <item.icon size={28} className="text-[#FFC917]" />
                  </div>
                  <h3 className="text-foreground mb-1 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback Systems */}
          <section>
            <h2 className="text-foreground mb-6 font-serif text-3xl font-bold">
              Feedback Systems
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl leading-relaxed">
              We believe in continuous improvement driven by stakeholder voices.
              Our multi-channel feedback system collects insights from students,
              parents, faculty, and industry partners to enhance the quality of
              education and services.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: User,
                  title: "Student Feedback",
                  desc: "Semester-end feedback on teaching quality, curriculum relevance, and campus facilities collected through a structured online portal.",
                },
                {
                  icon: Users,
                  title: "Parent Feedback",
                  desc: "Annual parent surveys and interactions during Parent-Teacher Meets to understand student progress and institutional performance.",
                },
                {
                  icon: Briefcase,
                  title: "Employer Feedback",
                  desc: "Regular feedback from recruiting companies on graduate competency, skills, and industry readiness.",
                },
                {
                  icon: GraduationCap,
                  title: "Alumni Feedback",
                  desc: "Structured surveys and alumni meets to gather insights on curriculum relevance and skill gaps in the current job market.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-2xl border border-white/10 p-6"
                >
                  <div className="mb-3 text-3xl">
                    <item.icon size={32} className="text-[#FFC917]" />
                  </div>
                  <h3 className="text-foreground mb-2 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section>
            <h2 className="text-foreground mb-8 font-serif text-3xl font-bold">
              Awards & Achievements
            </h2>
            <div className="space-y-4">
              {[
                {
                  year: "2024",
                  award: "Best Engineering College in Coimbatore",
                  body: "Tamil Nadu Education Excellence Awards",
                },
                {
                  year: "2023",
                  award: "Outstanding Placement Record",
                  body: "Anna University Industry Partnership Summit",
                },
                {
                  year: "2023",
                  award: "Best Institution in Innovation",
                  body: "Ministry of Education – IIC Star Performance",
                },
                {
                  year: "2022",
                  award: "NBA Accreditation",
                  body: "National Board of Accreditation – Multiple Programs",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-surface flex flex-col gap-4 rounded-2xl border border-white/10 p-6 sm:flex-row sm:items-center"
                >
                  <div className="bg-gold/10 text-gold shrink-0 rounded-xl px-4 py-2 text-center font-bold">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold">{item.award}</h3>
                    <p className="text-muted-foreground text-sm">{item.body}</p>
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
