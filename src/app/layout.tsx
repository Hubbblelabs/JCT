import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { GlobalElements } from "@/components/layout/GlobalElements";
import { RouteQuickNav } from "@/components/layout/RouteQuickNav";
import { MerittoScript } from "@/components/layout/MerittoScript";
import { InstitutionProvider } from "@/contexts/InstitutionContext";

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://jct.ac.in";

/** Google Analytics 4 measurement id. */
const GA_MEASUREMENT_ID = "G-ME2FVQ6817";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "JCT Institutions — Engineering, Arts & Science, Polytechnic | Coimbatore",
  description:
    "JCT Institutions is a premier group of three colleges in Coimbatore, Tamil Nadu — offering Engineering, Arts & Science, and Polytechnic programs. NAAC & NBA Accredited. 98% Placement Rate. 12,000+ Alumni.",
  keywords: [
    "JCT Institutions",
    "JCT College Coimbatore",
    "Engineering College Coimbatore",
    "Arts and Science College",
    "Polytechnic College",
    "NAAC Accredited",
    "NBA Accredited",
  ],
  openGraph: {
    title: "JCT Institutions — Three Colleges, One Commitment to Excellence",
    description:
      "Premier Engineering, Arts & Science, and Polytechnic colleges in Coimbatore. Established 2009. 98% Placement Rate.",
    url: SITE_URL,
    siteName: "JCT Institutions",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JCT Institutions — Coimbatore",
    description:
      "Engineering, Arts & Science, and Polytechnic colleges. NAAC & NBA Accredited.",
  },
  metadataBase: new URL(SITE_URL),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "JCT Institutions",
  url: SITE_URL,
  logo: `${SITE_URL}/jct_logo.webp`,
  description:
    "JCT Institutions is a premier group of three colleges in Coimbatore offering Engineering, Arts & Science, and Polytechnic programs.",
  foundingDate: "2009",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Knowledge Park, Pichanur",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641105",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} bg-surface text-foreground flex min-h-screen flex-col antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <InstitutionProvider>
          {children}
          {/* Global elements - conditionally shown based on route */}
          <GlobalElements />
          {/* Route quick nav - dev only, server component */}
          {process.env.NODE_ENV !== "production" && <RouteQuickNav />}
        </InstitutionProvider>

        {/* Meritto Chatbot - conditionally loaded on public pages only */}
        <MerittoScript />

        {/* Google Analytics (gtag.js) — googletagmanager.com must stay
            allowlisted in the CSP script-src in next.config.ts. */}
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
      </body>
    </html>
  );
}
