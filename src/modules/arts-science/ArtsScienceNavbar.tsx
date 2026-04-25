"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Menu, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

type ArtsNavChild = NonNullable<ArtsNavItem["children"]>[number];

const artsNav: ArtsNavItem[] = [
  { name: "Home", href: "/institutions/arts-science/#hero" },
  {
    name: "Institutions",
    href: "#",
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
  { name: "About Us", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Admission", href: "#admission" },
  { name: "Contact", href: "#contact" },
  { name: "Placements", href: "#placements" },
  { name: "Life @ JCT", href: "#life" },
  { name: "Testimonials", href: "#testimonials" },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function ArtsScienceNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showPill = scrolled || forceSolidOnTop;

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
      <nav className="fixed top-0 right-0 left-0 z-50 px-4 py-3 transition-all duration-300 md:px-8">
        <div
          className={`mx-auto flex w-full max-w-360 items-center justify-between px-4 py-2.5 transition-all duration-300 lg:px-7 ${
            showPill
              ? "rounded-full border border-white/14 bg-[#0b1a31]/95 shadow-[0_14px_36px_rgba(2,8,20,0.52)] backdrop-blur-xl"
              : "backdrop-blur-0 rounded-none border-transparent shadow-none"
          }`}
        >
          <Link
            href="/institutions/arts-science"
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
                JCT College of
              </span>
              <span className="pt-0.5 font-sans text-[10px] font-medium tracking-widest whitespace-nowrap text-white/70 uppercase">
                Arts & Science
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
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
                    className="group relative flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-semibold whitespace-nowrap text-white/92 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                    <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#f07b1a] transition-transform duration-300 group-hover:scale-x-100" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group relative flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-semibold text-white/92 transition-colors duration-300 hover:text-white"
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
                    <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#f07b1a] transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                )}

                <AnimatePresence>
                  {link.children && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 w-64 pt-3"
                    >
                      <div
                        className={`overflow-hidden rounded-xl border p-2 shadow-2xl backdrop-blur-2xl ${
                          showPill
                            ? "border-white/15 bg-[#0b1a31]/96 shadow-black/40"
                            : "border-white/20 bg-white/12 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)]"
                        }`}
                      >
                        <div className="space-y-0.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={(event) =>
                                handleNavClick(event, child.href)
                              }
                              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-300 ${
                                showPill
                                  ? "hover:bg-white/8"
                                  : "hover:bg-white/15"
                              } ${child.className || ""}`}
                            >
                              <div>
                                <p
                                  className={`font-sans text-[15px] font-medium whitespace-nowrap transition-colors group-hover:text-[#ffae4c] ${
                                    showPill ? "text-white/92" : "text-white"
                                  }`}
                                >
                                  {child.name}
                                </p>
                                {child.description && (
                                  <p
                                    className={`mt-0.5 font-sans text-xs ${
                                      showPill
                                        ? "text-white/55"
                                        : "text-white/75"
                                    }`}
                                  >
                                    {child.description}
                                  </p>
                                )}
                              </div>
                              <ArrowRight
                                size={12}
                                className="shrink-0 text-[#ffae4c] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 font-sans text-sm font-medium text-white/90 transition-colors duration-300 hover:text-white xl:flex max-w-[140px] min-[1350px]:max-w-none"
            >
              <Phone size={14} className="shrink-0" />
              <span className="truncate">{siteConfig.contact.phone}</span>
            </a>
          </div>

          <button
            className="p-2 text-white/70 transition-colors hover:text-white xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
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
              className="fixed inset-y-4 right-4 z-61 flex w-70 flex-col rounded-3xl border border-white/10 bg-[#111827]/90 shadow-2xl backdrop-blur-xl xl:hidden"
            >
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
                      JCT College of
                    </span>
                    <span className="mt-0.5 font-sans text-[9px] font-medium tracking-widest text-white/70 uppercase">
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

              <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                  {artsNav
                    .flatMap((item: ArtsNavItem) =>
                      item.name === "Explore More"
                        ? item.children || []
                        : [item],
                    )
                    .filter(
                      (link) =>
                        !link.className?.includes("hidden") ||
                        link.className?.includes("xl:hidden") ||
                        link.className?.includes("lg:hidden") ||
                        link.className?.includes("2xl:hidden"),
                    )
                    .map((link: ArtsNavItem | ArtsNavChild) => (
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
                                      (child: ArtsNavChild) => (
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
                            className={`block rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${link.href.includes("#") && typeof window !== "undefined" && window.location.hash === (link.href.includes("#") ? link.href.slice(link.href.indexOf("#")) : "") ? "text-arts-science-accent bg-white/10 shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                          >
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ))}
                </div>
              </div>

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
