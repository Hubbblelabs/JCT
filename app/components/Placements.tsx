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
    <div className="w-36 h-16 sm:w-40 sm:h-18 md:w-44 md:h-20 bg-white rounded-xl border border-border flex flex-col items-center justify-center px-3 py-2 hover:border-gold/30 hover:shadow-md transition-all duration-300 hover:scale-105">
      <div className="relative w-full h-8 sm:h-9">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="180px"
          className="object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
      <span className="mt-1 text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-wider leading-none">
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
        <div className="text-center mb-8 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
          >
            Placement Highlights
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-navy leading-tight mb-5"
          >
            Our Recruiters{" "}
            <span className="italic text-muted-foreground font-light">
              Trust Our Graduates
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base max-w-xl mx-auto"
          >
            Leading organizations across IT, engineering, and consulting
            regularly recruit from JCT campuses.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14 md:mb-16"
        >
          {placementStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 md:p-6 bg-white rounded-2xl border border-border"
            >
              <stat.icon
                size={20}
                className="mx-auto text-gold mb-2"
                strokeWidth={1.5}
              />
              <span className="block text-xl md:text-3xl font-sans font-black text-navy tracking-tight mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="mb-4">
          <div className="flex animate-scroll-left gap-4">
            {[...companies, ...companies].map((company, i) => (
              <div key={`r1-${i}`} className="shrink-0">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex animate-scroll-right gap-4">
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
