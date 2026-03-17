"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Award, Users, BookOpen, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroStats } from "@/data/arts-science";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#f8f9fb]">
      {/* Announcement Banner */}
      <div className="flex items-center justify-center gap-3 bg-black px-4 py-2.5 text-center text-sm text-white">
        <span className="bg-arts-science rounded px-2 py-0.5 text-xs font-semibold text-white">
          NEW
        </span>
        <span>
          Admissions open for 2025–26 — Apply early and secure your seat.
        </span>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto flex flex-1 flex-col items-center gap-12 px-4 pt-32 pb-0 md:flex-row md:items-center md:gap-8 md:px-8 md:pt-36 lg:pt-40">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1"
        >
          <h1 className="mb-6 font-serif text-5xl leading-tight font-bold text-gray-900 sm:text-6xl lg:text-7xl">
            Good Education
            <br />
            <span className="text-arts-science/30 font-bold">to Build</span>
            <br />A Better Future
          </h1>

          <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg">
            We offer a quality education that provides not only lessons but also
            real experience in every field. Embrace the future with our
            immersive, industry-aligned programs.
          </p>

          {/* CTA Buttons */}
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <Link
              href="/admissions"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-arts-science hover:bg-arts-science-dark h-12 gap-2 px-7 font-medium text-white",
              )}
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              href="#programs"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-gray-300 px-7 font-medium text-gray-700 hover:bg-gray-100",
              )}
            >
              Explore Programs
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className={`text-2xl font-bold ${stat.accent ? "text-arts-science" : "text-gray-900"}`}
                >
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column — Image Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative flex-1 self-end"
        >
          <div className="relative overflow-hidden rounded-t-2xl shadow-2xl">
            {/* Card Header */}
            <div className="flex items-center justify-between bg-white px-5 py-4">
              <span className="font-semibold text-gray-800">Campus Life</span>
              <Button
                size="sm"
                className="bg-arts-science h-8 rounded-full px-4 text-xs font-medium text-white"
              >
                Take a Tour
              </Button>
            </div>
            {/* Image */}
            <div className="relative h-72 w-full md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
                alt="JCT Arts & Science Campus"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  4.8 · 500+ Reviews
                </span>
              </motion.div>
              {/* NAAC Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="bg-arts-science absolute top-6 right-6 rounded-xl px-4 py-2 text-center shadow-lg"
              >
                <div className="text-lg font-bold text-white">NAAC</div>
                <div className="text-xs font-medium text-white/80">
                  Accredited
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-arts-science/95 border-arts-science-light/20 mt-16 w-full border-t backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 divide-y divide-white/20 md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col items-center px-4 pt-4 text-center md:px-8 md:pt-0">
              <div className="mb-3 flex items-center gap-2">
                <Award size={20} className="text-white" />
                <h3 className="font-serif text-lg font-bold text-white md:text-xl">
                  Quality
                </h3>
              </div>
              <p className="text-sm leading-relaxed font-light text-white/80">
                Experience a world-class education and unlock your potential at
                our university
              </p>
            </div>

            <div className="flex flex-col items-center px-4 pt-4 text-center md:px-8 md:pt-0">
              <div className="mb-3 flex items-center gap-2">
                <Users size={20} className="text-white" />
                <h3 className="font-serif text-lg font-bold text-white md:text-xl">
                  Leadership
                </h3>
              </div>
              <p className="text-sm leading-relaxed font-light text-white/80">
                Guided by visionary leadership, inspires growth, and shapes
                future leaders
              </p>
            </div>

            <div className="flex flex-col items-center px-4 pt-4 text-center md:px-8 md:pt-0">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={20} className="text-white" />
                <h3 className="font-serif text-lg font-bold text-white md:text-xl">
                  Experience
                </h3>
              </div>
              <p className="text-sm leading-relaxed font-light text-white/80">
                Embark on a transformative journey of personal and professional
                growth
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
