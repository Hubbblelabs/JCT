"use client";

import { motion } from "framer-motion";
import { PolySection, PolySectionHeader } from "@/modules/polytechnic/PolyUI";
import Image from "next/image";
import { Quote } from "lucide-react";

export function AboutPolytechnic() {
  return (
    <div className="relative overflow-hidden bg-[#f6f8f7]">
      {/* Global Engineering Drafting Paper Texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <PolySection 
        id="about-institution" 
        tone="transparent"
        className="relative"
      >
        {/* Abstract Texture & Blobs */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.6]" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 160, 36, 0.15) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-polytechnic-accent/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-polytechnic-dark/5 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <span className="text-polytechnic-accent font-sans text-sm font-bold tracking-widest uppercase mb-3 block">
              About Us
            </span>
            <h2 className="text-polytechnic-dark font-serif text-3xl font-bold tracking-tight md:text-4xl mb-6">
              Empowering Minds with Technical Excellence
            </h2>
            <div className="space-y-4 text-polytechnic-dark/70 font-sans text-base leading-relaxed">
              <p>
                Established with a strong commitment to quality technical education, JCT Polytechnic College has been a beacon of learning, transforming aspiring youngsters into skilled technicians and engineers. We provide a robust foundation in various engineering disciplines to meet the evolving demands of the industrial sector.
              </p>
              <p>
                Our curriculum is strictly aligned with the Directorate of Technical Education (DoTE) and approved by AICTE. We integrate hands-on workshop training from the very first semester, ensuring that our students possess not just theoretical knowledge, but real-world practical competence.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
              alt="JCT Polytechnic Campus"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </PolySection>

      <PolySection 
        id="vision-mission" 
        tone="transparent"
        className="relative"
      >
        <div className="relative z-10">
          <PolySectionHeader
            title="Vision & Mission"
            description="Our guiding principles and core objectives."
            centered={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-polytechnic-accent/10 p-3 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#D4A024" />
                </svg>
              </div>
              <h3 className="text-polytechnic-dark font-serif text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-polytechnic-dark/70 font-sans leading-relaxed text-[15px]">
              To emerge as a premier institute of technical education by imparting practical, industry-driven training and nurturing ethically strong, socially responsible technicians who contribute to the nation's technological growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-polytechnic-dark rounded-2xl p-8 shadow-sm text-white"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-polytechnic-accent/20 p-3 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 12H5V22H19V12H22L12 2ZM17 20H7V10H17V20Z" fill="#D4A024" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <ul className="space-y-3 font-sans text-[15px] text-white/80 leading-relaxed list-disc list-outside pl-4">
              <li>To provide state-of-the-art infrastructure and skilled faculty to facilitate effective teaching and practical learning.</li>
              <li>To bridge the gap between academia and industry by conducting hands-on workshops and continuous industrial engagement.</li>
              <li>To imbibe moral values, discipline, and leadership qualities in students to prepare them for dynamic professional environments.</li>
            </ul>
          </motion.div>
        </div>
        </div>
      </PolySection>

      <PolySection id="principals-message" tone="transparent">
        <div className="bg-[#fcfaf7] rounded-[2rem] p-6 md:p-12 border border-[#f0e6d5] shadow-lg relative overflow-hidden">
          {/* Diagonal abstract texture */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(212, 160, 36, 0.1) 0px, rgba(212, 160, 36, 0.1) 2px, transparent 2px, transparent 10px)`
            }}
          />
          {/* Decorative Quote Mark */}
          <Quote className="absolute top-6 left-6 w-24 h-24 text-polytechnic-accent/10 -rotate-12" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-4"
            >
              <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/jct_logo.png"
                  alt="Principal"
                  fill
                  className="object-contain bg-white"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className="text-polytechnic-dark font-serif text-xl font-bold">Dr. A. Jothi</h3>
                <p className="text-polytechnic-accent font-sans text-sm font-semibold mt-1">Principal, JCT Polytechnic College</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 flex flex-col justify-center"
            >
              <h2 className="text-polytechnic-dark font-serif text-2xl md:text-3xl font-bold mb-6">
                Principal&apos;s Message
              </h2>
              <div className="space-y-4 text-polytechnic-dark/80 font-sans text-base md:text-[17px] leading-relaxed italic">
                <p>
                  "Welcome to JCT Polytechnic College. As we stand at the threshold of a rapidly advancing technological era, our objective is to equip our youth with the exact skills the modern industry demands. At our institution, we emphasize hands-on, practical learning above all else."
                </p>
                <p>
                  "Our dedicated faculty ensures that our students are not only technically proficient but also imbibe strong ethical values. We have consistently produced a high placement record because we bridge the gap between the classroom and the factory floor from day one."
                </p>
                <p>
                  "I invite you to explore our campus and witness the dedication to experiential learning that defines JCT Polytechnic. Let us work together to build a strong foundation for your future."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </PolySection>
    </div>
  );
}
