import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHero({ title, subtitle, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "bg-navy noise-overlay relative overflow-hidden px-4 pt-32 pb-16 md:pt-40 md:pb-20",
        className,
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/5 absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-navy-light/50 absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 font-sans text-base text-white/60 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
