"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type StatItem = {
  value: string;
  label: string;
  suffix?: string;
};

type StatsGridProps = {
  stats: StatItem[];
  className?: string;
};

function AnimatedNumber({ value, suffix }: { value: string; suffix?: string }) {
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const isNumeric = !isNaN(num);
  const [displayed, setDisplayed] = useState(isNumeric ? "0" : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1500;
          const startTime = performance.now();

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * num);
            setDisplayed(current.toLocaleString());
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num, isNumeric]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="border-border bg-surface rounded-xl border p-5 text-center"
        >
          <div className="text-gold font-serif text-3xl font-bold md:text-4xl">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-muted-foreground mt-1 font-sans text-sm">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
