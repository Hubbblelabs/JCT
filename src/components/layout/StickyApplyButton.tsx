"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function StickyApplyButton() {
  return (
    <Link
      href="/admissions/apply"
      className="bg-gold text-navy hover:bg-gold-light fixed bottom-4 left-1/2 z-50 flex h-11 -translate-x-1/2 items-center gap-2 rounded-full px-4 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 md:right-22 md:bottom-6 md:left-auto md:translate-x-0 md:px-5"
      aria-label="Apply for Admission"
    >
      <GraduationCap size={16} />
      <span>Apply Now</span>
    </Link>
  );
}
