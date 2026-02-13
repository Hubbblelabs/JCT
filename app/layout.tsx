import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const FloatingChat = dynamic(() => import("@/app/components/FloatingChat").then(mod => mod.FloatingChat), {
  ssr: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "JCT Institutions",
  description: "Cultivating character, competence, and leadership since 2009.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
        <FloatingChat />
      </body>

    </html>
  );
}
