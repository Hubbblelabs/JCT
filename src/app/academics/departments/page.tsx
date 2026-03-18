import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, Beaker, Building2, ChevronRight, Home, ChevronDown } from "lucide-react";
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
    description: "Explore departments across JCT Engineering, Arts & Science, and Polytechnic colleges — each dedicated to academic excellence.",
    type: "website",
  },
};

const colleges = [
  {
    id: "01",
    name: "Engineering & Technology",
    href: "/institutions/engineering",
    description: "Departments of CSE, ECE, EEE, Mechanical, Civil, and more. Developing the technical leaders of tomorrow through innovation and hands-on learning.",
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
    description: "Departments of Computer Science, Commerce, Business Administration, Mathematics, and more. Fostering creative thinking and scientific inquiry.",
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
    description: "Departments of Computer Engineering, Mechanical, Electrical, and more. Building strong foundational skills for immediate industry readiness.",
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
      <section className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-arts-science-dark via-[#5c1022] to-[#2a060e] z-0">
           {/* Abstract graphics to give the background depth */}
           <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-gold/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
           <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-engineering/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          
          {/* Custom Breadcrumb for Dark Background */}
          <nav className="mb-8 flex items-center gap-2 text-sm font-sans text-white/70">
            <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1.5"><Home size={14}/> Home</Link>
            <ChevronRight size={12} className="opacity-50" />
            <Link href="/academics" className="hover:text-gold transition-colors">Academics</Link>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-white font-medium">Departments</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
               <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
               <span className="text-gold uppercase tracking-widest text-[11px] font-bold">Academic Excellence</span>
            </div>
            
            <h1 className="text-white font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl mb-6">
              Our <span className="text-gold">Departments</span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl font-sans leading-relaxed md:leading-relaxed max-w-2xl">
              {subtitle} Explore our specialized departments spanning Engineering, Arts & Science, and Polytechnic colleges.
            </p>
          </div>

          {/* Floating Glassmorphic Stats - Matching Image Vibe */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl">
             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl lg:col-span-1">
               <div className="text-white font-serif text-3xl font-bold mb-1">3</div>
               <div className="text-white/60 text-xs font-medium uppercase tracking-wider">Premier Institutions</div>
             </div>
             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl lg:col-span-1">
               <div className="text-white font-serif text-3xl font-bold mb-1">100+</div>
               <div className="text-white/60 text-xs font-medium uppercase tracking-wider">Experienced Faculty</div>
             </div>
             <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl col-span-2 flex items-center justify-between">
               <div>
                  <div className="text-white font-serif text-2xl font-bold mb-1">NAAC Accredited</div>
                  <div className="text-gold text-xs font-medium tracking-wider uppercase">Quality Framework</div>
               </div>
               <div className="text-gold opacity-50"><Building2 size={40} /></div>
             </div>
          </div>
        </div>

        {/* Fading bottom edge into content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-surface to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Sticky Sidebar Navigation */}
          <div className="lg:w-1/4 shrink-0">
             <div className="lg:sticky lg:top-32 rounded-3xl bg-surface-alt border border-border/80 p-6 shadow-sm">
                <h3 className="text-navy font-serif text-xl font-bold mb-6">Explore Institutions</h3>
                <div className="flex flex-col gap-2">
                  {colleges.map((inst, idx) => (
                    <a 
                      key={idx} 
                      href={`#inst-${idx}`} 
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                         <span className={cn("text-[10px] font-bold opacity-40 group-hover:opacity-100 transition-opacity", inst.textClass)}>
                            {inst.id}
                         </span>
                         <span className="text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                            {inst.name}
                         </span>
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-gold transition-all group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
             </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-3/4 flex flex-col gap-12">
             <div className="mb-4">
                <h2 className="text-gold font-sans text-sm font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                   <div className="w-8 h-px bg-gold"></div>
                   Section 01
                </h2>
                <h3 className="text-navy font-serif text-3xl md:text-4xl font-bold mb-6">
                   Select Your Path
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                   Each of our institutions brings a distinct flavor of academic rigor and industry alignment. Discover the one that aligns with your career goals.
                </p>
             </div>

             <div className="flex flex-col gap-10">
               {colleges.map((inst, idx) => {
                 const Icon = inst.icon;
                 return (
                   <div key={idx} id={`inst-${idx}`} className="group scroll-mt-32 relative flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-white border border-border/60 shadow-sm hover:shadow-xl transition-all duration-500">
                      
                      {/* Visual Color Marker Line */}
                      <div className={cn("absolute left-0 top-0 bottom-0 w-2 md:w-3", inst.colorClass)} />

                      {/* Image / Graphic Area (Left Side) */}
                      <div className="sm:w-2/5 p-8 md:p-10 flex flex-col justify-between bg-surface-alt/30 border-r border-border/40 relative overflow-hidden">
                         <div className="relative z-10">
                            <div className={cn("inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-6", inst.bgLightClass, inst.textClass)}>
                               <Icon size={28} />
                            </div>
                            <span className="block text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">
                               Institution {inst.id}
                            </span>
                            <h3 className="text-navy font-serif text-2xl md:text-3xl font-bold leading-tight group-hover:text-gold transition-colors">
                               {inst.name}
                            </h3>
                         </div>

                         {/* Large watermark number */}
                         <div className="absolute -bottom-6 -right-4 font-serif text-[150px] font-bold text-foreground/5 leading-none pointer-events-none select-none">
                            {inst.id}
                         </div>
                      </div>

                      {/* Content & Action Area (Right Side) */}
                      <div className="sm:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                         <div>
                            <p className="text-muted-foreground text-base leading-relaxed md:text-lg mb-8">
                              {inst.description}
                            </p>
                            
                            {/* Mini Stats for each institution */}
                            <div className="flex gap-8 mb-8">
                              {inst.stats.map((stat, sIdx) => (
                                 <div key={sIdx}>
                                   <div className={cn("text-3xl font-serif font-bold mb-1", inst.textClass)}>{stat.val}</div>
                                   <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                 </div>
                              ))}
                            </div>
                         </div>
                         
                         <div className="pt-6 border-t border-border/60 mt-auto">
                           <Link
                             href={inst.href}
                             className={cn(
                               "inline-flex w-full md:w-auto items-center justify-center gap-3 rounded-full border-2 border-border/80 bg-transparent px-6 py-3 font-sans text-sm font-semibold text-navy transition-all duration-300 hover:border-transparent focus:ring-2 focus:ring-offset-2",
                               // dynamic hover colors
                               idx === 0 ? "hover:bg-engineering hover:text-white" : 
                               idx === 1 ? "hover:bg-arts-science hover:text-white" : 
                               "hover:bg-polytechnic hover:text-white"
                             )}
                           >
                             Explore Domains
                             <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
