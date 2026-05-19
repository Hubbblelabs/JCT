"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

const DEFAULT_IMAGES = [
  "/pamphlets/jct-pamphlet.webp",
  "/pamphlets/engineering-pamphlet.webp",
];

const DEFAULT_VIDEO_URL = "https://www.youtube.com/embed/RBzA0cneWRA";

type PamphletConfig = {
  enabled: boolean;
  images: string[];
  delayMs?: number;
  videoUrl?: string;
};

function normalizePamphlet(raw: unknown): PamphletConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const images = Array.isArray(r.images)
    ? r.images.filter((s): s is string => typeof s === "string" && s.length > 0)
    : [];
  return {
    enabled: r.enabled !== false,
    images,
    delayMs: typeof r.delayMs === "number" ? r.delayMs : undefined,
    videoUrl:
      typeof r.videoUrl === "string" && r.videoUrl.trim()
        ? r.videoUrl.trim()
        : undefined,
  };
}

export function Pamphlet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [delayMs, setDelayMs] = useState(2000);
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO_URL);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=homePamphlet")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizePamphlet(res.data);
          if (next) {
            setEnabled(next.enabled);
            if (next.images.length > 0) setImages(next.images);
            if (typeof next.delayMs === "number") setDelayMs(next.delayMs);
            if (next.videoUrl) setVideoUrl(next.videoUrl);
          }
        }
        setConfigLoaded(true);
      })
      .catch(() => {
        setConfigLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!configLoaded || !enabled || images.length === 0) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [configLoaded, enabled, images.length, delayMs]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const [leftImage, rightImage] = [
    images[0] ?? DEFAULT_IMAGES[0],
    images[1] ?? images[0] ?? DEFAULT_IMAGES[1],
  ];

  return (
    <AnimatePresence>
      {isOpen && enabled && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition-all hover:rotate-90 hover:bg-black/80 md:h-12 md:w-12"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            <div className="relative flex h-[75vh] min-h-[550px] flex-col overflow-hidden md:flex-row">
              <div className="relative h-1/2 w-full overflow-hidden bg-white md:h-auto md:w-[45%]">
                <Image
                  src={getImageUrl(leftImage) ?? leftImage}
                  alt="JCT Brochure"
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="relative h-1/2 w-full overflow-hidden bg-white md:h-auto md:w-[55%]">
                <Image
                  src={getImageUrl(rightImage) ?? rightImage}
                  alt="JCT Programs"
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="absolute right-6 bottom-4 z-50 flex flex-wrap items-center justify-end gap-3 md:right-8 md:bottom-6">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 sm:px-10"
                >
                  <Play size={20} className="fill-current" /> Virtual Tour
                </button>
                <Link
                  href="https://admissions.jct.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="group bg-gold flex items-center gap-3 rounded-full px-10 py-4 text-base font-bold text-black shadow-[0_20px_40px_-10px_rgba(212,160,36,0.6)] transition-all hover:scale-105 hover:bg-white active:scale-95 sm:px-12 sm:text-lg"
                >
                  Apply Now{" "}
                  <ArrowRight
                    size={22}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

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
                      src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
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
