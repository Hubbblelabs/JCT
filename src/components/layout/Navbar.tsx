"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData, type NavItem, type NavChild } from "@/data/navigation";
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
        {
          name: "Engineering",
          href: "/institutions/engineering",
          desc: "B.E, B.Tech, M.E programs",
        },
        {
          name: "Arts & Science",
          href: "/institutions/arts-science",
          desc: "B.A, B.Sc, B.Com, BBA programs",
        },
        {
          name: "Polytechnic",
          href: "/institutions/polytechnic",
          desc: "Diploma programs",
        },
      ],
    },
    { name: "Admissions", href: "/admissions" },
    { name: "Placements", href: "/placements" },
    { name: "Campus Life", href: "/campus-life" },
  ];

  return (
    <>
      {/* Announcement Bar — Counselling Code */}
      {bannerVisible && !isHomePage && (
        <div className="bg-gold text-navy fixed top-0 right-0 left-0 z-60 px-3 py-2 text-center font-sans text-[11px] font-bold tracking-wide sm:px-4 sm:text-xs">
          <span className="block pr-6 leading-tight whitespace-nowrap">
            🎓 Admissions Open 2026-27 | Counselling Code: {siteConfig.counsellingCode}
          </span>
          <Link
            href="/admissions/apply"
            className="ml-1 hidden underline underline-offset-2 hover:no-underline sm:inline"
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
                  sizes="(min-width: 1024px) 40px, 28px"
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
                  className="relative"
                  onMouseEnter={() =>
                    hasDropdown && setDesktopExpanded(link.name)
                  }
                  onMouseLeave={() => hasDropdown && setDesktopExpanded(null)}
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
                        <span className="absolute right-3 bottom-1 left-3 h-0.5 bg-[#d4a024] xl:right-5 xl:left-5" />
                      )}
                    </Link>
                  )}

                  {hasDropdown && (
                    <AnimatePresence>
                      {isExpanded && (
                        <div className="absolute top-full left-0 z-50 pt-4">
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.985 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className={`w-64 rounded-2xl border p-2 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)] backdrop-blur-2xl ${
                              isSolid
                                ? "border-white/10 bg-[#0a1628]/96"
                                : "border-white/20 bg-white/12"
                            }`}
                          >
                            {link.children?.map((child: NavChild) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setDesktopExpanded(null)}
                                className={`block rounded-lg px-4 py-3 font-sans transition-colors ${
                                  isSolid
                                    ? "hover:bg-white/10"
                                    : "hover:bg-white/15"
                                } ${child.className || ""}`}
                              >
                                <div
                                  className={`text-[15px] font-medium whitespace-nowrap ${
                                    isSolid ? "text-white/90" : "text-white"
                                  }`}
                                >
                                  {child.name}
                                </div>
                                {child.desc && (
                                  <div
                                    className={`mt-0.5 text-[13px] whitespace-nowrap ${
                                      isSolid
                                        ? "text-white/50"
                                        : "text-white/75"
                                    }`}
                                  >
                                    {child.desc}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        </div>
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
              className={`inline-flex h-9.5 items-center justify-center rounded-full px-5 font-sans text-sm font-medium transition-all hover:scale-105 active:scale-95 xl:h-10.5 xl:px-8 xl:text-[15px] ${
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
              className="fixed inset-y-4 right-4 z-61 flex w-70 flex-col rounded-3xl border border-white/10 bg-[#0a1628]/90 shadow-2xl backdrop-blur-xl xl:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9">
                    <Image
                      src="/jct_logo_yellow.png"
                      alt="JCT"
                      fill
                      sizes="36px"
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
                  {navigationData
                    .flatMap((item: NavItem) =>
                      item.name === "Explore More"
                        ? item.children || []
                        : [item],
                    )
                    .map((link: NavItem | NavChild) => (
                      <div key={link.name} className="overflow-hidden">
                        {"children" in link && link.children ? (
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
                                    {link.children?.map((child: NavChild) => (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded-lg px-4 py-3 font-sans transition-colors hover:bg-white/5 hover:text-[#d4a024]"
                                      >
                                        <div className="text-sm text-white/70">
                                          {child.name}
                                        </div>
                                        {child.desc && (
                                          <div className="mt-0.5 text-xs text-white/40">
                                            {child.desc}
                                          </div>
                                        )}
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
