"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Award, Building } from "lucide-react";

const companies = [
  { name: "TCS", logo: "/company_logo/TCS.NS_BIG.svg" },
  { name: "Google", logo: "/company_logo/google-color.svg" },
  { name: "Microsoft", logo: "/company_logo/microsoft.png" },
  { name: "Apple", logo: "/company_logo/apple.png" },
  { name: "Amazon", logo: "/company_logo/AMZN_BIG.svg" },
  { name: "Meta", logo: "/company_logo/META_BIG.svg" },
  { name: "IBM", logo: "/company_logo/IBM.svg" },
  { name: "Intel", logo: "/company_logo/INTC.svg" },
  { name: "Cisco", logo: "/company_logo/CSCO.svg" },
  { name: "Oracle", logo: "/company_logo/ORCL_BIG.svg" },
  { name: "Adobe", logo: "/company_logo/ADBE_BIG.svg" },
  { name: "Nvidia", logo: "/company_logo/NVDA_BIG.svg" },
  { name: "AMD", logo: "/company_logo/AMD_BIG.svg" },
  { name: "Dell", logo: "/company_logo/DELL_BIG.svg" },
  { name: "HDFC Bank", logo: "/company_logo/HDB_BIG.svg" },
  { name: "LIC", logo: "/company_logo/LICI.NS_BIG.svg" },
  { name: "JSW Steel", logo: "/company_logo/JSWSTEEL.NS.svg" },
  { name: "Ford", logo: "/company_logo/F_BIG.svg" },
  { name: "Volvo", logo: "/company_logo/VOLV-A.ST.svg" },
  { name: "Caterpillar", logo: "/company_logo/CAT_BIG.svg" },
  { name: "Sony", logo: "/company_logo/SONY_BIG.svg" },
  { name: "Zoom", logo: "/company_logo/ZM.svg" },
  { name: "PayPal", logo: "/company_logo/PYPL_BIG.svg" },
  { name: "Visa", logo: "/company_logo/V.svg" },
  { name: "Mastercard", logo: "/company_logo/MA.svg" },
  { name: "Netflix", logo: "/company_logo/NFLX_BIG.svg" },
  { name: "ASML", logo: "/company_logo/ASML.svg" },
  { name: "Disney", logo: "/company_logo/DIS_BIG.svg" },
  { name: "Samsung", logo: "/company_logo/005380.KS_BIG.svg" },
  { name: "Cloudflare", logo: "/company_logo/NET_BIG.svg" },
];

const placementStats = [
  { icon: TrendingUp, value: "96%", label: "Placement Rate" },
  { icon: Award, value: "₹8.5 LPA", label: "Average Package" },
  { icon: Award, value: "₹24 LPA", label: "Highest Package" },
  { icon: Building, value: "500+", label: "Recruiting Partners" },
];

function CompanyCard({ company }: { company: { name: string; logo: string } }) {
  return (
    <div className="border-border hover:border-gold/30 flex h-16 w-36 flex-col items-center justify-center rounded-xl border bg-white px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md sm:h-18 sm:w-40 md:h-20 md:w-44">
      <div className="relative h-8 w-full sm:h-9">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="180px"
          className="object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
          loading="lazy"
        />
      </div>
      <span className="text-muted-foreground mt-1 font-sans text-[9px] leading-none font-bold tracking-wider uppercase">
        {company.name}
      </span>
    </div>
  );
}

export function Placements() {
  return (
    <section
      id="placements"
      className="section-padding bg-surface overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
          >
            Placement Highlights
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
          >
            Our Recruiters{" "}
            <span className="text-muted-foreground font-light italic">
              Trust Our Graduates
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mx-auto max-w-xl font-sans text-base"
          >
            Leading organizations across IT, engineering, and consulting
            regularly recruit from JCT campuses.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 grid grid-cols-2 gap-4 md:mb-16 md:grid-cols-4 md:gap-6"
        >
          {placementStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-border rounded-2xl border bg-white p-4 text-center md:p-6"
            >
              <stat.icon
                size={20}
                className="text-gold mx-auto mb-2"
                strokeWidth={1.5}
              />
              <span className="text-navy mb-1 block font-sans text-xl font-black tracking-tight md:text-3xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground font-sans text-[10px] font-semibold tracking-wider uppercase md:text-xs">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <div className="from-surface pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent md:w-32" />
        <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l to-transparent md:w-32" />
        <div className="mb-4">
          <div className="animate-scroll-left flex gap-4">
            {[...companies, ...companies].map((company, i) => (
              <div key={`r1-${i}`} className="shrink-0">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="animate-scroll-right flex gap-4">
            {[
              ...companies.slice().reverse(),
              ...companies.slice().reverse(),
            ].map((company, i) => (
              <div key={`r2-${i}`} className="shrink-0">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
