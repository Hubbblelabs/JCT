"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function ArtsSciencePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center px-4 sm:px-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[100] flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Scrollable Wrapper for Mobile */}
            <div className="flex h-full max-h-[85vh] w-full flex-col overflow-y-auto md:max-h-none md:flex-row">
              {/* Image / Graphic Side */}
              <div className="relative w-full bg-white md:w-[60%]">
                <Image
                  src="/pamphlets/arts-pamphlet.webp"
                  alt="Arts & Science Admission Brochure"
                  width={800}
                  height={1131}
                  className="block h-auto w-full"
                  priority
                />
              </div>

              {/* Content Side */}
              <div className="flex w-full flex-col justify-center p-6 md:w-[40%] md:p-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-0.5 text-[12px] font-bold tracking-wider text-[#d4a024] uppercase">
                    Admissions 2026-27
                  </div>
                  <h2 className="mb-2 font-serif text-2xl font-bold text-[#0a1628] md:text-3xl">
                    Shape Your Future
                  </h2>

                  <p className="mb-3 text-xs leading-relaxed text-stone-600 md:text-sm">
                    Explore a world of opportunities in Arts, Science, and
                    Commerce. Our programs prepare you for global success.
                  </p>

                  <div className="mb-5 flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-tighter text-stone-500 uppercase">
                        Explore Programs:
                      </span>
                      <span className="text-base font-bold text-[#d4a024]">
                        CS, AI, Commerce & more
                      </span>
                    </div>

                    <div className="h-px w-full bg-stone-200" />

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-tighter text-stone-500 uppercase">
                        Contact:
                      </span>
                      <a
                        href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-1 text-base font-bold text-[#0a1628] transition-colors hover:text-[#d4a024]"
                      >
                        <Phone size={14} className="text-[#d4a024]" />
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="https://admissions.jct.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC917] px-6 py-2.5 font-sans text-xs font-bold text-black transition-transform hover:scale-105"
                    >
                      Apply Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
