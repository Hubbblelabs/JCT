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
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80 md:h-8 md:w-8"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {/* Image / Graphic Side */}
            <div className="relative h-[450px] w-full overflow-hidden bg-stone-100 md:h-auto md:w-[40%]">
              <div className="absolute inset-0 z-0 opacity-90">
                <Image
                  src="/assets/engineering-landing4.png"
                  alt="Arts & Science Admission Brochure"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Content Side */}
            <div className="flex w-full flex-col justify-center p-8 md:w-[60%] md:p-12">
              <div className="mb-1 inline-block text-[20px] font-black tracking-widest text-[#d4a024] uppercase">
                Admissions Open 2026-27
              </div>
              <h2 className="text-navy mb-4 font-serif text-3xl font-bold md:text-4xl">
                Shape Your Future at JCT
              </h2>

              <p className="mb-4 text-stone-600">
                Explore a world of opportunities in Arts, Science, and Commerce. Our industry-aligned programs prepare you for global success.
              </p>

              <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-lg font-semibold text-stone-600">Explore Programs:</span>
                  <span className="text-xl font-bold text-[#d4a024]">
                    CS, AI, Commerce & more
                  </span>
                </div>
                <div className="h-px w-full bg-stone-200" />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-lg font-semibold text-stone-600">Contact:</span>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-xl font-bold text-[#0a1628] transition-colors hover:text-[#d4a024]"
                  >
                    <Phone size={20} className="text-[#d4a024]" />
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="https://admissions.jct.ac.in/"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC917] px-8 py-3 font-sans text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
