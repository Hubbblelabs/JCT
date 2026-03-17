"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { admissionsCriteria } from "@/data/polytechnic";
import {
  PolyButtonLink,
  PolySection,
  PolySectionHeader,
} from "@/modules/polytechnic/PolyUI";

export function Admissions() {
  return (
    <PolySection id="admissions" tone="subtle" className="border-t border-slate-100">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <PolySectionHeader
            eyebrow="Admissions"
            title="Admission Process"
            description="Simple and transparent admissions aligned with current DOTE and Tamil Nadu polytechnic guidelines."
            className="mb-0"
          />
          <PolyButtonLink href="/admissions/apply" className="shrink-0">
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </PolyButtonLink>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {admissionsCriteria.map((block, index) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-xl border border-slate-200 bg-[#fbfdfc] p-5"
            >
              <h3 className="text-polytechnic-dark mb-3 text-base font-semibold">
                {block.title}
              </h3>
              <ul className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-polytechnic mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm md:grid-cols-3 md:gap-4">
          <a
            href="tel:+919361422201"
            className="text-polytechnic-dark hover:text-polytechnic flex items-center gap-2"
          >
            <Phone size={15} className="text-polytechnic" /> +91 93614 22201
          </a>
          <a
            href="mailto:info@jct.ac.in"
            className="text-polytechnic-dark hover:text-polytechnic flex items-center gap-2"
          >
            <Mail size={15} className="text-polytechnic" /> info@jct.ac.in
          </a>
          <div className="text-polytechnic-dark flex items-start gap-2">
            <MapPin size={15} className="text-polytechnic mt-0.5 shrink-0" />
            <span>Knowledge Park, Pichanur, Coimbatore - 641105</span>
          </div>
        </div>
      </div>
    </PolySection>
  );
}
