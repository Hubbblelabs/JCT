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
        href: "/institutions/engineering",
        desc: "B.E. / B.Tech programs in CS, ECE, Mech, Civil, EEE & IT",
        logo: "/jct_engineering1.png",
      },
      {
        name: "JCT College of Arts & Science",
        short: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.Sc, B.Com, BBA programs with placement-focused training",
        logo: "/jct_arts1.png",
      },
      {
        name: "JCT Polytechnic College",
        short: "Polytechnic",
        href: "/institutions/polytechnic",
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
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gold text-navy text-center text-xs font-sans font-bold tracking-wide py-2 px-4">
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
        className={`fixed top-[32px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy/95 backdrop-blur-xl py-3 shadow-lg shadow-navy/10"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 md:w-11 md:h-11">
              <Image
                src="/jct_logo_yellow.png"
                alt="JCT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-lg font-serif font-bold text-white leading-none tracking-tight">
                JCT Institutions
              </h1>
              <span className="hidden sm:block text-[10px] text-white/40 font-sans font-medium tracking-[0.2em] uppercase mt-0.5">
                Est. 2009
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
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
                  className="flex items-center gap-1 px-3 py-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors"
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
                        className="absolute top-full -left-4 pt-4 w-110"
                      >
                        <div className="bg-navy-mid/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/30 border border-white/10 p-3 relative overflow-hidden">
                          {/* Background logo watermark */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/6 transition-all duration-200 group"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-sans font-semibold text-white group-hover:text-gold transition-colors">
                                    {child.short}
                                  </p>
                                  <p className="text-[11px] text-white/40 font-sans leading-relaxed mt-0.5 group-hover:text-white/55 transition-colors">
                                    {child.desc}
                                  </p>
                                </div>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gold/10">
                                  <ArrowRight size={13} className="text-gold" />
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Bottom accent line */}
                          <div className="mt-2 pt-3 border-t border-white/6 px-4 pb-2">
                            <p className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-white/25">
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
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919361488801"
              className="flex items-center gap-1.5 text-sm font-sans text-white/60 hover:text-white transition-colors"
            >
              <Phone size={14} /> +91 93614 88801
            </a>
            <Link
              href="#admissions"
              className="h-10 px-6 bg-gold text-navy font-sans font-bold text-sm rounded-full hover:bg-gold-light transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-gold/20"
            >
              Apply Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-navy z-[61] lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9">
                    <Image
                      src="/jct_logo_yellow.png"
                      alt="JCT"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg font-serif font-bold text-white">
                    JCT
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/60 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {link.children ? (
                      <div className="py-2 relative mt-1 mb-2 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden p-3 shadow-inner">
                        {/* Background logo watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Image
                            src="/jct_logo_blue.png"
                            alt=""
                            width={180}
                            height={180}
                            className="object-contain opacity-[0.04]"
                          />
                        </div>

                        <div className="relative z-10">
                          <p className="text-[10px] font-sans font-bold text-gold uppercase tracking-[0.2em] mb-2 px-1">
                            {link.name}
                          </p>
                          <div className="space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.short}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                              >
                                <p className="text-sm font-sans font-medium text-white group-hover:text-gold transition-colors">
                                  {child.short}
                                </p>
                                <p className="text-[11px] text-white/40 font-sans mt-0.5">
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
                        className="block py-2.5 text-[15px] font-sans font-medium text-white/80 hover:text-white transition-colors border-b border-white/5"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 space-y-2.5">
                <a
                  href="tel:+919361488801"
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white/5 text-white font-sans font-medium text-sm hover:bg-white/10 transition-colors"
                >
                  <Phone size={16} /> +91 93614 88801
                </a>
                <Link
                  href="#admissions"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gold text-navy font-sans font-bold text-sm hover:bg-gold-light transition-colors"
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
