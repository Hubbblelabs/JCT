"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
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

              <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 text-center text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(212,160,36,0.3)] bg-[rgba(212,160,36,0.08)] shadow-[0_0_15px_rgba(212,160,36,0.15)]">
                    <Phone className="h-6 w-6 text-[#D4A024]" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="mb-1 font-sans text-[15px] font-semibold tracking-wide text-[#D4A024]">
                    Admissions Helpline
                  </h3>
                  
                  <a href="tel:+919361488801" className="mb-4 font-sans text-3xl font-black tracking-tight text-white transition-colors hover:text-[#D4A024]">
                    +91 93614 88801
                  </a>
                  
                  <div className="my-1 h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
                  
                  <a href="mailto:admissions@jct.edu" className="mt-4 flex items-center justify-center gap-2.5 font-sans text-[13px] font-medium text-white/80 transition-colors hover:text-white">
                    <Mail className="h-4 w-4 text-[#D4A024]" strokeWidth={2} />
                    admissions@jct.edu
                  </a>
                </div>
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
