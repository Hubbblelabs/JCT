"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ClipboardList,
  BookOpen,
  Download,
  ChevronRight,
} from "lucide-react";

const navSections = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "responsibilities", label: "Roles & Responsibilities", icon: ClipboardList },
  { id: "obe", label: "Outcome Based Education", icon: BookOpen },
  { id: "downloads", label: "Circulars & Downloads", icon: Download },
];

interface COESideNavProps {
  activeId: string;
  setActiveId: (id: string) => void;
}

export function COESideNav({ activeId, setActiveId }: COESideNavProps) {
  useEffect(() => {
    // Only run intersection observers on desktop screens where all sections are visible
    if (window.innerWidth < 1024) return;

    const observers: IntersectionObserver[] = [];

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        {
          rootMargin: "-25% 0px -65% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [setActiveId]);

  const handleClick = (id: string) => {
    setActiveId(id);

    // Dynamic scroll behavior
    const el = document.getElementById(id);
    if (!el) return;
    const offset = window.innerWidth >= 1024 ? 120 : 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Mobile / Tablet: horizontal scrollable pill bar ── */}
      <div className="-mx-4 w-full overflow-x-auto px-4 pb-2 lg:hidden">
        <div className="flex w-max gap-2">
          {navSections.map(({ id, label, icon: Icon }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "border-gold bg-gold/15 text-gold"
                    : "text-muted-foreground hover:text-foreground border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: sticky sidebar ── */}
      <div className="bg-surface border-border hidden rounded-3xl border p-6 lg:block">
        {/* Section Navigation */}
        <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold tracking-wider uppercase">
          On This Page
        </h3>

        <nav className="space-y-1">
          {navSections.map(({ id, label, icon: Icon }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-gold"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="bg-gold ml-auto h-1.5 w-1.5 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Facts */}
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold tracking-wider uppercase">
            COE Quick Facts
          </h3>

          <div className="space-y-3">
            {[
              { label: "Controller", value: "Dr. D. Elangovan" },
              { label: "Affiliation", value: "Anna University" },
              { label: "Stream", value: "Autonomous Scheme" },
              { label: "Valuation", value: "Central Dummy Valuation" },
            ].map((fact) => (
              <div key={fact.label} className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {fact.label}
                </span>
                <span className="text-foreground text-sm font-bold">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ERP login CTA */}
        <Link
          href="http://erp.jct.ac.in/impres/students/default.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold text-navy mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center font-bold transition-colors hover:bg-[#e8b84a]"
        >
          Student Login
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}
