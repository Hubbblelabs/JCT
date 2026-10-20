"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** `dark` for a trail sitting on the navy `PageHero` band. */
  tone?: "light" | "dark";
};

const TONES = {
  light: {
    link: "text-muted-foreground hover:text-foreground",
    separator: "text-muted-foreground/50",
    current: "text-foreground",
  },
  dark: {
    link: "text-white/60 hover:text-white",
    separator: "text-white/30",
    current: "text-white/90",
  },
} as const;

export function Breadcrumb({ items, tone = "light" }: BreadcrumbProps) {
  const colors = TONES[tone];
  return (
    <nav aria-label="Breadcrumb" className="font-sans text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className={`${colors.link} transition-colors`}
            aria-label="Home"
          >
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className={colors.separator} />
            {item.href ? (
              <Link
                href={item.href}
                className={`${colors.link} transition-colors`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`${colors.current} font-medium`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
