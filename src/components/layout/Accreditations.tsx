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
  const doubled = [...logos, ...logos, ...logos];
  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-white py-5 shadow-inner md:py-6">
      {/* Fade Edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-12 bg-linear-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-12 bg-linear-to-l from-white to-transparent md:w-24" />

      <div className="flex animate-[marquee_12s_linear_infinite] items-center gap-12 md:animate-[marquee_20s_linear_infinite] md:gap-16">
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex shrink-0 items-center gap-1.5 opacity-70 transition-opacity duration-300 hover:opacity-100 md:gap-2"
            title={logo.name}
          >
            <div className="relative h-10 w-24 shrink-0 md:h-12 md:w-28">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 96px, 112px"
              />
            </div>
            <span className="pr-2 font-sans text-[10px] font-bold tracking-widest whitespace-nowrap text-[#64748b] uppercase md:text-[11px]">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
