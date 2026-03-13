"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type CollegeTestimonialItem = {
  quote: string;
  name: string;
  role: string;
  image: string;
  tag?: string;
};

const TESTIMONIAL_CATEGORIES = ["Alumini", "Student", "VIP"] as const;

type TestimonialCategory = (typeof TESTIMONIAL_CATEGORIES)[number];

function normalizeCategory(tag?: string): TestimonialCategory {
  if (!tag) return "Alumini";
  const value = tag.toLowerCase();
  if (value === "student") return "Student";
  if (value === "vip") return "VIP";
  return "Alumini";
}

type CollegeTestimonialsProps = {
  title: string;
  subtitle?: string;
  items: CollegeTestimonialItem[];
  accentColor: string;
  sectionBgClassName?: string;
};

export function CollegeTestimonials({
  title,
  subtitle,
  items,
  accentColor,
  sectionBgClassName = "bg-[#F5F5F5]",
}: CollegeTestimonialsProps) {
  const groupedItems = useMemo(() => {
    const groups: Record<TestimonialCategory, CollegeTestimonialItem[]> = {
      Alumini: [],
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

  const [activeIndices, setActiveIndices] = useState<Record<TestimonialCategory, number>>({
    Alumini: 0,
    Student: 0,
    VIP: 0,
  });
  const [paused, setPaused] = useState<Record<TestimonialCategory, boolean>>({
    Alumini: false,
    Student: false,
    VIP: false,
  });

  useEffect(() => {
    const timers = TESTIMONIAL_CATEGORIES.map((category) =>
      setInterval(() => {
        setActiveIndices((prev) => {
          if (paused[category]) return prev;
          const lane = groupedItems[category];
          if (!lane.length) return prev;
          return {
            ...prev,
            [category]: (prev[category] + 1) % lane.length,
          };
        });
      }, 2800),
    );

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [groupedItems, paused]);

  return (
    <section className={`py-20 md:py-28 ${sectionBgClassName}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-[#111827] md:text-5xl">{title}</h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563] md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIAL_CATEGORIES.map((category, laneIndex) => {
            const laneItems = groupedItems[category];
            const activeIndex = activeIndices[category] % laneItems.length;
            const activeItem = laneItems[activeIndex];

            return (
              <motion.article
                key={category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: laneIndex * 0.08 }}
                className="flex flex-col items-center"
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
                <span
                  className="z-20 inline-flex rounded-full px-6 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  {category}
                </span>

                <motion.div
                  key={`${category}-${activeItem.name}-${activeIndex}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full"
                >
                  <div
                    className="relative z-10 mx-auto -mt-2 h-32 w-32 overflow-hidden rounded-full border-4 bg-white"
                    style={{ borderColor: accentColor }}
                  >
                    <Image
                      src={activeItem.image}
                      alt={activeItem.name}
                      fill
                      sizes="136px"
                      className="object-cover"
                    />
                  </div>

                  <div className="-mt-10 w-full rounded-4xl border border-[#D1D5DB] bg-white px-8 pt-20 pb-10 text-center shadow-[0_12px_35px_rgba(17,24,39,0.06)]">
                    <p className="min-h-36 text-lg leading-relaxed text-[#374151]">
                      {activeItem.quote}
                    </p>

                    <h3
                      className="mt-8 text-4xl font-bold"
                      style={{ color: accentColor }}
                    >
                      {activeItem.name}
                    </h3>
                    <p className="mt-2 text-lg text-[#6B7280]">{activeItem.role}</p>
                  </div>
                </motion.div>

                <div className="mt-7 flex items-center gap-2">
                  {laneItems.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`h-3 w-3 rounded-full ${
                        dotIndex === activeIndex ? "opacity-100" : "opacity-40"
                      }`}
                      style={{
                        backgroundColor:
                          dotIndex === activeIndex ? accentColor : "#D1D5DB",
                      }}
                    />
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
