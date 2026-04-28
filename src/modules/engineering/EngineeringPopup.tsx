"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Award, Megaphone, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function EngineeringPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("jct-engineering-popup-seen");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("jct-engineering-popup-seen", "true");
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
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40 hover:text-white md:top-4 md:right-4 md:bg-white/90 md:text-black md:hover:bg-white"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Image / Graphic Side */}
            <div className="bg-navy relative h-[200px] w-full overflow-hidden md:h-auto md:w-1/2">
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                <Image
                  src="/site_assests/engineering.jpeg"
                  alt="Campus"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  <Award size={14} className="text-[#FFC917]" />
                  <span>NAAC & NBA Accredited</span>
                </div>
                <h3 className="font-serif text-3xl leading-tight font-bold md:text-4xl">
                  Transforming <span className="text-[#FFC917]">Futures</span>
                </h3>
                <p className="mt-2 text-sm text-white/80 md:text-base">
                  15+ Years of Academic Excellence & 96% Placement Success Rate.
                </p>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
              <div className="mb-6 inline-flex items-center gap-2 font-sans text-sm font-bold tracking-widest text-[#FFc917] uppercase">
                <Megaphone size={16} />
                <span>Admissions 2026-27</span>
              </div>

              <h2 className="text-navy mb-4 font-serif text-3xl font-bold md:text-4xl">
                Admissions Open
              </h2>

              <p className="mb-4 text-stone-600">
                Start your engineering journey with JCT. Applications are now
                open for B.E. / B.Tech programs.
              </p>

              <div className="mb-8 flex flex-col gap-2 rounded-xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">
                    Counselling Code:
                  </span>
                  <span className="text-lg font-bold text-[#d4a024]">
                    {siteConfig.counsellingCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">Contact:</span>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\\s/g, "")}`}
                    className="flex items-center gap-1 font-bold text-[#0a1628] transition-colors hover:text-[#d4a024]"
                  >
                    <Phone size={14} />
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/apply-now"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC917] px-6 py-3 font-sans text-sm font-bold text-black transition-transform hover:scale-105"
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
