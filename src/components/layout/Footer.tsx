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
import { siteConfig } from "@/data/site";

const quickLinks = [
  { name: "About JCT", href: "/about" },
  { name: "Admissions", href: "/admissions" },
  { name: "Programs", href: "/academics/programs" },
  { name: "Placements", href: "/placements" },
  { name: "Campus Life", href: "/campus-life" },
  { name: "Contact", href: "/contact" },
];

const governanceLinks = [
  { name: "Anti-Ragging Cell", href: "/governance/anti-ragging" },
  { name: "Grievance Redressal", href: "/governance/grievance" },
  { name: "Women Empowerment", href: "/governance/women-empowerment" },
  { name: "IQAC", href: "/quality/iqac" },
  { name: "ICC", href: "/governance/icc" },
  { name: "SC/ST Cell", href: "/governance/sc-st-cell" },
];

const disclosureLinks = [
  { name: "Code of Conduct", href: "/mandatory-disclosure/code-of-conduct" },
  { name: "Privacy Policy", href: "/mandatory-disclosure/privacy" },
  { name: "Terms & Conditions", href: "/mandatory-disclosure/terms" },
  { name: "Disclaimer", href: "/mandatory-disclosure/disclaimer" },
];

const socialLinks = [
  { Icon: FaFacebookF, label: "Facebook", href: siteConfig.social.facebook },
  { Icon: FaInstagram, label: "Instagram", href: siteConfig.social.instagram },
  { Icon: FaXTwitter, label: "X", href: siteConfig.social.twitter },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: siteConfig.social.linkedin },
  { Icon: FaYoutube, label: "YouTube", href: siteConfig.social.youtube },
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
            <div className="flex flex-col gap-6 lg:col-span-4 lg:gap-7">
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
              </div>

              {/* Accreditation logos */}
              <div>
                <h3 className="text-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                  Accreditations
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {siteConfig.accreditations.slice(0, 6).map((acc) => (
                    <div
                      key={acc.name}
                      className="border-border/80 bg-surface relative h-10 w-10 overflow-hidden rounded-lg border p-1"
                      title={acc.description}
                    >
                      <Image
                        src={acc.logo}
                        alt={acc.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Links columns */}
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 lg:col-span-5 lg:gap-6">
              <div>
                <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  Quick Links
                </h3>
                <ul className="space-y-2.5">
                  {quickLinks.map((item) => (
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
                  Governance
                </h3>
                <ul className="space-y-2.5">
                  {governanceLinks.map((item) => (
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
                  Disclosure
                </h3>
                <ul className="space-y-2.5">
                  {disclosureLinks.map((item) => (
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

                <h3 className="text-foreground mt-6 mb-3 text-sm font-semibold tracking-wide uppercase">
                  Follow Us
                </h3>
                <div className="flex gap-2">
                  {socialLinks.map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border/90 bg-surface text-foreground hover:border-gold/50 hover:text-gold flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
                      aria-label={label}
                    >
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
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
                    {siteConfig.address.line1}
                    <br />
                    {siteConfig.address.line2}
                    <br />
                    {siteConfig.address.city} - {siteConfig.address.pincode},{" "}
                    {siteConfig.address.state}
                  </span>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                  >
                    <FaPhone className="text-gold shrink-0" size={13} />
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                  >
                    <FaEnvelope className="text-gold shrink-0" size={13} />
                    {siteConfig.contact.email}
                  </a>
                </li>
              </ul>

              <div className="border-border overflow-hidden rounded-xl border">
                <iframe
                  src={siteConfig.address.mapEmbedUrl}
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
          <p>
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 pr-16 sm:gap-6 md:pr-20">
            <Link
              href="/mandatory-disclosure/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/mandatory-disclosure/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of service
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
