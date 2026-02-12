"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const accreditations = [
    { name: "AICTE Approved", logo: "/aicte.png" },
    { name: "Anna University Affiliated", logo: "/anna.png" },
    { name: "NAAC Accredited", logo: "/naac.png" },
    { name: "NBA Accredited", logo: "/nba.png" },
    { name: "ISO Certified", logo: "/iso.png" },
    { name: "UGC Recognized", logo: "/ugc.png" },
];

export function Accreditations() {
    return (
        <section className="bg-white py-8 border-b border-stone-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-1">
                            Recognized & Accredited By
                        </h3>
                        <p className="text-stone-400 text-xs max-w-xs">
                            Upholding the highest standards of education and infrastructure.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 items-center grayscale hover:grayscale-0 transition-all duration-300">
                        {accreditations.map((item) => (
                            <div key={item.name} className="relative group">
                                <div className="relative h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                                    {item.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
