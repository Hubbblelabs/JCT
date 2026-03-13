"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
                className="h-14 rounded-full border border-[#f1d892]/60 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] px-8 font-semibold text-[#70001b] shadow-[0_10px_25px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
              >
                Explore
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-2 border-white/50 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                Learn
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Campus image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex aspect-square w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm lg:aspect-4/3"
          >
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop"
              alt="Students collaborating on campus"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-tr from-[#800020]/25 via-transparent to-[#D4AF37]/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
