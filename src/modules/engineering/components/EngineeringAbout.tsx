"use client";

import { Award, BookOpen } from "lucide-react";
import { siteConfig } from "@/data/site";

export function EngineeringAbout() {
  return (
    <section id="about" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-engineering mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              About Us
            </h2>
            <h3 className="text-navy mb-6 font-serif text-4xl md:text-5xl font-bold leading-tight">
              Excellence in{" "}
              <span className="font-normal text-stone-300 italic">
                Engineering Education.
              </span>
            </h3>
            <div className="space-y-4 text-base md:text-lg leading-relaxed text-stone-600">
              <p>
                JCT College of Engineering &amp; Technology is an{" "}
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 align-baseline font-semibold text-amber-700">
                  <Award size={14} className="inline-block" />
                  Autonomous
                </span>{" "}
                institution affiliated to Anna University, Chennai.
                Established with a vision to provide world-class technical
                education, the college offers{" "}
                <strong className="text-stone-800">
                  11 undergraduate
                </strong>{" "}
                and <strong className="text-stone-800">4 postgraduate</strong>{" "}
                programs, producing industry-ready graduates year after year.
              </p>
              <p>
                Approved by AICTE and recognized for academic excellence, our
                institution combines rigorous coursework with hands-on
                laboratory training, industry partnerships, and a robust
                placement ecosystem. With ISO 9001:2015 certification and a
                commitment to continuous improvement, JCT Engineering stands
                as a trusted name in technical education in Tamil Nadu.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5">
                <BookOpen size={16} className="text-engineering" />
                <span className="text-sm font-bold text-stone-700">
                  Counselling Code:{" "}
                  <span className="text-engineering text-base font-extrabold">
                    {siteConfig.counsellingCode}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                val: "AICTE",
                label: "Approved",
                desc: "All India Council for Technical Education",
              },
              {
                val: "Anna",
                label: "University",
                desc: "Affiliated to Anna University, Chennai",
              },
              {
                val: "ISO",
                label: "9001:2015",
                desc: "Certified quality management system",
              },
              {
                val: "NBA",
                label: "Accredited",
                desc: "National Board of Accreditation",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="hover:border-engineering/20 rounded-2xl border border-stone-100 bg-stone-50 p-6 transition-colors"
              >
                <span className="text-engineering mb-1 block font-sans text-2xl md:text-3xl font-bold">
                  {item.val}
                </span>
                <span className="text-navy block text-sm font-bold">
                  {item.label}
                </span>
                <span className="mt-1 block text-[11px] text-stone-400">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}