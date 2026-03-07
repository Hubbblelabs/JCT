"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const institutions = [
  {
    name: "JCT College of Engineering & Technology",
    slug: "engineering",
    href: "/institutions/engineering",
    logo: "/jct_engineering1.png",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    tagline: "Pioneering Technical Education",
    stat: "6 B.E./B.Tech Programs",
    programs: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    color: "from-navy/90 to-navy/70",
    accent: "border-l-gold",
  },
  {
    name: "JCT College of Arts & Science",
    slug: "arts-science",
    href: "/institutions/arts-science",
    logo: "/jct_arts1.png",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    tagline: "Fostering Creativity & Inquiry",
    stat: "6 UG Programs",
    programs: ["Computer Science", "Mathematics", "Commerce", "BBA"],
    color: "from-burgundy/90 to-burgundy/70",
    accent: "border-l-burgundy",
  },
  {
    name: "JCT Polytechnic College",
    slug: "polytechnic",
    href: "/institutions/polytechnic",
    logo: "/jct_polytechnic1.png",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    tagline: "Hands-On Technical Training",
    stat: "5 Diploma Programs",
    programs: ["Computer", "Mechanical", "Electrical", "Electronics"],
    color: "from-polytechnic/90 to-polytechnic/70",
    accent: "border-l-polytechnic",
  },
];

export function Institutions() {
  return (
    <section id="institutions" className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
          >
            Our Institutions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-navy leading-tight mb-5"
          >
            Three Pathways to{" "}
            <span className="italic text-muted-foreground font-light">Excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Each institution is dedicated to shaping future leaders through specialized education, modern infrastructure, and strong industry connections.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* Large Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:row-span-2"
          >
            <Link href={institutions[0].href} className="group block h-full">
              <div className="relative h-full min-h-[400px] lg:min-h-[580px] rounded-3xl overflow-hidden">
                <Image
                  src={institutions[0].image}
                  alt={institutions[0].name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${institutions[0].color}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center p-2 shadow-lg">
                      <Image src={institutions[0].logo} alt="" width={32} height={32} className="object-contain" />
                    </div>
                    <span className="text-xs font-sans font-bold tracking-[0.15em] uppercase text-gold">
                      {institutions[0].stat}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 leading-tight">
                    {institutions[0].name}
                  </h3>
                  <p className="text-white/70 font-sans text-sm mb-5 max-w-md">
                    {institutions[0].tagline} — state-of-the-art laboratories and industry-aligned curriculum preparing engineers for tomorrow.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {institutions[0].programs.map((p) => (
                        <span key={p} className="text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                          {p}
                        </span>
                      ))}
                    </div>
                    <span className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy ml-auto shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Smaller Cards */}
          {institutions.slice(1).map((inst, index) => (
            <motion.div
              key={inst.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 * (index + 1) }}
            >
              <Link href={inst.href} className="group block">
                <div className="relative h-[260px] md:h-[280px] rounded-3xl overflow-hidden">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${inst.color}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center p-1.5 shadow-lg">
                        <Image src={inst.logo} alt="" width={28} height={28} className="object-contain" />
                      </div>
                      <span className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-gold">
                        {inst.stat}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 leading-tight">
                      {inst.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 font-sans text-sm">
                        {inst.tagline}
                      </p>
                      <span className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-gold group-hover:border-gold group-hover:text-navy transition-all shrink-0 ml-4">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
