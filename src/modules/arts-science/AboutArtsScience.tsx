"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type ArtsSectionProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "subtle" | "brand" | "transparent";
  id?: string;
};

function ArtsSection({ children, className, tone = "surface", ...props }: ArtsSectionProps) {
  const toneClass =
    tone === "brand"
      ? "bg-arts-science-dark text-white"
      : tone === "subtle"
        ? "bg-[#faf9f8]"
        : tone === "transparent"
          ? "bg-transparent"
          : "bg-white";

  return (
    <section className={cn("py-16 md:py-20", toneClass, className)} {...props}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}

type TabKey = "about" | "vision" | "mission";

export function AboutArtsScience() {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "About Us" },
    { key: "vision", label: "Vision" },
    { key: "mission", label: "Mission" },
  ];

  return (
    <section
      id="about"
      className="group/section relative overflow-hidden bg-slate-50"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <div className="absolute inset-0 bg-orange-200 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px]" />

        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
            maskImage:
              "radial-gradient(circle 400px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
          }}
        >
          <div className="absolute inset-0 bg-arts-science-accent [mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] [mask-size:24px_24px]" />
        </div>
      </div>
      <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-arts-science/5 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-arts-science/5 blur-[100px]" />

      <ArtsSection tone="transparent" className="relative">
        {/* Tab Navigation */}
        <div className="relative z-10 mb-10 flex justify-center">
          <div className="inline-flex rounded-full bg-white/80 p-1 shadow-sm border border-orange-100 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  activeTab === tab.key
                    ? "bg-arts-science-accent text-white shadow-md"
                    : "text-arts-science-dark/60 hover:text-arts-science-dark"
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
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <span className="text-arts-science-accent font-sans text-sm font-bold tracking-widest uppercase mb-3 block">
                  About Us
                </span>
                <h2 className="text-arts-science-dark font-serif text-3xl font-bold tracking-tight md:text-5xl mb-6 leading-tight">
                  Fostering Creativity &amp; Scientific Inquiry
                </h2>
                <div className="space-y-4 text-arts-science-dark/75 font-sans text-[17px] leading-relaxed">
                  <p>
                    JCT College of Arts &amp; Science aims to provide an interdisciplinary and innovative learning environment that empowers students to excel in various domains of arts, commerce, and sciences. Our campus is vibrant with intellectual rigor and creativity.
                  </p>
                  <p>
                    We are committed to delivering contemporary programs that meet global standards. We equip our students with analytical skills, ethical values, and leadership qualities required to navigate and shape the future of society and industry.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[450px] lg:h-[550px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
              >
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                  alt="JCT Arts and Science Campus"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Vision Tab */}
        {activeTab === "vision" && (
          <motion.div
            key="vision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] p-10 shadow-sm border border-orange-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-50 p-4 rounded-2xl">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#f97316" />
                    </svg>
                  </div>
                  <h3 className="text-arts-science-dark font-serif text-3xl font-bold">Our Vision</h3>
                </div>
                <p className="text-arts-science-dark/75 font-sans leading-relaxed text-[17px]">
                  To be an institution of excellence in higher education by providing quality learning experiences, promoting research, and equipping students with the ethical values and intellectual competence needed to build a sustainable and harmonious society.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Mission Tab */}
        {activeTab === "mission" && (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-arts-science-dark rounded-[2rem] p-10 shadow-lg text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 12H5V22H19V12H22L12 2ZM17 20H7V10H17V20Z" fill="#f97316" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white">Our Mission</h3>
                </div>
                <ul className="space-y-4 font-sans text-[16px] text-white/80 leading-relaxed list-disc list-outside pl-5 relative z-10">
                  <li>Provide holistic education integrating academic excellence with human values.</li>
                  <li>Foster a culture of continuous learning, critical thinking, and innovation.</li>
                  <li>Empower students with career readiness and entrepreneurship skills to meet global challenges.</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </ArtsSection>

      <ArtsSection tone="transparent" className="relative pb-24">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-orange-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <Quote className="absolute top-8 left-8 w-32 h-32 text-orange-500/5 -rotate-6" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-4"
            >
              <div className="relative aspect-[4/5] w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden border-8 border-orange-50 flex items-center justify-center bg-white shadow-lg">
                 <Image
                  src="/jct_logo.png"
                  alt="Principal"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className="text-arts-science-dark font-serif text-2xl font-bold">Dr. K. Senthil</h3>
                <p className="text-arts-science-accent font-sans text-[15px] font-semibold mt-1">Principal, JCT College of Arts &amp; Science</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 flex flex-col justify-center"
            >
              <h2 className="text-arts-science-dark font-serif text-3xl md:text-4xl font-bold mb-8">
                Principal&apos;s Message
              </h2>
              <div className="space-y-5 text-arts-science-dark/80 font-sans text-lg md:text-[19px] leading-relaxed italic">
                <p>
                  &ldquo;It gives me immense pleasure to welcome you to JCT College of Arts &amp; Science. Higher education today requires a delicate balance of academic rigor, practical knowledge, and value-based development. At JCT, we ensure our students find this balance.&rdquo;
                </p>
                <p>
                  &ldquo;Our dedicated faculty, modern infrastructure, and industry-oriented programs ensure that every student who leaves our doors is confident, capable, and ready to make a significant impact in the world.&rdquo;
                </p>
                <p>
                  &ldquo;I invite you to be a part of our dynamic learning community and embark on a fulfilling educational journey that will shape your career and your life.&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </ArtsSection>
    </section>
  );
}
