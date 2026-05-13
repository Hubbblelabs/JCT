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
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

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
              <div className="relative w-full bg-[#f8f9fa] md:w-[50%]">
                <Image
                  src="/phamplets/engineerinig-placement.jpeg"
                  alt="Engineering Placement Brochure"
                  width={800}
                  height={1131}
                  className="h-auto w-full block"
                  priority
                />
              </div>

              {/* Content Side */}
              <div className="flex w-full flex-col justify-center p-8 md:w-[50%] md:p-10">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-1 text-[16px] font-bold tracking-wider text-[#d4a024] uppercase">
                    Autonomous Institution
                  </div>
                  <h2 className="mb-4 font-serif text-3xl font-bold text-[#0a1628] md:text-4xl">
                    Admissions Open
                  </h2>

                  <p className="mb-6 text-sm leading-relaxed text-stone-600 md:text-base">
                    Start your engineering journey with JCT. Applications are now
                    open for B.E. / B.Tech programs.
                  </p>

                  <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50/50 p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-stone-600">
                        Counselling Code:
                      </span>
                      <span className="text-2xl font-bold text-[#d4a024]">
                        {siteConfig.counsellingCode}
                      </span>
                    </div>
                    
                    <div className="h-px w-full bg-stone-200" />
                    
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-stone-600">
                        Contact:
                      </span>
                      <a
                        href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 text-xl font-bold text-[#0a1628] transition-colors hover:text-[#d4a024]"
                      >
                        <Phone size={18} className="text-[#d4a024]" />
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="https://admissions.jct.ac.in/"
                      onClick={handleClose}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC917] px-8 py-3 font-sans text-sm font-bold text-black transition-transform hover:scale-105"
                    >
                      Apply Now <ArrowRight size={16} />
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
