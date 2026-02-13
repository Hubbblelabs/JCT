import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google";
import { FloatingChat } from "@/app/components/FloatingChat";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
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
