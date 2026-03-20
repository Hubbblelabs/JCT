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

// Custom Polytechnic Navigation Data
const polytechnicNavigation: PolytechnicNavItem[] = [
  { name: "Home", href: "/institutions/polytechnic#top" },
  {
    name: "Institutions",
    href: "/institutions",
    children: [
      { name: "Engineering", href: "/institutions/engineering", desc: "B.E, B.Tech, M.E programs" },
      { name: "Arts & Science", href: "/institutions/arts-science", desc: "B.A, B.Sc, B.Com, BBA" },
      { name: "Polytechnic", href: "/institutions/polytechnic", desc: "Diploma programs" }
    ]
  },
  { name: "About Us", href: "/institutions/polytechnic#about-institution", className: "hidden xl:block" },
  { name: "Courses", href: "/institutions/polytechnic#programs", className: "hidden xl:block" },
  { name: "Admission", href: "/institutions/polytechnic#admissions", className: "hidden 2xl:block" },
  { name: "Contact", href: "/institutions/polytechnic#contact", className: "hidden 2xl:block" },
  {
    name: "Explore More",
    href: "#",
    children: [
      { name: "About Us", href: "/institutions/polytechnic#about-institution", desc: "About our institution", className: "xl:hidden" },
      { name: "Courses", href: "/institutions/polytechnic#programs", desc: "Programs offered", className: "xl:hidden" },
      { name: "Admission", href: "/institutions/polytechnic#admissions", desc: "Admission process & criteria", className: "2xl:hidden" },
      { name: "Contact", href: "/institutions/polytechnic#contact", desc: "Get in touch with us", className: "2xl:hidden" },
      { name: "Placements", href: "/institutions/polytechnic#placements", desc: "Our recruitment partners & stats" },
      { name: "Life @ JCT", href: "/institutions/polytechnic#happenings", desc: "News, events & student life" },
      { name: "Testimonials", href: "/institutions/polytechnic#testimonials", desc: "Voices from our community" }
    ]
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
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled || forceSolidOnTop
            ? "bg-polytechnic-dark/95 shadow-polytechnic-dark/50 py-2 shadow-lg backdrop-blur-xl"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/institutions/polytechnic" className="flex shrink-0 items-center gap-3">
            <div className="relative h-10 w-10 md:h-11 md:w-11">
              <Image
                src="/jct_logo_yellow.png"
                alt="JCT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm leading-none font-bold tracking-tight text-white whitespace-nowrap md:text-lg">
                JCT Polytechnic College
              </span>
              <span className="mt-0.5 hidden font-sans text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase sm:block">
                Est. 2009
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 lg:flex">
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
                    className="flex items-center gap-1 px-3 py-2 font-sans text-base whitespace-nowrap font-medium text-white transition-colors hover:text-white/70"
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
                    className="flex items-center gap-1 px-3 py-2 font-sans text-base whitespace-nowrap font-medium text-white transition-colors hover:text-white/70"
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
                        <div className="bg-polytechnic-dark/95 overflow-hidden rounded-xl border border-white/10 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                          <div className="space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={(e) => handleNavClick(e, child.href)}
                                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-white/6 ${child.className || ""}`}
                              >
                                <div>
                                  <p className="group-hover:text-gold font-sans whitespace-nowrap text-base font-medium text-white/90 transition-colors">
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
                                  className="text-gold shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-sans whitespace-nowrap text-base text-white/60 transition-colors hover:text-white"
            >
              <Phone size={16} /> {siteConfig.contact.phone}
            </a>
            <Link
              href="/institutions/polytechnic#admissions"
              onClick={(e) => handleNavClick(e, "/institutions/polytechnic#admissions")}
              className="bg-gold text-polytechnic-dark hover:bg-gold-light shadow-gold/20 inline-flex flex-shrink-0 whitespace-nowrap h-10 items-center justify-center gap-2 rounded-full px-5 font-sans text-base font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Apply Now <ArrowRight size={16} />
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
      </nav>

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
              className="bg-polytechnic-dark fixed inset-y-0 right-0 z-61 flex w-full flex-col sm:w-96 lg:hidden"
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
                    JCT Polytechnic
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
                {polytechnicNavigation.map((link) => (
                  <div key={link.name} className={`border-b border-white/5 ${link.className || ""}`}>
                    {link.children ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSection(link.name)}
                          className="flex w-full items-center justify-between py-3 font-sans text-lg font-medium text-white/80 transition-colors hover:text-white"
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
                                    onClick={(e) => handleNavClick(e, child.href, true)}
                                    className={`hover:text-gold block rounded-lg px-2 py-2 font-sans text-base text-white/60 transition-colors ${child.className || ""}`}
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
                        className="block py-3 font-sans text-lg font-medium text-white/80 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/5 bg-white/5 p-4">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="mb-4 flex items-center justify-center gap-2 font-sans text-base font-medium text-white"
                >
                  <Phone size={18} className="text-gold" />{" "}
                  {siteConfig.contact.phone}
                </a>
                <Link
                  href="/institutions/polytechnic#admissions"
                  onClick={(e) => handleNavClick(e, "/institutions/polytechnic#admissions", true)}
                  className="bg-gold text-polytechnic-dark font-sans flex w-full items-center justify-center gap-2 rounded-xl py-3 text-lg font-bold transition-transform active:scale-[0.98]"
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}