"use client";

import { useState, useEffect, useRef } from "react";
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

  const [desktopExpanded, setDesktopExpanded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDesktopExpanded(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = isHomePage
    ? ["Home", "Institutions", "Placements", "Testimonials", "Campus Life"]

        .map((name) => {
          if (name === "Testimonials") {
            return { name: "Testimonials", href: "/#testimonials" } as typeof navigationData[0];
          }
          return navigationData.find((item) => item.name === name);
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => {
          if (item.name === "Institutions") {
            return {
              ...item,
              href: "#",
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
      {bannerVisible && !isHomePage && (
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
        className={`fixed ${bannerVisible && !isHomePage ? "top-10" : "top-4"} right-0 left-0 z-50 transition-all duration-300 px-4 md:px-8`}
      >
        <div className={`mx-auto flex w-full max-w-360 items-center lg:justify-between justify-end rounded-full border px-4 lg:px-7 py-2.5 transition-all duration-300 ${isSolid ? 'shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-white/10 bg-[#0a1628]/95 backdrop-blur-md' : 'border-white/0 bg-transparent'}`}>
          {/* Mobile Left Logo */}
          <Link href="/" className="z-50 flex items-center lg:hidden">
            <div className="relative h-[26px] w-[26px]">
              <Image
                src="/jct_logo_yellow.png"
                alt="JCT Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Mobile Center Text */}
          <div className="pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 lg:hidden">
            <span className="font-sans text-xs font-semibold tracking-[0.08em] whitespace-nowrap text-white drop-shadow-sm">
              JCT Institutions --est 2009 --
            </span>
          </div>

          {/* Desktop Logo Container */}
          <div className="hidden lg:flex items-center lg:flex-1 justify-start shrink-0 z-50">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="relative h-10 w-10">
                <Image 
                  src="/jct_logo_yellow.png" 
                  alt="JCT Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="font-sans text-xl xl:text-[24px] font-bold tracking-tight transition-colors drop-shadow-sm whitespace-nowrap text-white">
                JCT Institutions
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden items-center justify-center lg:flex whitespace-nowrap" ref={dropdownRef}>
            {[
              { name: "Home", href: "/" },
              { 
                name: "Institutions", 
                href: "#", 
                children: [
                  { name: "Engineering College", href: "/institutions/engineering" },
                  { name: "Arts & Science College", href: "/institutions/arts-science" },
                  { name: "Polytechnic College", href: "/institutions/polytechnic" },
                ]
              },
              { name: "Admissions", href: "/admissions" },
              { name: "Placements", href: "/#placements" },
              { name: "Testimonials", href: "/#testimonials" },
              { name: "Life@JCT", href: "/#happenings" },
            ].map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : (pathname.startsWith(link.href) && !link.href.includes("#"));
              const hasDropdown = !!link.children;
              const isExpanded = desktopExpanded === link.name;

              return (
                <div key={link.name} className="relative">
                  {hasDropdown ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDesktopExpanded(isExpanded ? null : link.name);
                      }}
                      className={`relative flex items-center justify-center gap-1.5 px-3 xl:px-5 py-2 font-sans text-sm xl:text-[15px] font-medium transition-colors ${
                        isExpanded
                          ? "text-[#d4a024]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative flex items-center justify-center px-3 xl:px-5 py-2 font-sans text-sm xl:text-[15px] font-medium transition-colors ${
                        isActive 
                          ? "text-[#d4a024]" 
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-1 left-3 right-3 xl:left-5 xl:right-5 h-[2px] bg-[#d4a024]" />
                      )}
                    </Link>
                  )}
                  
                  {hasDropdown && (
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#0a1628]/95 p-2 shadow-xl backdrop-blur-md"
                        >
                          {link.children?.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setDesktopExpanded(null)}
                              className="block rounded-lg px-4 py-2.5 font-sans text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center justify-end gap-3 xl:gap-6 lg:flex lg:flex-1 shrink-0 z-50 whitespace-nowrap">
            <a 
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} 
              className="flex items-center gap-1.5 xl:gap-2 font-sans text-sm xl:text-[15px] font-medium transition-colors text-white/90 hover:text-white"
            >
              <Phone size={16} className="xl:w-4 xl:h-4 w-3.5 h-3.5" />
              {siteConfig.contact.phone}
            </a>
            <Link
              href="/admissions/apply"
              className={`inline-flex h-[38px] xl:h-[42px] items-center justify-center rounded-full px-5 xl:px-8 font-sans text-sm xl:text-[15px] font-medium transition-all hover:scale-105 active:scale-95 ${
                isSolid 
                  ? 'bg-[#d4a024] text-[#0a1628] hover:bg-[#e8b84a] shadow-lg shadow-black/20 font-semibold' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="p-2 transition-colors lg:hidden text-white hover:text-white/80 z-50 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
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
