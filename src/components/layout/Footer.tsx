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
  { name: "Engineering & Technology", href: "/engineering" },
  { name: "Arts & Science", href: "/arts-science" },
  { name: "Polytechnic", href: "/polytechnic" },
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
        <div className="container mx-auto px-4 py-10 md:px-6 md:py-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="mb-1 font-serif text-lg font-bold text-white md:text-xl">
                Stay Connected
              </h3>
              <p className="font-sans text-sm text-white/50">
                Get updates on admissions, events, and campus news.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full gap-3 md:w-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-gold/40 h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-5 font-sans text-sm text-white transition-colors placeholder:text-white/30 focus:outline-none md:w-72"
              />
              <button
                type="submit"
                className="bg-gold text-navy hover:bg-gold-light h-12 shrink-0 rounded-xl px-6 font-sans text-sm font-bold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-14 pb-6 md:px-6 md:pt-16">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-11 w-11">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="font-serif text-xl leading-none font-bold tracking-tight text-white">
                  JCT Institutions
                </h2>
                <span className="font-sans text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
                  Est. 2009
                </span>
              </div>
            </div>
            <p className="mb-6 font-sans text-sm leading-relaxed text-white/50">
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
                  className="hover:bg-gold hover:text-navy flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gold mb-6 font-sans text-xs font-bold tracking-[0.2em] uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 font-sans text-sm text-white/50 transition-all hover:gap-2 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold mb-6 font-sans text-xs font-bold tracking-[0.2em] uppercase">
              Our Institutions
            </h3>
            <ul className="space-y-3">
              {institutionLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 font-sans text-sm text-white/50 transition-all hover:gap-2 hover:text-white"
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
            <h3 className="text-gold mb-6 font-sans text-xs font-bold tracking-[0.2em] uppercase">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <div className="font-sans text-sm leading-relaxed text-white/50">
                  <p className="mb-0.5 font-medium text-white/70">
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
                  className="font-sans text-sm text-white/50 transition-colors hover:text-white"
                >
                  +91 93614 88801
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold shrink-0" />
                <a
                  href="mailto:info@jct.edu"
                  className="font-sans text-sm text-white/50 transition-colors hover:text-white"
                >
                  info@jct.edu
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                <div className="font-sans text-sm text-white/50">
                  <p>Mon – Fri: 9 AM – 5 PM</p>
                  <p>Sat: 9 AM – 1 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-10 h-36 overflow-hidden rounded-2xl border border-white/5 md:h-56">
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 font-sans text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="transition-colors hover:text-white"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
