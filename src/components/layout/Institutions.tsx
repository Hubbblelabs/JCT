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
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
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
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
          >
            Our Institutions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-3 font-serif text-3xl leading-tight sm:text-4xl md:mb-5 md:text-5xl lg:text-6xl"
          >
            Three Pathways to{" "}
            <span className="text-muted-foreground font-light italic">
              Excellence
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mx-auto max-w-2xl font-sans text-base leading-relaxed md:text-lg"
          >
            Each institution is dedicated to shaping future leaders through
            specialized education, modern infrastructure, and strong industry
            connections.
          </motion.p>
        </div>

        {/* Bento Grid — Desktop | Horizontal Scroll — Mobile */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Large Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:row-span-2"
          >
            <Link href={institutions[0].href} className="group block h-full">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-3xl lg:min-h-[580px]">
                <Image
                  src={institutions[0].image}
                  alt={institutions[0].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${institutions[0].color}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">
                      <Image
                        src={institutions[0].logo}
                        alt=""
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-gold font-sans text-xs font-bold tracking-[0.15em] uppercase">
                      {institutions[0].stat}
                    </span>
                  </div>
                  <h3 className="mb-2 font-serif text-2xl leading-tight font-bold text-white md:text-3xl">
                    {institutions[0].name}
                  </h3>
                  <p className="mb-5 max-w-md font-sans text-sm text-white/70">
                    {institutions[0].tagline} — state-of-the-art laboratories
                    and industry-aligned curriculum preparing engineers for
                    tomorrow.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      {institutions[0].programs.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-sans text-[10px] font-bold tracking-wider text-white/80 uppercase backdrop-blur-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <span className="bg-gold text-navy ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110">
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
                <div className="relative h-[200px] overflow-hidden rounded-3xl md:h-[280px]">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${inst.color}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 p-1.5 shadow-lg backdrop-blur">
                        <Image
                          src={inst.logo}
                          alt=""
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gold font-sans text-[10px] font-bold tracking-[0.15em] uppercase">
                        {inst.stat}
                      </span>
                    </div>
                    <h3 className="mb-2 font-serif text-xl leading-tight font-bold text-white md:text-2xl">
                      {inst.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-sm text-white/70">
                        {inst.tagline}
                      </p>
                      <span className="group-hover:bg-gold group-hover:border-gold group-hover:text-navy ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll Cards */}
        <div className="snap-container scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 lg:hidden">
          {institutions.map((inst, i) => (
            <motion.div
              key={inst.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="snap-item w-[280px] shrink-0 sm:w-[340px]"
            >
              <Link href={inst.href} className="group block">
                <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[360px]">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="340px"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${inst.color}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 p-1.5 shadow-lg backdrop-blur">
                        <Image
                          src={inst.logo}
                          alt=""
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gold font-sans text-[10px] font-bold tracking-[0.15em] uppercase">
                        {inst.stat}
                      </span>
                    </div>
                    <h3 className="mb-1.5 font-serif text-lg leading-tight font-bold text-white">
                      {inst.name}
                    </h3>
                    <p className="mb-3 font-sans text-xs text-white/60">
                      {inst.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {inst.programs.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 font-sans text-[9px] font-bold tracking-wider text-white/70 uppercase"
                        >
                          {p}
                        </span>
                      ))}
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
