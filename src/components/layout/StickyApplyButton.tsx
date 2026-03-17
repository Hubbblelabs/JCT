"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function StickyApplyButton() {
  return (
    <Link
      href="/admissions/apply"
      className="bg-gold text-navy hover:bg-gold-light fixed right-[6.5rem] bottom-4 z-50 flex h-11 items-center gap-2 rounded-full px-5 font-sans text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 md:right-[7.5rem] md:bottom-6"
      aria-label="Apply for Admission"
    >
      <GraduationCap size={16} />
      <span className="hidden sm:inline">Apply Now</span>
    </Link>
  );
}
