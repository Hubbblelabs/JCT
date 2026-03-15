"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const academicsLinks = [
  { name: "Programs", href: "#programs" },
  { name: "Admissions", href: "#admissions" },
  { name: "Faculty", href: "#faculty" },
  { name: "Research", href: "#research" },
  { name: "Campus", href: "#campus" },
];

const studentLifeLinks = [
  { name: "Housing", href: "#housing" },
  { name: "Activities", href: "#activities" },
  { name: "Athletics", href: "#athletics" },
  { name: "Support", href: "#support" },
  { name: "Connect", href: "#connect" },
];

const socialLinks = [
  { Icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icon: FaXTwitter, label: "X", href: "https://x.com" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { Icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-surface font-sans">
      {/* Main card */}
      <div className="container mx-auto px-4 py-6 sm:py-8 md:px-6">
        <div className="border-border bg-muted rounded-2xl border p-5 sm:p-7 lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Brand + Newsletter */}
            <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-7">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
                  <Image
                    src="/jct_logo_yellow.png"
                    alt="JCT"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-foreground font-serif text-xl font-bold sm:text-2xl">
                  JCT Institutions
                </span>
              </div>

              <div className="border-border/80 bg-surface rounded-xl border p-4 sm:p-5">
                <p className="text-muted-foreground mb-3 max-w-md text-sm leading-relaxed">
                  Get campus news and admission updates delivered to your inbox.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 h-10 w-full rounded-lg border bg-white px-4 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-foreground hover:bg-foreground/85 h-10 shrink-0 rounded-lg px-5 text-sm font-medium text-white transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-muted-foreground/70 mt-2 text-xs leading-relaxed">
                  We respect your privacy and only send what matters to your
                  future.
                </p>
              </div>
            </div>

            {/* Links + Social */}
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:col-span-4 lg:gap-6">
              <div>
                <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  Academics
                </h3>
                <ul className="space-y-2.5">
                  {academicsLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-gold text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  Student Life
                </h3>
                <ul className="space-y-2.5">
                  {studentLifeLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-gold text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sm:col-span-2">
                <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  Follow Us
                </h3>
                <ul className="grid grid-cols-2 gap-2.5">
                  {socialLinks.map(({ Icon, label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-border/90 bg-surface text-foreground hover:border-gold/50 hover:text-gold flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                      >
                        <span className="bg-foreground/90 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                          <Icon size={11} />
                        </span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-3">
              <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed">
                  <FaMapMarkerAlt
                    className="text-gold mt-0.5 shrink-0"
                    size={14}
                  />
                  <span>
                    JCT Institutions
                    <br />
                    Knowledge Park, Pichanur
                    <br />
                    Coimbatore - 641105, Tamil Nadu
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+919361488801"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                  >
                    <FaPhone className="text-gold shrink-0" size={13} />
                    +91 93614 88801
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@jct.ac.in"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                  >
                    <FaEnvelope className="text-gold shrink-0" size={13} />
                    info@jct.ac.in
                  </a>
                </li>
              </ul>

              {/* Compact map on small screens to prevent vertical dominance */}
              <div className="border-border overflow-hidden rounded-xl border">
                <iframe
                  src="https://www.google.com/maps?q=JCT+Institutions+Knowledge+Park+Pichanur+Coimbatore+641105&output=embed"
                  className="h-32 w-full sm:h-40"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JCT Institutions Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-4 pb-6 md:px-6">
        <div className="border-border/70 text-muted-foreground flex flex-col items-start justify-between gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} JCT. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 pr-16 sm:gap-6 md:pr-20">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
