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
          <div className="flex flex-col gap-5 lg:pr-4 h-full">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[#1e1e1e] font-serif text-xl font-bold sm:text-2xl">
                JCT Institutions
              </span>
            </div>

            {/* Helpline Card Wrapper for Glow */}
            <div className="relative flex-1 flex flex-col w-full min-h-[220px]">
              {/* Soft external radial glow behind the card */}
              <div className="absolute inset-0 bg-[#D4A024]/20 blur-[80px] rounded-full scale-105 pointer-events-none" />
              
              {/* Helpline Card */}
              <div className="relative z-10 flex-1 flex flex-col justify-center overflow-hidden rounded-[1.5rem] bg-[#0F172A] p-6 text-center text-white shadow-2xl w-full h-full">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-[#D4A024]/10 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,160,36,0.3)] bg-[rgba(212,160,36,0.08)] shadow-[0_0_20px_rgba(212,160,36,0.15)]">
                  <Phone className="h-5 w-5 text-[#D4A024]" strokeWidth={1.5} />
                </div>
                
                <h3 className="mb-1 font-sans text-sm font-semibold tracking-wide text-[#D4A024]">
                  Admissions Helpline
                </h3>
                
                <a href="tel:+919361488801" className="mb-3 font-sans text-2xl xl:text-3xl font-black tracking-tight text-white transition-colors hover:text-[#D4A024]">
                  +91 93614 88801
                </a>
                
                <div className="my-1.5 h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <a href="mailto:admissions@jct.edu" className="mt-3 flex items-center justify-center gap-2 font-sans text-xs font-medium text-white/80 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 text-[#D4A024]" strokeWidth={2} />
                  admissions@jct.edu
                </a>
              </div>
            </div>
            </div>
          </div> 

          {/* Column 2: Contact Us Details & Navigation */}
          <div className="flex flex-col gap-4 lg:px-6 h-full">
            <div className="flex items-center h-10">
              <h3 className="text-[#1a1a1a] text-sm font-bold tracking-widest uppercase mb-0">
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
                  {siteConfig.address.city} - {siteConfig.address.pincode}, {siteConfig.address.state}
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
              <h3 className="text-[#1a1a1a] mb-3 text-xs font-bold tracking-widest uppercase">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-gray-600 hover:bg-[#D4A024] hover:text-white flex h-9 w-9 items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(212,160,36,0.3)]"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Map Column */}
          <div className="flex flex-col gap-4 lg:pl-6 h-full">
            <div className="flex items-center h-10">
              <h3 className="text-[#1a1a1a] text-sm font-bold tracking-widest uppercase mb-0">
                Location Map
              </h3>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full relative h-[250px] lg:h-auto lg:flex-1 min-h-[220px]">
              {/* Subtle map glow */}
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none z-10"></div>
              <iframe
                src={siteConfig.address.mapEmbedUrl}
                className="h-full w-full transition-transform duration-700 hover:scale-105 absolute inset-0"
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
      <div className="bg-[#ebe4d8] px-4 py-6 md:px-8 border-t border-[#e2d8c9]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-[13px] text-gray-600 sm:flex-row">
          <p className="font-medium">
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <Link href="/mandatory-disclosure/privacy" className="hover:text-[#D4A024] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/mandatory-disclosure/terms" className="hover:text-[#D4A024] transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#D4A024] transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
