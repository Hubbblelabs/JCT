"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";

type PolytechnicNavChild = {
  name: string;
  href: string;
  desc?: string;
  className?: string;
};

type PolytechnicNavItem = {
  name: string;
  href: string;
  className?: string;
  children?: PolytechnicNavChild[];
};

type PolytechnicMobileNavItem = PolytechnicNavItem | PolytechnicNavChild;

// Custom Polytechnic Navigation Data
const polytechnicNavigation: PolytechnicNavItem[] = [
  { name: "Home", href: "/institutions/polytechnic#top" },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering (Autonomous)",
        href: "/institutions/engineering",
        desc: "B.E, B.Tech, M.E, Ph.D programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.A, B.Sc, B.Com, BBA",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  {
    name: "Programs",
    href: "/institutions/polytechnic#programs",
  },
  {
    name: "Admissions",
    href: "/admissions",
  },
  {
    name: "Placements",
    href: "/placements",
  },
  {
    name: "Life @ JCT",
    href: "/campus-life",
  },
  {
    name: "More",
    href: "#",
    children: [
      { name: "About Us", href: "/institutions/polytechnic#about-institution" },
      { name: "Testimonials", href: "/institutions/polytechnic#testimonials" },
    ],
  },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function PolytechnicNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isSamePageHashLink = (href: string) =>
    href.startsWith("#") || href.startsWith("/institutions/polytechnic#");

  const scrollToSection = (hash: string) => {
    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    const nav = document.querySelector("nav") as HTMLElement | null;
    const offset = (nav?.offsetHeight ?? 88) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `/institutions/polytechnic${hash}`);
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

    if (window.location.pathname !== "/institutions/polytechnic") return;

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
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  return (
    <>
      {/* Main Nav */}
      <nav className="fixed top-0 right-0 left-0 z-50 px-4 py-3 transition-all duration-300 md:px-8">
        <div
          className={`mx-auto flex w-full max-w-360 items-center justify-between px-4 py-2.5 transition-all duration-300 lg:px-7 ${
            scrolled || forceSolidOnTop
              ? "rounded-full border border-white/10 bg-[#0B1628]/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
              : "backdrop-blur-0 rounded-none border-transparent shadow-none"
          }`}
        >
          {/* Logo */}
          <Link
            href="/institutions/polytechnic"
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
            <div className="flex flex-col">
              <span className="font-serif text-sm leading-none font-bold tracking-tight whitespace-nowrap text-white md:text-lg">
                JCT Polytechnic College
              </span>
              <span className="mt-0.5 hidden font-sans text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase sm:block">
                Est. 2009
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 xl:flex">
            {polytechnicNavigation.map((link) => (
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
                    className="group relative flex items-center gap-1 px-3 py-2 font-sans text-base font-medium whitespace-nowrap text-white transition-colors hover:text-white/70"
                  >
                    {link.name}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                    <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#4f617b] transition-transform duration-300 group-hover:scale-x-100" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group relative flex items-center gap-1 px-3 py-2 font-sans text-base font-medium whitespace-nowrap text-white transition-colors hover:text-white/70"
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
                    <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#4f617b] transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                )}

                {/* Dropdown */}
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
                        <div
                          className={`overflow-hidden rounded-xl border p-2 shadow-2xl backdrop-blur-2xl ${
                            scrolled || forceSolidOnTop
                              ? "border-white/10 bg-[#0B1628]/95 shadow-black/30"
                              : "border-white/20 bg-white/12 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)]"
                          }`}
                        >
                          <div className="space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={(e) => handleNavClick(e, child.href)}
                                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-300 ${
                                  scrolled || forceSolidOnTop
                                    ? "hover:bg-white/8"
                                    : "hover:bg-white/12"
                                } ${child.className || ""}`}
                              >
                                <div>
                                  <p
                                    className={`font-sans text-[15px] font-medium whitespace-nowrap transition-colors group-hover:text-white ${
                                      scrolled || forceSolidOnTop
                                        ? "text-white/95"
                                        : "text-white"
                                    }`}
                                  >
                                    {child.name}
                                  </p>
                                  {child.desc && (
                                    <p
                                      className={`mt-0.5 font-sans text-xs transition-colors ${
                                        scrolled || forceSolidOnTop
                                          ? "text-white/55 group-hover:text-white/75"
                                          : "text-white/78 group-hover:text-white"
                                      }`}
                                    >
                                      {child.desc}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={12}
                                  className="shrink-0 text-white/70 opacity-0 transition-opacity group-hover:opacity-100"
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
          <div className="hidden items-center gap-4 xl:flex">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="flex max-w-[140px] items-center gap-1.5 font-sans text-base text-white/60 transition-colors hover:text-white min-[1350px]:max-w-none"
            >
              <Phone size={16} className="shrink-0" />
              <span className="truncate">{siteConfig.contact.phone}</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="p-2 text-white/70 transition-colors hover:text-white xl:hidden"
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
                  <div className="flex flex-col text-white">
                    <span className="font-serif text-lg leading-none font-bold">
                      JCT
                    </span>
                    <span className="mt-0.5 font-sans text-[10px] font-medium tracking-widest text-white/50 uppercase">
                      Polytechnic College
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
                  {polytechnicNavigation
                    .flatMap((item: PolytechnicNavItem) =>
                      item.name === "More" ? item.children || [] : [item],
                    )
                    .filter(
                      (link) =>
                        !link.className?.includes("hidden") ||
                        link.className?.includes("xl:hidden") ||
                        link.className?.includes("lg:hidden") ||
                        link.className?.includes("2xl:hidden"),
                    )
                    .map((link: PolytechnicMobileNavItem) => (
                      <div key={link.name} className="overflow-hidden">
                        {"children" in link && link.children ? (
                          <div>
                            <button
                              type="button"
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
                                    {link.children.map(
                                      (child: PolytechnicNavChild) => (
                                        <Link
                                          key={child.name}
                                          href={child.href}
                                          onClick={(e) =>
                                            handleNavClick(e, child.href, true)
                                          }
                                          className="hover:text-polytechnic-light block rounded-lg px-4 py-2.5 font-sans text-sm text-white/50 transition-colors hover:bg-white/5"
                                        >
                                          {child.name}
                                        </Link>
                                      ),
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href, true)}
                            className={`block rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${link.href.includes("#") && typeof window !== "undefined" && window.location.hash === (link.href.includes("#") ? link.href.slice(link.href.indexOf("#")) : "") ? "text-polytechnic-light bg-white/10 shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
