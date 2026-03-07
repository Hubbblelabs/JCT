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
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-sans font-bold tracking-[0.2em] uppercase text-gold mb-4"
          >
            Why Choose JCT
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-navy leading-tight mb-5"
          >
            Built for{" "}
            <span className="italic text-muted-foreground font-light">
              Your Success
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed"
          >
            JCT Institutions combines academic rigor with practical exposure,
            creating an ecosystem where students thrive and succeed.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-10 md:mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group p-4 md:p-8 bg-white rounded-2xl border border-border hover:border-gold/30 card-hover-lift ${!showAllFeatures && i >= 4 ? "hidden sm:block" : ""}`}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 md:mb-5 group-hover:scale-110 transition-transform`}
              >
                <feature.icon
                  size={20}
                  className="text-navy"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-sm md:text-lg font-sans font-semibold text-navy mb-1 md:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Show More */}
        {!showAllFeatures && features.length > 4 && (
          <div className="sm:hidden text-center mb-8">
            <button
              onClick={() => setShowAllFeatures(true)}
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-navy hover:text-gold transition-colors"
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
          className="bg-navy rounded-3xl p-8 md:p-12 noise-overlay relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {counters.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-black text-white tracking-tight mb-2">
                  <AnimatedNumber
                    value={item.value}
                    suffix={item.suffix}
                    inView={inView}
                  />
                </div>
                <div className="text-xs md:text-sm text-white/50 font-sans font-medium">
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
