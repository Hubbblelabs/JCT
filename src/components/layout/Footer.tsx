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

const socialLinks = [
  { Icon: FaFacebookF, label: "Facebook", href: siteConfig.social.facebook },
  { Icon: FaInstagram, label: "Instagram", href: siteConfig.social.instagram },
  { Icon: FaXTwitter, label: "X", href: siteConfig.social.twitter },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: siteConfig.social.linkedin },
  { Icon: FaYoutube, label: "YouTube", href: siteConfig.social.youtube },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#f4efe6] font-sans">
      <div className="container mx-auto px-4 py-6 md:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8 lg:divide-x-2 lg:divide-dotted lg:divide-gray-300">
          {/* Column 1: Brand & Helpline */}
          <div className="flex h-full flex-col gap-5 lg:pr-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT"
                  fill
                  sizes="(min-width: 640px) 48px, 40px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-xl font-bold text-[#1e1e1e] sm:text-2xl">
                JCT Institutions
              </span>
            </div>

            {/* Helpline Card Wrapper for Glow */}
            <div className="relative flex min-h-55 w-full flex-1 flex-col">
              {/* Soft external radial glow behind the card */}
              <div className="pointer-events-none absolute inset-0 scale-105 rounded-full bg-[#D4A024]/20 blur-[80px]" />

              {/* Helpline Card */}
              <div className="relative z-10 flex h-full w-full flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-center text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,160,36,0.3)] bg-[rgba(212,160,36,0.08)] shadow-[0_0_20px_rgba(212,160,36,0.15)]">
                    <Phone
                      className="h-5 w-5 text-[#D4A024]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="mb-1 font-sans text-sm font-semibold tracking-wide text-[#D4A024]">
                    Admissions Helpline
                  </h3>

                  <a
                    href="tel:+919361488801"
                    className="mb-3 font-sans text-2xl font-black tracking-tight text-white transition-colors hover:text-[#D4A024] xl:text-3xl"
                  >
                    +91 93614 88801
                  </a>

                  <div className="my-1.5 h-px w-full max-w-50 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                  <a
                    href="mailto:admissions@jct.ac.in"
                    className="mt-3 flex items-center justify-center gap-2 font-sans text-xs font-medium text-white/80 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-[#D4A024]" strokeWidth={2} />
                    admissions@jct.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Us Details & Navigation */}
          <div className="flex h-full flex-col gap-4 lg:px-6">
            <div className="flex h-10 items-center">
              <h3 className="mb-0 text-sm font-bold tracking-widest text-[#1a1a1a] uppercase">
                Contact Us
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[14px] leading-relaxed text-gray-700">
                <div className="mt-1 flex text-[#D4A024]">
                  <FaMapMarkerAlt size={16} />
                </div>
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
                  className="flex items-center gap-3 text-[14px] text-gray-700 transition-colors hover:text-[#D4A024]"
                >
                  <div className="flex text-[#D4A024]">
                    <FaPhone size={14} />
                  </div>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-[14px] text-gray-700 transition-colors hover:text-[#D4A024]"
                >
                  <div className="flex text-[#D4A024]">
                    <FaEnvelope size={14} />
                  </div>
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            {/* Social Links inside left contact area */}
            <div className="mt-2">
              <h3 className="mb-3 text-xs font-bold tracking-widest text-[#1a1a1a] uppercase">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#D4A024] hover:text-white hover:shadow-[0_8px_15px_rgba(212,160,36,0.3)]"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Map Column */}
          <div className="flex h-full flex-col gap-4 lg:pl-6">
            <div className="flex h-10 items-center">
              <h3 className="mb-0 text-sm font-bold tracking-widest text-[#1a1a1a] uppercase">
                Location Map
              </h3>
            </div>
            <div className="relative h-62.5 min-h-55 w-full overflow-hidden rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:h-auto lg:flex-1">
              {/* Subtle map glow */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-white/10 mix-blend-overlay"></div>
              <iframe
                src={siteConfig.address.mapEmbedUrl}
                className="absolute inset-0 h-full w-full transition-transform duration-700 hover:scale-105"
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
      {/* Bottom bar */}
      <div className="border-t border-[#e2d8c9] bg-[#ebe4d8] px-4 pt-6 pb-32 md:px-8 md:pt-8 md:pb-30 lg:pb-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 text-center text-[13px] text-gray-600 sm:flex-row lg:pr-80">
          <p className="w-full font-medium sm:w-auto">
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
          <div className="flex w-full flex-col flex-wrap items-center justify-center gap-3 font-medium sm:w-auto sm:flex-row sm:gap-6">
            <Link
              href="/mandatory-disclosure/privacy"
              className="transition-colors hover:text-[#D4A024]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/mandatory-disclosure/terms"
              className="transition-colors hover:text-[#D4A024]"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-[#D4A024]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
