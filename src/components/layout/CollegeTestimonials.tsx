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

  const [activeIndices, setActiveIndices] = useState<
    Record<TestimonialCategory, number>
  >({
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
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-[#f2f4f7] rounded-[3rem] md:rounded-[4rem] p-6 md:p-10 lg:p-14 shadow-inner">
          <div className="mb-8 text-center">
            {subtitle && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#a0842c] font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-4 inline-block"
              >
                Voices
              </motion.span>
            )}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-5xl font-serif italic text-[#1a2332] leading-tight"
            >
              {title === "Testimonials" ? "Stories of Transformation" : title}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-3">
            {TESTIMONIAL_CATEGORIES.map((category, laneIndex) => {
              const laneItems = groupedItems[category];
              const activeIndex = activeIndices[category] % laneItems.length;
              const activeItem = laneItems[activeIndex];

              if (!activeItem) return null;

              return (
                <motion.article
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: laneIndex * 0.1 }}
                  className="flex flex-col h-full"
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
                  <motion.div
                    key={`${category}-${activeItem.name}-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col flex-1 bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100 transition-colors"
                  >
                    <div className="flex-1 relative">
                      <span className="absolute -top-2 right-0 bg-[#f4f5f7] text-[#a0842c] px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                        {category}
                      </span>
                      <span className="text-[#fcebba] font-serif text-7xl leading-0 block mb-6 mt-4 opacity-80">&ldquo;</span>
                      <p className="text-[#5b6574] italic leading-relaxed text-[15px] min-h-[140px]">
                        "{activeItem.quote}"
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={activeItem.image}
                          alt={activeItem.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1a2332] text-[15px]">
                          {activeItem.name}
                        </h3>
                        <p className="text-[#7c869a] text-[10px] font-bold tracking-widest uppercase mt-0.5">
                          {activeItem.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    {laneItems.length > 1 && laneItems.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        onClick={() => setActiveIndices(prev => ({ ...prev, [category]: dotIndex }))}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dotIndex === activeIndex 
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
