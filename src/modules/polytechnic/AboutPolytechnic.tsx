"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PolySection } from "@/modules/polytechnic/PolyUI";
import Image from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";

type TabKey = "about" | "vision-mission" | "principal";

export function AboutPolytechnic() {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "About Us" },
    { key: "vision-mission", label: "Vision & Mission" },
    { key: "principal", label: "Principal's Message" },
  ];

  return (
    <div
      className="group/section relative overflow-hidden bg-[#f6f8f7]"
      onMouseMove={handleMouseMove}
    >
      {/* Global Engineering Drafting Paper Texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 92, 185, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 92, 185, 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <PolySection
        id="about-institution"
        tone="transparent"
        className="relative pt-0 md:pt-2"
      >
        <div className="bg-polytechnic-accent/5 pointer-events-none absolute top-0 right-0 z-0 -mt-32 -mr-32 h-125 w-125 rounded-full blur-3xl"></div>
        <div className="bg-polytechnic-dark/5 pointer-events-none absolute bottom-0 left-0 z-0 -mb-32 -ml-32 h-100 w-100 rounded-full blur-3xl"></div>

        {/* Tab Navigation */}
        <div className="relative z-10 mb-10 flex justify-center px-4">
          <div className="no-scrollbar flex max-w-full flex-col overflow-x-auto rounded-3xl border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm md:flex-row md:rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  activeTab === tab.key
                    ? "bg-polytechnic text-white shadow-md"
                    : "text-polytechnic-dark/60 hover:text-polytechnic-dark",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* About Us Tab */}
        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <span className="text-polytechnic mb-4 block text-sm font-bold tracking-[0.2em] uppercase">
                  About Us
                </span>
                <h2 className="text-polytechnic-dark mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
                  Empowering Minds with Technical Excellence
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-stone-600 md:text-lg">
                  <p>
                    Established with a strong commitment to quality technical
                    education, JCT Polytechnic College has been a beacon of
                    learning, transforming aspiring youngsters into skilled
                    technicians and engineers. We provide a robust foundation in
                    various engineering disciplines to meet the evolving demands
                    of the industrial sector.
                  </p>
                  <p>
                    Our curriculum is strictly aligned with the Directorate of
                    Technical Education (DoTE) and approved by AICTE. We
                    integrate hands-on workshop training from the very first
                    semester, ensuring that our students possess not just
                    theoretical knowledge, but real-world practical competence.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-100 w-full overflow-hidden rounded-3xl shadow-2xl lg:h-125"
              >
                <Image
                  src="/site_assests/polytechnic.jpeg"
                  alt="JCT Polytechnic Campus"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Vision & Mission Tab */}
        {activeTab === "vision-mission" && (
          <motion.div
            key="vision-mission"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="bg-polytechnic-accent/10 rounded-full p-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
                        fill="#4f617b"
                      />
                    </svg>
                  </div>
                  <h3 className="text-polytechnic-dark font-serif text-2xl font-bold">
                    Our Vision
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-stone-600 md:text-lg">
                  To emerge as a premier institute of technical education by
                  imparting practical, industry-driven training and nurturing
                  ethically strong, socially responsible technicians who
                  contribute to the nation&apos;s technological growth.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-polytechnic-dark rounded-2xl p-8 text-white shadow-sm"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="bg-polytechnic-accent/20 rounded-full p-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 12H5V22H19V12H22L12 2ZM17 20H7V10H17V20Z"
                        fill="#4f617b"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Our Mission
                  </h3>
                </div>
                <ul className="list-outside list-disc space-y-3 pl-4 text-base leading-relaxed text-white/80 md:text-lg">
                  <li>
                    To provide state-of-the-art infrastructure and skilled
                    faculty to facilitate effective teaching and practical
                    learning.
                  </li>
                  <li>
                    To bridge the gap between academia and industry by
                    conducting hands-on workshops and continuous industrial
                    engagement.
                  </li>
                  <li>
                    To imbibe moral values, discipline, and leadership qualities
                    in students to prepare them for dynamic professional
                    environments.
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Principal's Message Tab */}
        {activeTab === "principal" && (
          <motion.div
            key="principal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="relative z-10 overflow-hidden rounded-4xl border border-[#f0e6d5] bg-[#fcfaf7] p-6 shadow-lg md:p-12">
              {/* Diagonal abstract texture */}
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(212, 160, 36, 0.1) 0px, rgba(212, 160, 36, 0.1) 2px, transparent 2px, transparent 10px)`,
                }}
              />
              {/* Decorative Quote Mark */}
              <Quote className="text-polytechnic-accent/10 absolute top-6 left-6 h-24 w-24 -rotate-12" />

              <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="md:col-span-4"
                >
                  <div className="relative mx-auto aspect-square w-full max-w-70 overflow-hidden rounded-full border-4 border-white shadow-xl">
                    <Image
                      src="/site_assests/logo.webp"
                      alt="Principal"
                      fill
                      className="bg-white object-contain"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-polytechnic-dark font-serif text-xl font-bold">
                      Dr. A. Jothi
                    </h3>
                    <p className="text-polytechnic-accent mt-1 font-sans text-sm font-semibold">
                      Principal, JCT Polytechnic College
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col justify-center md:col-span-8"
                >
                  <h2 className="text-polytechnic-dark mb-6 font-serif text-3xl leading-tight font-bold md:text-4xl">
                    Principal&apos;s Message
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed text-stone-600 italic md:text-lg">
                    <p>
                      &ldquo;Welcome to JCT Polytechnic College. As we stand at
                      the threshold of a rapidly advancing technological era,
                      our objective is to equip our youth with the exact skills
                      the modern industry demands. At our institution, we
                      emphasize hands-on, practical learning above all
                      else.&rdquo;
                    </p>
                    <p>
                      &ldquo;Our dedicated faculty ensures that our students are
                      not only technically proficient but also imbibe strong
                      ethical values. We have consistently produced a high
                      placement record because we bridge the gap between the
                      classroom and the factory floor from day one.&rdquo;
                    </p>
                    <p>
                      &ldquo;I invite you to explore our campus and witness the
                      dedication to experiential learning that defines JCT
                      Polytechnic. Let us work together to build a strong
                      foundation for your future.&rdquo;
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </PolySection>
    </div>
  );
}
