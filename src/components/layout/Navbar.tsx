"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData } from "@/data/navigation";
import { siteConfig } from "@/data/site";

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function Navbar({ forceSolidOnTop = false }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const navItems = isHomePage
    ? ["Home", "Institutions", "Placements", "Campus Life"]
        .map((name) => navigationData.find((item) => item.name === name))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => {
          if (item.name === "Institutions") {
            return {
              ...item,
              href: "/#institutions",
              children: undefined,
            };
          }

          if (item.name === "Placements") {
            return {
              ...item,
              href: "/#placements",
              children: undefined,
            };
          }

          if (item.name === "Campus Life") {
            return {
              ...item,
              name: "Life@JCT",
              href: "/campus-life",
              children: undefined,
            };
          }

          return {
            ...item,
            children: undefined,
          };
        })
    : navigationData;

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

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  const isSolid = scrolled || forceSolidOnTop;

  return (
    <>
      {/* Announcement Bar — Counselling Code */}
      {bannerVisible && (
        <div className="bg-gold text-navy fixed top-0 right-0 left-0 z-60 px-4 py-2 text-center font-sans text-xs font-bold tracking-wide">
          🎓 Admissions Open 2026-27 | Counselling Code:{" "}
          <span className="underline">{siteConfig.counsellingCode}</span> —{" "}
          <Link
            href="/admissions/apply"
            className="underline underline-offset-2 hover:no-underline"
          >
            Apply Now
          </Link>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Nav */}
      <nav
        className={`fixed ${bannerVisible ? "top-10" : "top-4"} right-0 left-0 z-50 transition-all duration-300 px-4 md:px-8`}
      >
        <div className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border px-7 py-2.5 transition-all duration-300 ${isSolid ? 'shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] border-gray-200 bg-white' : 'border-white/0 bg-transparent'}`}>
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative h-10 w-10">
              <Image 
                src={isSolid ? "/jct_logo_blue.png" : "/jct_logo_yellow.png"} 
                alt="JCT Logo" 
                fill 
                className="object-contain" 
              />
            </div>
            <span className={`hidden sm:block font-serif text-[24px] font-bold italic tracking-tight transition-colors drop-shadow-sm ${isSolid ? 'text-[#1a2332]' : 'text-white'}`}>
              JCT Institutions
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-9 lg:flex">
            {[
              { name: "Home", href: "/" },
              { name: "Colleges", href: "/#institutions" },
              { name: "Admissions", href: "/admissions" },
              { name: "Placements", href: "/#placements" },
              { name: "Life@JCT", href: "/#happenings" },
            ].map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : (pathname.startsWith(link.href) && !link.href.includes("#"));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-sans text-[15px] font-medium transition-colors ${
                    isActive 
                      ? (isSolid ? "text-[#e68b20]" : "text-white") 
                      : (isSolid ? "text-[#5b6574] hover:text-[#1a2332]" : "text-white/80 hover:text-white")
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] ${isSolid ? 'bg-[#e68b20]' : 'bg-white'}`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center lg:flex">
            <Link
              href="/admissions/apply"
              className={`inline-flex h-[42px] items-center justify-center rounded-full px-8 font-sans text-[15px] font-medium transition-all hover:scale-105 active:scale-95 ${
                isSolid 
                  ? 'bg-[#735b0d] text-white hover:bg-[#5e4b0c]' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`p-2 transition-colors lg:hidden ${isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white hover:text-white/80'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm xl:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="bg-navy fixed inset-y-0 right-0 z-[61] flex w-full flex-col sm:w-96 xl:hidden"
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
                  <span className="font-serif text-lg font-bold text-white">
                    JCT
                  </span>
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
                {navItems.map((link) => (
                  <div key={link.name} className="border-b border-white/5">
                    {link.children ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSection(link.name)}
                          className="flex w-full items-center justify-between py-3 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                        >
                          {link.name}
                          <ChevronDown
                            size={16}
                            className={`text-white/40 transition-transform duration-200 ${
                              mobileExpanded === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-0.5 pb-3 pl-3">
                                {link.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-gold block rounded-lg px-2 py-2 font-sans text-sm text-white/60 transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
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
                  href="/admissions/apply"
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
