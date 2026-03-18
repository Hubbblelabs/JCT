"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site";

const artsNav = [
  { name: "Home", href: "#hero" },
  { name: "About JCT", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Admission", href: "#admission" },
  { name: "Life @ JCT", href: "#life" },
  { name: "Contact Us", href: "#contact" },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function ArtsScienceNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(37, 10, 69, 0)", "rgba(37, 10, 69, 0.95)"]
  );
  
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(168, 85, 247, 0)", "rgba(168, 85, 247, 0.2)"]
  );
  
  const navY = useTransform(scrollY, [0, 50], [0, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Announcement Bar */}
     

      {/* Main Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          backgroundColor: forceSolidOnTop ? "rgba(37, 10, 69, 0.95)" : navBackground,
          borderColor: forceSolidOnTop ? "rgba(168, 85, 247, 0.2)" : navBorder,
          borderBottomWidth: "1px",
        }}
        className={`fixed ${bannerVisible ? "top-0" : "top-0"} right-0 left-0 z-50 transition-all duration-300 shadow-lg backdrop-blur-xl py-3`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/institutions/arts-science" className="flex shrink-0 items-center gap-3">
            <div className="relative h-10 w-10 md:h-11 md:w-11">
              <Image
                src="/jct_logo_yellow.png"
                alt="JCT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-white">
              <span className="font-serif text-sm leading-none font-bold tracking-tight md:text-lg">
                JCT
              </span>
              <span className="font-sans text-[10px] font-medium tracking-[0.1em] text-white/70 uppercase pt-0.5">
                Arts & Science
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 lg:flex">
            {artsNav.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-sans text-sm text-white/60 transition-colors hover:text-white xl:flex hidden"
            >
              <Phone size={14} /> {siteConfig.contact.phone}
            </a>
            <Link
              href="/admissions/apply"
              className="bg-gold text-navy hover:bg-gold-light shadow-gold/20 inline-flex h-9 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Apply Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="p-2 text-white/70 transition-colors hover:text-white lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="bg-[#1f093a] border-l border-purple-500/20 shadow-[-10px_0_30px_rgba(107,33,168,0.2)] fixed inset-y-0 right-0 z-61 flex w-full flex-col sm:w-96 lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9">
                    <Image
                      src="/jct_logo_yellow.png"
                      alt="JCT"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-white">
                    <span className="font-serif text-lg leading-none font-bold">JCT</span>
                    <span className="font-sans text-[9px] font-medium tracking-[0.1em] text-white/70 uppercase">
                      Arts & Science
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/5"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links */}
              <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-3">
                {artsNav.map((link) => (
                  <div key={link.name} className="border-b border-white/5">
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="space-y-2.5 border-t border-white/5 p-4">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Phone size={16} /> {siteConfig.contact.phone}
                </a>
                <Link
                  href="#admission"
                  onClick={() => setIsOpen(false)}
                  className="bg-gold text-navy hover:bg-gold-light flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-bold transition-colors"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

