"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    name: "Institutions",
    href: "#institutions",
    children: [
      {
        name: "JCT College of Engineering & Technology",
        short: "Engineering",
        href: "/engineering",
        desc: "B.E. / B.Tech programs in CS, ECE, Mech, Civil, EEE & IT",
        logo: "/jct_engineering1.png",
      },
      {
        name: "JCT College of Arts & Science",
        short: "Arts & Science",
        href: "/arts-science",
        desc: "B.Sc, B.Com, BBA programs with placement-focused training",
        logo: "/jct_arts1.png",
      },
      {
        name: "JCT Polytechnic College",
        short: "Polytechnic",
        href: "/polytechnic",
        desc: "3-year diploma programs with hands-on lab training",
        logo: "/jct_polytechnic1.png",
      },
    ],
  },
  { name: "About", href: "#about" },
  { name: "Programs", href: "#programs" },
  { name: "Placements", href: "#placements" },
  { name: "Campus Life", href: "#campus-life" },
  { name: "Admissions", href: "#admissions" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gold text-navy fixed top-0 right-0 left-0 z-[60] px-4 py-2 text-center font-sans text-xs font-bold tracking-wide">
        🎓 Admissions Open 2026-27 —{" "}
        <Link
          href="#admissions"
          className="underline underline-offset-2 hover:no-underline"
        >
          Apply Now
        </Link>
      </div>

      {/* Main Nav */}
      <nav
        className={`fixed top-[32px] right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy/95 shadow-navy/10 py-3 shadow-lg backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
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
              <h1 className="font-serif text-sm leading-none font-bold tracking-tight text-white md:text-lg">
                JCT Institutions
              </h1>
              <span className="mt-0.5 hidden font-sans text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase sm:block">
                Est. 2009
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {link.name}
                  {link.children && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                {link.children && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full -left-4 w-110 pt-4"
                      >
                        <div className="bg-navy-mid/95 relative overflow-hidden rounded-2xl border border-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                          {/* Background logo watermark */}
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <Image
                              src="/jct_logo_blue.png"
                              alt=""
                              width={200}
                              height={200}
                              className="object-contain opacity-[0.04]"
                            />
                          </div>

                          <div className="relative z-10 space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.short}
                                href={child.href}
                                className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-white/6"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="group-hover:text-gold font-sans text-sm font-semibold text-white transition-colors">
                                    {child.short}
                                  </p>
                                  <p className="mt-0.5 font-sans text-[11px] leading-relaxed text-white/40 transition-colors group-hover:text-white/55">
                                    {child.desc}
                                  </p>
                                </div>
                                <div className="bg-gold/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all duration-200 group-hover:opacity-100">
                                  <ArrowRight size={13} className="text-gold" />
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Bottom accent line */}
                          <div className="mt-2 border-t border-white/6 px-4 pt-3 pb-2">
                            <p className="font-sans text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">
                              3 Institutions · 50+ Programs · Since 2009
                            </p>
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
              href="tel:+919361488801"
              className="flex items-center gap-1.5 font-sans text-sm text-white/60 transition-colors hover:text-white"
            >
              <Phone size={14} /> +91 93614 88801
            </a>
            <Link
              href="#admissions"
              className="bg-gold text-navy hover:bg-gold-light shadow-gold/20 inline-flex h-10 items-center gap-2 rounded-full px-6 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
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
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="bg-navy fixed inset-y-0 right-0 z-[61] flex w-full flex-col sm:w-96 lg:hidden"
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
                    JCT
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
              <div className="flex-1 space-y-0 overflow-y-auto px-4 py-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {link.children ? (
                      <div className="relative mt-1 mb-2 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-3 py-2 shadow-inner">
                        {/* Background logo watermark */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <Image
                            src="/jct_logo_blue.png"
                            alt=""
                            width={180}
                            height={180}
                            className="object-contain opacity-[0.04]"
                          />
                        </div>

                        <div className="relative z-10">
                          <p className="text-gold mb-2 px-1 font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
                            {link.name}
                          </p>
                          <div className="space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.short}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="group block rounded-xl p-2.5 transition-colors hover:bg-white/5"
                              >
                                <p className="group-hover:text-gold font-sans text-sm font-medium text-white transition-colors">
                                  {child.short}
                                </p>
                                <p className="mt-0.5 font-sans text-[11px] text-white/40">
                                  {child.desc}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block border-b border-white/5 py-2.5 font-sans text-[15px] font-medium text-white/80 transition-colors hover:text-white"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="space-y-2.5 border-t border-white/5 p-4">
                <a
                  href="tel:+919361488801"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Phone size={16} /> +91 93614 88801
                </a>
                <Link
                  href="#admissions"
                  onClick={() => setIsOpen(false)}
                  className="bg-gold text-navy hover:bg-gold-light flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-bold transition-colors"
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
