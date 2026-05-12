"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function Phamplets() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/80 hover:rotate-90 md:h-12 md:w-12"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            {/* Split Images Container */}
            <div className="relative flex h-[85vh] min-h-[600px] flex-col overflow-hidden md:flex-row">
              {/* Left Image - Main Brochure */}
              <div className="relative h-1/2 w-full overflow-hidden bg-white md:h-auto md:w-1/2">
                <Image
                  src="/phamplets/mainleft.jpeg"
                  alt="Engineering Placement"
                  fill
                  className="object-contain object-top"
                />
              </div>

              {/* Right Image - Engineering Placement */}
              <div className="relative h-1/2 w-full overflow-hidden bg-white md:h-auto md:w-1/2">
                <Image
                  src="/phamplets/engineerinig-placement.jpeg"
                  alt="Engineering Admission"
                  fill
                  className="object-contain object-top"
                />
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute right-6 bottom-8 z-50 flex flex-wrap items-center justify-end gap-3 md:right-10 md:bottom-10">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 sm:px-10"
                >
                  <Play size={20} className="fill-current" /> Virtual Tour
                </button>
                <Link
                  href="/apply-now"
                  onClick={handleClose}
                  className="group flex items-center gap-3 rounded-full bg-gold px-10 py-4 text-base font-bold text-black shadow-[0_20px_40px_-10px_rgba(212,160,36,0.6)] transition-all hover:scale-105 hover:bg-white active:scale-95 sm:px-12 sm:text-lg"
                >
                  Apply Now <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
              {isVideoOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-10"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                  >
                    <button
                      onClick={() => setIsVideoOpen(false)}
                      className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <X size={24} />
                    </button>
                    <iframe
                      src="https://www.youtube.com/embed/RBzA0cneWRA?autoplay=1"
                      title="JCT Campus Tour"
                      className="h-full w-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 -z-10"
                    onClick={() => setIsVideoOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
