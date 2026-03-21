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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
            return {
              name: "Testimonials",
              href: "/#testimonials",
            } as (typeof navigationData)[0];
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

  const navigationLinks = [
    { name: "Home", href: "/" },
    {
      name: "Institutions",
      href: "#",
      children: [
        { name: "Engineering College", href: "/institutions/engineering" },
        { name: "Arts & Science College", href: "/institutions/arts-science" },
        { name: "Polytechnic College", href: "/institutions/polytechnic" },
      ],
    },
    { name: "Admissions", href: "/admissions" },
    { name: "Placements", href: "/#placements", className: "hidden 2xl:block" },
    {
      name: "Testimonials",
      href: "/#testimonials",
      className: "hidden 2xl:block",
    },
    { name: "Life@JCT", href: "/#happenings", className: "hidden 2xl:block" },
    {
      name: "Explore More",
      href: "#",
      className: "xl:block 2xl:hidden",
      children: [
        { name: "Placements", href: "/#placements", className: "2xl:hidden" },
        {
          name: "Testimonials",
          href: "/#testimonials",
          className: "2xl:hidden",
        },
        { name: "Life@JCT", href: "/#happenings", className: "2xl:hidden" },
      ],
    },
  ];

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
        className={`fixed ${bannerVisible && !isHomePage ? "top-10" : "top-4"} right-0 left-0 z-50 px-4 transition-all duration-300 md:px-8`}
      >
        <div
          className={`mx-auto flex w-full max-w-360 items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 lg:px-7 ${isSolid ? "border-white/10 bg-[#0a1628]/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md" : "border-white/0 bg-transparent"}`}
        >
          {/* Logo Container */}
          <div className="z-50 flex shrink-0 items-center justify-start xl:flex-1">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 lg:gap-3"
            >
              <div className="relative h-7 w-7 lg:h-10 lg:w-10">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight whitespace-nowrap text-white drop-shadow-sm transition-colors lg:text-xl xl:text-[24px]">
                JCT Institutions
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div
            className="hidden items-center justify-center whitespace-nowrap xl:flex"
            ref={dropdownRef}
          >
            {navigationLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href) && !link.href.includes("#");
              const hasDropdown = !!link.children;
              const isExpanded = desktopExpanded === link.name;

              return (
                <div
                  key={link.name}
                  className={`relative ${(link as any).className || ""}`}
                >
                  {hasDropdown ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDesktopExpanded(isExpanded ? null : link.name);
                      }}
                      className={`relative flex items-center justify-center gap-1.5 px-3 py-2 font-sans text-sm font-medium transition-colors xl:px-5 xl:text-[15px] ${
                        isExpanded
                          ? "text-[#d4a024]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative flex items-center justify-center px-3 py-2 font-sans text-sm font-medium transition-colors xl:px-5 xl:text-[15px] ${
                        isActive
                          ? "text-[#d4a024]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute right-3 bottom-1 left-3 h-[2px] bg-[#d4a024] xl:right-5 xl:left-5" />
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
                          className="absolute top-full left-0 mt-2 w-60 rounded-xl border border-white/10 bg-[#0a1628]/95 p-2 shadow-xl backdrop-blur-md"
                        >
                          {link.children?.map((child: any) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setDesktopExpanded(null)}
                              className={`block rounded-lg px-4 py-2.5 font-sans text-sm font-medium whitespace-nowrap text-white/90 transition-colors hover:bg-white/10 hover:text-white ${child.className || ""}`}
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
          <div className="z-50 hidden shrink-0 items-center justify-end gap-3 whitespace-nowrap xl:flex xl:flex-1 xl:gap-6">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-sans text-sm font-medium text-white/90 transition-colors hover:text-white xl:gap-2 xl:text-[15px]"
            >
              <Phone size={16} className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
              {siteConfig.contact.phone}
            </a>
            <Link
              href="/admissions/apply"
              className={`inline-flex h-[38px] items-center justify-center rounded-full px-5 font-sans text-sm font-medium transition-all hover:scale-105 active:scale-95 xl:h-[42px] xl:px-8 xl:text-[15px] ${
                isSolid
                  ? "bg-[#d4a024] font-semibold text-[#0a1628] shadow-lg shadow-black/20 hover:bg-[#e8b84a]"
                  : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              }`}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="z-50 ml-auto p-2 text-white transition-colors hover:text-white/80 xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={32} strokeWidth={1.5} />
            ) : (
              <Menu size={32} strokeWidth={1.5} />
            )}
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
              className="fixed inset-y-4 right-4 z-[61] flex w-[280px] flex-col rounded-3xl border border-white/10 bg-[#0a1628]/90 shadow-2xl backdrop-blur-xl xl:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9">
                    <Image
                      src="/jct_logo_yellow.png"
                      alt="JCT"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg leading-none font-bold text-white">
                      JCT
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium tracking-widest text-white/50 uppercase">
                      Institutions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                  {(
                    navigationLinks.flatMap((item) =>
                      item.name === "Explore More"
                        ? item.children || []
                        : [item],
                    ) as any[]
                  )
                    .filter(
                      (link) =>
                        !link.className?.includes("hidden") ||
                        link.className?.includes("xl:hidden") ||
                        link.className?.includes("lg:hidden") ||
                        link.className?.includes("2xl:hidden"),
                    )
                    .map((link) => (
                      <div key={link.name} className="overflow-hidden">
                        {link.children ? (
                          <div>
                            <button
                              onClick={() => toggleMobileSection(link.name)}
                              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${mobileExpanded === link.name ? "bg-white/10 text-white shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                            >
                              {link.name}
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${mobileExpanded === link.name ? "rotate-180" : ""}`}
                              />
                            </button>
                            <AnimatePresence>
                              {mobileExpanded === link.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-1 py-1 pr-2 pl-4">
                                    {link.children.map((child: any) => (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded-lg px-4 py-2.5 font-sans text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-[#d4a024]"
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
                            className={`block rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${pathname === link.href ? "bg-white/10 text-[#d4a024] shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                          >
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3 border-t border-white/5 p-5 pt-2">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/5 font-sans text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                >
                  <Phone size={16} /> {siteConfig.contact.phone}
                </a>
                <Link
                  href="/admissions/apply"
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#d4a024] font-sans text-sm font-bold text-[#0a1628] shadow-lg shadow-[#d4a024]/10 transition-all hover:scale-[1.02] hover:bg-[#e8b84a] active:scale-[0.98]"
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
