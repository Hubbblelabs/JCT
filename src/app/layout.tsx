import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { StickyApplyButton } from "@/components/layout/StickyApplyButton";
import { ChatbotButton } from "@/components/layout/ChatbotButton";
import { siteConfig } from "@/data/site";

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
    "JCT Institutions is a premier group of three colleges in Coimbatore, Tamil Nadu — offering Engineering, Arts & Science, and Polytechnic programs. NAAC & NBA Accredited. 96% Placement Rate. 12,000+ Alumni.",
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
      "Premier Engineering, Arts & Science, and Polytechnic colleges in Coimbatore. Established 2009. 96% Placement Rate.",
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
  logo: `${siteConfig.url}/jct_logo.png`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} bg-surface text-foreground flex min-h-screen flex-col antialiased`}
      >
        {children}

        {/* Global sticky elements */}
        <StickyApplyButton />
        <ChatbotButton />

        {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed right-4 bottom-6 z-50 flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/20 transition-transform hover:scale-105 active:scale-95 md:right-6 md:bottom-8 md:h-16 md:w-16"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="white"
            className="h-8 w-8 md:h-9 md:w-9"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.742 3.054 9.378L1.056 31.2l6.042-1.94a15.9 15.9 0 008.906 2.702C24.828 31.962 32 24.788 32 16.004S24.828 0 16.004 0zm9.35 22.616c-.396 1.116-1.95 2.042-3.21 2.312-.862.182-1.988.326-5.78-1.242-4.85-2.006-7.972-6.924-8.214-7.244-.232-.32-1.942-2.588-1.942-4.936 0-2.348 1.232-3.502 1.668-3.98.396-.436 1.056-.634 1.686-.634.204 0 .386.01.55.018.436.02.654.046.942.728.36.852 1.236 3.014 1.342 3.234.108.22.216.516.072.818-.134.31-.252.448-.472.7s-.462.562-.66.754c-.22.214-.448.444-.194.87.254.428 1.132 1.868 2.43 3.026 1.672 1.49 3.08 1.952 3.516 2.17.354.176.634.148.868-.088.304-.312.66-.832 1.02-1.344.26-.366.586-.412.968-.248.386.158 2.438 1.15 2.856 1.36.418.21.696.31.798.486.1.176.1 1.026-.296 2.142z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
