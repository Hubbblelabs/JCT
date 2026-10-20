import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /**
   * The page's trail, shown above the title inside the band — usually a
   * `<Breadcrumb tone="dark" />`. It used to sit in a row of its own under the
   * band, which together with the band's old height pushed every page's
   * content down to the middle of a laptop screen.
   */
  breadcrumb?: ReactNode;
  className?: string;
};

// Kept short on purpose: the top padding only has to clear the fixed navbar
// (and the announcement bar above it, when one is showing), so the content
// starts within the first third of the screen instead of below the fold.
export function PageHero({
  title,
  subtitle,
  breadcrumb,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "bg-navy noise-overlay relative overflow-hidden px-4 pt-28 pb-8 md:pt-32 md:pb-10",
        className,
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/5 absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-navy-light/50 absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        {breadcrumb && (
          <div className="mb-3 flex justify-center">{breadcrumb}</div>
        )}
        <h1 className="font-serif text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-2 max-w-2xl font-sans text-sm text-white/60 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
