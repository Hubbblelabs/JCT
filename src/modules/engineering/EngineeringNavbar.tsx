"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";

type EngineeringNavChild = {
  name: string;
  href: string;
  desc?: string;
  className?: string;
};

type EngineeringNavItem = {
  name: string;
  href: string;
  className?: string;
  children?: EngineeringNavChild[];
};

const engineeringNavigation: EngineeringNavItem[] = [
  { name: "Home", href: "/institutions/engineering" },
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
  { name: "About Us", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Placements", href: "#placements" },
  { name: "CoE", href: "#research" },
  { name: "Research", href: "#research" },
  { name: "Life@JCT", href: "#life-jct" },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function EngineeringNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(32);

  const isSamePageHashLink = (href: string) =>
    href.startsWith("#") || href.startsWith("/institutions/engineering#");

  const scrollToSection = (hash: string) => {
    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    const nav = document.querySelector("nav") as HTMLElement | null;
    const offset = (nav?.offsetHeight ?? 56) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMobileMenu = false,
  ) => {
    if (closeMobileMenu) {
      setIsOpen(false);
      setMobileExpanded(null);
    }

    if (!isSamePageHashLink(href)) return;

    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : href;
    if (!hash || hash === "#") {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    scrollToSection(hash);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, [bannerVisible]);

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

  const mobileNavItems = engineeringNavigation;

  return (
    <>
      {/* Announcement Bar */}
      {bannerVisible && (
        <div
          ref={bannerRef}
          className="bg-engineering fixed top-0 right-0 left-0 z-60 px-4 py-2 text-center font-sans text-xs font-bold tracking-wide text-white"
        >
          🎓 Admissions Open 2026-27 | Counselling Code:{" "}
          <span className="underline">{siteConfig.counsellingCode}</span> |
          Mobile:{" "}
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="underline"
          >
            {siteConfig.contact.phone}
          </a>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <nav
        style={{ top: bannerVisible ? bannerHeight : 0 }}
        className={`fixed right-0 left-0 z-50 transition-all duration-300 ${
          isSolid
            ? "bg-[#0B1628]/95 py-2 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <Link
            href="/institutions/engineering"
            className="flex shrink-0 items-center gap-3"
          >
            <div className="relative h-10 w-10 md:h-11 md:w-11">
              <Image
                src="/jct_logo_yellow.png"
                alt="JCT"
                fill
                sizes="(min-width: 768px) 44px, 40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-white">
              <span className="font-serif text-sm leading-none font-bold tracking-tight md:text-lg">
                JCT
              </span>
              <span className="pt-0.5 font-sans text-[10px] font-medium tracking-widest whitespace-nowrap text-white/70 uppercase">
                Engineering & Technology
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {engineeringNavigation.map((link) => (
              <div
                key={link.name}
                className={`relative ${link.className || ""}`}
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children && link.href === "#" ? (
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium whitespace-nowrap text-white transition-colors hover:text-white/70"
                  >
                    {link.name}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium whitespace-nowrap text-white transition-colors hover:text-white/70"
                  >
                    {link.name}
                    {link.children && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                )}

                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 w-64 pt-3"
                      >
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1628]/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                          <div className="space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={(e) => handleNavClick(e, child.href)}
                                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-white/6 ${child.className || ""}`}
                              >
                                <div>
                                  <p className="font-sans text-[14px] font-medium text-white/90 transition-colors group-hover:text-amber-400">
                                    {child.name}
                                  </p>
                                  {child.desc && (
                                    <p className="mt-0.5 font-sans text-xs text-white/40">
                                      {child.desc}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={12}
                                  className="shrink-0 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 font-sans text-sm whitespace-nowrap text-white/60 transition-colors hover:text-white xl:flex"
            >
              <Phone size={16} /> {siteConfig.contact.phone}
            </a>
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
      </nav>
      {/* Mobile Drawer — matches arts-science / polytechnic style */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer — floating rounded panel from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-4 right-4 z-61 flex w-70 flex-col rounded-3xl border border-white/10 bg-[#0B1628]/90 shadow-2xl backdrop-blur-xl lg:hidden"
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
                    <span className="mt-0.5 text-[9px] font-medium tracking-widest text-white/50 uppercase">
                      Engineering
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
                  {mobileNavItems.map(
                    (link: EngineeringNavItem, index: number) => (
                      <div
                        key={`${link.name}-${link.href}-${index}`}
                        className="overflow-hidden"
                      >
                        {link.children ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleMobileSection(link.name)}
                              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${
                                mobileExpanded === link.name
                                  ? "bg-white/10 text-white shadow-sm"
                                  : "text-white/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {link.name}
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                  mobileExpanded === link.name
                                    ? "rotate-180"
                                    : ""
                                }`}
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
                                    {link.children.map((child) => (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={(e) =>
                                          handleNavClick(e, child.href, true)
                                        }
                                        className="block rounded-lg px-4 py-2.5 font-sans text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-amber-400"
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
                            onClick={(e) => handleNavClick(e, link.href, true)}
                            className="block rounded-xl px-4 py-3 font-sans text-[15px] font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
                          >
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3 border-t border-white/5 p-5 pt-2">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/5 font-sans text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  <Phone size={16} /> {siteConfig.contact.phone}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
