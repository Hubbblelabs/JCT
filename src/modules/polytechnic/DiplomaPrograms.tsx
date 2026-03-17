"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { diplomaPrograms } from "@/data/polytechnic";
import {
  PolyButtonLink,
  PolySection,
  PolySectionHeader,
} from "@/modules/polytechnic/PolyUI";

export function DiplomaPrograms() {
  return (
    <PolySection id="programs" tone="surface" className="border-t border-slate-100">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <PolySectionHeader
          eyebrow="Programs"
          title="Diploma Programs"
          description="Six industry-relevant diploma streams with practical training and structured academic support."
          className="mb-0"
        />
        <PolyButtonLink href="/institutions/polytechnic/departments" variant="outline">
          View All Programs
          <ArrowRight className="ml-2 h-4 w-4" />
        </PolyButtonLink>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {diplomaPrograms.map((prog, index) => (
          <motion.article
            key={prog.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="border-polytechnic/12 group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-[0_8px_24px_rgba(2,42,50,0.06)]"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              {prog.image ? (
                <Image
                  src={prog.image}
                  alt={prog.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />
              ) : (
                <div className="bg-polytechnic-muted absolute inset-0 flex items-center justify-center">
                  <prog.icon className="text-polytechnic/45 h-16 w-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-slate-700">
                AICTE Approved
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                <Clock className="text-polytechnic h-3.5 w-3.5" />
                {prog.duration}
              </div>

              <h3 className="text-polytechnic-dark mb-2 line-clamp-2 text-xl leading-snug font-semibold">
                {prog.name}
              </h3>

              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {prog.desc}
              </p>

              <div className="mt-auto">
                <Link
                  href={`/institutions/polytechnic/departments/${prog.slug}`}
                  className="text-polytechnic inline-flex items-center text-sm font-semibold hover:underline"
                >
                  Program Details
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </PolySection>
  );
}
