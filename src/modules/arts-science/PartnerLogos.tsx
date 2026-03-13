"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const companies = [
  { name: "TCS", logo: "/company_logo/TCS.NS_BIG.svg" },
  { name: "Google", logo: "/company_logo/google-color.svg" },
  { name: "Microsoft", logo: "/company_logo/microsoft.png" },
  { name: "Amazon", logo: "/company_logo/AMZN_BIG.svg" },
  { name: "IBM", logo: "/company_logo/IBM.svg" },
  { name: "Nvidia", logo: "/company_logo/NVDA_BIG.svg" },
  { name: "Oracle", logo: "/company_logo/ORCL_BIG.svg" },
  { name: "Adobe", logo: "/company_logo/ADBE_BIG.svg" },
  { name: "Cisco", logo: "/company_logo/CSCO.svg" },
  { name: "PayPal", logo: "/company_logo/PYPL_BIG.svg" },
  { name: "Visa", logo: "/company_logo/V.svg" },
  { name: "HDFC Bank", logo: "/company_logo/HDB_BIG.svg" },
  { name: "LIC", logo: "/company_logo/LICI.NS_BIG.svg" },
  { name: "Zoom", logo: "/company_logo/ZM.svg" },
  { name: "Mastercard", logo: "/company_logo/MA.svg" },
];

function LogoCard({ company }: { company: { name: string; logo: string } }) {
  return (
    <div className="flex h-14 w-32 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md md:h-16 md:w-36">
      <div className="relative h-7 w-full md:h-8">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="144px"
          className="object-contain opacity-50 transition-opacity duration-300 hover:opacity-100"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function PartnerLogos() {
  const row1 = [...companies, ...companies];
  const row2 = [...companies.slice().reverse(), ...companies.slice().reverse()];

  return (
    <section className="overflow-hidden bg-[#edeff2] py-16 md:py-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 font-sans text-xl font-bold text-[#800020] md:text-2xl"
        >
          Where our graduates work
        </motion.h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r from-[#edeff2] to-transparent md:w-32" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l from-[#edeff2] to-transparent md:w-32" />

        {/* Row 1 — scrolls left */}
        <div className="mb-4">
          <div className="animate-scroll-left flex gap-4">
            {row1.map((company, i) => (
              <LogoCard key={`r1-${i}`} company={company} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div>
          <div className="animate-scroll-right flex gap-4">
            {row2.map((company, i) => (
              <LogoCard key={`r2-${i}`} company={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
