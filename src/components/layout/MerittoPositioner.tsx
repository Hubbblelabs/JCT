"use client";

import { useEffect } from "react";

export function MerittoPositioner() {
  useEffect(() => {
    // Track elements we deliberately hide so we can re-suppress them if
    // the Meritto script tries to restore them via style changes.
    const suppressed = new WeakSet<HTMLElement>();

    const reposition = () => {
      const own = new Set<Element>();
      document.querySelectorAll("[data-own-fixed]").forEach((el) => {
        own.add(el);
        el.querySelectorAll("*").forEach((child) => own.add(child));
      });

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Re-suppress any elements we've already hidden that Meritto may have restored.
      document.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (suppressed.has(el)) {
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
        }
      });

      document.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (own.has(el) || suppressed.has(el)) return;
        const style = window.getComputedStyle(el);
        if (style.position !== "fixed") return;

        const rect = el.getBoundingClientRect();

        // Skip invisible / display:none elements
        if (rect.width <= 0 || rect.height <= 0) return;

        // Skip full-screen overlays / backdrops
        if (rect.width > vw * 0.9 || rect.height > vh * 0.9) return;

        // Only care about elements anchored near the bottom of the viewport.
        // We intentionally do NOT restrict to the right half: Meritto drops the
        // launcher in the bottom-LEFT by default, and we want to detect it there
        // so we can relocate it to the bottom-right. Our own bottom-left FABs
        // (WhatsApp / Apply) carry data-own-fixed and are excluded above.
        if (rect.bottom <= vh * 0.5) return;

        // --- Classify by size ---

        // Launcher icon: roughly square and small (≤ 120 px in each axis).
        // Use 120 instead of 90 to tolerate widget updates that render slightly
        // larger icons. Aspect-ratio guard (< 3) prevents wide notification
        // bubbles from being mistaken for a launcher.
        const aspectRatio = rect.width / rect.height;
        const isLauncher =
          rect.width <= 120 && rect.height <= 120 && aspectRatio < 3;

        // Notification bubble: wide (> 150 px) and short (≤ 140 px).
        // Meritto's popup is typically 200–320 px wide and 60–130 px tall.
        const isNotification =
          !isLauncher && rect.height <= 140 && rect.width > 150;

        if (isLauncher) {
          // Move launcher to the bottom-right and ensure it's always on top.
          // top:auto so a top-anchored default can't fight the bottom anchor.
          el.style.setProperty("right", "16px", "important");
          el.style.setProperty("left", "auto", "important");
          el.style.setProperty("bottom", "20px", "important");
          el.style.setProperty("top", "auto", "important");
          el.style.setProperty("z-index", "9999", "important");
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("visibility", "visible", "important");
          el.style.setProperty("pointer-events", "auto", "important");
        } else if (isNotification) {
          // Suppress Meritto's native notification — we show our own
          suppressed.add(el);
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
        } else {
          // Chat modal — move to bottom-right
          el.style.setProperty("right", "16px", "important");
          el.style.setProperty("left", "auto", "important");
        }
      });
    };

    let rafId: number;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(reposition);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    const timers = [
      100, 300, 600, 1000, 1500, 2000, 3000, 5000, 8000, 12000,
    ].map((ms) => setTimeout(reposition, ms));
    const keepAlive = setInterval(reposition, 5000);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      clearInterval(keepAlive);
    };
  }, []);

  return null;
}
