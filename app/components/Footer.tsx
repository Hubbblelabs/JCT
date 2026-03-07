"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const quickLinks = [
  { name: "About Us", href: "#about" },
  { name: "Programs", href: "#programs" },
  { name: "Admissions", href: "#admissions" },
  { name: "Placements", href: "#placements" },
  { name: "Campus Life", href: "#campus-life" },
  { name: "Contact", href: "#contact" },
];

const institutionLinks = [
  { name: "Engineering & Technology", href: "/institutions/engineering" },
  { name: "Arts & Science", href: "/institutions/arts-science" },
  { name: "Polytechnic", href: "/institutions/polytechnic" },
];

const socialLinks = [
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
  { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-navy text-white">
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 max-w-5xl mx-auto">
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-white mb-1">
                Stay Connected
              </h3>
              <p className="text-sm text-white/50 font-sans">
                Get updates on admissions, events, and campus news.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-3 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-72 h-12 px-5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-sans placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-gold text-navy font-sans font-bold rounded-xl hover:bg-gold-light transition-colors text-sm shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-14 md:pt-16 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-11 h-11">
                <Image
                  src="/jct_logo.png"
                  alt="JCT"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight text-white leading-none">
                  JCT Institutions
                </h2>
                <span className="text-[10px] text-white/40 font-sans font-medium tracking-[0.2em] uppercase">
                  Est. 2009
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm font-sans leading-relaxed mb-6">
              Empowering the next generation of engineers, scientists, and
              leaders through innovative education in Coimbatore, Tamil Nadu.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gold flex items-center justify-center text-white/60 hover:text-navy transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white inline-flex items-center gap-1 text-sm font-sans transition-all hover:gap-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Our Institutions
            </h3>
            <ul className="space-y-3">
              {institutionLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white inline-flex items-center gap-1 text-sm font-sans transition-all hover:gap-2"
                  >
                    {item.name}{" "}
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-gold mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <div className="text-sm text-white/50 font-sans leading-relaxed">
                  <p className="font-medium text-white/70 mb-0.5">
                    JCT Institutions
                  </p>
                  <p>Knowledge Park, Pichanur</p>
                  <p>Coimbatore - 641105, Tamil Nadu</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold shrink-0" />
                <a
                  href="tel:+919361488801"
                  className="text-sm text-white/50 hover:text-white transition-colors font-sans"
                >
                  +91 93614 88801
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold shrink-0" />
                <a
                  href="mailto:info@jct.edu"
                  className="text-sm text-white/50 hover:text-white transition-colors font-sans"
                >
                  info@jct.edu
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-gold shrink-0 mt-0.5" />
                <div className="text-sm text-white/50 font-sans">
                  <p>Mon – Fri: 9 AM – 5 PM</p>
                  <p>Sat: 9 AM – 1 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/5 h-36 md:h-56 mb-10">
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

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 font-sans">
          <p>
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
