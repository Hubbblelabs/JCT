import Link from "next/link";
import { cn } from "@/lib/utils";

type PolySectionProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "subtle" | "brand" | "transparent";
} & React.ComponentPropsWithoutRef<"section">;

export function PolySection({
  children,
  className,
  tone = "surface",
  ...props
}: PolySectionProps) {
  const toneClass =
    tone === "brand"
      ? "bg-polytechnic-dark text-white"
      : tone === "subtle"
        ? "bg-[#f6f8f7]"
        : tone === "transparent"
          ? "bg-transparent"
          : "bg-white";

  return (
    <section className={cn("py-16 md:py-20", toneClass, className)} {...props}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}

type PolySectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
};

export function PolySectionHeader({
  eyebrow,
  title,
  description,
  className,
  centered = false,
}: PolySectionHeaderProps) {
  return (
    <div className={cn("mb-10", centered ? "text-center" : "", className)}>
      {eyebrow ? (
        <p className="text-polytechnic mb-3 text-xs font-bold tracking-[0.16em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-polytechnic-dark font-serif text-3xl leading-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-polytechnic-dark/70 mt-3 max-w-3xl text-base leading-relaxed md:text-lg",
            centered ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type PolyButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

export function PolyButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: PolyButtonLinkProps) {
  const variantClass =
    variant === "outline"
      ? "border border-polytechnic/25 bg-transparent text-polytechnic-dark hover:bg-polytechnic-muted"
      : variant === "secondary"
        ? "bg-polytechnic-light text-white hover:bg-polytechnic"
        : "bg-polytechnic text-white hover:bg-polytechnic-dark";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold transition-colors",
        variantClass,
        className,
      )}
    >
      {children}
    </Link>
  );
}
