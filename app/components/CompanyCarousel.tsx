"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ─── Company logos (recruiter partners) using reliable logo sources ─── */
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
    { name: "Nestle", logo: "/company_logo/NESN.SW_BIG.svg" },
    { name: "Unilever", logo: "/company_logo/UL_BIG.svg" },
    { name: "Samsung", logo: "/company_logo/005380.KS_BIG.svg" },
    { name: "McDonald's", logo: "/company_logo/MCD.svg" },
    { name: "Kellogg's", logo: "/company_logo/K_BIG.svg" },
    { name: "Cloudflare", logo: "/company_logo/NET_BIG.svg" },
];

function CompanyCard({ company }: { company: { name: string; logo: string } }) {
    return (
        <div className="w-36 h-16 sm:w-44 sm:h-18 md:w-48 md:h-20 2xl:w-56 2xl:h-24 bg-white rounded-xl sm:rounded-2xl border border-stone-100 flex flex-col items-center justify-center px-3 sm:px-5 py-2 sm:py-3 hover:border-accent/30 hover:shadow-lg transition-all duration-300 hover:scale-105 relative">
            <div className="relative w-full h-8 sm:h-10">
                <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    sizes="(max-width: 640px) 144px, 200px"
                    className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
            </div>
            <span className="mt-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider leading-none">
                {company.name}
            </span>
        </div>
    );
}

export function CompanyCarousel() {
    return (
        <section className="py-12 md:py-16 3xl:py-20 bg-stone-50 border-y border-stone-100 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 3xl:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-4">
                        Our Recruiting Partners
                    </h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-serif text-primary leading-tight mb-3">
                        Top Companies{" "}
                        <span className="text-stone-500 italic font-light">Trust Our Graduates</span>
                    </h3>
                    <p className="text-stone-500 text-sm font-light max-w-xl mx-auto">
                        Leading organizations across IT, engineering, and consulting regularly recruit from JCT campuses.
                    </p>
                </motion.div>
            </div>

            {/* Infinite Scrolling Carousel */}
            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

                {/* Track Row 1 - Left to Right */}
                <div className="mb-4">
                    <div className="flex animate-scroll-left gap-4">
                        {[...companies, ...companies].map((company, index) => (
                            <div key={`row1-${index}`} className="shrink-0">
                                <CompanyCard company={company} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Track Row 2 - Right to Left */}
                <div>
                    <div className="flex animate-scroll-right gap-4">
                        {[...companies.slice().reverse(), ...companies.slice().reverse()].map((company, index) => (
                            <div key={`row2-${index}`} className="shrink-0">
                                <CompanyCard company={company} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats bar at the bottom */}
            <div className="container mx-auto px-4 md:px-6 3xl:px-8 mt-10 md:mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16"
                >
                    {[
                        { value: "500+", label: "Recruiting Partners" },
                        { value: "96%", label: "Placement Rate" },
                        { value: "₹8.5 LPA", label: "Avg. Package" },
                        { value: "₹24 LPA", label: "Highest Package" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <span className="block text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-sans font-black text-primary tracking-tight">
                                {stat.value}
                            </span>
                            <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
