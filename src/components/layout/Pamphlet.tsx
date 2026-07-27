"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Play, Phone } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { useSiteConfig } from "@/lib/use-site-config";
import type { PamphletLayout } from "@/lib/validation";

type Slot = {
  image: string;
  heading: string;
  subheading: string;
  body: string;
};

type VirtualTour = {
  enabled: boolean;
  label: string;
  url: string;
};

type CallNow = {
  enabled: boolean;
  label: string;
  phone: string;
};

type PamphletConfig = {
  enabled: boolean;
  delayMs: number;
  layout: PamphletLayout;
  leftSlot: Slot;
  rightSlot: Slot;
  virtualTour: VirtualTour;
  callNow: CallNow;
  applyEnabled: boolean;
  applyLabel: string;
  applyHref: string;
};

const EMPTY_SLOT: Slot = { image: "", heading: "", subheading: "", body: "" };

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function readSlot(raw: unknown): Slot {
  if (!raw || typeof raw !== "object") return { ...EMPTY_SLOT };
  const r = raw as Record<string, unknown>;
  return {
    image: asString(r.image),
    heading: asString(r.heading),
    subheading: asString(r.subheading),
    body: asString(r.body),
  };
}

/**
 * The popup to render. Several may be configured but only one is ever live:
 * the one named by `activePopupId`, falling back to the first. A value saved
 * before multi-popup support has no `popups[]` — its single popup is described
 * by the top-level fields, which is exactly the shape a popup entry has, so
 * the object itself stands in.
 */
function selectPopup(r: Record<string, unknown>): Record<string, unknown> {
  const popups = Array.isArray(r.popups)
    ? (r.popups.filter(
        (p) => p && typeof p === "object",
      ) as Record<string, unknown>[])
    : [];
  if (popups.length === 0) return r;

  const activeId = asString(r.activePopupId);
  const active = activeId
    ? popups.find((p) => asString(p.id) === activeId)
    : null;
  return active ?? popups[0];
}

function normalizePamphlet(raw: unknown): PamphletConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const outer = raw as Record<string, unknown>;
  // `enabled` and `delayMs` are settings for the popup slot as a whole; every
  // other field describes the one live popup.
  const r: Record<string, unknown> = {
    ...selectPopup(outer),
    enabled: outer.enabled,
    delayMs: outer.delayMs,
  };

  const legacyImages = Array.isArray(r.images)
    ? r.images.filter((s): s is string => typeof s === "string" && s.length > 0)
    : [];

  const explicitLeft = readSlot(r.leftSlot);
  const explicitRight = readSlot(r.rightSlot);

  const leftSlot: Slot = {
    ...explicitLeft,
    image: explicitLeft.image || legacyImages[0] || "",
  };
  const rightSlot: Slot = {
    ...explicitRight,
    image: explicitRight.image || legacyImages[1] || legacyImages[0] || "",
  };

  const allowedLayouts: PamphletLayout[] = [
    "image-image",
    "image-text",
    "text-image",
    "text-text",
  ];
  const rawLayout = typeof r.layout === "string" ? r.layout : "";
  const layout: PamphletLayout = allowedLayouts.includes(
    rawLayout as PamphletLayout,
  )
    ? (rawLayout as PamphletLayout)
    : "image-image";

  const vt = (r.virtualTour ?? null) as Record<string, unknown> | null;
  const legacyVideoUrl = asString(r.videoUrl);
  const virtualTour: VirtualTour = vt
    ? {
        enabled:
          vt.enabled === undefined
            ? Boolean(asString(vt.url) || legacyVideoUrl)
            : Boolean(vt.enabled),
        label: asString(vt.label) || "Virtual Tour",
        url: asString(vt.url) || legacyVideoUrl,
      }
    : {
        enabled: Boolean(legacyVideoUrl),
        label: "Virtual Tour",
        url: legacyVideoUrl,
      };

  const cn = (r.callNow ?? null) as Record<string, unknown> | null;
  const callNow: CallNow = {
    enabled: Boolean(cn?.enabled),
    label: (cn && asString(cn.label)) || "Call Now",
    phone: (cn && asString(cn.phone)) || "",
  };

  return {
    enabled: r.enabled !== false,
    delayMs: typeof r.delayMs === "number" ? r.delayMs : 2000,
    layout,
    leftSlot,
    rightSlot,
    virtualTour,
    callNow,
    applyEnabled: r.applyEnabled !== false,
    applyLabel: asString(r.applyLabel) || "Apply Now",
    applyHref: asString(r.applyHref) || "https://admissions.jct.ac.in",
  };
}

function slotIsImage(layout: PamphletLayout, side: "left" | "right"): boolean {
  if (layout === "image-image") return true;
  if (layout === "text-text") return false;
  if (layout === "image-text") return side === "left";
  return side === "right"; // text-image
}

function isEmbeddableVideo(url: string): boolean {
  return /\/embed\//i.test(url) || /youtu\.?be/i.test(url);
}

function ImageSlot({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return <div className="h-full w-full bg-gray-100" />;
  }
  return (
    <Image
      src={getImageUrl(src) ?? src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover object-top"
    />
  );
}

function TextSlot({ slot, accent }: { slot: Slot; accent: boolean }) {
  const hasContent = slot.heading || slot.subheading || slot.body;
  if (!hasContent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-8 text-sm text-gray-400">
        No text content
      </div>
    );
  }
  return (
    <div
      className={`flex h-full w-full flex-col justify-center gap-3 p-8 md:p-12 ${
        accent ? "bg-navy text-white" : "bg-white text-gray-900"
      }`}
    >
      {slot.heading && (
        <h2
          className={`text-2xl leading-tight font-bold md:text-3xl lg:text-4xl ${
            accent ? "text-gold" : "text-navy"
          }`}
        >
          {slot.heading}
        </h2>
      )}
      {slot.subheading && (
        <p
          className={`text-base font-semibold md:text-lg ${
            accent ? "text-white/90" : "text-gray-700"
          }`}
        >
          {slot.subheading}
        </p>
      )}
      {slot.body && (
        <p
          className={`text-sm leading-relaxed md:text-base ${
            accent ? "text-white/80" : "text-gray-600"
          } whitespace-pre-line`}
        >
          {slot.body}
        </p>
      )}
    </div>
  );
}

export function Pamphlet() {
  const { data } = useSiteConfig("homePamphlet");
  const config = normalizePamphlet(data);

  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const enabled = config?.enabled ?? false;
  const layout = config?.layout ?? "image-image";
  const leftSlot = config?.leftSlot ?? EMPTY_SLOT;
  const rightSlot = config?.rightSlot ?? EMPTY_SLOT;
  const virtualTour = config?.virtualTour ?? {
    enabled: false,
    label: "Virtual Tour",
    url: "",
  };
  const callNow = config?.callNow ?? {
    enabled: false,
    label: "Call Now",
    phone: "",
  };
  const applyEnabled = config?.applyEnabled ?? true;
  const applyLabel = config?.applyLabel ?? "Apply Now";
  const applyHref = config?.applyHref ?? "https://admissions.jct.ac.in";
  const delayMs = config?.delayMs ?? 2000;

  const leftIsImage = slotIsImage(layout, "left");
  const rightIsImage = slotIsImage(layout, "right");

  // Hide entirely if the chosen layout has no usable content.
  const leftHasContent = leftIsImage
    ? Boolean(leftSlot.image)
    : Boolean(leftSlot.heading || leftSlot.subheading || leftSlot.body);
  const rightHasContent = rightIsImage
    ? Boolean(rightSlot.image)
    : Boolean(rightSlot.heading || rightSlot.subheading || rightSlot.body);
  const hasAnyContent = leftHasContent || rightHasContent;

  useEffect(() => {
    if (!enabled || !hasAnyContent) return;
    const timer = setTimeout(() => setIsOpen(true), delayMs);
    return () => clearTimeout(timer);
  }, [enabled, hasAnyContent, delayMs]);

  const handleClose = () => setIsOpen(false);

  if (!enabled || !hasAnyContent) return null;

  const showVirtualTour = virtualTour.enabled && Boolean(virtualTour.url);
  const tourEmbeds = showVirtualTour && isEmbeddableVideo(virtualTour.url);
  const showCallNow = callNow.enabled && Boolean(callNow.phone);
  const showApply = applyEnabled && Boolean(applyHref);

  const leftSplit = layout === "image-text" ? "md:w-[45%]" : "md:w-1/2";
  const rightSplit = layout === "image-text" ? "md:w-[55%]" : "md:w-1/2";

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div
                className={`relative h-1/2 w-full overflow-hidden bg-white md:h-auto ${leftSplit}`}
              >
                {leftIsImage ? (
                  <ImageSlot src={leftSlot.image} alt="JCT Brochure" />
                ) : (
                  <TextSlot slot={leftSlot} accent={false} />
                )}
              </div>

              <div
                className={`relative h-1/2 w-full overflow-hidden bg-white md:h-auto ${rightSplit}`}
              >
                {rightIsImage ? (
                  <ImageSlot src={rightSlot.image} alt="JCT Programs" />
                ) : (
                  <TextSlot
                    slot={rightSlot}
                    accent={layout === "text-text" || layout === "image-text"}
                  />
                )}
              </div>

              <div className="absolute inset-x-3 bottom-3 z-50 flex flex-wrap items-center justify-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-4 sm:justify-end sm:gap-3 md:right-8 md:bottom-6">
                {showVirtualTour && tourEmbeds && (
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 sm:gap-3 sm:px-8 sm:py-4 sm:text-base md:px-10"
                  >
                    <Play size={18} className="fill-current sm:size-5" />{" "}
                    {virtualTour.label}
                  </button>
                )}
                {showVirtualTour && !tourEmbeds && (
                  <a
                    href={virtualTour.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 sm:gap-3 sm:px-8 sm:py-4 sm:text-base md:px-10"
                  >
                    <Play size={18} className="fill-current sm:size-5" />{" "}
                    {virtualTour.label}
                  </a>
                )}
                {showCallNow && (
                  <a
                    href={`tel:${callNow.phone.replace(/[^0-9+]/g, "")}`}
                    onClick={handleClose}
                    className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black shadow-lg ring-1 ring-black/5 transition-all hover:scale-105 hover:bg-black hover:text-white active:scale-95 sm:gap-3 sm:px-8 sm:py-4 sm:text-base md:px-10"
                  >
                    <Phone size={18} className="sm:size-5" />
                    {callNow.label}
                  </a>
                )}
                {showApply && (
                  <Link
                    href={applyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="group bg-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-black shadow-[0_20px_40px_-10px_rgba(212,160,36,0.6)] transition-all hover:scale-105 hover:bg-white active:scale-95 sm:gap-3 sm:px-10 sm:py-4 sm:text-base md:px-12 md:text-lg"
                  >
                    {applyLabel}{" "}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1 sm:size-[22px]"
                    />
                  </Link>
                )}
              </div>
            </div>

            <AnimatePresence>
              {isVideoOpen && tourEmbeds && (
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
                      src={`${virtualTour.url}${virtualTour.url.includes("?") ? "&" : "?"}autoplay=1`}
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
