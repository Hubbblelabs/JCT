"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Landmark,
  Target,
  MessageSquareQuote,
  Award,
  School,
  Star,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const navSections = [
  { id: "about", label: "About the Institution", icon: Landmark },
  { id: "vision", label: "Vision & Mission", icon: Target },
  { id: "principal", label: "Principal's Message", icon: MessageSquareQuote },
  { id: "accreditations", label: "Approvals & Accreditations", icon: Award },
  { id: "campus", label: "Campus Highlights", icon: School },
  { id: "why-jct", label: "Why Choose JCT?", icon: Star },
];

export function AboutSideNav() {
  const [activeId, setActiveId] = useState<string>("about");

  useEffect(() => {
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
          rootMargin: "-30% 0px -60% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="bg-surface border-border rounded-3xl border p-6">
      {/* Section Navigation */}
      <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-wider">
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
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon
                size={16}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
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
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Quick Facts
        </h3>

        <div className="space-y-3">
          {[
            { label: "Established", value: "2009" },
            { label: "Autonomous Status", value: "Granted" },
            { label: "Affiliation", value: "Anna University" },
            { label: "NAAC Grade", value: '"A" Grade' },
          ].map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {fact.label}
              </span>
              <span className="text-foreground text-sm font-bold">
                {fact.value}
              </span>
            </div>
          ))}

          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Counselling Code
            </span>
            <span className="text-gold text-2xl font-bold">2769</span>
          </div>
        </div>
      </div>

      {/* Apply CTA */}
      <Link
        href="https://admissions.jct.ac.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gold text-navy mt-6 block w-full rounded-xl py-4 text-center font-bold transition-colors hover:bg-[#e8b84a]"
      >
        Apply Now
      </Link>

      {/* Contact */}
    

      {/* Program links */}
     
      

    </div>
  );
}
