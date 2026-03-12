"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Krishnan",
    batch: "B.E. CSE, 2024",
    company: "Infosys",
    quote:
      "The practical exposure at JCT gave me real confidence. From hackathons to internships, every experience prepared me for my career at Infosys.",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    name: "Arjun Raghavan",
    batch: "B.E. Mechanical, 2023",
    company: "Caterpillar",
    quote:
      "JCT's engineering labs and faculty mentorship helped me develop real-world problem-solving skills. I landed my dream role straight from campus.",
    avatar: "https://i.pravatar.cc/150?u=arjun",
  },
  {
    name: "Sneha Patel",
    batch: "B.Sc Computer Science, 2024",
    company: "TCS",
    quote:
      "The Arts & Science college provided a perfect blend of theory and practice. The coding bootcamps and placement training made all the difference.",
    avatar: "https://i.pravatar.cc/150?u=sneha",
  },
  {
    name: "Karthik Sundaram",
    batch: "Diploma — Mechanical, 2023",
    company: "TVS Motors",
    quote:
      "JCT Polytechnic's hands-on approach gave me skills employers value. I was offered a role before even completing my final semester.",
    avatar: "https://i.pravatar.cc/150?u=karthik",
  },
  {
    name: "Anjali Devi",
    batch: "B.Com (CA), 2024",
    company: "Zoho Corp",
    quote:
      "The faculty at JCT go beyond textbooks. They helped me prepare for competitive exams, interviews, and real-world business scenarios.",
    avatar: "https://i.pravatar.cc/150?u=anjali",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
    const gap = 20;
    const newIndex =
      dir === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(testimonials.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    scrollRef.current.scrollTo({
      left: newIndex * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              Student Stories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-navy font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
            >
              Voices of{" "}
              <span className="text-muted-foreground font-light italic">
                Success
              </span>
            </motion.h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={activeIndex === 0}
              className="border-border text-navy hover:bg-navy hover:border-navy disabled:hover:text-navy disabled:hover:border-border flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={activeIndex === testimonials.length - 1}
              className="border-border text-navy hover:bg-navy hover:border-navy disabled:hover:text-navy disabled:hover:border-border flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="snap-container scrollbar-hide flex gap-5 overflow-x-auto pb-4"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="snap-item w-[320px] shrink-0 sm:w-[380px] md:w-[420px]"
            >
              <div className="bg-surface border-border hover:border-gold/30 group h-full rounded-2xl border p-5 transition-all md:p-8">
                <Quote
                  size={28}
                  className="text-gold/30 mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-foreground/80 mb-6 min-h-[80px] font-sans text-sm leading-relaxed md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-border flex items-center gap-3 border-t pt-5">
                  <div className="relative h-11 w-11 shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="border-gold/20 rounded-full border-2 object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-navy font-sans text-sm font-semibold">
                      {t.name}
                    </h4>
                    <p className="text-muted-foreground font-sans text-xs">
                      {t.batch} · Placed at{" "}
                      <span className="text-gold font-semibold">
                        {t.company}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                if (scrollRef.current) {
                  const cw =
                    scrollRef.current.children[0]?.getBoundingClientRect()
                      .width || 0;
                  scrollRef.current.scrollTo({
                    left: i * (cw + 20),
                    behavior: "smooth",
                  });
                }
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-gold w-6" : "bg-border hover:bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
