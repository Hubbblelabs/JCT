"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  { name: "Home", href: "/institutions/engineering#top" },
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
  {
    name: "About Us",
    href: "/institutions/engineering#about",
  },
  {
    name: "Courses",
    href: "/institutions/engineering#courses",
  },
  {
    name: "Placements",
    href: "/institutions/engineering#placements",
  },
  {
    name: "COE",
    href: "/examinations",
  },
  {
    name: "Life @ JCT",
    href: "/institutions/engineering#life-at-jct",
  },
  {
    name: "Explore More",
    href: "#",
    children: [
      { name: "About", href: "/about" },
      { name: "Examinations", href: "/examinations" },
      { name: "Governance", href: "/governance" },
      { name: "Quality", href: "/quality" },
      { name: "Mandatory Disclosure", href: "/mandatory-disclosure" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function EngineeringNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPhoneCta, setShowPhoneCta] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowPhoneCta(window.scrollY > window.innerHeight * 0.8);
    };
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
      {bannerVisible && (
        <div className="bg-gold fixed top-0 right-0 left-0 z-60 text-[#0B1628]">
          <div className="relative flex w-full items-center justify-center px-3 py-2 text-center font-sans text-[11px] font-bold tracking-wide sm:px-10 sm:text-xs">
            <span className="pr-6 leading-tight whitespace-nowrap">
              Admissions Open 2026-27 | Counselling Code: {siteConfig.counsellingCode}
            </span>
            <Link
              href="/admissions/apply"
              className="hidden pl-1 font-extrabold underline underline-offset-2 hover:no-underline sm:inline"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 opacity-70 transition-opacity hover:bg-[#0B1628]/10 hover:opacity-100"
              aria-label="Dismiss announcement"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <nav
        className={`fixed right-0 left-0 z-50 px-4 transition-all duration-300 md:px-8 ${bannerVisible ? "top-11" : "top-4"}`}
      >
        <div
          className={`mx-auto flex w-full max-w-360 items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 lg:px-7 ${
            isSolid
              ? "border-white/10 bg-[#0B1628]/95 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
              : "border-white/0 bg-transparent"
          }`}
        >
          <div className="z-50 flex shrink-0 items-center justify-start xl:flex-1">
            <Link
              href="/institutions/engineering"
              className="flex shrink-0 items-center gap-2 lg:gap-3"
            >
              <div className="relative h-7 w-7 lg:h-10 lg:w-10">
                <Image
                  src="/jct_logo_yellow.png"
                  alt="JCT Logo"
                  fill
                  sizes="(min-width: 1024px) 40px, 28px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col text-white">
                <span className="font-serif text-[18px] leading-none font-bold tracking-tight lg:text-[22px]">
                  JCT College of
                </span>
                <span className="pt-0.5 font-sans text-[9px] font-semibold tracking-[0.18em] whitespace-nowrap text-white/70 uppercase lg:text-[11px]">
                  Engineering & Technology
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden items-center justify-center whitespace-nowrap xl:flex">
            {engineeringNavigation.map((link) => {
              const hasDropdown = !!link.children;
              const isExpanded = desktopExpanded === link.name;
              const linkPath = link.href.split("#")[0];
              const isActive =
                link.name === "Home"
                  ? pathname === "/institutions/engineering"
                  : link.href !== "#" &&
                    !link.href.includes("#") &&
                    pathname.startsWith(linkPath);

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
                      type="button"
                      onClick={() =>
                        setDesktopExpanded(isExpanded ? null : link.name)
                      }
                      className={`group relative flex items-center justify-center gap-1.5 px-3 py-2 font-sans text-sm font-medium transition-colors xl:px-5 xl:text-[15px] ${
                        isExpanded
                          ? "text-[#d4a024]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                      <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#d4a024] transition-transform duration-300 group-hover:scale-x-100 xl:right-5 xl:left-5" />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`group relative flex items-center justify-center px-3 py-2 font-sans text-sm font-medium transition-colors xl:px-5 xl:text-[15px] ${
                        isActive
                          ? "text-[#d4a024]"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {link.name}
                      {isActive ? (
                        <span className="absolute right-3 bottom-1 left-3 h-0.5 bg-[#d4a024] xl:right-5 xl:left-5" />
                      ) : (
                        <span className="absolute right-3 bottom-1 left-3 h-[1.5px] origin-left scale-x-0 bg-[#d4a024] transition-transform duration-300 group-hover:scale-x-100 xl:right-5 xl:left-5" />
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
                            className={`w-70 rounded-2xl border p-2 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.65)] backdrop-blur-2xl ${
                              isSolid
                                ? "border-white/10 bg-[#0B1628]/96"
                                : "border-white/20 bg-white/12"
                            }`}
                          >
                            {link.children?.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setDesktopExpanded(null)}
                                className={`group block rounded-lg px-4 py-3 font-sans transition-colors ${
                                  isSolid
                                    ? "hover:bg-white/10"
                                    : "hover:bg-white/15"
                                } ${child.className || ""}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <div
                                      className={`text-[15px] font-medium whitespace-nowrap ${
                                        isSolid ? "text-white/90" : "text-white"
                                      }`}
                                    >
                                      {child.name}
                                    </div>
                                    {child.desc && (
                                      <div
                                        className={`mt-0.5 text-[13px] ${
                                          isSolid
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
                                    className="shrink-0 text-[#d4a024] opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                </div>
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

          <div className="z-50 hidden shrink-0 items-center justify-end gap-3 whitespace-nowrap xl:flex xl:flex-1 xl:gap-6">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\\s/g, "")}`}
              className="flex items-center gap-1.5 font-sans text-sm font-medium text-white/90 transition-colors hover:text-white xl:gap-2 xl:text-[15px]"
            >
              <Phone size={16} className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
              {siteConfig.contact.phone}
            </a>
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
              className="fixed inset-y-4 right-4 z-61 flex w-72 flex-col rounded-3xl border border-white/10 bg-[#0B1628]/90 shadow-2xl backdrop-blur-xl xl:hidden"
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
                      JCT College of
                    </span>
                    <span className="mt-0.5 text-[9px] font-medium tracking-[0.14em] text-white/50 uppercase">
                      Engineering & Technology
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
                  {engineeringNavigation.map((link) => (
                    <div key={link.name} className="overflow-hidden">
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
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileExpanded(null);
                                      }}
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
                          onClick={() => setIsOpen(false)}
                          className="block rounded-xl px-4 py-3 font-sans text-[15px] font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white"
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
                  href={`tel:${siteConfig.contact.phone.replace(/\\s/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#d4a024] font-sans text-sm font-bold text-[#0B1628] shadow-lg shadow-[#d4a024]/10 transition-all hover:bg-[#e8b84a] hover:scale-[1.02] active:scale-[0.98]"
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
