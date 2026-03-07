"use client";

import Image from "next/image";

const logos = [
  { src: "/aicte.png", name: "AICTE Approved" },
  { src: "/anna.png", name: "Anna University" },
  { src: "/naac.png", name: "NAAC Accredited" },
  { src: "/nba.png", name: "NBA Accredited" },
  { src: "/iso.png", name: "ISO 9001:2015" },
  { src: "/ugc.png", name: "UGC Recognized" },
  { src: "/dote.png", name: "DOTE Approved" },
  { src: "/bharathiar_university.png", name: "Bharathiar University" },
];

export function Accreditations() {
  const doubled = [...logos, ...logos];
  return (
    <section className="py-5 md:py-6 bg-white border-b border-border overflow-hidden relative">
      {/* Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee gap-10 md:gap-16 items-center">
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex items-center gap-2.5 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="text-[11px] md:text-xs font-sans font-semibold text-muted-foreground whitespace-nowrap tracking-wide uppercase">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
