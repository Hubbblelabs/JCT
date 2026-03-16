"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function StickyApplyButton() {
  return (
    <Link
      href="/admissions/apply"
      className="bg-gold text-navy hover:bg-gold-light animate-pulse-glow fixed right-4 bottom-20 z-50 flex h-12 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 md:right-6 md:bottom-24"
      aria-label="Apply for Admission"
    >
      <GraduationCap size={18} />
      <span className="hidden sm:inline">Apply Now</span>
    </Link>
  );
}
