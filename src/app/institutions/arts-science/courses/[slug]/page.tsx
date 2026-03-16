import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ugPrograms } from "@/data/arts-science";
import {
  CheckCircle2,
  ArrowLeft,
  Clock,
  GraduationCap,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import { Variants } from "framer-motion";

export const dynamicParams = false;

export function generateStaticParams() {
  return ugPrograms.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = ugPrograms.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.name} | JCT College of Arts & Science`,
    description: course.desc,
    openGraph: {
      title: `${course.name} | JCT College of Arts & Science`,
      description: course.desc,
      type: "website",
    },
  };
}

// Fade in up animation variant
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = ugPrograms.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="arts-science-theme min-h-screen overflow-x-hidden bg-stone-50 font-sans text-[#2C2C2C]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[#800020] pt-32 pb-20">
        {/* Subtle patterned background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Large subtle glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-200 w-200 translate-x-1/3 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp}>
              <Link
                href="/institutions/arts-science"
                className="group mb-8 inline-flex items-center text-sm font-medium text-[#D4AF37] transition-colors hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Arts & Science
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <span className="mb-6 inline-block rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-bold tracking-widest text-[#800020] uppercase shadow-sm">
                UG Program &bull; {course.duration}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 font-serif text-4xl leading-[1.1] text-white md:text-5xl lg:text-7xl"
            >
              {course.name}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-3xl text-lg leading-relaxed font-light text-white/90 md:text-xl lg:text-2xl"
            >
              {course.desc}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative flex flex-col gap-16 lg:flex-row">
            {/* Left Content Column */}
            <div className="w-full lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-[#D4AF37]"></div>
                  <h2 className="font-serif text-3xl text-[#800020] md:text-4xl">
                    Program Overview
                  </h2>
                </div>

                <div className="prose prose-stone prose-lg mb-16 max-w-none space-y-6 text-[#2C2C2C]">
                  {course.longDesc.map((paragraph, i) => (
                    <p
                      key={i}
                      className={i === 0 ? "text-xl leading-relaxed font-medium text-[#2C2C2C]" : "leading-relaxed"}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-16 rounded-2xl border border-stone-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
                  <h3 className="mb-8 font-serif text-2xl font-bold text-[#800020]">
                    Key Learning Outcomes
                  </h3>
                  <ul className="space-y-6">
                    {course.outcomes.map((item, i) => (
                      <motion.li
                        key={item.slice(0, 40)}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="group flex gap-4"
                      >
                        <div className="mt-1 rounded-full bg-[#D4AF37]/20 p-1 transition-colors group-hover:bg-[#D4AF37]/30">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#800020]" />
                        </div>
                        <span className="text-lg leading-relaxed text-[#2C2C2C]">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Right Sticky Sidebar Column */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
                >
                  {/* Card Header */}
                  <div className="bg-[#800020] p-6 text-center">
                    <h3 className="font-serif text-2xl text-white">
                      At a Glance
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-8">
                    <div className="mb-10 space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-stone-50 p-3">
                          <Clock className="h-6 w-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="mb-1 block text-sm font-bold tracking-wider text-stone-500 uppercase">
                            Duration
                          </span>
                          <span className="text-lg font-semibold text-[#2C2C2C]">
                            {course.duration} (Full-Time)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-stone-50 p-3">
                          <GraduationCap className="h-6 w-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="mb-1 block text-sm font-bold tracking-wider text-stone-500 uppercase">
                            Affiliation
                          </span>
                          <span className="text-lg font-semibold text-[#2C2C2C]">
                            Bharathiar University
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-stone-50 p-3">
                          <FileCheck className="h-6 w-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="mb-1 block text-sm font-bold tracking-wider text-stone-500 uppercase">
                            Eligibility
                          </span>
                          <span className="text-lg font-semibold text-[#2C2C2C]">
                            12th (HSC) pass in relevant stream
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Link
                        href="/institutions/arts-science#admissions"
                        className={cn(
                          buttonVariants(),
                          "h-14 w-full rounded-full border border-[#f1d892]/70 bg-linear-to-r from-[#f0ce74] to-[#D4AF37] text-lg font-bold text-[#70001b] shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5 hover:brightness-95"
                        )}
                      >
                        Apply Now
                      </Link>
                      <Link
                        href={`/syllabus/${course.slug}.pdf`}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-14 w-full rounded-full border-2 border-[#800020]/35 bg-white/80 text-lg font-bold text-[#800020] transition-all hover:-translate-y-0.5 hover:bg-white"
                        )}
                      >
                        Download Syllabus
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#D4AF37] py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 font-serif text-3xl text-[#800020] md:text-5xl">
              Ready to Shape Your Future?
            </h2>
            <p className="mb-10 text-xl font-bold text-[#800020]/90">
              Join the {course.name} program and take the first step towards a
              rewarding career.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/institutions/arts-science#admissions"
                className={cn(
                  buttonVariants(),
                  "h-14 rounded-full border border-[#800020] bg-[#800020] px-8 text-lg font-bold text-white shadow-[0_10px_24px_rgba(128,0,32,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#5e0017]"
                )}
              >
                Start Your Application
              </Link>
              <Link
                href="/institutions/arts-science#contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-14 rounded-full border-2 border-[#800020]/45 bg-white/40 px-8 text-lg font-bold text-[#800020] transition-all hover:-translate-y-0.5 hover:bg-white/70"
                )}
              >
                Contact Admissions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
