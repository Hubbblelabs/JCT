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
    <section className="border-border relative overflow-hidden border-b bg-white py-5 md:py-6">
      {/* Fade Edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-24" />

      <div className="flex animate-[marquee_20s_linear_infinite] items-center gap-10 md:animate-[marquee_35s_linear_infinite] md:gap-16">
        {doubled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 opacity-40 transition-opacity duration-300 hover:opacity-100"
          >
            <div className="relative h-8 w-8 shrink-0 md:h-10 md:w-10">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="text-muted-foreground hidden font-sans text-xs font-semibold tracking-wide whitespace-nowrap uppercase md:inline-block">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
