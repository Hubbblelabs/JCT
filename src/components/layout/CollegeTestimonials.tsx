"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type CollegeTestimonialItem = {
  quote: string;
  name: string;
  role: string;
  image: string;
  tag?: string;
};

const TESTIMONIAL_CATEGORIES = ["Alumni", "Student", "VIP"] as const;

const CATEGORY_ROTATION_CONFIG: Record<
  TestimonialCategory,
  { intervalMs: number; initialDelayMs: number }
> = {
  Alumni: { intervalMs: 2700, initialDelayMs: 0 },
  Student: { intervalMs: 3300, initialDelayMs: 600 },
  VIP: { intervalMs: 3900, initialDelayMs: 1200 },
};

type TestimonialCategory = (typeof TESTIMONIAL_CATEGORIES)[number];

function normalizeCategory(tag?: string): TestimonialCategory {
  if (!tag) return "Alumni";
  const value = tag.toLowerCase();
  if (value === "student") return "Student";
  if (value === "vip") return "VIP";
  return "Alumni";
}

type CollegeTestimonialsProps = {
  title: string;
  subtitle?: string;
  items: CollegeTestimonialItem[];
  accentColor: string;
  sectionBgClassName?: string;
  sectionId?: string;
};

export function CollegeTestimonials({
  title,
  subtitle,
  items,
  accentColor: _accentColor,
  sectionBgClassName = "bg-[#F5F5F5]",
  sectionId,
}: CollegeTestimonialsProps) {
  const groupedItems = useMemo(() => {
    const groups: Record<TestimonialCategory, CollegeTestimonialItem[]> = {
      Alumni: [],
      Student: [],
      VIP: [],
    };

    items.forEach((item) => {
      groups[normalizeCategory(item.tag)].push(item);
    });

    const fallback = items[0];
    if (fallback) {
      TESTIMONIAL_CATEGORIES.forEach((category) => {
        if (groups[category].length === 0) {
          groups[category] = [{ ...fallback, tag: category }];
        }
      });
    }

    return groups;
  }, [items]);

  const [activeIndices, setActiveIndices] = useState<
    Record<TestimonialCategory, number>
  >({
    Alumni: 0,
    Student: 0,
    VIP: 0,
  });
  const [paused, setPaused] = useState<Record<TestimonialCategory, boolean>>({
    Alumni: false,
    Student: false,
    VIP: false,
  });

  useEffect(() => {
    const timers = TESTIMONIAL_CATEGORIES.map((category) => {
      const { intervalMs, initialDelayMs } = CATEGORY_ROTATION_CONFIG[category];
      const lane = groupedItems[category];

      if (lane.length <= 1) {
        return -1;
      }

      const kickoffTimer = window.setTimeout(() => {
        setActiveIndices((prev) => {
          if (paused[category]) return prev;
          return {
            ...prev,
            [category]: (prev[category] + 1) % lane.length,
          };
        });
      }, initialDelayMs);

      const intervalTimer = window.setInterval(() => {
        setActiveIndices((prev) => {
          if (paused[category]) return prev;
          return {
            ...prev,
            [category]: (prev[category] + 1) % lane.length,
          };
        });
      }, intervalMs);

      return { kickoffTimer, intervalTimer };
    });

    return () => {
      timers.forEach((timer) => {
        if (timer === -1) return;
        clearTimeout(timer.kickoffTimer);
        clearInterval(timer.intervalTimer);
      });
    };
  }, [groupedItems, paused]);

  return (
    <section id={sectionId} className={`py-10 md:py-16 ${sectionBgClassName}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-[3rem] bg-[#f2f4f7] p-6 shadow-inner md:rounded-[4rem] md:p-10 lg:p-14">
          <div className="mb-8 text-center">
            {subtitle && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-4 inline-block font-sans text-sm font-bold tracking-[0.2em] text-[#a0842c] uppercase"
              >
                Voices
              </motion.span>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl"
            >
              {title === "Testimonials" ? "Stories of Transformation" : title}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {TESTIMONIAL_CATEGORIES.map((category, laneIndex) => {
              const laneItems = groupedItems[category];
              const activeIndex = activeIndices[category] % laneItems.length;

              if (laneItems.length === 0) return null;
              const activeItem = laneItems[activeIndex];

              return (
                <motion.article
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: laneIndex * 0.1 }}
                  className="flex h-full flex-col"
                  onMouseEnter={() =>
                    setPaused((prev) => ({
                      ...prev,
                      [category]: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setPaused((prev) => ({
                      ...prev,
                      [category]: false,
                    }))
                  }
                >
                  <div className="grid w-full flex-1 overflow-hidden pb-4">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={activeIndex}
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        className="col-start-1 row-start-1 flex w-full shrink-0 flex-col px-1"
                      >
                        <div className="flex h-full flex-col rounded-3xl border border-transparent bg-white p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-colors hover:border-gray-100 md:p-10">
                          <div className="relative flex-1">
                            <span className="absolute -top-2 right-0 rounded-full bg-[#f4f5f7] px-3 py-1 text-[10px] font-bold tracking-widest text-[#a0842c] uppercase">
                              {category}
                            </span>
                            <span className="mt-4 mb-6 block font-serif text-7xl leading-0 text-[#fcebba] opacity-80">
                              &ldquo;
                            </span>
                            <p className="min-h-35 text-base leading-relaxed text-stone-600 italic md:text-lg">
                              &quot;{activeItem.quote}&quot;
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-4 border-t border-gray-100/80 pt-4">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <Image
                                src={activeItem.image}
                                alt={activeItem.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-navy font-serif text-lg font-bold">
                                {activeItem.name}
                              </h3>
                              <p className="mt-0.5 text-xs font-bold tracking-widest text-stone-500 uppercase">
                                {activeItem.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    {laneItems.length > 1 &&
                      laneItems.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() =>
                            setActiveIndices((prev) => ({
                              ...prev,
                              [category]: dotIndex,
                            }))
                          }
                          className={`h-2 rounded-full transition-all duration-300 ${dotIndex === activeIndex
                              ? "w-6 bg-[#3b475c]"
                              : "w-2 bg-[#d1d5db] hover:bg-[#9ca3af]"
                            }`}
                          aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                      ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
