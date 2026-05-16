"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Landmark,
  Target,
  MessageSquareQuote,
  Award,
  School,
  Star,
  Users,
  Heart,
  ChevronRight,
  Briefcase,
  BookOpen,
} from "lucide-react";

const navSections = [
  { id: "about", label: "About", icon: Landmark },
  { id: "vision", label: "Vision & Mission", icon: Target },
  { id: "principal", label: "Principal's Message", icon: MessageSquareQuote },
  { id: "management", label: "Management", icon: Briefcase },
  { id: "hod", label: "Administration — HOD", icon: BookOpen },
  { id: "governing-council", label: "Governing Council", icon: Users },
  { id: "core-values", label: "Core Values", icon: Heart },
  { id: "accreditations", label: "Accreditations", icon: Award },
  { id: "campus", label: "Campus", icon: School },
  { id: "why-jct", label: "Why JCT?", icon: Star },
];

interface AboutSideNavProps {
  activeId: string;
  setActiveId: (id: string) => void;
}

export function AboutSideNav({ activeId, setActiveId }: AboutSideNavProps) {
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const observers: IntersectionObserver[] = [];

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [setActiveId]);

  const handleClick = (id: string) => {
    setActiveId(id);

    if (window.innerWidth >= 1024) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Mobile pill bar */}
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
                    ? "border-polytechnic bg-polytechnic/15 text-polytechnic"
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

      {/* Desktop sticky sidebar */}
      <div className="bg-surface border-border hidden rounded-3xl border p-6 lg:block">
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
                    ? "bg-polytechnic/15 text-polytechnic"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-polytechnic"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="bg-polytechnic ml-auto h-1.5 w-1.5 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Facts */}
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold tracking-wider uppercase">
            Quick Facts
          </h3>
          <div className="space-y-3">
            {[
              { label: "Established", value: "2014" },
              { label: "Programs", value: "6 Diploma Programs" },
              { label: "Affiliation", value: "DOTE, Tamil Nadu" },
              { label: "Approved by", value: "AICTE" },
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

        <Link
          href="https://admissions.jct.ac.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-polytechnic text-white mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center font-bold transition-colors hover:opacity-90"
        >
          Apply Now
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}
