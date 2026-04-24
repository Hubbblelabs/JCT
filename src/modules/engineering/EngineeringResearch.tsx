"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { facilities } from "@/data/engineering";

export function EngineeringResearch() {
  return (
    <section id="research" className="bg-stone-50 py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Left: text content */}
          <div>
            <h2 className="text-engineering mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Research & Innovation
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl leading-tight font-bold md:text-5xl">
              Where Theory <br />
              <span className="font-normal text-stone-300 italic">
                Meets Application
              </span>
            </h3>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              Faculty-led research, student projects, and industry collaboration
              come together through the Research & Innovation Cell.
            </p>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                "25+ patents filed across departments",
                "TechVista: 2000+ participants annually",
                "15+ industry MoUs for research and internships",
                "Funded by DST, AICTE, and state agencies",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-accent mt-1 shrink-0"
                  />
                  <p className="text-sm leading-relaxed text-stone-600 md:text-[15px]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-primary rounded-2xl p-5">
              <p className="mb-1 text-sm font-bold text-white/80">
                Student Innovation Challenge
              </p>
              <p className="font-serif text-base font-bold text-white md:text-lg">
                140+ student projects showcased across the last 3 innovation
                expos.
              </p>
            </div>
          </div>

          {/* Right: facility cards */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {facilities.map((fac, index) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="hover:border-accent/20 group rounded-2xl border border-stone-100 bg-white p-5 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-primary group-hover:bg-accent/10 group-hover:text-accent w-fit shrink-0 rounded-xl bg-stone-50 p-3 transition-colors">
                    <fac.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-navy mb-0 font-serif text-xl font-bold leading-snug">
                      {fac.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
