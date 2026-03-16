"use client";

import { motion } from "framer-motion";
import { Hammer, Factory, Target, GraduationCap } from "lucide-react";

const advantages = [
  {
    icon: Hammer,
    title: "Workshop Training from Day One",
    desc: "You don't wait two years to touch a machine. Practical sessions begin in the very first semester — welding, fitting, carpentry, and beyond.",
  },
  {
    icon: Factory,
    title: "Industry-Reviewed Curriculum",
    desc: "Our course content is periodically reviewed with input from local industries and alumni now working in technical roles across Tamil Nadu.",
  },
  {
    icon: Target,
    title: "Affordable, Focused Education",
    desc: "A three-year diploma costs a fraction of a four-year degree. For students who want to start working sooner, this is the most direct path.",
  },
  {
    icon: GraduationCap,
    title: "Clear Path to a Degree",
    desc: "Every diploma graduate can apply for lateral entry into the second year of B.E. programs — at JCT Engineering or any AICTE-approved college.",
  },
];

export function Distinction() {
  return (
    <section className="bg-[#F8F9FA] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#1A237E] uppercase">
              Distinction
            </h2>
            <h3 className="mb-6 font-sans text-4xl leading-tight font-bold text-[#1A237E] md:text-5xl">
              Why JCT Polytechnic
            </h3>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light text-[#212121]/75">
              Not every great career begins with a four-year degree. Our diploma
              programs offer focused, affordable, workshop-driven training — and
              a clear path forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {advantages.map((adv, index) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-stone-100 bg-white p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F9FA] text-[#1A237E]">
                  <adv.icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="mb-3 font-sans text-xl font-bold text-[#1A237E]">
                  {adv.title}
                </h4>
                <p className="leading-relaxed font-light text-[#212121]/75">
                  {adv.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
