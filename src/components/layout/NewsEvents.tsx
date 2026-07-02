"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export type NewsEventItem = {
  date: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  href?: string;
};

// Fallback content shown until events are published in the admin CMS
// (Admin → Main → News & Events).
const fallbackItems: NewsEventItem[] = [
  {
    date: "04 Mar 2026",
    title: "JCT Engineering Students Win National Hackathon at IIT Madras",
    excerpt:
      "A team of 4 CSE students bagged first prize at CodeSprint 2026, competing against 200+ teams from across India.",
    category: "Achievement",
    image: "/assets/jct-life13.webp",
  },
  {
    date: "28 Feb 2026",
    title: "MoU Signed with TCS for Industry-Integrated Learning",
    excerpt:
      "JCT College of Engineering partners with TCS to offer hands-on training modules and guaranteed internship placements.",
    category: "Partnership",
    image: "/assets/jct-life2.webp",
  },
  {
    date: "15 Feb 2026",
    title: "Annual Sports Day 2026 — Record Participation",
    excerpt:
      "Over 1,500 students participated in inter-department sports events spanning athletics, cricket, basketball, and chess.",
    category: "Campus Life",
    image: "/campus-life-assets/sports3.webp",
  },
  {
    date: "22 Feb 2026",
    title: "NAAC Re-Accreditation Process Successfully Completed",
    excerpt:
      "JCT Institutions undergoes peer review for NAAC re-accreditation, with preliminary reports indicating strong outcomes.",
    category: "Accreditation",
    image: "/accreditations/naac.webp",
  },
];

function CardShell({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}

export function NewsEvents({ items }: { items?: NewsEventItem[] }) {
  const newsItems = items && items.length > 0 ? items : fallbackItems;
  const [first, second, third, fourth] = newsItems;

  return (
    <section id="happenings" className="bg-surface py-10 md:py-14">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        {/* Header */}
        <div className="border-border mb-6 flex items-end justify-between border-b pb-4 md:mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-foreground mb-3 font-serif text-3xl leading-tight italic sm:text-4xl md:text-[44px]"
            >
              Happenings at JCT
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground font-sans text-base"
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
              href="/events"
              className="text-accent font-sans text-[15px] font-bold tracking-wide underline-offset-4 hover:underline"
            >
              View All News
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Large Image Card */}
          {first && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5"
            >
              <CardShell
                href={first.href}
                className="group relative block h-100 cursor-pointer overflow-hidden rounded-4xl lg:h-150"
              >
                <Image
                  src={first.image}
                  alt={first.title}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                <div className="absolute right-8 bottom-10 left-8 z-10 text-white">
                  <span className="bg-accent mb-5 inline-block rounded px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                    {first.category}
                  </span>
                  <h3 className="font-serif text-[28px] leading-[1.2] text-white/95 italic md:text-[34px]">
                    {first.title}
                  </h3>
                </div>
              </CardShell>
            </motion.div>
          )}

          {/* Right Column Grid */}
          {second && (
            <div className="flex h-auto flex-col gap-6 lg:col-span-7 lg:h-150">
              {/* Top Horizontal Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="min-h-62.5 flex-1"
              >
                <CardShell
                  href={second.href}
                  className="group relative block h-full min-h-62.5 cursor-pointer overflow-hidden rounded-4xl"
                >
                  <Image
                    src={second.image}
                    alt={second.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/10 to-transparent" />
                  <div className="absolute right-8 bottom-8 left-8 z-10 text-white">
                    <h3 className="max-w-[80%] font-serif text-[24px] leading-tight text-white/95 italic md:text-[28px]">
                      {second.title}
                    </h3>
                  </div>
                </CardShell>
              </motion.div>

              {/* Two Bottom Vertical Cards */}
              {third && (
                <div className="grid min-h-62.5 flex-[1.2] grid-cols-1 gap-6 sm:grid-cols-2">
                  {[third, fourth]
                    .filter((x): x is NewsEventItem => Boolean(x))
                    .map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="min-h-62.5"
                    >
                      <CardShell
                        href={item.href}
                        className="group relative block h-full min-h-62.5 cursor-pointer overflow-hidden rounded-4xl"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#1a2332]/90 via-[#1a2332]/20 to-transparent" />
                        <div className="absolute right-6 bottom-6 left-6 z-10 text-white">
                          <h3 className="font-serif text-[20px] leading-tight text-white/95 italic md:text-[22px]">
                            {item.title}
                          </h3>
                        </div>
                      </CardShell>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
