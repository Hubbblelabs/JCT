"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Building } from "lucide-react";

const companies = [
    "Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Accenture", "IBM", "Zoho",
    "Meta", "Apple", "Oracle", "Cisco", "Intel", "Adobe", "Salesforce"
];

export function Placements() {
    return (
        <section id="placements" className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-16 mb-20">
                    {/* Header & Context */}
                    <div className="lg:w-1/3">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Career Impact</h2>
                        <h3 className="text-3xl md:text-4xl font-serif text-primary mb-6 leading-tight">
                            Launching <span className="italic text-gray-400 font-light">Global Careers</span>
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                            Our placement cell bridges the gap between strong academic foundations and industry requirements, ensuring every student finds their place in the world.
                        </p>
                        <button className="text-primary font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all group">
                            Download Placement Report <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Report Style Stats */}
                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start pt-4">
                        <StatBox
                            value="96%"
                            label="Placement Rate"
                            description="Consistently maintaining high placement records."
                            icon={TrendingUp}
                        />
                        <StatBox
                            value="42 LPA"
                            label="Highest Package"
                            description="Secured by CSE student at Top Tier Tech Firm."
                            icon={Building}
                        />
                        <StatBox
                            value="500+"
                            label="Recruiters"
                            description="Diverse opportunities across IT, Core, and Management."
                            icon={Users}
                        />
                    </div>
                </div>

                {/* Marquee */}
                <div className="relative border-y border-gray-100 py-12 bg-gray-50/30">
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />

                    <div className="flex overflow-hidden group">
                        <motion.div
                            className="flex gap-20 items-center whitespace-nowrap"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            {[...companies, ...companies].map((company, idx) => (
                                <span key={idx} className="text-2xl md:text-3xl font-serif font-bold text-gray-300 group-hover:text-gray-400 transition-colors cursor-default select-none">
                                    {company}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatBox({ value, label, description, icon: Icon }: { value: string, label: string, description: string, icon: any }) {
    return (
        <div className="p-6 bg-gray-50 rounded-sm border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight">{value}</div>
                <Icon className="text-gray-300" size={24} strokeWidth={1.5} />
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{label}</div>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{description}</p>
        </div>
    )
}
