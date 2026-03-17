"use client";

import { motion } from "framer-motion";
import { Hammer, Factory, Target, GraduationCap } from "lucide-react";
import { PolySection, PolySectionHeader } from "@/modules/polytechnic/PolyUI";

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
    <PolySection tone="subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PolySectionHeader
          centered
          eyebrow="Why JCT Polytechnic"
          title="Focused Learning with Practical Outcomes"
          description="A disciplined three-year diploma pathway that balances affordability, workshop competency, and clear progression opportunities."
          className="mx-auto max-w-4xl"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {advantages.map((adv, index) => (
          <motion.article
            key={adv.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(2,42,50,0.05)]"
          >
            <div className="bg-polytechnic-muted text-polytechnic mb-4 flex h-11 w-11 items-center justify-center rounded-lg">
              <adv.icon size={20} strokeWidth={1.7} />
            </div>
            <h3 className="text-polytechnic-dark mb-2 text-lg font-semibold">
              {adv.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">{adv.desc}</p>
          </motion.article>
        ))}
      </div>
    </PolySection>
  );
}
