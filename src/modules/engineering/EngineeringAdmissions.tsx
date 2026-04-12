"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export function EngineeringAdmissions() {
  return (
    <section id="admission" className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: CTA */}
          <div>
            <h2 className="text-engineering-light mb-4 text-sm font-bold tracking-[0.2em] uppercase">
              Admissions 2025-26
            </h2>
            <h3 className="text-white mb-6 font-serif text-4xl md:text-5xl font-bold leading-tight">
              Your Engineering <br />
              Journey Starts <span className="text-accent">Here.</span>
            </h3>
            <p className="mb-10 text-base md:text-lg leading-relaxed text-white/80">
              Admissions for B.E. programs are through TNEA counseling (Tamil
              Nadu Engineering Admissions). Management quota seats are
              available for eligible candidates.
            </p>

            <div className="mb-10 space-y-4">
              {[
                {
                  step: "01",
                  text: "Appear for TNEA Counseling with 12th marks",
                },
                {
                  step: "02",
                  text: "Select JCT College of Engineering and Technology",
                },
                {
                  step: "03",
                  text: "Complete document verification on campus",
                },
                { step: "04", text: "Confirm enrollment with fee payment" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <span className="text-engineering-light font-sans text-xl font-bold">
                    {s.step}
                  </span>
                  <p className="pt-1 text-base leading-relaxed text-white/80">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-accent text-primary hover:bg-accent/90 shadow-accent/20 h-14 rounded-2xl px-8 font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Apply Through TNEA <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-2xl border-white/20 bg-transparent px-8 font-bold text-white hover:bg-white/10 hover:text-white"
              >
                Management Quota
              </Button>
            </div>
          </div>

          <span id="contact" className="sr-only" />

          {/* Right: Contact card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10">
            <h3 className="mb-2 font-serif text-2xl text-white">
              Admissions Office
            </h3>
            <p className="mb-8 text-sm text-white/40">
              Reach out for queries about eligibility, scholarships, or campus
              visits.
            </p>

            <div className="mb-10 space-y-5">
              <a
                href="tel:+919361488801"
                className="flex items-center gap-4 text-white/70 transition-colors hover:text-white"
              >
                <div className="rounded-xl bg-white/5 p-3">
                  <Phone size={18} className="text-accent" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">
                    +91 93614 88801
                  </span>
                  <span className="text-xs text-white/40">
                    Mon — Sat, 9 AM — 5 PM
                  </span>
                </div>
              </a>
              <a
                href="mailto:engineering@jct.ac.in"
                className="flex items-center gap-4 text-white/70 transition-colors hover:text-white"
              >
                <div className="rounded-xl bg-white/5 p-3">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">
                    engineering@jct.ac.in
                  </span>
                  <span className="text-xs text-white/40">
                    Typical response within 24 hours
                  </span>
                </div>
              </a>
              <div className="flex items-start gap-4 text-white/70">
                <div className="rounded-xl bg-white/5 p-3">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">
                    Knowledge Park, Pichanur
                  </span>
                  <span className="text-xs text-white/40">
                    Coimbatore — 641105, Tamil Nadu
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck size={18} className="text-accent" />
                <span className="text-sm font-bold text-white">
                  Approved & Recognized
                </span>
              </div>
              <p className="text-xs leading-relaxed font-normal text-white/40">
                AICTE Approved • Anna University Affiliated • ISO 9001:2015
                Certified • NBA Accreditation Applied
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}