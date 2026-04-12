"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { facilities } from "@/data/engineering";

export function EngineeringResearch() {
  return (
    <section id="research" className="bg-stone-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          {/* Left: text content */}
          <div>
            <h2 className="text-engineering mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Research & Innovation
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl md:text-5xl font-bold leading-tight">
              Where Theory <br />
              <span className="font-normal text-stone-300 italic">
                Meets Application
              </span>
            </h3>
            <p className="mb-8 text-base md:text-lg leading-relaxed text-stone-600">
              Our faculty actively publish in peer-reviewed journals and guide
              student projects that go beyond coursework. The Research &
              Innovation Cell connects departments and facilitates
              collaboration with industry partners.
            </p>

            <div className="mb-10 space-y-6">
              {[
                "25+ patents filed by faculty and students across departments",
                "Annual technical symposium 'TechVista' with 2000+ participants",
                "MoUs with 15+ companies for joint research and internships",
                "Funded projects from DST, AICTE, and Tamil Nadu State Council for Science and Technology",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="text-accent mt-1 shrink-0"
                  />
                  <p className="text-base md:text-lg leading-relaxed text-stone-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <p className="mb-2 text-base font-bold text-white/80">
                Student Innovation Challenge
              </p>
              <p className="font-serif text-lg font-bold text-white">
                140+ student projects showcased in the last 3 editions of the
                annual innovation expo.
              </p>
            </div>
          </div>

          {/* Right: facility cards */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {facilities.map((fac, index) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="hover:border-accent/20 group rounded-2xl border border-stone-100 bg-white p-6 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-primary group-hover:bg-accent/10 group-hover:text-accent w-fit shrink-0 rounded-xl bg-stone-50 p-3 transition-colors">
                    <fac.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-navy mb-2 font-serif text-xl font-bold">
                      {fac.title}
                    </h3>
                    <p className="text-base leading-relaxed text-stone-600">
                      {fac.desc}
                    </p>
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