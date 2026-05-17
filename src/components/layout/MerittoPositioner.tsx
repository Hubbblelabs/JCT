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

        // Only care about elements in the bottom-right quadrant
        if (rect.right <= vw * 0.5) return;
        if (rect.bottom <= vh * 0.5) return;

        // --- Classify by size ---

        // Launcher icon: roughly square and small (≤ 90 px in each axis)
        const isLauncher = rect.width <= 90 && rect.height <= 90;

        // Notification bubble: short but wider than a launcher
        // Meritto's popup is typically 200–320 px wide and 60–130 px tall.
        const isNotification = !isLauncher && rect.height <= 140;

        if (isLauncher) {
          // Move launcher to the bottom-left
          el.style.setProperty("left", "16px", "important");
          el.style.setProperty("right", "auto", "important");
        } else if (isNotification) {
          // Suppress Meritto's native notification — we show our own
          suppressed.add(el);
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("pointer-events", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
        } else {
          // Chat modal — move to bottom-left
          el.style.setProperty("left", "16px", "important");
          el.style.setProperty("right", "auto", "important");
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
