"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
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

const legalLinks = [
  { name: "Privacy Policy", href: "/mandatory-disclosure/privacy" },
  { name: "Terms of Service", href: "/mandatory-disclosure/terms" },
  { name: "Contact Support", href: "/contact" },
];

export function Footer() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isEngineering = pathname.startsWith("/institutions/engineering");
  const isArts = pathname.startsWith("/institutions/arts-science");
  const isPolytechnic = pathname.startsWith("/institutions/polytechnic");

  const footerTheme = isHome
    ? {
        bg: "#081322",
        surface: "#0d1a2d",
        heading: "#f8fafc",
        text: "#d9e1ec",
        muted: "#9aa8bb",
        accent: "#d4a024",
        border: "rgba(212,160,36,0.28)",
      }
    : isEngineering
      ? {
          bg: "#081322",
          surface: "#0e1b2f",
          heading: "#f8fafc",
          text: "#dbe4f0",
          muted: "#a4b3c8",
          accent: "#d4a024",
          border: "rgba(212,160,36,0.28)",
        }
      : isArts
        ? {
            bg: "#171b22",
            surface: "#20252e",
            heading: "#fff7ed",
            text: "#eadbd0",
            muted: "#c7b6aa",
            accent: "#f97316",
            border: "rgba(249,115,22,0.28)",
          }
        : isPolytechnic
          ? {
              bg: "#2d313a",
              surface: "#343945",
              heading: "#f8fafc",
              text: "#dde4ee",
              muted: "#aeb8c7",
              accent: "#f4c430",
              border: "rgba(244,196,48,0.3)",
            }
          : {
              bg: "#101827",
              surface: "#162033",
              heading: "#f8fafc",
              text: "#d8dee8",
              muted: "#a1aabb",
              accent: "#d4a024",
              border: "rgba(212,160,36,0.28)",
            };

  const footerVars = {
    "--footer-bg": footerTheme.bg,
    "--footer-surface": footerTheme.surface,
    "--footer-heading": footerTheme.heading,
    "--footer-text": footerTheme.text,
    "--footer-muted": footerTheme.muted,
    "--footer-accent": footerTheme.accent,
    "--footer-border": footerTheme.border,
  } as CSSProperties;

  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  return (
    <footer
      id="contact"
      className="bg-(--footer-bg) font-sans text-(--footer-text)"
      style={footerVars}
    >
      <div className="container mx-auto px-4 py-8 md:px-8 lg:py-7">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr_1fr] lg:gap-0 lg:divide-x lg:divide-dotted lg:divide-(--footer-border)">
          <div className="flex flex-col gap-4 mlg:pr-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative h-7 w-6 shrink-0 mt-2">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT"
                  fill
                  sizes="64px"
                  className="object-contain object-left"
                />
              </span>
              <span className="font-serif text-2xl font-bold text-(--footer-heading) sm:text-3xl">
                JCT Institutions
              </span>
            </Link>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
              <div className="flex min-h-56 flex-1 flex-col items-center justify-center rounded-lg bg-(--footer-surface) px-6 py-7 text-center shadow-[0_18px_42px_-28px_rgba(0,0,0,0.8)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-(--footer-accent)/35 text-(--footer-accent)">
                  <Phone className="h-5 w-5" strokeWidth={1.7} />
                </div>

                <p className="text-sm font-bold tracking-wide text-(--footer-accent)">
                  Admissions Helpline
                </p>
                <a
                  href={phoneHref}
                  className="mt-2 text-3xl font-black tracking-tight text-white transition-colors hover:text-(--footer-accent) sm:text-4xl"
                >
                  {siteConfig.contact.phone}
                </a>

                <a
                  href={`mailto:${siteConfig.contact.admissionsEmail}`}
                  className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-(--footer-text) transition-colors hover:text-(--footer-accent)"
                >
                  <Mail className="h-4 w-4 text-(--footer-accent)" />
                  {siteConfig.contact.admissionsEmail}
                </a>
              </div>
            </div>

            <p className="text-sm leading-6 text-(--footer-muted)">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>

          <div className="lg:px-14">
            <h2 className="text-sm font-extrabold tracking-wide text-(--footer-heading) uppercase">
              Contact Us
            </h2>

            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-4 text-[15px] leading-7 text-(--footer-text)">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-(--footer-accent)" />
                <p>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                  <br />
                  {siteConfig.address.city} - {siteConfig.address.pincode},{" "}
                  {siteConfig.address.state}
                </p>
              </div>

              <a
                href={phoneHref}
                className="flex items-center gap-4 text-[15px] text-(--footer-text) transition-colors hover:text-(--footer-accent)"
              >
                <Phone className="h-4 w-4 text-(--footer-accent)" />
                {siteConfig.contact.phone}
              </a>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-4 text-[15px] text-(--footer-text) transition-colors hover:text-(--footer-accent)"
              >
                <Mail className="h-4 w-4 text-(--footer-accent)" />
                {siteConfig.contact.email}
              </a>
            </div>

            <div className="mt-7">
              <h3 className="text-xs font-extrabold tracking-wide text-(--footer-heading) uppercase">
                Connect With Us
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 transition-colors hover:bg-(--footer-accent) hover:text-(--footer-bg)"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:pl-14">
            <h2 className="text-sm font-extrabold tracking-wide text-(--footer-heading) uppercase">
              Location Map
            </h2>

            <div className="mt-7 overflow-hidden rounded-lg bg-(--footer-surface) shadow-[0_18px_42px_-28px_rgba(0,0,0,0.8)]">
              <iframe
                src={siteConfig.address.mapEmbedUrl}
                className="h-56 w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JCT Institutions Location"
              />
            </div>

            <nav
              aria-label="Footer legal links"
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-(--footer-muted)"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="transition-colors hover:text-(--footer-accent)"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
