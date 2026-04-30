"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";
import { useInstitution } from "@/contexts/InstitutionContext";
import {
  mainNavigation,
  engineeringNavigation,
  artsNavigation,
  polytechnicNavigation,
  type NavItem,
  type NavChild,
} from "@/data/all-navigations";

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function Navbar({ forceSolidOnTop = false }: NavbarProps) {
  const pathname = usePathname();
  const { institution } = useInstitution();

  const isEngineeringPage = institution === "engineering";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const bannerVisible = isEngineeringPage && showBanner;

  const [desktopExpanded, setDesktopExpanded] = useState<string | null>(null);
  const [dropdownSolidOverride, setDropdownSolidOverride] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const solidOverrideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  useEffect(() => {
    if (!scrolled && !forceSolidOnTop) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDropdownSolidOverride(true);
      if (solidOverrideTimeoutRef.current) {
        clearTimeout(solidOverrideTimeoutRef.current);
      }
      solidOverrideTimeoutRef.current = setTimeout(() => {
        setDropdownSolidOverride(false);
      }, 400);
    }
    return () => {
      if (solidOverrideTimeoutRef.current) {
        clearTimeout(solidOverrideTimeoutRef.current);
      }
    };
  }, [scrolled, forceSolidOnTop]);

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  const isSolid = scrolled || forceSolidOnTop;
  const isDropdownSolid = isSolid || dropdownSolidOverride || !!desktopExpanded;

  let navigationLinks: NavItem[] = mainNavigation;
  let logoText = "JCT Institutions";
  let logoSubText = "";
  let logoLink = "/";
  let highlightColor = "text-[#d4a024]";
  let highlightBgColor = "bg-[#d4a024]";
  let highlightHoverBgColor = "hover:bg-[#e8b84a]";
  let highlightShadowColor = "shadow-[#d4a024]/10";

  if (institution === "engineering") {
    navigationLinks = engineeringNavigation;
    logoText = "JCT College of";
    logoSubText = "Engineering & Technology";
    logoLink = "/institutions/engineering";
  } else if (institution === "arts-science") {
    navigationLinks = artsNavigation;
    logoText = "JCT College of";
    logoSubText = "Arts and Science";
    logoLink = "/institutions/arts-science";
    highlightColor = "text-orange-500";
    highlightBgColor = "bg-orange-500";
    highlightHoverBgColor = "hover:bg-orange-600";
    highlightShadowColor = "shadow-orange-500/10";
  } else if (institution === "polytechnic") {
    navigationLinks = polytechnicNavigation;
    logoText = "JCT Polytechnic College";
    logoSubText = "Est. 2009";
    logoLink = "/institutions/polytechnic";
    highlightColor = "text-slate-400";
    highlightBgColor = "bg-slate-500";
    highlightHoverBgColor = "hover:bg-slate-600";
    highlightShadowColor = "shadow-slate-500/10";
  }

  const isSamePageHashLink = (href: string) => {
    return href.startsWith("#") || href.includes("#");
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMobileMenu = false,
  ) => {
    if (closeMobileMenu) {
      setIsOpen(false);
      setMobileExpanded(null);
    }

    if (href === "#") {
      e.preventDefault();
      return;
    }

    if (!isSamePageHashLink(href)) return;

    const hashIndex = href.indexOf("#");
    const hash = hashIndex !== -1 ? href.slice(hashIndex) : "";
    const basePath = hashIndex !== -1 ? href.slice(0, hashIndex) : href;

    if (!hash || hash === "#") return;

    if (
      window.location.pathname === basePath ||
      (basePath === "" && window.location.pathname === logoLink)
    ) {
      e.preventDefault();
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;

      const nav = document.querySelector("nav") as HTMLElement | null;
      const offset = (nav?.offsetHeight ?? 88) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: "smooth" });
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${hash}`,
      );
    }
  };

  return (
    <>
      {bannerVisible && (
        <div className="bg-gold text-navy fixed top-0 right-0 left-0 z-60 px-3 py-2 text-center font-sans text-[11px] font-bold tracking-wide sm:px-4 sm:text-xs">
          <div className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="truncate">
              🎓 Admissions Open 2026-27 | Counselling Code:{" "}
              {siteConfig.counsellingCode}
            </span>

            <Link
              href="/apply-now"
              className="hidden shrink-0 underline underline-offset-2 hover:no-underline sm:inline"
            >
              Apply Now
            </Link>

            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
              aria-label="Dismiss announcement"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <nav
        className={`fixed ${bannerVisible ? "top-10" : "top-4"} right-0 left-0 z-50 px-4 transition-all duration-300 md:px-8`}
      >
        <div
          className={`mx-auto flex w-full max-w-360 items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 lg:px-5 xl:px-6 2xl:px-8 ${isSolid ? "border-white/10 bg-[#0a1628]/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md" : "border-white/0 bg-transparent"}`}
        >
          <div className="z-50 flex shrink-0 items-center justify-start xl:flex-1">
            <Link
              href={logoLink}
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
              <div className="flex flex-col justify-center">
                <span className="font-sans text-lg leading-none font-bold tracking-tight whitespace-nowrap text-white drop-shadow-sm transition-colors lg:text-xl xl:text-[20px]">
                  {logoText}
                </span>
                {logoSubText && (
                  <span className="mt-1 font-sans text-[9px] leading-none font-medium tracking-[0.14em] text-white/60 uppercase lg:text-[10px]">
                    {logoSubText}
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div
            className="hidden items-center justify-center whitespace-nowrap xl:flex"
            ref={dropdownRef}
          >
            {navigationLinks.map((link) => {
              const basePath = link.href.split("#")[0];
              const isHashLink = link.href.includes("#");
              const isActive =
                !isHashLink &&
                (link.name === "Home" || link.href === "/"
                  ? pathname === basePath
                  : pathname.startsWith(basePath) && basePath !== "/");
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
                  {hasDropdown && link.href === "#" ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDesktopExpanded(isExpanded ? null : link.name);
                      }}
                      className={`group relative flex items-center justify-center gap-1 px-2 py-2 font-sans text-sm font-medium transition-colors xl:gap-1.5 xl:px-3 xl:text-[14px] 2xl:px-4 2xl:text-[15px] ${
                        isExpanded
                          ? highlightColor
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                      <span
                        className={`absolute right-1 bottom-1 left-1 h-[1.5px] origin-left ${highlightBgColor} transition-transform duration-300 xl:right-3 xl:left-3 2xl:right-4 2xl:left-4 ${isExpanded ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`group relative flex items-center justify-center gap-1 px-2 py-2 font-sans text-sm font-medium transition-colors xl:gap-1.5 xl:px-3 xl:text-[14px] 2xl:px-4 2xl:text-[15px] ${
                        isActive
                          ? highlightColor
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {hasDropdown && (
                        <ChevronDown
                          size={14}
                          className={`ml-1 transition-transform duration-200 xl:ml-1.5 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                      <span
                        className={`absolute right-1 bottom-1 left-1 h-[1.5px] origin-left ${highlightBgColor} transition-transform duration-300 xl:right-3 xl:left-3 2xl:right-4 2xl:left-4 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                      />
                    </Link>
                  )}

                  {hasDropdown && (
                    <AnimatePresence>
                      {isExpanded && (
                        <div
                          className={`absolute top-full z-50 pt-4 ${link.name === "More" ? "right-0" : "left-0"}`}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.985 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className={`rounded-2xl border p-2 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)] backdrop-blur-2xl ${
                              link.name === "More"
                                ? "grid w-[600px] grid-cols-2 gap-x-2 gap-y-1"
                                : "w-72"
                            } ${
                              isDropdownSolid
                                ? "border-white/10 bg-[#0a1628]/96"
                                : "border-white/20 bg-[#0a1628]/70"
                            }`}
                          >
                            {link.children?.map((child: NavChild) => {
                              const isChildHashLink = child.href.includes("#");
                              const childPath = child.href.split("#")[0];
                              const isChildActive =
                                !isChildHashLink &&
                                (childPath !== "/"
                                  ? pathname === childPath ||
                                    pathname.startsWith(`${childPath}/`)
                                  : pathname === "/");

                              return (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  onClick={(e) => {
                                    setDesktopExpanded(null);
                                    handleNavClick(e, child.href);
                                  }}
                                  className={`group block rounded-lg px-4 py-3 font-sans transition-colors ${
                                    isDropdownSolid
                                      ? "hover:bg-white/10"
                                      : "hover:bg-white/15"
                                  } ${isChildActive ? "bg-white/10" : ""} ${child.className || ""}`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <div
                                        className={`text-[15px] font-medium whitespace-nowrap transition-colors ${highlightColor.replace("text-", "group-hover:text-")} ${
                                          isChildActive
                                            ? highlightColor
                                            : isDropdownSolid
                                              ? "text-white/90"
                                              : "text-white"
                                        }`}
                                      >
                                        {child.name}
                                      </div>
                                      {child.desc && (
                                        <div
                                          className={`mt-0.5 text-[13px] whitespace-nowrap transition-colors group-hover:text-white/80 ${
                                            isChildActive
                                              ? "text-white/70"
                                              : isDropdownSolid
                                                ? "text-white/50"
                                                : "text-white/75"
                                          }`}
                                        >
                                          {child.desc}
                                        </div>
                                      )}
                                    </div>
                                    <ArrowRight
                                      size={14}
                                      className={`shrink-0 -translate-x-1 ${highlightColor} transition-all duration-300 ${isChildActive ? "translate-x-0 opacity-100" : "opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                                    />
                                  </div>
                                </Link>
                              );
                            })}
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          <div className="z-50 hidden shrink-0 items-center justify-end gap-2 whitespace-nowrap xl:flex xl:flex-1 xl:gap-3 2xl:gap-6">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="flex max-w-[180px] items-center gap-1 font-sans text-sm font-medium text-white/90 transition-colors hover:text-white min-[1400px]:max-w-none xl:gap-1.5 xl:text-[14px] 2xl:text-[15px]"
            >
              <Phone size={16} className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4" />
              <span className="truncate">{siteConfig.contact.phone}</span>
            </a>
            {institution === "main" && (
              <Link
                href="/apply-now"
                className={`inline-flex h-9 items-center justify-center rounded-full px-4 font-sans text-sm font-medium transition-all hover:scale-105 active:scale-95 xl:h-10 xl:px-5 xl:text-[14px] 2xl:text-[15px] ${
                  isSolid
                    ? `${highlightBgColor} font-semibold text-[#0a1628] shadow-lg shadow-black/20 ${highlightHoverBgColor}`
                    : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                }`}
              >
                Apply Now
              </Link>
            )}
          </div>

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
              className="fixed inset-y-4 right-4 z-61 flex w-76 flex-col rounded-3xl border border-white/10 bg-[#0a1628]/95 shadow-2xl backdrop-blur-xl xl:hidden"
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
                  <div className="flex flex-col">
                    <span className="font-serif text-lg leading-none font-bold text-white">
                      {logoText}
                    </span>
                    {logoSubText && (
                      <span className="mt-0.5 text-[9px] font-medium tracking-[0.14em] text-white/50 uppercase">
                        {logoSubText}
                      </span>
                    )}
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
                  {navigationLinks.map((link) => (
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
                                  {link.children?.map((child: NavChild) => {
                                    const isChildHashLink =
                                      child.href.includes("#");
                                    const childPath = child.href.split("#")[0];
                                    const isChildActive =
                                      !isChildHashLink &&
                                      (childPath !== "/"
                                        ? pathname === childPath ||
                                          pathname.startsWith(`${childPath}/`)
                                        : pathname === "/");

                                    return (
                                      <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={(e) =>
                                          handleNavClick(e, child.href, true)
                                        }
                                        className={`block rounded-lg px-4 py-3 font-sans transition-colors hover:bg-white/5 ${isChildActive ? `bg-white/5 ${highlightColor}` : highlightColor.replace("text-", "hover:text-")}`}
                                      >
                                        <div
                                          className={`text-sm ${isChildActive ? "font-medium" : "text-white/70"}`}
                                        >
                                          {child.name}
                                        </div>
                                        {child.desc && (
                                          <div
                                            className={`mt-0.5 text-xs ${isChildActive ? "text-white/60" : "text-white/40"}`}
                                          >
                                            {child.desc}
                                          </div>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href, true)}
                          className={`block rounded-xl px-4 py-3 font-sans text-[15px] font-medium transition-all ${pathname === link.href ? `bg-white/10 ${highlightColor} shadow-sm` : "text-white/70 hover:bg-white/5 hover:text-white"}`}
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
                {institution === "main" && (
                  <Link
                    href="/apply-now"
                    onClick={() => setIsOpen(false)}
                    className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl ${highlightBgColor} font-sans text-sm font-bold text-[#0a1628] shadow-lg ${highlightShadowColor} transition-all hover:scale-[1.02] ${highlightHoverBgColor} active:scale-[0.98]`}
                  >
                    Apply Now <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
