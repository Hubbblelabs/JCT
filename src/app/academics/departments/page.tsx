import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Beaker,
  Building2,
  ChevronRight,
  Home,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Departments | ${siteConfig.name}`,
  description:
    "Explore departments across JCT Engineering, Arts & Science, and Polytechnic colleges — each dedicated to academic excellence.",
  openGraph: {
    title: `Departments | ${siteConfig.name}`,
    description:
      "Explore departments across JCT Engineering, Arts & Science, and Polytechnic colleges — each dedicated to academic excellence.",
    type: "website",
  },
};

const colleges = [
  {
    id: "01",
    name: "Engineering & Technology",
    href: "/institutions/engineering",
    description:
      "Departments of CSE, ECE, EEE, Mechanical, Civil, and more. Developing the technical leaders of tomorrow through innovation and hands-on learning.",
    colorClass: "bg-engineering",
    textClass: "text-engineering",
    bgLightClass: "bg-engineering/10",
    icon: Wrench,
    stats: [
      { label: "Departments", val: "8+" },
      { label: "Labs & Centers", val: "40+" },
    ],
  },
  {
    id: "02",
    name: "Arts & Science",
    href: "/institutions/arts-science",
    description:
      "Departments of Computer Science, Commerce, Business Administration, Mathematics, and more. Fostering creative thinking and scientific inquiry.",
    colorClass: "bg-arts-science",
    textClass: "text-arts-science",
    bgLightClass: "bg-arts-science/10",
    icon: Beaker,
    stats: [
      { label: "Departments", val: "10+" },
      { label: "Clubs", val: "15+" },
    ],
  },
  {
    id: "03",
    name: "Polytechnic",
    href: "/institutions/polytechnic",
    description:
      "Departments of Computer Engineering, Mechanical, Electrical, and more. Building strong foundational skills for immediate industry readiness.",
    colorClass: "bg-polytechnic",
    textClass: "text-polytechnic",
    bgLightClass: "bg-polytechnic/10",
    icon: Building2,
    stats: [
      { label: "Departments", val: "6+" },
      { label: "Workshops", val: "12+" },
    ],
  },
];

export default function DepartmentsPage() {
  const { title, subtitle } = academicsData.departments;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />

      {/* Hero Section Inspired by the JCT Brand (Maroon/Red) */}
      <section className="relative z-0 overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32">
        <div className="from-arts-science-dark absolute inset-0 z-0 bg-linear-to-br via-[#5c1022] to-[#2a060e]">
          {/* Abstract graphics to give the background depth */}
          <div className="bg-gold/10 pointer-events-none absolute top-0 right-0 h-[800px] w-[800px] translate-x-1/3 -translate-y-1/3 rounded-full mix-blend-screen blur-[120px]"></div>
          <div className="bg-engineering/20 pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full mix-blend-screen blur-[100px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          {/* Custom Breadcrumb for Dark Background */}
          <nav className="mb-8 flex items-center gap-2 font-sans text-sm text-white/70">
            <Link
              href="/"
              className="hover:text-gold flex items-center gap-1.5 transition-colors"
            >
              <Home size={14} /> Home
            </Link>
            <ChevronRight size={12} className="opacity-50" />
            <Link
              href="/academics"
              className="hover:text-gold transition-colors"
            >
              Academics
            </Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="font-medium text-white">Departments</span>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
              <span className="bg-gold h-2 w-2 animate-pulse rounded-full"></span>
              <span className="text-gold text-[11px] font-bold tracking-widest uppercase">
                Academic Excellence
              </span>
            </div>

            <h1 className="mb-6 font-serif text-5xl leading-tight font-bold text-white md:text-6xl lg:text-7xl">
              Our <span className="text-gold">Departments</span>
            </h1>

            <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/80 md:text-xl md:leading-relaxed">
              {subtitle} Explore our specialized departments spanning
              Engineering, Arts & Science, and Polytechnic colleges.
            </p>
          </div>

          {/* Floating Glassmorphic Stats - Matching Image Vibe */}
          <div className="mt-16 grid max-w-4xl grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md lg:col-span-1">
              <div className="mb-1 font-serif text-3xl font-bold text-white">
                3
              </div>
              <div className="text-xs font-medium tracking-wider text-white/60 uppercase">
                Premier Institutions
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md lg:col-span-1">
              <div className="mb-1 font-serif text-3xl font-bold text-white">
                100+
              </div>
              <div className="text-xs font-medium tracking-wider text-white/60 uppercase">
                Experienced Faculty
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
              <div>
                <div className="mb-1 font-serif text-2xl font-bold text-white">
                  NAAC Accredited
                </div>
                <div className="text-gold text-xs font-medium tracking-wider uppercase">
                  Quality Framework
                </div>
              </div>
              <div className="text-gold opacity-50">
                <Building2 size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Fading bottom edge into content */}
        <div className="from-surface pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-24 bg-linear-to-t to-transparent"></div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Sticky Sidebar Navigation */}
          <div className="shrink-0 lg:w-1/4">
            <div className="bg-surface-alt border-border/80 rounded-3xl border p-6 shadow-sm lg:sticky lg:top-32">
              <h3 className="text-navy mb-6 font-serif text-xl font-bold">
                Explore Institutions
              </h3>
              <div className="flex flex-col gap-2">
                {colleges.map((inst, idx) => (
                  <a
                    key={idx}
                    href={`#inst-${idx}`}
                    className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[10px] font-bold opacity-40 transition-opacity group-hover:opacity-100",
                          inst.textClass,
                        )}
                      >
                        {inst.id}
                      </span>
                      <span className="text-navy group-hover:text-gold text-sm font-semibold transition-colors">
                        {inst.name}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-col gap-12 lg:w-3/4">
            <div className="mb-4">
              <h2 className="text-gold mb-4 flex items-center gap-3 font-sans text-sm font-bold tracking-[0.2em] uppercase">
                <div className="bg-gold h-px w-8"></div>
                Section 01
              </h2>
              <h3 className="text-navy mb-6 font-serif text-3xl font-bold md:text-4xl">
                Select Your Path
              </h3>
              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                Each of our institutions brings a distinct flavor of academic
                rigor and industry alignment. Discover the one that aligns with
                your career goals.
              </p>
            </div>

            <div className="flex flex-col gap-10">
              {colleges.map((inst, idx) => {
                const Icon = inst.icon;
                return (
                  <div
                    key={idx}
                    id={`inst-${idx}`}
                    className="group border-border/60 relative flex scroll-mt-32 flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 hover:shadow-xl sm:flex-row"
                  >
                    {/* Visual Color Marker Line */}
                    <div
                      className={cn(
                        "absolute top-0 bottom-0 left-0 w-2 md:w-3",
                        inst.colorClass,
                      )}
                    />

                    {/* Image / Graphic Area (Left Side) */}
                    <div className="bg-surface-alt/30 border-border/40 relative flex flex-col justify-between overflow-hidden border-r p-8 sm:w-2/5 md:p-10">
                      <div className="relative z-10">
                        <div
                          className={cn(
                            "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                            inst.bgLightClass,
                            inst.textClass,
                          )}
                        >
                          <Icon size={28} />
                        </div>
                        <span className="text-muted-foreground mb-2 block text-[10px] font-bold tracking-[0.2em] uppercase">
                          Institution {inst.id}
                        </span>
                        <h3 className="text-navy group-hover:text-gold font-serif text-2xl leading-tight font-bold transition-colors md:text-3xl">
                          {inst.name}
                        </h3>
                      </div>

                      {/* Large watermark number */}
                      <div className="text-foreground/5 pointer-events-none absolute -right-4 -bottom-6 font-serif text-[150px] leading-none font-bold select-none">
                        {inst.id}
                      </div>
                    </div>

                    {/* Content & Action Area (Right Side) */}
                    <div className="flex flex-col justify-between p-8 sm:w-3/5 md:p-10">
                      <div>
                        <p className="text-muted-foreground mb-8 text-base leading-relaxed md:text-lg">
                          {inst.description}
                        </p>

                        {/* Mini Stats for each institution */}
                        <div className="mb-8 flex gap-8">
                          {inst.stats.map((stat, sIdx) => (
                            <div key={sIdx}>
                              <div
                                className={cn(
                                  "mb-1 font-serif text-3xl font-bold",
                                  inst.textClass,
                                )}
                              >
                                {stat.val}
                              </div>
                              <div className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-border/60 mt-auto border-t pt-6">
                        <Link
                          href={inst.href}
                          className={cn(
                            "border-border/80 text-navy inline-flex w-full items-center justify-center gap-3 rounded-full border-2 bg-transparent px-6 py-3 font-sans text-sm font-semibold transition-all duration-300 hover:border-transparent focus:ring-2 focus:ring-offset-2 md:w-auto",
                            // dynamic hover colors
                            idx === 0
                              ? "hover:bg-engineering hover:text-white"
                              : idx === 1
                                ? "hover:bg-arts-science hover:text-white"
                                : "hover:bg-polytechnic hover:text-white",
                          )}
                        >
                          Explore Domains
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
