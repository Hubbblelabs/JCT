"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Award, Building } from "lucide-react";
import { useEffect, useState } from "react";

const STATIC_COMPANIES = [
  { name: "Abiba", logo: "/company-logos/abiba.webp" },
  { name: "Aditya Birla Group", logo: "/company-logos/aditya-birla-group.webp" },
  { name: "AIS India Glass", logo: "/company-logos/ais-india-glass.webp" },
  { name: "Alstom", logo: "/company-logos/alstom.webp" },
  { name: "Ashok Leyland", logo: "/company-logos/ashok-leyland.webp" },
  { name: "Caterpillar", logo: "/company-logos/caterpillar.webp" },
  { name: "Cognizant", logo: "/company-logos/cognizant.webp" },
  { name: "CPF", logo: "/company-logos/cpf.webp" },
  { name: "C.R.I. Pumps", logo: "/company-logos/cri-pumps.webp" },
  { name: "CSS Corp", logo: "/company-logos/css-crop.webp" },
  { name: "Face Prep", logo: "/company-logos/face-prep.webp" },
  { name: "Force Motors", logo: "/company-logos/force-motors.webp" },
  { name: "Genpact", logo: "/company-logos/genpact.webp" },
  { name: "Infosys", logo: "/company-logos/Infosys.webp" },
  { name: "Infoview", logo: "/company-logos/infoview.webp" },
  { name: "Ionix", logo: "/company-logos/ionix.webp" },
  { name: "LT", logo: "/company-logos/lt.webp" },
  { name: "Murugappa", logo: "/company-logos/murugappa.webp" },
  { name: "Niyata Infotech", logo: "/company-logos/niyata.webp" },
  { name: "Parle Agro", logo: "/company-logos/parle agro.webp" },
  { name: "Petrofac", logo: "/company-logos/petrofac.webp" },
  { name: "Poornam", logo: "/company-logos/poornam.webp" },
  { name: "Popcorn Apps", logo: "/company-logos/popcornapps.webp" },
  { name: "Sakava", logo: "/company-logos/sakava.webp" },
  { name: "Salzer", logo: "/company-logos/salzer.webp" },
  { name: "Sanmar", logo: "/company-logos/sanmar.webp" },
  { name: "Sharda", logo: "/company-logos/sharda.webp" },
  { name: "SPIC.NS", logo: "/company-logos/SPIC.NS.webp" },
  { name: "Tagros", logo: "/company-logos/tagros.webp" },
  { name: "TCS", logo: "/company-logos/tcs.webp" },
  { name: "Tech Mahindra", logo: "/company-logos/tech-mahindra.webp" },
  { name: "Thirumalai Chemicals", logo: "/company-logos/thirumalai-chemicals.webp" },
  { name: "Trika", logo: "/company-logos/trika.webp" },
  { name: "Trioticz", logo: "/company-logos/trioticz.webp" },
  { name: "Tudip", logo: "/company-logos/tudip.webp" },
  { name: "TVS", logo: "/company-logos/tvs.webp" },
  { name: "V-Guard", logo: "/company-logos/v-gaurd.webp" },
  { name: "Vermeer", logo: "/company-logos/vermeer.webp" },
  { name: "Windcare", logo: "/company-logos/windcare.webp" },
  { name: "Zoho", logo: "/company-logos/zoho.webp" },
];

const placementStats = [
  { icon: TrendingUp, value: "98%", label: "Placement Rate" },
  { icon: Award, value: "₹9 LPA", label: "Average Package" },
  { icon: Award, value: "₹70 LPA", label: "Highest Package" },
  { icon: Building, value: "500+", label: "Recruiting Partners" },
];

function CompanyCard({ company }: { company: { name: string; logo: string } }) {
  return (
    <div className="border-border hover:border-accent/30 flex h-16 w-36 flex-col items-center justify-center rounded-xl border bg-white px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-md sm:h-18 sm:w-40 md:h-20 md:w-44">
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
      <span className="mt-1 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
        {company.name}
      </span>
    </div>
  );
}

export function Placements() {
  const [companies, setCompanies] = useState(STATIC_COMPANIES);

  useEffect(() => {
    fetch("/api/public/recruiters")
      .then((r) => r.json())
      .then((res) => {
        if (res.source === "db" && res.data.length > 0) {
          setCompanies(res.data.map((r: Record<string, unknown>) => ({
            name: String(r.name),
            logo: String(r.logo),
          })));
        }
      })
      .catch(() => {});
  }, []);

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
            className="text-accent mb-4 inline-block text-sm font-bold tracking-[0.2em] uppercase"
          >
            Placement Highlights
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl"
          >
            Our Recruiters{" "}
            <span className="font-normal text-stone-500 italic">
              Trust Our Graduates
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-base leading-relaxed text-stone-600 md:text-lg"
          >
            Leading organizations across IT, engineering, and consulting
            regularly recruit from JCT campuses.
          </motion.p>
        </div>
      </div>

      {/* Stats contained */}
      <div className="container mx-auto mb-14 px-4 md:mb-20 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {placementStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-border rounded-2xl border bg-white p-4 text-center shadow-sm md:p-6"
            >
              <stat.icon
                size={20}
                className="text-accent mx-auto mb-2"
                strokeWidth={1.5}
              />
              <span className="text-navy mb-1 block font-sans text-3xl font-bold md:text-4xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground font-sans text-xs font-bold tracking-wider uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Carousel full bleed */}
      <div className="relative">
        <div className="from-surface pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r to-transparent md:w-32" />
        <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l to-transparent md:w-32" />
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
