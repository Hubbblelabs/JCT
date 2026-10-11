"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

/**
 * The live page, shown inside an editor at desktop width and scaled to fit.
 *
 * Tailwind's breakpoints answer to the *window*, not to the box a component
 * sits in, so squeezing a public layout into the space beside the edit panel
 * kept its desktop classes while starving it of room — grids collapsed into
 * slivers that looked nothing like the live page. Instead the page is laid out
 * at a real desktop width (`minWidth`) and shrunk with CSS `zoom`, which keeps
 * every proportion — including `100vh` heroes — as a visitor would see it.
 *
 * The inner wrapper's `transform` makes it the containing block for
 * `position: fixed` descendants, so the navbar, announcement strip and floating
 * buttons stay inside the preview instead of covering the admin screen.
 *
 * Links are inert: clicking a navbar item in the preview must open its editor,
 * not navigate away from unsaved work.
 */
export function ScaledPreview({
  minWidth = 1280,
  children,
}: {
  /** The width the page is laid out at before scaling. */
  minWidth?: number;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: minWidth, zoom: 1 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const available = host.clientWidth;
      if (available <= 0) return;
      // Wider than the design width: lay out at the real width, unscaled.
      const width = Math.max(available, minWidth);
      setBox({ width, zoom: available / width });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [minWidth]);

  const stopLinks = (event: MouseEvent) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (anchor) event.preventDefault();
  };

  return (
    <div ref={hostRef} className="admin-preview-host">
      <div
        className="admin-preview-frame"
        style={{ width: box.width, zoom: box.zoom }}
        onClickCapture={stopLinks}
        data-admin-preview
      >
        <div className="admin-preview-page">{children}</div>
      </div>
    </div>
  );
}
