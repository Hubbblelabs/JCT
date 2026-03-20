"use client";

import { degrees, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const institutions = [
  {
    name: "JCT College of Engineering & Technology",
    slug: "engineering",
    href: "/institutions/engineering",
    // logo: "/jct_engineering1.png",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    tagline: "Pioneering Technical Education",
    // stat: "6 B.E./B.Tech Programs",
    degreePrograms: [
      {
        degree:"Autonomous  ",
        courses:[],
      },
      {
        degree: "B.E. / B.Tech",
        courses: ["CSE", "ECE", "Mechanical", "Civil", "EEE", "FT"],
      },
      {
        degree: "M.E. / M.Tech",
        courses: ["Structural", "Power Systems", "Engg Design", "CSE"],
      },
      {
        degree: "Ph.D",
        courses: ["Computer Science", "Electrical"],
      },
    ],
    color: "from-engineering-dark/95 via-engineering/70 to-transparent",
    accent: "border-l-engineering",
  },
  {
    name: "JCT College of Arts & Science",
    slug: "arts-science",
    href: "/institutions/arts-science",
    // logo: "/jct_arts1.png",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    tagline: "Fostering Creativity & Inquiry",
    // stat: "6 UG Programs",
    degreePrograms: [
      {
        degree: "Degrees Offered",
        courses: ["B.Sc", "BCA", "BBA", "B.Com"],
      },
    ],
    color: "from-arts-science-dark/95 via-gray-800/70 to-transparent",
    accent: "border-l-arts-science",
  },
  {
    name: "JCT Polytechnic College",
    slug: "polytechnic",
    href: "/institutions/polytechnic",
    // logo: "/jct_polytechnic1.png",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    tagline: "Hands-On Technical Training",
    // stat: "5 Diploma Programs",
    degreePrograms: [
      {
        degree: "Diploma",
        courses: ["Civil", "Mechanical", "Automobile", "EEE", "ECE"],
      },
    ],
    color: "from-polytechnic-dark/95 via-polytechnic/70 to-transparent",
    accent: "border-l-polytechnic",
  },
];

export function Institutions() {
  return (
    <section id="institutions" className="section-padding bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
          {/* Smaller Cards Column (Column 1) */}
          <div className="flex flex-col gap-6">
            {institutions.slice(1).map((inst, index) => (
              <motion.div
                key={inst.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 * index }}
              >
                <Link href={inst.href} className="group block focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-3xl">
                  <div className="relative h-50 overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 md:h-70">
                    <Image
                      src={inst.image}
                      alt={inst.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                      <h3 className="mb-2 font-serif text-xl leading-tight font-bold text-white drop-shadow-md md:text-2xl">
                        {inst.name}
                      </h3>
                      <p className="mb-5 font-sans text-sm font-medium text-white/80">
                        {inst.tagline}
                      </p>
                      <div className="flex flex-1 items-end gap-3">
                        <div className="flex flex-1 flex-col gap-3">
                          {inst.degreePrograms.map((degProg) => (
                            <div key={degProg.degree} className="flex flex-col gap-1.5">
                              <span className="font-sans text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                {degProg.degree}
                              </span>
                              {degProg.courses.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {degProg.courses.map((course) => (
                                    <span
                                      key={course}
                                      className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-sans text-[11px] font-medium text-white/95 shadow-xs backdrop-blur-md transition-colors hover:bg-white/20"
                                    >
                                      {course}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <span className="group-hover:bg-gold group-hover:border-gold group-hover:text-navy mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Large Feature Card (Column 2) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
          >
            <Link href={institutions[0].href} className="group block h-full focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-3xl">
              <div className="relative h-full min-h-70 overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 lg:min-h-145">
                <Image
                  src={institutions[0].image}
                  alt={institutions[0].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Dark gradient for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                {/* Content overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                  <h3 className="mb-3 font-serif text-2xl leading-tight font-bold text-white drop-shadow-lg md:text-3xl lg:text-4xl">
                    {institutions[0].name}
                  </h3>
                  <p className="mb-6 max-w-md font-sans text-base font-medium leading-relaxed text-white/80">
                    <span className="font-semibold text-white">{institutions[0].tagline}</span> — State-of-the-art laboratories
                    and industry-aligned curriculum preparing engineers for
                    tomorrow.
                  </p>
                  <div className="flex flex-1 items-end gap-3">
                    <div className="flex flex-1 flex-col gap-4">
                      {institutions[0].degreePrograms.map((degProg) => (
                        <div key={degProg.degree} className="flex flex-col gap-2">
                          <span className="font-sans text-[11px] font-bold tracking-[0.15em] text-white/60 uppercase">
                            {degProg.degree}
                          </span>
                          {degProg.courses.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {degProg.courses.map((course) => (
                                <span
                                  key={course}
                                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-sans text-xs font-semibold text-white shadow-xs backdrop-blur-md transition-colors hover:bg-white/20"
                                >
                                  {course}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="bg-gold text-navy mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
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
              className="snap-item w-70 shrink-0 sm:w-85"
            >
              <Link href={inst.href} className="group block focus:outline-none rounded-2xl">
                <div className="relative h-80 overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:shadow-xl sm:h-90">
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="340px"
                  />
                  {/* Dark gradient for text readability */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
                    <h3 className="mb-1.5 font-serif text-lg leading-tight font-bold text-white drop-shadow-md">
                      {inst.name}
                    </h3>
                    <p className="mb-4 font-sans text-[13px] font-medium text-white/80">
                      {inst.tagline}
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {inst.degreePrograms.map((degProg) => (
                        <div key={degProg.degree} className="flex flex-col gap-1">
                          <span className="font-sans text-[9px] font-bold tracking-widest text-white/50 uppercase">
                            {degProg.degree}
                          </span>
                          {degProg.courses.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                              {degProg.courses.map((course, idx) => (
                                <div key={course} className="flex items-center gap-1.5">
                                  <span className="font-sans text-[10px] font-medium text-white/90">
                                    {course}
                                  </span>
                                  {idx < degProg.courses.length - 1 && (
                                    <span className="h-1 w-1 rounded-full bg-white/20" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
