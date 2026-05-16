"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function clickMerittoLauncher() {
  for (const el of document.querySelectorAll<HTMLElement>("*")) {
    if (el.dataset.ownFixed !== undefined) continue;
    const style = window.getComputedStyle(el);
    if (style.position !== "fixed") continue;
    const rect = el.getBoundingClientRect();
    // Launcher is small, square-ish, at bottom-left after repositioning
    if (
      rect.width > 0 &&
      rect.width <= 90 &&
      rect.height <= 90 &&
      rect.left < 120 &&
      rect.bottom > window.innerHeight * 0.5
    ) {
      el.click();
      return;
    }
  }
}

export function ChatbotNotification() {
  const [visible, setVisible] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Show after 3 s — let Meritto initialise first
    const show = setTimeout(() => setVisible(true), 3000);
    // Auto-dismiss after 11 s total (8 s of being visible)
    const hide = setTimeout(() => setVisible(false), 11000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    // Remove from DOM after exit animation
    setTimeout(() => setGone(true), 300);
  };

  const open = () => {
    dismiss();
    clickMerittoLauncher();
  };

  if (gone) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          // Sits just to the right of the launcher icon (16px left + ~64px icon + 8px gap)
          className="fixed bottom-5 z-[9997] pointer-events-auto"
          style={{ left: "88px" }}
          data-own-fixed
        >
          {/* Tail pointing left toward the launcher */}
          <span
            aria-hidden
            className="absolute top-4 -left-[7px] h-3.5 w-3.5 rotate-45 rounded-[2px] border-b border-l border-slate-200 bg-white"
            style={{ boxShadow: "-2px 2px 3px rgba(0,0,0,0.04)" }}
          />

          {/* Bubble */}
          <button
            onClick={open}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-left shadow-xl shadow-slate-900/10 transition-all hover:border-[#d4a024]/50 hover:shadow-2xl focus:outline-none max-w-[220px]"
          >
            {/* Gold accent bar */}
            <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-[#d4a024]" />

            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold leading-tight text-[#0a1628]">
                Hey! I&apos;m Jagannath
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-slate-500">
                Your admission assistant
              </p>
            </div>

            <span
              role="button"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              className="shrink-0 mt-0.5 rounded-full p-0.5 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
            >
              <X size={13} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
