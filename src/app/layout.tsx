import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { PublicFloatingElements } from "@/components/layout/PublicFloatingElements";
import { RouteQuickNav } from "@/components/layout/RouteQuickNav";
import { siteConfig } from "@/data/site";
import { InstitutionProvider } from "@/contexts/InstitutionContext";

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
    url: siteConfig.url,
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
  metadataBase: new URL(siteConfig.url),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo/jct_logo.webp`,
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
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactType: "admissions",
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.social.twitter,
    siteConfig.social.linkedin,
    siteConfig.social.youtube,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/logo/favicon.ico"></link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} bg-surface text-foreground flex min-h-screen flex-col antialiased`}
      >
        <InstitutionProvider>
          {children}
          <PublicFloatingElements />
          {process.env.NODE_ENV !== "production" && <RouteQuickNav />}
        </InstitutionProvider>
      </body>
    </html>
  );
}
