"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { StickyApplyButton } from "./StickyApplyButton";
import { MerittoPositioner } from "./MerittoPositioner";
import { ChatbotNotification } from "./ChatbotNotification";
import { useSiteConfig } from "@/lib/use-site-config";
import { socialLinksFrom, type SocialKey } from "./social-links";

type FloatingConfig = {
  whatsapp?: {
    enabled?: boolean;
    phone?: string;
  };
  applyNow?: {
    enabled?: boolean;
    label?: string;
    href?: string;
  };
  meritto?: {
    enabled?: boolean;
  };
  social?: {
    enabled?: boolean;
    networks?: SocialKey[];
  };
};

type FooterSocials = Partial<Record<SocialKey, string>>;

export function GlobalElements({
  preview = false,
}: {
  /** Admin live preview: show the buttons (normally hidden under /admin),
   *  without the third-party chat widget. */
  preview?: boolean;
} = {}) {
  const pathname = usePathname();
  const isAdmin = !preview && pathname?.startsWith("/admin");
  const { data: floatingData } =
    useSiteConfig<FloatingConfig>("floatingElements");
  const { data: footer } = useSiteConfig<FooterSocials>("footer");

  if (isAdmin) return null;

  const wa = floatingData?.whatsapp ?? {};
  const ap = floatingData?.applyNow ?? {};
  const mt = floatingData?.meritto ?? {};

  const waEnabled = wa.enabled !== false;
  const waPhone = wa.phone?.trim() ?? null;

  const apEnabled = ap.enabled !== false;
  const apLabel = (ap.label && ap.label.trim()) || "Apply Now";
  const apHref = (ap.href && ap.href.trim()) || "https://admissions.jct.ac.in";

  // The chat widget is an external script with its own fixed UI — it can't
  // be drawn inside a preview.
  const mtEnabled = !preview && mt.enabled !== false;

  // Off unless switched on — it is a new element, and it needs the Footer's
  // social URLs before it has anything to show.
  const sc = floatingData?.social ?? {};
  const socials = sc.enabled
    ? socialLinksFrom(footer).filter(
        (s) => !Array.isArray(sc.networks) || sc.networks.includes(s.key),
      )
    : [];

  return (
    <>
      {apEnabled && (
        <StickyApplyButton
          label={apLabel}
          href={apHref}
          alwaysVisible={preview}
        />
      )}

      {mtEnabled && <MerittoPositioner />}
      {mtEnabled && <ChatbotNotification />}

      {socials.length > 0 && (
        // Middle of the left edge: the bottom-left corner is WhatsApp's and the
        // right side belongs to Apply Now and the chatbot. Desktop only — on a
        // phone a fixed strip would sit on top of the page text, and the
        // footer already carries the same links.
        <nav
          aria-label="Social media"
          data-own-fixed
          className="fixed top-1/2 left-0 z-40 hidden -translate-y-1/2 md:block"
        >
          <ul className="flex flex-col overflow-hidden rounded-r-xl bg-[#0a1628]/90 shadow-lg shadow-black/20 backdrop-blur-sm">
            {socials.map(({ key, Icon, label, href, color }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{ "--brand": color } as CSSProperties}
                  className="flex h-11 w-11 items-center justify-center text-white/85 transition-all duration-200 hover:w-14 hover:bg-(--brand) hover:text-white focus-visible:w-14 focus-visible:bg-(--brand) focus-visible:text-white focus-visible:outline-none"
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {waEnabled && waPhone && (
        <div
          data-own-fixed
          className="group fixed bottom-5 left-4 z-50 md:bottom-6 md:left-6"
        >
          <span className="pointer-events-none absolute top-1/2 left-14 -translate-y-1/2 rounded-md bg-[#0a1628]/92 px-2 py-1 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
            Chat on WhatsApp
          </span>
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <a
            href={`https://wa.me/${waPhone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative flex aspect-square h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/25 transition-transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="white"
              className="h-7 w-7"
            >
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.742 3.054 9.378L1.056 31.2l6.042-1.94a15.9 15.9 0 008.906 2.702C24.828 31.962 32 24.788 32 16.004S24.828 0 16.004 0zm9.35 22.616c-.396 1.116-1.95 2.042-3.21 2.312-.862.182-1.988.326-5.78-1.242-4.85-2.006-7.972-6.924-8.214-7.244-.232-.32-1.942-2.588-1.942-4.936 0-2.348 1.232-3.502 1.668-3.98.396-.436 1.056-.634 1.686-.634.204 0 .386.01.55.018.436.02.654.046.942.728.36.852 1.236 3.014 1.342 3.234.108.22.216.516.072.818-.134.31-.252.448-.472.7s-.462.562-.66.754c-.22.214-.448.444-.194.87.254.428 1.132 1.868 2.43 3.026 1.672 1.49 3.08 1.952 3.516 2.17.354.176.634.148.868-.088.304-.312.66-.832 1.02-1.344.26-.366.586-.412.968-.248.386.158 2.438 1.15 2.856 1.36.418.21.696.31.798.486.1.176.1 1.026-.296 2.142z" />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}
