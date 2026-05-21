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
import { useSiteConfig } from "@/lib/use-site-config";

type FooterConfig = {
  helplineLabel?: string;
  phone?: string;
  admissionsEmail?: string;
  email?: string;
  addressLines?: string[];
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
};

const SOCIAL_DEFS = [
  { key: "facebook", Icon: FaFacebookF, label: "Facebook" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram" },
  { key: "twitter", Icon: FaXTwitter, label: "X" },
  { key: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "youtube", Icon: FaYoutube, label: "YouTube" },
] as const;

// Fixed footer chrome — not part of the editable Footer CMS.
const LEGAL_LINKS = [
  { name: "Privacy Policy", href: "/mandatory-disclosure/privacy" },
  { name: "Terms of Service", href: "/mandatory-disclosure/terms" },
  { name: "Contact Support", href: "/contact" },
];

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=JCT+Institutions+Knowledge+Park+Pichanur+Coimbatore+641105&output=embed";

export function Footer() {
  const pathname = usePathname();
  const { data: footer } = useSiteConfig<FooterConfig>("footer");

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
            accent: "var(--color-arts-science-accent)",
            border:
              "color-mix(in srgb, var(--color-arts-science-accent) 28%, transparent)",
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

  const addressLines = Array.isArray(footer?.addressLines)
    ? footer.addressLines.filter((l) => l.trim().length > 0)
    : [];
  const socials = SOCIAL_DEFS.map((d) => ({
    Icon: d.Icon,
    label: d.label,
    href: footer?.[d.key] ?? "",
  })).filter((s) => s.href);
  const phoneHref = footer?.phone
    ? `tel:${footer.phone.replace(/\s/g, "")}`
    : "";

  return (
    <footer
      id="contact"
      className="bg-(--footer-bg) font-sans text-(--footer-text)"
      style={footerVars}
    >
      <div className="container mx-auto px-4 pt-8 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] md:px-8 md:pb-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:py-7 lg:pb-[calc(env(safe-area-inset-bottom)+4.25rem)]">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr_1fr] lg:gap-0 lg:divide-x lg:divide-dotted lg:divide-(--footer-border)">
          <div className="flex flex-col gap-5 lg:pr-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative mt-2 h-7 w-6 shrink-0">
                <Image
                  src="/logo/jct_logo.webp"
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

            {(footer?.phone || footer?.admissionsEmail) && (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
                <div className="flex min-h-56 flex-1 flex-col items-center justify-center rounded-lg bg-(--footer-surface) px-6 py-7 text-center shadow-[0_18px_42px_-28px_rgba(0,0,0,0.8)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-(--footer-accent)/35 text-(--footer-accent)">
                    <Phone className="h-5 w-5" strokeWidth={1.7} />
                  </div>

                  <p className="text-sm font-bold tracking-wide text-(--footer-accent)">
                    {footer?.helplineLabel || "Admissions Helpline"}
                  </p>
                  {footer?.phone && (
                    <a
                      href={phoneHref}
                      className="mt-2 text-3xl font-black tracking-tight text-white transition-colors hover:text-(--footer-accent) sm:text-4xl"
                    >
                      {footer.phone}
                    </a>
                  )}

                  {footer?.admissionsEmail && (
                    <a
                      href={`mailto:${footer.admissionsEmail}`}
                      className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-(--footer-text) transition-colors hover:text-(--footer-accent)"
                    >
                      <Mail className="h-4 w-4 text-(--footer-accent)" />
                      {footer.admissionsEmail}
                    </a>
                  )}
                </div>
              </div>
            )}

            <p className="hidden text-sm leading-6 text-(--footer-muted) lg:block">
              © {new Date().getFullYear()} JCT Institutions. All rights
              reserved.
            </p>
          </div>

          <div className="lg:px-14">
            <h2 className="text-sm font-extrabold tracking-wide text-(--footer-heading) uppercase">
              Contact Us
            </h2>

            <div className="mt-7 space-y-5">
              {addressLines.length > 0 && (
                <div className="flex items-start gap-4 text-[15px] leading-7 text-(--footer-text)">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-(--footer-accent)" />
                  <p>
                    {addressLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < addressLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {footer?.phone && (
                <a
                  href={phoneHref}
                  className="flex items-center gap-4 text-[15px] text-(--footer-text) transition-colors hover:text-(--footer-accent)"
                >
                  <Phone className="h-4 w-4 text-(--footer-accent)" />
                  {footer.phone}
                </a>
              )}

              {footer?.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="flex items-center gap-4 text-[15px] text-(--footer-text) transition-colors hover:text-(--footer-accent)"
                >
                  <Mail className="h-4 w-4 text-(--footer-accent)" />
                  {footer.email}
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-7">
                <h3 className="text-xs font-extrabold tracking-wide text-(--footer-heading) uppercase">
                  Connect With Us
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {socials.map(({ Icon, label, href }) => (
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
            )}
          </div>

          <div className="lg:pl-14">
            <h2 className="text-sm font-extrabold tracking-wide text-(--footer-heading) uppercase">
              Location Map
            </h2>

            <div className="mt-7 overflow-hidden rounded-lg bg-(--footer-surface) shadow-[0_18px_42px_-28px_rgba(0,0,0,0.8)]">
              <iframe
                src={MAP_EMBED_URL}
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
              {LEGAL_LINKS.map((link) => (
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

        <div className="mt-4 lg:hidden">
          <p className="text-sm leading-6 text-(--footer-muted)">
            © {new Date().getFullYear()} JCT Institutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
