"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const newsItems = [
  {
    date: "04 Mar 2026",
    title: "JCT Engineering Students Win National Hackathon at IIT Madras",
    excerpt:
      "A team of 4 CSE students bagged first prize at CodeSprint 2026, competing against 200+ teams from across India.",
    category: "Achievement",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    date: "28 Feb 2026",
    title: "MoU Signed with TCS for Industry-Integrated Learning",
    excerpt:
      "JCT College of Engineering partners with TCS to offer hands-on training modules and guaranteed internship placements.",
    category: "Partnership",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    date: "15 Feb 2026",
    title: "Annual Sports Day 2026 — Record Participation",
    excerpt:
      "Over 1,500 students participated in inter-department sports events spanning athletics, cricket, basketball, and chess.",
    category: "Campus Life",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
  },
  {
    date: "22 Feb 2026",
    title: "NAAC Re-Accreditation Process Successfully Completed",
    excerpt:
      "JCT Institutions undergoes peer review for NAAC re-accreditation, with preliminary reports indicating strong outcomes.",
    category: "Accreditation",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  },
];

export function NewsEvents() {
  return (
    <section id="happenings" className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-end justify-between border-b border-gray-100 pb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#1a2332] font-serif text-3xl leading-tight sm:text-4xl md:text-[44px] italic mb-3"
            >
              Happenings at JCT
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#5b6574] font-sans text-base"
            >
              Latest news, events, and academic breakthroughs.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block"
          >
            <Link href="/campus-life" className="text-[#e68b20] font-sans text-[15px] font-bold tracking-wide hover:underline underline-offset-4">
              View All News
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Large Image Card (index 0) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 h-[400px] lg:h-[600px] relative rounded-4xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={newsItems[0].image}
              alt={newsItems[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
            <div className="absolute bottom-10 left-8 right-8 text-white z-10">
              <span className="bg-[#a0842c] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded inline-block mb-5">
                {newsItems[0].category}
              </span>
              <h3 className="font-serif text-[28px] md:text-[34px] italic leading-[1.2] text-white/95">
                {newsItems[0].title}
              </h3>
            </div>
          </motion.div>

          {/* Right Column Grid */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-auto lg:h-[600px]">
            {/* Top Horizontal Card (index 1) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1 min-h-[250px] relative rounded-4xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={newsItems[1].image}
                alt={newsItems[1].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <h3 className="font-serif text-[24px] md:text-[28px] italic leading-tight text-white/95 max-w-[80%]">
                  {newsItems[1].title}
                </h3>
              </div>
            </motion.div>
            
            {/* Two Bottom Vertical Cards */}
            <div className="flex-[1.2] grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[250px]">
               {/* Card (index 2) */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="relative rounded-4xl overflow-hidden group cursor-pointer min-h-[250px]"
               >
                  <Image
                    src={newsItems[2].image}
                    alt={newsItems[2].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                     <h3 className="font-serif text-[20px] md:text-[22px] italic leading-tight text-white/95">
                        {newsItems[2].title}
                     </h3>
                  </div>
               </motion.div>

               {/* Card (index 3) */}
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 }}
                 className="relative rounded-4xl overflow-hidden group cursor-pointer min-h-[250px]"
               >
                  <Image
                    src={newsItems[3].image}
                    alt={newsItems[3].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                     <h3 className="font-serif text-[20px] md:text-[22px] italic leading-tight text-white/95">
                        {newsItems[3].title}
                     </h3>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
