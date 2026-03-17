"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DragScroll } from "@/components/ui/DragScroll";

const campusImages = [
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
];

export function CampusLife() {
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:sticky lg:top-32"
          >
            <h2 className="text-polytechnic-dark mb-4 text-xs font-bold tracking-[0.2em] uppercase">
              Life @ JCT
            </h2>
            <h3 className="text-polytechnic-dark mb-6 font-sans text-4xl leading-tight font-bold md:text-5xl">
              More than a classroom
            </h3>
            <p className="mb-6 text-lg leading-relaxed font-light text-[#212121]/75">
              We want you to make the most of your time studying with us.
              Studying here is about the atmosphere and feeling like part of the
              JCT Polytechnic community — whether you&apos;re in the workshop,
              the library, or on the sports field.
            </p>
            <p className="mb-10 leading-relaxed font-light text-[#212121]/75">
              Our campus offers dedicated labs, sports facilities, a library
              with technical references, and an active NSS and cultural
              programme that keeps student life vibrant throughout the year.
            </p>
            <Link
              href="/institutions/polytechnic/campus-life"
              className="group to-gold text-polytechnic-dark inline-flex h-12 items-center gap-2 rounded-full border border-[#ffd166]/70 bg-linear-to-r from-[#ffd166] px-8 text-sm font-semibold shadow-[0_10px_24px_rgba(255,179,0,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
            >
              Find Out More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right: Drag-scroll gallery */}
          <div>
            <DragScroll className="relative flex h-110 w-full snap-x snap-mandatory gap-4 scroll-smooth pb-4 md:h-130">
              {campusImages.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-full min-w-[75%] shrink-0 snap-center overflow-hidden rounded-2xl bg-stone-100 md:min-w-[55%]"
                  draggable={false}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Campus Life ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </DragScroll>

            {/* Pagination dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {campusImages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${i === 0 ? "bg-polytechnic-dark h-2 w-6" : "h-2 w-2 bg-stone-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
