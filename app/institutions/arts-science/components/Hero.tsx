"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import { heroStats } from "../data";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center bg-[#800020] py-20 px-4 md:px-8 overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white mb-6 leading-[1.1]">
              Shape your future at our <span className="text-[#D4AF37]">university</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 font-light">
              Join thousands of students who have transformed their careers
              through rigorous academics and real-world experience. Our campus
              offers the foundation you need to lead in tomorrow's world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 lg:mb-0 relative z-20">
              <Button
                size="lg"
                className="h-14 px-8 bg-[#D4AF37] text-[#800020] hover:bg-[#b8962e] font-semibold rounded-none"
              >
                Explore
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-white/30 text-white bg-transparent hover:bg-white/10 font-semibold rounded-none"
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
            className="relative w-full aspect-square lg:aspect-[4/3] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-col shrink-0 rounded-2xl overflow-hidden"
          >
            {/* Relume style image placeholder */}
            <div className="text-white/40">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
