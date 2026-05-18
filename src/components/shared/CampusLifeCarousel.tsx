"use client";

import { useEffect, useState, type UIEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";
import { getImageUrl } from "@/lib/utils";

const DEFAULT_PHOTOS = [
  "/assets/jct-life6.webp",
  "/assets/jct-life7.webp",
  "/assets/campus1.webp",
  "/assets/jct-life12.webp",
  "/assets/jct-life3.webp",
];

type Theme = "arts-science" | "polytechnic";

type Props = {
  theme: Theme;
  configKey: "artsScienceCampusLife" | "polytechnicCampusLife";
  defaultCta?: { label: string; href: string };
};

type CampusLifeConfig = {
  photos: string[];
  cta?: { label: string; href: string };
};

function normalizeConfig(raw: unknown): CampusLifeConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const photos = Array.isArray(r.photos)
    ? r.photos.filter((p): p is string => typeof p === "string" && p.length > 0)
    : [];
  if (photos.length === 0) return null;
  let cta: CampusLifeConfig["cta"];
  if (r.cta && typeof r.cta === "object") {
    const c = r.cta as Record<string, unknown>;
    if (typeof c.label === "string" && typeof c.href === "string") {
      cta = { label: c.label, href: c.href };
    }
  }
  return { photos, cta };
}

const THEME_STYLES: Record<
  Theme,
  {
    eyebrow: string;
    title: string;
    dotActive: string;
    dotInactive: string;
    btn: string;
  }
> = {
  "arts-science": {
    eyebrow: "text-arts-science-accent",
    title: "text-arts-science-dark",
    dotActive: "bg-arts-science-accent",
    dotInactive: "bg-orange-200",
    btn: "bg-arts-science-accent hover:bg-arts-science-accent/90",
  },
  polytechnic: {
    eyebrow: "text-polytechnic",
    title: "text-polytechnic-dark",
    dotActive: "bg-polytechnic",
    dotInactive: "bg-polytechnic/30",
    btn: "bg-polytechnic hover:bg-polytechnic/90",
  },
};

export function CampusLifeCarousel({ theme, configKey, defaultCta }: Props) {
  const [photos, setPhotos] = useState<string[]>(DEFAULT_PHOTOS);
  const [cta, setCta] = useState<{ label: string; href: string }>(
    defaultCta ?? { label: "Explore Full Campus Life", href: "/campus-life" },
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/site-config?key=${configKey}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalizeConfig(res.data);
          if (next) {
            setPhotos(next.photos);
            if (next.cta) setCta(next.cta);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [configKey]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;

    const index = Math.round(
      (scrollLeft / maxScroll) * (photos.length - 1),
    );
    setActiveIndex(Math.min(Math.max(index, 0), photos.length - 1));
  };

  const styles = THEME_STYLES[theme];

  return (
    <section id="life" className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2
            className={`${styles.eyebrow} mb-6 text-sm font-bold tracking-[0.2em] uppercase`}
          >
            Campus life
          </h2>
          <h3
            className={`${styles.title} mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl`}
          >
            See where learning happens beyond the classroom
          </h3>
        </div>

        <DragScroll
          className="scrollbar-hide relative flex h-100 w-full snap-x snap-mandatory gap-4 scroll-smooth md:h-125 md:gap-6"
          onScroll={handleScroll}
        >
          {photos.map((src, index) => (
            <motion.div
              key={`${src}-${index}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative h-full max-w-[85vw] min-w-[85vw] shrink-0 snap-center overflow-hidden bg-stone-100 md:max-w-[60vw] md:min-w-[60vw]"
              draggable={false}
            >
              <img
                src={getImageUrl(src) ?? src}
                alt={`Campus Life ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          ))}
        </DragScroll>

        <div className="mt-4 flex items-center justify-center gap-2">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === activeIndex ? styles.dotActive : styles.dotInactive
              }`}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Link
            href={cta.href}
            className={`${styles.btn} inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold text-white transition-all`}
          >
            {cta.label} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
