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
    image: "/site_assests/news-1.webp",
  },
  {
    date: "28 Feb 2026",
    title: "MoU Signed with TCS for Industry-Integrated Learning",
    excerpt:
      "JCT College of Engineering partners with TCS to offer hands-on training modules and guaranteed internship placements.",
    category: "Partnership",
    image: "/site_assests/dummy-news-img.jpg.jpeg",
  },
  {
    date: "15 Feb 2026",
    title: "Annual Sports Day 2026 — Record Participation",
    excerpt:
      "Over 1,500 students participated in inter-department sports events spanning athletics, cricket, basketball, and chess.",
    category: "Campus Life",
    image: "/site_assests/MGL5086-1.webp",
  },
  {
    date: "22 Feb 2026",
    title: "NAAC Re-Accreditation Process Successfully Completed",
    excerpt:
      "JCT Institutions undergoes peer review for NAAC re-accreditation, with preliminary reports indicating strong outcomes.",
    category: "Accreditation",
    image: "/site_assests/naac-imggg-01.jpg.jpeg",
  },
];

export function NewsEvents() {
  return (
    <section id="happenings" className="bg-white py-10 md:py-14">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between border-b border-gray-100 pb-4 md:mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 font-serif text-3xl leading-tight text-[#1a2332] italic sm:text-4xl md:text-[44px]"
            >
              Happenings at JCT
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans text-base text-[#5b6574]"
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
            <Link
              href="/campus-life"
              className="font-sans text-[15px] font-bold tracking-wide text-[#e68b20] underline-offset-4 hover:underline"
            >
              View All News
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Large Image Card (index 0) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative h-100 cursor-pointer overflow-hidden rounded-4xl lg:col-span-5 lg:h-150"
          >
            <Image
              src={newsItems[0].image}
              alt={newsItems[0].title}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
            <div className="absolute right-8 bottom-10 left-8 z-10 text-white">
              <span className="mb-5 inline-block rounded bg-[#a0842c] px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                {newsItems[0].category}
              </span>
              <h3 className="font-serif text-[28px] leading-[1.2] text-white/95 italic md:text-[34px]">
                {newsItems[0].title}
              </h3>
            </div>
          </motion.div>

          {/* Right Column Grid */}
          <div className="flex h-auto flex-col gap-6 lg:col-span-7 lg:h-150">
            {/* Top Horizontal Card (index 1) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative min-h-62.5 flex-1 cursor-pointer overflow-hidden rounded-4xl"
            >
              <Image
                src={newsItems[1].image}
                alt={newsItems[1].title}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/10 to-transparent" />
              <div className="absolute right-8 bottom-8 left-8 z-10 text-white">
                <h3 className="max-w-[80%] font-serif text-[24px] leading-tight text-white/95 italic md:text-[28px]">
                  {newsItems[1].title}
                </h3>
              </div>
            </motion.div>

            {/* Two Bottom Vertical Cards */}
            <div className="grid min-h-62.5 flex-[1.2] grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Card (index 2) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative min-h-62.5 cursor-pointer overflow-hidden rounded-4xl"
              >
                <Image
                  src={newsItems[2].image}
                  alt={newsItems[2].title}
                  fill
                  sizes="(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                <div className="absolute right-6 bottom-6 left-6 z-10 text-white">
                  <h3 className="font-serif text-[20px] leading-tight text-white/95 italic md:text-[22px]">
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
                className="group relative min-h-62.5 cursor-pointer overflow-hidden rounded-4xl"
              >
                <Image
                  src={newsItems[3].image}
                  alt={newsItems[3].title}
                  fill
                  sizes="(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                <div className="absolute right-6 bottom-6 left-6 z-10 text-white">
                  <h3 className="font-serif text-[20px] leading-tight text-white/95 italic md:text-[22px]">
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
