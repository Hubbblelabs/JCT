"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ─── Company logos (recruiter partners) using reliable logo sources ─── */
const companies = [
    { name: "TCS", logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png?t=1720244494" },
    { name: "Infosys", logo: "https://companieslogo.com/img/orig/INFY-79e7e11b.png?t=1720244492" },
    { name: "Wipro", logo: "https://companieslogo.com/img/orig/WIT-7d45dbe7.png?t=1720244499" },
    { name: "Cognizant", logo: "https://companieslogo.com/img/orig/CTSH-82cdde2c.png?t=1720244490" },
    { name: "HCL Tech", logo: "https://companieslogo.com/img/orig/HCLTECH.NS-bb3b4cf5.png?t=1720244491" },
    { name: "Zoho", logo: "https://companieslogo.com/img/orig/zoho-a5765a74.png?t=1720244499" },
    { name: "Capgemini", logo: "https://companieslogo.com/img/orig/CAP.PA-9b4110b5.png?t=1720244490" },
    { name: "Accenture", logo: "https://companieslogo.com/img/orig/ACN-b6241e56.png?t=1720244488" },
    { name: "LTIMindtree", logo: "https://companieslogo.com/img/orig/LTIM.NS-48734cf0.png?t=1720244493" },
    { name: "Tech Mahindra", logo: "https://companieslogo.com/img/orig/TECHM.NS-e91a528a.png?t=1720244494" },
    { name: "Amazon", logo: "https://companieslogo.com/img/orig/AMZN-e9f942e4.png?t=1632523695" },
    { name: "Freshworks", logo: "https://companieslogo.com/img/orig/FRSH-510c3e67.png?t=1720244491" },
    { name: "Mphasis", logo: "https://companieslogo.com/img/orig/MPHASIS.NS-e2fdfca5.png?t=1720244493" },
    { name: "Hexaware", logo: "https://companieslogo.com/img/orig/HEXAWARE.NS-f20d27c6.png?t=1720244491" },
];

function CompanyCard({ company }: { company: { name: string; logo: string } }) {
    return (
        <div className="w-48 h-20 bg-white rounded-2xl border border-stone-100 flex flex-col items-center justify-center px-5 py-3 hover:border-accent/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <img
                src={company.logo}
                alt={company.name}
                className="max-w-[100px] max-h-[32px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            <span className="mt-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">
                {company.name}
            </span>
        </div>
    );
}

export function CompanyCarousel() {
    return (
        <section className="py-16 bg-stone-50 border-y border-stone-100 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">
                        Our Recruiting Partners
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-serif text-primary leading-tight mb-3">
                        Top Companies{" "}
                        <span className="text-stone-400 italic font-light">Trust Our Graduates</span>
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
            <div className="container mx-auto px-4 md:px-6 mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-8 md:gap-16"
                >
                    {[
                        { value: "500+", label: "Recruiting Partners" },
                        { value: "96%", label: "Placement Rate" },
                        { value: "₹8.5 LPA", label: "Avg. Package" },
                        { value: "₹24 LPA", label: "Highest Package" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <span className="block text-2xl md:text-3xl font-sans font-black text-primary tracking-tight">
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
