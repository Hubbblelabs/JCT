"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Menu, Phone, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { siteConfig } from "@/data/site";

type ArtsNavItem = {
  name: string;
  href: string;
  className?: string;
  children?: {
    name: string;
    href: string;
    description?: string;
    className?: string;
  }[];
};

const artsNav: ArtsNavItem[] = [
  { name: "Home", href: "/institutions/arts-science/#hero" },
  {
    name: "Institutions",
    href: "/institutions",
    children: [
      {
        name: "Engineering",
        href: "/institutions/engineering",
        description: "B.E, B.Tech, M.E programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        description: "B.A, B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        description: "Diploma programs",
      },
    ],
  },
  { name: "About Us", href: "#about", className: "hidden xl:block" },
  { name: "Courses", href: "#courses", className: "hidden xl:block" },
  { name: "Admission", href: "#admission", className: "hidden 2xl:block" },
  { name: "Contact", href: "#contact", className: "hidden 2xl:block" },
  {
    name: "Explore More",
    href: "#",
    children: [
      {
        name: "About Us",
        href: "#about",
        description: "About our institution",
        className: "xl:hidden",
      },
      {
        name: "Courses",
        href: "#courses",
        description: "Programs offered",
        className: "xl:hidden",
      },
      {
        name: "Admission",
        href: "#admission",
        description: "Admission process & criteria",
        className: "2xl:hidden",
      },
      {
        name: "Contact",
        href: "#contact",
        description: "Get in touch with us",
        className: "2xl:hidden",
      },
      {
        name: "Placements",
        href: "#placements",
        description: "Our recruitment partners & stats",
      },
      {
        name: "Life @ JCT",
        href: "#life",
        description: "News, events & student life",
      },
      {
        name: "Testimonials",
        href: "#testimonials",
        description: "Voices from our community",
      },
    ],
  },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function ArtsScienceNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isSamePageHashLink = (href: string) =>
    href.startsWith("#") || href.startsWith("/institutions/arts-science#");

  const scrollToSection = (hash: string) => {
    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    const nav = document.querySelector("nav") as HTMLElement | null;
    const offset = (nav?.offsetHeight ?? 88) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `/institutions/arts-science${hash}`);
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

    if (window.location.pathname !== "/institutions/arts-science") return;

    e.preventDefault();
    scrollToSection(hash);
  };

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.95)"],
  );

  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(55, 65, 81, 0)", "rgba(55, 65, 81, 0.4)"],
  );

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
          backgroundColor: forceSolidOnTop
            ? "rgba(17, 24, 39, 0.95)"
            : navBackground,
          borderColor: forceSolidOnTop ? "rgba(55, 65, 81, 0.4)" : navBorder,
          borderBottomWidth: "1px",
        }}
        className="fixed top-0 right-0 left-0 z-50 py-3 shadow-lg backdrop-blur-xl transition-all duration-300"
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/institutions/arts-science"
            className="flex shrink-0 items-center gap-3"
          >
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
              <span className="pt-0.5 font-sans text-[10px] font-medium tracking-[0.1em] whitespace-nowrap text-white/70 uppercase">
                Arts & Science
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 lg:flex">
            {artsNav.map((link) => (
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
                    className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium text-white transition-colors hover:text-white/70"
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
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111827]/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                          <div className="space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={(e) => handleNavClick(e, child.href)}
                                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-white/5 ${child.className || ""}`}
                              >
                                <div>
                                  <p className="group-hover:text-arts-science-primary font-sans text-[15px] font-medium whitespace-nowrap text-white/90 transition-colors group-hover:text-amber-500">
                                    {child.name}
                                  </p>
                                  {child.description && (
                                    <p className="mt-0.5 font-sans text-xs text-white/40">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight
                                  size={12}
                                  className="shrink-0 text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"
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
              className="hidden items-center gap-1.5 font-sans text-sm whitespace-nowrap text-white transition-colors hover:text-white/60 xl:flex"
            >
              <Phone size={14} /> {siteConfig.contact.phone}
            </a>
            <Link
              href="/admissions/apply"
              className="bg-arts-science-accent shadow-arts-science-accent/20 inline-flex h-9 flex-shrink-0 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold whitespace-nowrap text-white shadow-lg transition-all hover:scale-105 hover:bg-orange-500 active:scale-95"
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
              className="fixed inset-y-4 right-4 z-[61] flex w-[280px] flex-col rounded-3xl border border-white/10 bg-[#111827]/90 shadow-2xl backdrop-blur-xl lg:hidden"
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
                  <div className="flex flex-col text-white">
                    <span className="font-serif text-lg leading-none font-bold">
                      JCT
                    </span>
                    <span className="mt-0.5 font-sans text-[9px] font-medium tracking-[0.1em] text-white/70 uppercase">
                      Arts & Science
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
                    artsNav.flatMap((item) =>
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
                    .map((link: any) => (
                      <div key={link.name} className="overflow-hidden">
                        {link.children ? (
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
                                    {link.children.map((child: any) => (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={(e) =>
                                          handleNavClick(e, child.href, true)
                                        }
                                        className="hover:text-arts-science-accent block rounded-lg px-4 py-2.5 font-sans text-sm text-white/50 transition-colors hover:bg-white/5"
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
                            className={`block rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${link.href.includes("#") && typeof window !== "undefined" && window.location.hash === (link.href.includes("#") ? link.href.slice(link.href.indexOf("#")) : "") ? "text-arts-science-accent bg-white/10 shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
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
                  href="#admission"
                  onClick={(e) => handleNavClick(e, "#admission", true)}
                  className="bg-arts-science-accent shadow-arts-science-accent/10 flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-sans text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-orange-500 active:scale-[0.98]"
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
