"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Menu, Phone, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site";

type ArtsNavItem = {
  name: string;
  href: string;
  children?: { name: string; href: string; description?: string }[];
};

const artsNav: ArtsNavItem[] = [
  { name: "Home", href: "#hero" },
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
  { name: "About Us", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Admission", href: "#admission" },
  { name: "Contact", href: "#contact" },
  {
    name: "Explore More",
    href: "#",
    children: [
      { name: "Placements", href: "#placements", description: "Our recruitment partners & stats" },
      { name: "Life @ JCT", href: "#life", description: "News, events & student life" },
      { name: "Testimonials", href: "#testimonials", description: "Voices from our community" }
    ]
  },
];

type NavbarProps = {
  forceSolidOnTop?: boolean;
};

export function ArtsScienceNavbar({ forceSolidOnTop = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const toggleMobileSection = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.95)"]
  );
  
  const navBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(55, 65, 81, 0)", "rgba(55, 65, 81, 0.4)"]
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
          backgroundColor: forceSolidOnTop ? "rgba(17, 24, 39, 0.95)" : navBackground,
          borderColor: forceSolidOnTop ? "rgba(55, 65, 81, 0.4)" : navBorder,
          borderBottomWidth: "1px",
        }}
        className="fixed top-0 right-0 left-0 z-50 py-3 shadow-lg backdrop-blur-xl transition-all duration-300"
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/institutions/arts-science" className="flex shrink-0 items-center gap-3">
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
              <span className="font-sans text-[10px] font-medium tracking-[0.1em] text-white/70 uppercase pt-0.5">
                Arts & Science
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 lg:flex">
            {artsNav.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children && link.href === "#" ? (
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium text-white/70 transition-colors hover:text-white"
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
                    className="flex items-center gap-1 px-3 py-2 font-sans text-[14px] font-medium text-white/70 transition-colors hover:text-white"
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
                        <div className="bg-[#111827]/95 overflow-hidden rounded-xl border border-white/10 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                          <div className="space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-white/5"
                              >
                                <div>
                                  <p className="font-sans text-[15px] font-medium text-white/90 transition-colors group-hover:text-arts-science-primary group-hover:text-amber-500">
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
              className="hidden items-center gap-1.5 font-sans text-sm text-white/60 transition-colors hover:text-white xl:flex"
            >
              <Phone size={14} /> {siteConfig.contact.phone}
            </a>
            <Link
              href="/admissions/apply"
              className="bg-arts-science-accent text-white hover:bg-orange-500 shadow-arts-science-accent/20 inline-flex h-9 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
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
              className="bg-[#111827] border-l border-slate-700/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] fixed inset-y-0 right-0 z-61 flex w-full flex-col sm:w-96 lg:hidden"
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
                  <div className="flex flex-col text-white">
                    <span className="font-serif text-lg leading-none font-bold">JCT</span>
                    <span className="font-sans text-[9px] font-medium tracking-[0.1em] text-white/70 uppercase">
                      Arts & Science
                    </span>
                  </div>
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
                {artsNav.map((link) => (
                  <div key={link.name} className="border-b border-white/5">
                    {link.children ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleMobileSection(link.name)}
                          className="flex w-full items-center justify-between py-3 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
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
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pb-2"
                            >
                              <div className="space-y-1 pl-4">
                                {link.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setMobileExpanded(null);
                                    }}
                                    className="block rounded-lg px-3 py-2 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
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
                        className="block py-3 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="space-y-2.5 border-t border-white/5 p-4">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Phone size={16} /> {siteConfig.contact.phone}
                </a>
                <Link
                  href="#admission"
                  onClick={() => setIsOpen(false)}
                  className="bg-arts-science-accent text-white hover:bg-orange-500 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-bold transition-colors"
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

