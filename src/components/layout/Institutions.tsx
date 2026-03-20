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
    color: "from-navy/90 to-navy/70",
    accent: "border-l-gold",
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
    color: "from-arts-science/90 to-arts-science/70",
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
    color: "from-polytechnic/90 to-polytechnic/70",
    accent: "border-l-polytechnic",
  },
];

export function Institutions() {
  return (
    <section id="institutions" className="bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header content matching Image 2 */}
        <div className="mx-auto mb-12 md:mb-16 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#a0842c] mb-6 inline-block font-sans text-[10px] font-bold tracking-[0.25em] uppercase"
          >
            The Academic Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#1a2332] mb-6 font-serif text-[42px] leading-tight sm:text-5xl md:text-6xl tracking-tight"
          >
            Three Pathways to <br className="hidden md:block" />
            <span className="text-[#c1a044] italic pr-2">Prestige</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#5b6574] mx-auto max-w-2xl font-sans text-[15px] leading-relaxed"
          >
            Select your trajectory within our specialized environments. Each
            college is a distinct pillar of our commitment to your future.
          </motion.p>
        </div>

        {/* 3 Circular overlapping images */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 lg:-space-x-12 mt-8 md:mt-16">
          {/* Engineering (Left) */}
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7 }}
             className="z-10 lg:translate-y-8"
          >
            <Link href={institutions[0].href} className="group block relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden transition-transform duration-500 hover:scale-105 hover:z-30">
              <Image
                src={institutions[0].image}
                alt={institutions[0].name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                sizes="(max-width: 768px) 300px, 360px"
              />
              <div className="absolute inset-0 bg-[#0e111a]/60 group-hover:bg-[#0e111a]/40 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <p className="text-[#c1a044] font-sans text-[9px] font-bold tracking-[0.2em] uppercase mb-4">
                  College of Engineering
                </p>
                <h3 className="text-white font-serif text-[26px] md:text-[28px] italic leading-snug">
                  Engineering the New<br/>Frontier.
                </h3>
              </div>
            </Link>
          </motion.div>

          {/* Arts & Science (Center) */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7, delay: 0.1 }}
             className="z-20 relative"
          >
            <Link href={institutions[1].href} className="group block relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border border-[#c1a044]/80 shadow-[0_0_80px_rgba(193,160,68,0.1)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_100px_rgba(193,160,68,0.2)]">
              <Image
                src={institutions[1].image}
                alt={institutions[1].name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                sizes="(max-width: 768px) 340px, 420px"
              />
              <div className="absolute inset-0 bg-[#0e111a]/50 group-hover:bg-[#0e111a]/30 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-10">
                <p className="text-[#c1a044] font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  College of Arts & Science
                </p>
                <h3 className="text-white font-serif text-[32px] md:text-[36px] italic leading-snug">
                  The Art of Critical<br/>Thought.
                </h3>
              </div>
            </Link>
          </motion.div>

          {/* Polytechnic (Right) */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7, delay: 0.2 }}
             className="z-10 lg:translate-y-8"
          >
             <Link href={institutions[2].href} className="group block relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full overflow-hidden transition-transform duration-500 hover:scale-105 hover:z-30">
              <Image
                src={institutions[2].image}
                alt={institutions[2].name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                sizes="(max-width: 768px) 300px, 360px"
              />
              <div className="absolute inset-0 bg-[#0e111a]/60 group-hover:bg-[#0e111a]/40 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <p className="text-[#c1a044] font-sans text-[9px] font-bold tracking-[0.2em] uppercase mb-4">
                  Polytechnic College
                </p>
                <h3 className="text-white font-serif text-[26px] md:text-[28px] italic leading-snug">
                  Hands-On Mastery,<br/>Redefined.
                </h3>
              </div>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
