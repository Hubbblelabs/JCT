"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = "G-ME2FVQ6817";

/**
 * Google Analytics (gtag.js) for the public site only — googletagmanager.com
 * must stay allowlisted in the CSP script-src in next.config.ts.
 *
 * Rendered from the root layout, which also wraps the admin panel, so it
 * skips `/admin`: otherwise every CMS screen sent its path (document ids,
 * login callback URLs) and page title to Google. Same check as MerittoScript.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
