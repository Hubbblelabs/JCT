"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function StickyApplyButton() {
  return (
    <Link
      href="/admissions/apply"
      className="bg-gold text-navy hover:bg-gold-light fixed bottom-6 left-1/2 z-50 flex h-14 -translate-x-1/2 items-center gap-2.5 rounded-full px-5 font-sans text-[15px] font-bold shadow-xl transition-all hover:scale-105 active:scale-95 md:right-28 md:bottom-8 md:left-auto md:h-16 md:translate-x-0 md:px-7 md:text-base"
      aria-label="Apply for Admission"
    >
      <GraduationCap className="h-5 w-5 shrink-0 md:h-[22px] md:w-[22px]" />
      <span>Apply Now</span>
    </Link>
  );
}
