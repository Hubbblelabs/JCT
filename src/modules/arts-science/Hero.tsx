"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#800020] px-4 py-20 md:min-h-screen md:px-8">
      {/* Artistic pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, transparent 0%, transparent 2%, #D4AF37 2%, #D4AF37 2.2%, transparent 2.2%)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="mb-6 font-sans text-4xl leading-[1.1] font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Shape your future at our{" "}
              <span className="text-[#D4AF37]">university</span>
            </h1>

            <p className="mb-8 text-base leading-relaxed font-light text-white/90 md:text-lg">
              Join thousands of students who have transformed their careers
              through rigorous academics and real-world experience. Our campus
              offers the foundation you need to lead in tomorrow&apos;s world.
            </p>

            <div className="relative z-20 mb-16 flex flex-col gap-4 sm:flex-row lg:mb-0">
              <Button
                size="lg"
                className="h-14 rounded-none bg-[#D4AF37] px-8 font-semibold text-[#800020] hover:bg-[#b8962e]"
              >
                Explore
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-none border-white/30 bg-transparent px-8 font-semibold text-white hover:bg-white/10"
              >
                Learn
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex aspect-square w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm lg:aspect-[4/3]"
          >
            {/* Relume style image placeholder */}
            <div className="text-white/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
