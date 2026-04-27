"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StickyApplyButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button only after scrolling past the hero section (approx 80vh)
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:right-24 md:bottom-6 md:left-auto md:translate-x-0"
        >
          <Link
            href="/admissions/apply"
            className="bg-gold text-navy hover:bg-gold-light flex h-12 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            aria-label="Apply for Admission"
          >
            <GraduationCap className="h-[18px] w-[18px] shrink-0" />
            <span>Apply Now</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
