"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = {
  /** Already-resolved public URL — storage keys must be run through getImageUrl first. */
  src: string;
  alt?: string;
  caption?: string;
};

/**
 * Full-screen image viewer with previous / next navigation over a list.
 *
 * `useLightbox(images)` owns the open index and returns both the props for the
 * trigger (`open(i)`) and the overlay element to render — so a gallery only has
 * to make each tile call `open(i)`.
 */
export function useLightbox(images: LightboxImage[], enabled = true) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback(
    (i: number) => {
      if (enabled) setIndex(i);
    },
    [enabled],
  );
  const close = useCallback(() => setIndex(null), []);
  const overlay = (
    <Lightbox
      images={images}
      index={index}
      onIndexChange={setIndex}
      onClose={close}
    />
  );
  return { open, close, index, overlay, enabled };
}

export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  /** null when closed. */
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null && index >= 0 && index < images.length;
  const count = images.length;

  useEffect(() => setMounted(true), []);

  // Arrow keys step through the list and Escape closes — the same controls the
  // on-screen buttons drive, so keyboard users aren't stuck on one photo.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndexChange((index! + 1) % count);
      else if (e.key === "ArrowLeft")
        onIndexChange((index! - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, index, count, onClose, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const image = images[index!];
  const showNav = count > 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "Image viewer"}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 text-white/80 md:px-6">
        <span className="font-sans text-sm tabular-nums">
          {index! + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="rounded-full p-2 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <X size={22} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-16">
        {showNav && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index! - 1 + count) % count);
            }}
            className="absolute left-2 z-10 rounded-full bg-black/50 p-2.5 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none md:left-4 md:p-3"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          className="relative h-full w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt || ""}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {showNav && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index! + 1) % count);
            }}
            className="absolute right-2 z-10 rounded-full bg-black/50 p-2.5 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none md:right-4 md:p-3"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {image.caption?.trim() && (
        <p
          className="shrink-0 px-4 pb-5 text-center font-sans text-sm leading-relaxed text-white/70 md:px-16"
          onClick={(e) => e.stopPropagation()}
        >
          {image.caption}
        </p>
      )}
    </div>,
    document.body,
  );
}
