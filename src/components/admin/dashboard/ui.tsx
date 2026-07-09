"use client";

// Shared presentational primitives for the admin dashboard. shadcn-style:
// small, composable, Tailwind-only, themed through the --dash-* tokens
// declared in src/styles/admin.css (dark-mode ready).

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { rememberPage } from "./recent-pages";
import type { IconType } from "./types";

/* ── TrackedLink ─────────────────────────────────────── */
// A next/link that records the destination for "Continue editing".

export function TrackedLink({
  href,
  label,
  className,
  children,
  ...rest
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => rememberPage({ label, href })}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* ── Card ────────────────────────────────────────────── */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-(--dash-border) bg-(--dash-card) shadow-xs",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  icon: Icon,
  count,
  action,
}: {
  title: string;
  icon?: IconType;
  count?: number;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-(--dash-border) px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-2">
        {Icon && <Icon size={15} className="shrink-0 text-(--dash-subtle)" />}
        <h2 className="truncate text-sm font-semibold text-(--dash-fg)">
          {title}
        </h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-(--dash-hover) px-2 py-0.5 text-[11px] font-medium text-(--dash-muted) tabular-nums">
            {count}
          </span>
        )}
      </div>
      {action && (
        <TrackedLink
          href={action.href}
          label={action.label}
          className="group inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-medium text-(--dash-muted) transition-colors hover:text-(--dash-fg)"
        >
          {action.label}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </TrackedLink>
      )}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────── */

export type BadgeTone =
  | "gray"
  | "emerald"
  | "amber"
  | "red"
  | "blue"
  | "indigo"
  | "violet"
  | "sky"
  | "pink"
  | "teal";

const BADGE_TONES: Record<BadgeTone, string> = {
  gray: "bg-gray-100 text-gray-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  violet: "bg-violet-50 text-violet-700",
  sky: "bg-sky-50 text-sky-700",
  pink: "bg-pink-50 text-pink-700",
  teal: "bg-teal-50 text-teal-700",
};

export function Badge({
  tone = "gray",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Avatar ──────────────────────────────────────────── */
// Deterministic initial-based avatar for audit users.

const AVATAR_HUES = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

export function Avatar({
  seed,
  size = "md",
  className,
}: {
  seed: string;
  size?: "sm" | "md";
  className?: string;
}) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const hue = AVATAR_HUES[Math.abs(hash) % AVATAR_HUES.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold uppercase",
        size === "sm" ? "h-5 w-5 text-[10px]" : "h-8 w-8 text-xs",
        hue,
        className,
      )}
    >
      {seed.trim().charAt(0) || "?"}
    </span>
  );
}

/* ── EmptyState ──────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  hint,
  cta,
  className,
}: {
  icon: IconType;
  title: string;
  hint?: string;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-(--dash-hover) p-3 text-(--dash-subtle)">
        <Icon size={20} />
      </div>
      <p className="mt-3 text-sm font-medium text-(--dash-fg)">{title}</p>
      {hint && (
        <p className="mt-1 max-w-56 text-xs leading-relaxed text-(--dash-muted)">
          {hint}
        </p>
      )}
      {cta && (
        <TrackedLink
          href={cta.href}
          label={cta.label}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-(--dash-navy) px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1a2a42]"
        >
          {cta.label}
          <ArrowRight size={13} />
        </TrackedLink>
      )}
    </div>
  );
}

/* ── Skeleton ────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-(--dash-skeleton)", className)}
    />
  );
}

/* ── Reveal — light entrance animation ───────────────── */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      {children}
    </m.div>
  );
}

/* ── Popover helpers ─────────────────────────────────── */

/** Close on Escape or on pointer-down outside the returned ref. */
export function useDismiss<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, onClose]);
  return ref;
}

/** ArrowUp/ArrowDown roving focus across [role="menuitem"] children. */
export function moveMenuFocus(
  e: React.KeyboardEvent,
  container: HTMLElement | null,
) {
  if (!container || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
  e.preventDefault();
  const items = Array.from(
    container.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  );
  if (items.length === 0) return;
  const idx = items.indexOf(document.activeElement as HTMLElement);
  const next =
    e.key === "ArrowDown"
      ? (idx + 1) % items.length
      : (idx - 1 + items.length) % items.length;
  items[next]?.focus();
}
