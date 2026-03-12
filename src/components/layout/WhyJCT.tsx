"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  Users,
  Briefcase,
  Award,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Industry-Ready Curriculum",
    desc: "Programs designed with industry input, updated annually to match evolving career demands and technology trends.",
    gradient: "from-blue-50 to-indigo-50",
  },
  {
    icon: FlaskConical,
    title: "Modern Labs & Infrastructure",
    desc: "State-of-the-art laboratories, smart classrooms, and a sprawling campus equipped for immersive learning.",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    desc: "150+ experienced educators with industry and research backgrounds, mentoring students to excel.",
    gradient: "from-violet-50 to-purple-50",
  },
  {
    icon: Briefcase,
    title: "Strong Placement Record",
    desc: "96% placement support with 500+ recruiting partners, including TCS, Infosys, Wipro, and more.",
    gradient: "from-amber-50 to-yellow-50",
  },
  {
    icon: Award,
    title: "Accredited Excellence",
    desc: "NAAC, NBA, and AICTE recognized. Affiliated with Anna University and Bharathiar University.",
    gradient: "from-rose-50 to-pink-50",
  },
  {
    icon: Heart,
    title: "Holistic Development",
    desc: "Clubs, sports, cultural events, and community service — shaping well-rounded individuals, not just graduates.",
    gradient: "from-sky-50 to-cyan-50",
  },
];

const counters = [
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 10000, suffix: "+", label: "Alumni Worldwide" },
  { value: 500, suffix: "+", label: "Students Placed" },
  { value: 100, suffix: "+", label: "Industry Awards" },
];

function AnimatedNumber({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const inc = value / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span>
      {count >= 10000 ? `${Math.floor(count / 1000)}K` : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function WhyJCT() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-surface">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold mb-4 inline-block font-sans text-xs font-bold tracking-[0.2em] uppercase"
          >
            Why Choose JCT
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy mb-5 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl"
          >
            Built for{" "}
            <span className="text-muted-foreground font-light italic">
              Your Success
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base leading-relaxed md:text-lg"
          >
            JCT Institutions combines academic rigor with practical exposure,
            creating an ecosystem where students thrive and succeed.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:mb-20 md:gap-6 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group border-border hover:border-gold/30 card-hover-lift rounded-2xl border bg-white p-4 md:p-8 ${!showAllFeatures && i >= 4 ? "hidden sm:block" : ""}`}
            >
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br md:h-12 md:w-12 ${feature.gradient} mb-3 flex items-center justify-center transition-transform group-hover:scale-110 md:mb-5`}
              >
                <feature.icon
                  size={20}
                  className="text-navy"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-navy mb-1 font-sans text-sm font-semibold md:mb-2 md:text-lg">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-sans text-xs leading-relaxed md:text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Show More */}
        {!showAllFeatures && features.length > 4 && (
          <div className="mb-8 text-center sm:hidden">
            <button
              onClick={() => setShowAllFeatures(true)}
              className="text-navy hover:text-gold inline-flex items-center gap-2 font-sans text-sm font-semibold transition-colors"
            >
              Show All Features →
            </button>
          </div>
        )}

        {/* Counter Strip */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-navy noise-overlay relative overflow-hidden rounded-3xl p-8 md:p-12"
        >
          <div className="bg-gold/5 pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full blur-[150px]" />
          <div className="relative z-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {counters.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 font-sans text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                  <AnimatedNumber
                    value={item.value}
                    suffix={item.suffix}
                    inView={inView}
                  />
                </div>
                <div className="font-sans text-xs font-medium text-white/50 md:text-sm">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
