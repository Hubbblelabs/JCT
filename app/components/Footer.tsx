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
                                <span className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">Est. 1998</span>
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
                                    <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
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
                        <div className="rounded-2xl overflow-hidden border-2 border-white/10 h-64">
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
