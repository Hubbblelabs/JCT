"use client";

import React from "react";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import {
  Users,
  Bus,
  Home,
  Trophy,
  Music,
  Microscope,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck
} from "lucide-react";

// --- Animation Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

// --- Data ---
const HIGHLIGHTS = [
  { id: 1, title: "Student Hub", image: "/jct-life/jct-life2.webp", aspect: "aspect-[4/5]" },
  { id: 2, title: "Central Library", image: "/jct-life/library1.webp", aspect: "aspect-[16/9]" },
  { id: 3, title: "Innovation Lab", image: "/jct-life/computer-lab2.webp", aspect: "aspect-square" },
  { id: 5, title: "Sports Complex", image: "/jct-life/sports1.webp", aspect: "aspect-[16/10]" },
  { id: 6, title: "Smart Classrooms", image: "/jct-life/classroom1.webp", aspect: "aspect-[4/3]" },
  { id: 7, title: "Research Excellence", image: "/jct-life/electronics-lab.webp", aspect: "aspect-video" },
  { id: 8, title: "Student Activities", image: "/jct-life/arts-club3.webp", aspect: "aspect-[9/16]" },
];

export default function CampusLifePage() {
  return (
    <main className="bg-background min-h-screen selection:bg-gold selection:text-navy overflow-x-hidden">
      <Navbar />

      {/* 🔹 1. Hero Section: Refined Typography & Soft Gradient */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/jct-life/jct-life1.webp"
          alt="JCT Campus Life"
          fill
          className="object-cover brightness-[0.55]"
          priority
        />

        {/* TOP */}
        <div className="absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-navy/50 to-transparent" />
        {/* BOTTOM (smooth blend) */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-background/40 via-background/20 to-transparent" />
        
        <div className="relative z-10 container mx-auto flex h-full flex-col items-start justify-end pb-16 md:pb-24 px-4 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            Life @ <span className="gradient-text">JCT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-xl font-sans text-base text-white/80 md:text-lg"
          >
            A vibrant ecosystem where heritage meets innovation.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-8 md:px-6">
        <Breadcrumb items={[{ label: "Campus Life" }]} />

        {/* 🔹 2. Experience Section */}
        <section className="section-padding grid items-center gap-16 lg:grid-cols-2">
          <motion.div {...slideInLeft}>
            <div className="inline-block rounded-lg bg-gold/10 px-3 py-1 text-xs font-bold tracking-widest text-gold uppercase">
              The JCT Advantage
            </div>
            <h2 className="text-navy mt-4 font-serif text-4xl font-bold md:text-5xl">
              Experience the <span className="text-gold">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              At JCT Institutions, we believe that education extends far beyond the four walls of a classroom. Our campus is a living laboratory where students evolve into leaders.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                { title: "Cultural Melting Pot", desc: "Students from across India and beyond.", icon: <Users className="text-gold" /> },
                { title: "Western Ghats Views", desc: "Serene foothills of Pichanur.", icon: <Star className="text-gold" /> },
                { title: "Holistic Development", desc: "Equal focus on EQ and IQ.", icon: <Zap className="text-gold" /> },
                { title: "Safe & Secure", desc: "24/7 campus-wide monitoring.", icon: <ShieldCheck className="text-gold" /> }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 transition-all">
                  <div className="bg-surface group-hover:bg-gold/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...slideInRight}
            className="relative"
          >
            <div className="relative aspect-[20/12] overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Image
                src="/jct-life/building1.webp"
                alt="JCT Main Building"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="bg-gold absolute -right-6 -bottom-6 -z-10 h-64 w-64 rounded-3xl opacity-20 blur-3xl" />
          </motion.div>
        </section>

        {/* 🔹 3. Campus Highlights: Pinterest Masonry Style */}
        <section className="section-padding">
          <div className="mb-16 text-center">
            <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">Campus Highlights</h2>
            <p className="text-muted-foreground mt-4">Discover the spaces where innovation and community thrive.</p>
          </div>

          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
            {HIGHLIGHTS.map((item) => (
              <motion.div
                key={item.id}
                {...fadeIn}
                className="break-inside-avoid"
              >
                <div className="group relative overflow-hidden rounded-[2rem] shadow-md transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`relative w-full ${item.aspect}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gold">
                      View Space <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 🔹 4. Essential Services: Full Width Background */}
      <section className="section-padding bg-surface/50 rounded-[4rem] mx-4 md:mx-6 my-12">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="text-gold mb-4 flex justify-center">
              <ShieldCheck size={48} className="animate-pulse" />
            </div>
            <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">Essential Support</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm md:text-base">Premium facilities designed for the comfort and efficiency of our students.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Hostel Facilities",
                desc: "A home away from home with multi-cuisine dining, Wi-Fi, and 24/7 care.",
                image: "/jct-life/hostel.webp",
                icon: <Home className="text-navy" size={24} />,
                points: ["Separate Boys/Girls Hostels", "Gym & Recreation Rooms", "Medical Assistance 24/7"]
              },
              {
                title: "Transport Network",
                desc: "Extensive fleet connecting Coimbatore and Palakkad with real-time GPS tracking.",
                image: "/jct-life/transport.webp",
                icon: <Bus className="text-navy" size={24} />,
                points: ["CCTV & GPS Enabled", "Experienced Drivers", "Punctual Route Management"]
              },
              {
                title: "Industry-Ready Labs",
                desc: "Specialized research spaces equipped with the latest technology.",
                image: "/jct-life/electronics-lab.webp",
                icon: <Microscope className="text-navy" size={24} />,
                points: ["NABL Standards", "Technical Support Team", "Advanced Computing Center"]
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                {...fadeIn}
                className="bg-background group flex flex-col overflow-hidden rounded-[2.5rem] shadow-md transition-all hover:-translate-y-3 hover:shadow-2xl border border-border/50"
              >
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-white/95 shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:rotate-[360deg]">
                    {service.icon}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="text-navy font-serif text-xl md:text-2xl font-bold group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="mt-6 space-y-3 border-t border-border/50 pt-6">
                    {service.points.map((pt, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs font-medium text-navy/80">
                        <CheckCircle2 size={14} className="text-gold" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        {/* 🔹 5. Sports Section */}
        <section className="section-padding">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              {...slideInLeft}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl group">
                    <Image src="/jct-life/sports1.webp" alt="Sports" fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-xl group">
                    <Image src="/jct-life/sports4.webp" alt="Sports" fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                </div>
                <div className="mt-12 space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-xl group">
                    <Image src="/jct-life/sports3.webp" alt="Sports" fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl group">
                    <Image src="/jct-life/sports2.webp" alt="Sports" fill className="object-cover transition-transform group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...slideInRight}
              className="order-1 lg:order-2"
            >
              <div className="inline-block rounded-lg bg-gold/10 px-3 py-1 text-xs font-bold tracking-widest text-gold uppercase">
                Athletics & Fitness
              </div>
              <h2 className="text-navy mt-4 font-serif text-4xl font-bold md:text-5xl">
                Unleash Your <span className="text-gold">Spirit</span>
              </h2>
              <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
                A healthy body fuels a sharp mind. Our campus is built to push boundaries, fostering character and teamwork through every game.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-l-2 border-gold/30 pl-8">
                {[
                  { label: "Cricket & Football", val: "5+ Grounds" },
                  { label: "Indoor Games", val: "10+ Disciplines" },
                  { label: "Annual Trophies", val: "150+" },
                  { label: "Fitness Training", val: "NCA Certified" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-navy font-serif text-2xl font-bold">{stat.val}</div>
                    <div className="text-muted-foreground text-sm uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-navy mt-12 overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl relative">
                <div className="relative z-10 flex items-center gap-6">
                  <div className="bg-gold/20 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <Trophy className="text-gold" size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Annual Sports Meet</h4>
                    <p className="text-white/60 text-sm mt-1">A celebration of talent and grit with over 2000+ participants.</p>
                  </div>
                </div>
                <div className="bg-gold/10 absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* 🔹 6. Clubs & Culture: Immersive Full Width */}
      <section className="section-padding bg-navy rounded-[4rem] mx-4 md:mx-6 my-12 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-gold uppercase">
              Community & Arts
            </div>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-6xl">
              Life in <span className="gradient-text">Full Color</span>
            </h2>
          </div>

          <div className="space-y-16">
            {/* Arts Club - Cinematic Aspect Ratio */}
            <motion.div {...fadeIn} className="group relative overflow-hidden rounded-[3rem] shadow-2xl">
              <div className="relative aspect-[4/3] md:aspect-[32/9] w-full overflow-hidden">
                <Image
                  src="/jct-life/arts-club1.webp"
                  alt="Arts Club"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
                <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
                  <div>
                    <h3 className="text-2xl font-bold md:text-5xl">The Arts & Music Club</h3>
                    <p className="mt-4 text-white/70 text-sm md:text-lg max-w-xl">
                      Where creativity knows no bounds. Our members jam, perform, and collaborate across disciplines, making every day a performance.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    {["Music", "Dance", "Fine Arts", "Drama"].map((tag) => (
                      <span key={tag} className="rounded-full bg-white/10 px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm font-bold backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div {...slideInLeft} className="bg-white/5 group flex flex-col gap-6 rounded-[2.5rem] border border-white/10 p-8 md:p-10 transition-all hover:bg-white/10">
                <div className="bg-gold/20 text-gold flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">
                  <Zap size={28} className="md:size-[32px]" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold">JCTantra</h4>
                  <p className="mt-4 text-white/60 text-sm md:text-lg leading-relaxed">National level technical symposium showcasing the convergence of technical brilliance and innovation.</p>
                </div>
              </motion.div>

              <motion.div {...slideInRight} className="bg-white/5 group flex flex-col gap-6 rounded-[2.5rem] border border-white/10 p-8 md:p-10 transition-all hover:bg-white/10">
                <div className="bg-gold/20 text-gold flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">
                  <Music size={28} className="md:size-[32px]" />
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold">Dhwani</h4>
                  <p className="mt-4 text-white/60 text-sm md:text-lg leading-relaxed">The heart of JCT culture. A two-day carnival celebrating music, dance, and theatrical arts.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 7. Final Conversion Section */}
      <section className="section-padding container mx-auto px-4 md:px-6 mb-12">
        <motion.div
          {...fadeIn}
          className="bg-gold relative flex flex-col items-center overflow-hidden rounded-[3rem] p-10 text-center md:p-24"
        >
          <div className="bg-navy absolute top-0 left-0 h-full w-full opacity-[0.03]" />
          <div className="border-navy/10 absolute -top-24 -right-24 h-96 w-96 rounded-full border-2" />

          <h2 className="text-navy relative z-10 font-serif text-3xl font-bold md:text-6xl">
            Ready to Start Your Journey?
          </h2>
          <p className="text-navy/70 relative z-10 mt-6 max-w-2xl text-base md:text-lg font-medium">
            Join a community of visionaries and leaders. Admissions are now open for the upcoming academic year.
          </p>

          <div className="relative z-10 mt-10 md:mt-12 flex justify-center">
            <button className="bg-navy text-white hover:bg-navy-mid flex items-center gap-2 rounded-full px-10 md:px-12 py-4 md:py-5 font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 text-base md:text-lg">
              Apply Now <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
