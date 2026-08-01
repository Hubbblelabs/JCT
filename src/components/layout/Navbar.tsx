"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  ArrowRight,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInstitution } from "@/contexts/InstitutionContext";
import { useSiteConfig } from "@/lib/use-site-config";
import { getImageUrl } from "@/lib/utils";
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

type HeaderConfig = {
  phone?: string;
  studentLoginLabel?: string;
  studentLoginUrl?: string;
  showStudentLogin?: boolean;
};

type NavbarConfigChild = {
  label?: string;
  href?: string;
  file?: string;
  desc?: string;
  visible?: boolean;
};

type NavbarConfigItem = {
  label?: string;
  href?: string;
  file?: string;
  desc?: string;
  visible?: boolean;
  children?: NavbarConfigChild[];
};

type NavbarConfig = {
  items?: NavbarConfigItem[];
};

function navbarKeyFor(institution: string): string {
  if (institution === "engineering") return "engineeringNavbar";
  if (institution === "arts-science") return "artsScienceNavbar";
  if (institution === "polytechnic") return "polytechnicNavbar";
  return "mainNavbar";
}

function headerKeyFor(institution: string): string {
  if (institution === "engineering") return "engineeringHeader";
  if (institution === "arts-science") return "artsScienceHeader";
  if (institution === "polytechnic") return "polytechnicHeader";
  return "mainHeader";
}

function staticNavFor(institution: string): NavItem[] {
  if (institution === "engineering") return engineeringNavigation;
  if (institution === "arts-science") return artsNavigation;
  if (institution === "polytechnic") return polytechnicNavigation;
  return mainNavigation;
}

/**
 * A nav entry can point at an uploaded PDF instead of a route. The CMS stores
 * that as an R2 storage key, so resolve it to a public URL and flag it — file
 * links open in a new tab and get a document icon.
 */
function resolveNavTarget(raw: { href?: string; file?: string }): {
  href: string;
  isFile: boolean;
} {
  const file = raw.file?.trim();
  if (file) return { href: getImageUrl(file) ?? file, isFile: true };
  return { href: raw.href || "#", isFile: false };
}

function applyNavbarConfig(
  cfg: NavbarConfig | null,
  fallback: NavItem[],
): NavItem[] {
  const items = Array.isArray(cfg?.items) ? cfg!.items : [];
  if (items.length === 0) return fallback;
  const result: NavItem[] = [];
  for (const raw of items) {
    if (!raw || raw.visible === false || !raw.label) continue;
    const children = Array.isArray(raw.children)
      ? raw.children
          .filter(
            (c) => c && c.visible !== false && c.label && (c.href || c.file),
          )
          .map<NavChild>((c) => {
            const target = resolveNavTarget(c);
            return {
              name: c.label!,
              href: target.href,
              desc: c.desc,
              isFile: target.isFile,
            };
          })
      : undefined;
    const target = resolveNavTarget(raw);
    result.push({
      name: raw.label,
      href: target.href,
      isFile: target.isFile,
      children: children && children.length > 0 ? children : undefined,
    });
  }
  return result;
}

export function Navbar({ forceSolidOnTop = false }: NavbarProps) {
  const pathname = usePathname();
  const { institution } = useInstitution();
  const navbarKey = navbarKeyFor(institution);
  const headerKey = headerKeyFor(institution);
  const { data: navbarCfg } = useSiteConfig<NavbarConfig>(navbarKey);
  const { data: headerCfgRaw } = useSiteConfig<HeaderConfig>(headerKey);
  const { data: legacyHeader } = useSiteConfig<HeaderConfig>("header");
  const header = headerCfgRaw ?? legacyHeader;

  const isEngineeringPage = institution === "engineering";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [announcementConfig, setAnnouncementConfig] = useState<{
    enabled?: boolean;
    text?: string;
    ctaLabel?: string;
    ctaHref?: string;
  } | null>(null);
  const bannerVisible =
    isEngineeringPage &&
    showBanner &&
    !!announcementConfig?.enabled &&
    !!announcementConfig?.text;

  const [desktopExpanded, setDesktopExpanded] = useState<string | null>(null);
  const [dropdownSolidOverride, setDropdownSolidOverride] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  // Escape closes the mobile drawer and any open desktop dropdown, and returns
  // focus to the menu trigger so keyboard users aren't stranded.
  useEffect(() => {
    if (!isOpen && !desktopExpanded) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (isOpen) menuButtonRef.current?.focus();
      setIsOpen(false);
      setDesktopExpanded(null);
      setMobileExpanded(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, desktopExpanded]);

  useEffect(() => {
    if (!isEngineeringPage) return;
    let cancelled = false;
    fetch("/api/public/site-config?key=engineeringAnnouncement")
      .then((r) => r.json())
      .then((res) => {
        if (!cancelled && res?.source === "db" && res.data) {
          setAnnouncementConfig(res.data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isEngineeringPage]);

  useEffect(() => {
    if (!scrolled && !forceSolidOnTop) {
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

  let logoText = "JCT Institutions";
  let logoSubText = "";
  const logoLink = "/";
  let highlightColor = "text-[#d4a024]";
  let highlightBgColor = "bg-[#d4a024]";
  let highlightHoverBgColor = "hover:bg-[#e8b84a]";
  let highlightShadowColor = "shadow-[#d4a024]/10";

  if (institution === "engineering") {
    logoText = "JCT College of";
    logoSubText = "Engineering & Technology";
  } else if (institution === "arts-science") {
    logoText = "JCT College of";
    logoSubText = "Arts and Science";
    highlightColor = "text-arts-science-accent";
    highlightBgColor = "bg-arts-science-accent";
    highlightHoverBgColor = "hover:bg-arts-science-accent-dark";
    highlightShadowColor = "shadow-arts-science-accent/10";
  } else if (institution === "polytechnic") {
    logoText = "JCT Polytechnic College";
    logoSubText = "Est. 2009";
    highlightColor = "text-slate-400";
    highlightBgColor = "bg-slate-500";
    highlightHoverBgColor = "hover:bg-slate-600";
    highlightShadowColor = "shadow-slate-500/10";
  }

  const navigationLinks = useMemo<NavItem[]>(
    () => applyNavbarConfig(navbarCfg, staticNavFor(institution)),
    [navbarCfg, institution],
  );

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
            <span className="truncate">{announcementConfig?.text}</span>

            {announcementConfig?.ctaLabel && announcementConfig?.ctaHref && (
              <Link
                href={announcementConfig.ctaHref}
                target={
                  announcementConfig.ctaHref.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  announcementConfig.ctaHref.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="hidden shrink-0 underline underline-offset-2 hover:no-underline sm:inline"
              >
                {announcementConfig.ctaLabel}
              </Link>
            )}

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
                  src="/logo/jct_logo.webp"
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
            {navigationLinks.map((link, index) => {
              const basePath = link.href.split("#")[0];
              const isHashLink = link.href.includes("#");
              const isActive =
                !link.isFile &&
                !isHashLink &&
                (link.name === "Home" || link.href === "/"
                  ? pathname === basePath
                  : pathname.startsWith(basePath) && basePath !== "/");
              const hasDropdown = !!link.children;
              // Only a long menu splits into two columns — below that the
              // single column is both narrower to scan and less likely to
              // collide with the viewport edge.
              const twoColumn = (link.children?.length ?? 0) > 6;
              const isExpanded = desktopExpanded === link.name;
              // Items past the midpoint sit close to the right edge, so their
              // panel is right-anchored; earlier ones open to the right. Without
              // this the panel spills outside the viewport at narrower widths.
              const alignRight = index >= navigationLinks.length / 2;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() =>
                    hasDropdown && setDesktopExpanded(link.name)
                  }
                  onMouseLeave={() => hasDropdown && setDesktopExpanded(null)}
                  onFocus={() => hasDropdown && setDesktopExpanded(link.name)}
                  onBlur={(e) => {
                    if (
                      hasDropdown &&
                      !e.currentTarget.contains(e.relatedTarget as Node)
                    )
                      setDesktopExpanded(null);
                  }}
                >
                  {hasDropdown && link.href === "#" ? (
                    <button
                      aria-haspopup="true"
                      aria-expanded={isExpanded}
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
                      target={link.isFile ? "_blank" : undefined}
                      rel={link.isFile ? "noopener noreferrer" : undefined}
                      aria-haspopup={hasDropdown ? "true" : undefined}
                      aria-expanded={hasDropdown ? isExpanded : undefined}
                      className={`group relative flex items-center justify-center gap-1 px-2 py-2 font-sans text-sm font-medium transition-colors xl:gap-1.5 xl:px-3 xl:text-[14px] 2xl:px-4 2xl:text-[15px] ${
                        isActive
                          ? highlightColor
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {link.isFile && (
                        <FileText size={13} className="shrink-0" />
                      )}
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
                          className={`absolute top-full z-50 pt-4 ${alignRight ? "right-0" : "left-0"}`}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.985 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className={`scrollbar-hide max-h-[min(70vh,32rem)] overflow-y-auto rounded-2xl border p-2 whitespace-normal shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)] backdrop-blur-2xl ${
                              twoColumn
                                ? "w-[min(40rem,calc(100vw-3rem))]"
                                : "w-[min(18rem,calc(100vw-3rem))]"
                            } ${
                              isDropdownSolid
                                ? "border-white/10 bg-[#0a1628]/96"
                                : "border-white/20 bg-[#0a1628]/70"
                            }`}
                          >
                            <div
                              className={
                                twoColumn
                                  ? "grid grid-cols-2 items-start gap-x-1"
                                  : ""
                              }
                            >
                              {link.children?.map((child: NavChild) => {
                                const isChildHashLink =
                                  child.href.includes("#");
                                const childPath = child.href.split("#")[0];
                                const isChildActive =
                                  !child.isFile &&
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
                                    target={child.isFile ? "_blank" : undefined}
                                    rel={
                                      child.isFile
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className={`group block rounded-lg px-4 py-3 font-sans transition-colors ${
                                      isDropdownSolid
                                        ? "hover:bg-white/10"
                                        : "hover:bg-white/15"
                                    } ${isChildActive ? "bg-white/10" : ""} ${child.className || ""}`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="min-w-0">
                                        <div
                                          className={`flex items-center gap-1.5 text-[15px] font-medium break-words transition-colors ${highlightColor.replace("text-", "group-hover:text-")} ${
                                            isChildActive
                                              ? highlightColor
                                              : isDropdownSolid
                                                ? "text-white/90"
                                                : "text-white"
                                          }`}
                                        >
                                          {child.isFile && (
                                            <FileText
                                              size={13}
                                              className="shrink-0"
                                            />
                                          )}
                                          <span className="min-w-0">
                                            {child.name}
                                          </span>
                                        </div>
                                        {child.desc && (
                                          <div
                                            className={`mt-0.5 text-[13px] break-words transition-colors group-hover:text-white/80 ${
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
                            </div>
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
            {header?.phone && (
              <a
                href={`tel:${header.phone.replace(/\s/g, "")}`}
                className="flex max-w-[180px] items-center gap-1 font-sans text-sm font-medium text-white/90 transition-colors hover:text-white min-[1400px]:max-w-none xl:gap-1.5 xl:text-[14px] 2xl:text-[15px]"
              >
                <Phone
                  size={16}
                  className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4"
                />
                <span className="truncate">{header.phone}</span>
              </a>
            )}
            {pathname === "/" &&
              header?.showStudentLogin !== false &&
              header?.studentLoginUrl && (
                <Link
                  href={header.studentLoginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-9 items-center justify-center rounded-full px-4 font-sans text-sm font-medium transition-all hover:scale-105 active:scale-95 xl:h-10 xl:px-5 xl:text-[14px] 2xl:text-[15px] ${
                    isSolid
                      ? `${highlightBgColor} font-semibold text-[#0a1628] shadow-lg shadow-black/20 ${highlightHoverBgColor}`
                      : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  }`}
                >
                  {header.studentLoginLabel || "Student Login"}
                </Link>
              )}
          </div>

          <button
            ref={menuButtonRef}
            className="z-50 ml-auto p-2 text-white transition-colors hover:text-white/80 xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
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
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-4 right-4 z-61 flex w-[min(19rem,calc(100vw-2rem))] flex-col rounded-3xl border border-white/10 bg-[#0a1628]/95 shadow-2xl backdrop-blur-xl xl:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9">
                    <Image
                      src="/logo/jct_logo.webp"
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
                  aria-label="Close menu"
                  className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
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
                            className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left font-sans text-[15px] font-medium transition-all ${mobileExpanded === link.name ? "bg-white/10 text-white shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                          >
                            <span className="min-w-0 break-words">
                              {link.name}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 transition-transform duration-300 ${mobileExpanded === link.name ? "rotate-180" : ""}`}
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
                                      !child.isFile &&
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
                                        target={
                                          child.isFile ? "_blank" : undefined
                                        }
                                        rel={
                                          child.isFile
                                            ? "noopener noreferrer"
                                            : undefined
                                        }
                                        className={`block rounded-lg px-4 py-3 font-sans transition-colors hover:bg-white/5 ${isChildActive ? `bg-white/5 ${highlightColor}` : highlightColor.replace("text-", "hover:text-")}`}
                                      >
                                        <div
                                          className={`flex items-center gap-1.5 text-sm break-words ${isChildActive ? "font-medium" : "text-white/70"}`}
                                        >
                                          {child.isFile && (
                                            <FileText
                                              size={13}
                                              className="shrink-0"
                                            />
                                          )}
                                          <span className="min-w-0">
                                            {child.name}
                                          </span>
                                        </div>
                                        {child.desc && (
                                          <div
                                            className={`mt-0.5 text-xs break-words ${isChildActive ? "text-white/60" : "text-white/40"}`}
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
                          target={link.isFile ? "_blank" : undefined}
                          rel={link.isFile ? "noopener noreferrer" : undefined}
                          className={`flex items-center gap-1.5 rounded-xl px-4 py-3 font-sans text-[15px] font-medium break-words transition-all ${!link.isFile && pathname === link.href ? `bg-white/10 ${highlightColor} shadow-sm` : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                        >
                          {link.isFile && (
                            <FileText size={14} className="shrink-0" />
                          )}
                          <span className="min-w-0">{link.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-white/5 p-5 pt-2">
                {header?.phone && (
                  <a
                    href={`tel:${header.phone.replace(/\s/g, "")}`}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/5 font-sans text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]"
                  >
                    <Phone size={16} /> {header.phone}
                  </a>
                )}
                {pathname === "/" &&
                  header?.showStudentLogin !== false &&
                  header?.studentLoginUrl && (
                    <Link
                      href={header.studentLoginUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl ${highlightBgColor} font-sans text-sm font-bold text-[#0a1628] shadow-lg ${highlightShadowColor} transition-all hover:scale-[1.02] ${highlightHoverBgColor} active:scale-[0.98]`}
                    >
                      {header.studentLoginLabel || "Student Login"}{" "}
                      <ArrowRight size={14} />
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
