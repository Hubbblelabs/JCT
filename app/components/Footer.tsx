"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Landmark, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-white pt-24 pb-8 border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & About */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-accent flex items-center justify-center rounded-xl">
                                <Landmark size={24} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-serif tracking-tight text-white leading-none">JCT Institutions</h2>
                                <span className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">Est. 2009</span>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Empowering the next generation of engineers and leaders through innovative education and ethical values.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-accent flex items-center justify-center text-white hover:text-primary transition-all"
                                >
                                    <Icon size={18} strokeWidth={2} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {["About Us", "Academics", "Admissions", "Research", "Campus Life", "Alumni"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                                <div className="text-sm text-white/70 leading-relaxed">
                                    <p className="font-medium text-white mb-1">JCT Institute of Technology</p>
                                    <p>Knowledge Park, Pichanur</p>
                                    <p>Coimbatore - 641105</p>
                                    <p>Tamil Nadu, India</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-accent shrink-0" />
                                <div className="text-sm text-white/70">
                                    <a href="tel:+919361488801" className="hover:text-white transition-colors">+91 93614 88801</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-accent shrink-0" />
                                <div className="text-sm text-white/70">
                                    <a href="mailto:info@jct.edu" className="hover:text-white transition-colors">info@jct.edu</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                                <div className="text-sm text-white/70">
                                    <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                                    <p>Sat: 9:00 AM - 1:00 PM</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Google Map */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent mb-6">Location</h3>
                        <div className="rounded-2xl overflow-hidden border-2 border-white/10 h-72">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3087446879744!2d77.0244!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAxJzAwLjUiTiA3N8KwMDEnMjcuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="JCT Institutions Location"
                            />
                        </div>
                        <Link
                            href="https://maps.google.com/?q=JCT+Institute+Coimbatore"
                            target="_blank"
                            className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:text-white transition-colors"
                        >
                            <MapPin size={16} />
                            Get Directions
                        </Link>
                    </div>
                </div>

                {/* Accreditation Logos Strip */}
                <div className="border-t border-white/10 pt-10 pb-6 mb-6">
                    <div className="flex flex-col items-center gap-6">
                        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40">Approved & Accredited By</span>
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                            {[
                                { name: "AICTE", sub: "Approved", color: "#FBBF24" },
                                { name: "NAAC", sub: "Accredited", color: "#34D399" },
                                { name: "Anna\nUniversity", sub: "Affiliated", color: "#60A5FA" },
                                { name: "UGC", sub: "Recognized", color: "#F87171" },
                                { name: "ISO\n9001:2015", sub: "Certified", color: "#A78BFA" },
                            ].map((acc) => (
                                <div key={acc.name} className="flex flex-col items-center gap-2 group cursor-default">
                                    <div className="w-18 h-18 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-3 group-hover:bg-white/10 group-hover:border-white/25 transition-all duration-300">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={acc.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1 opacity-80">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        <span className="text-[10px] font-black text-white/90 tracking-tight text-center leading-tight whitespace-pre-line">{acc.name}</span>
                                    </div>
                                    <span className="text-[9px] text-white/40 font-medium uppercase tracking-wider">{acc.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                    <p>
                        © {new Date().getFullYear()} JCT Institute of Technology. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
