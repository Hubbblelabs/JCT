"use client";

import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Clock,
  Calendar,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Users,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    resume: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted successfully! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      resume: null,
    });
  };

  const facultyJobs = [
    {
      title: "Assistant Professor",
      dept: "Computer Science Engineering",
      exp: "2-5 Years",
    },
    {
      title: "Associate Professor",
      dept: "Artificial Intelligence",
      exp: "5-10 Years",
    },
    {
      title: "Lecturer",
      dept: "English Department",
      exp: "0-2 Years",
    },
  ];

  const staffJobs = [
    {
      title: "System Administrator",
      dept: "IT Infrastructure",
      exp: "3+ Years",
    },
    {
      title: "Lab Assistant",
      dept: "Mechanical Engineering",
      exp: "1-3 Years",
    },
    {
      title: "Admissions Counselor",
      dept: "Admissions Office",
      exp: "2+ Years",
    },
  ];

  return (
    <main className="bg-background text-foreground selection:bg-gold selection:text-navy min-h-screen">
      <Navbar />
      <PageHero
        title="Careers at JCT"
        subtitle="Join Our Mission to Shape the Future Leaders"
      />

      <div className="container mx-auto px-4 py-8 md:px-6">
        <Breadcrumb items={[{ label: "Careers" }]} />

        {/* 1. Why Join JCT? */}
        <section className="section-padding grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fadeIn}>
            <div className="bg-gold/10 text-gold inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase">
              Work with us
            </div>
            <h2 className="text-navy mt-4 font-serif text-4xl font-bold md:text-5xl">
              Why Join <span className="text-gold">JCT?</span>
            </h2>
            <div className="text-muted-foreground mt-6 space-y-4 text-lg leading-relaxed">
              <p>
                At JCT Institutions, we believe that our faculty and staff are
                our greatest assets. We are always looking for passionate,
                dedicated, and innovative individuals to join our team.
              </p>
              <p>
                We offer a dynamic work environment, opportunities for
                professional growth, competitive compensation, and the chance to
                make a real difference in the lives of students.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                {
                  label: "Global Impact",
                  icon: <Star className="text-gold" size={20} />,
                },
                {
                  label: "Research Focus",
                  icon: <Zap className="text-gold" size={20} />,
                },
                {
                  label: "Growth Path",
                  icon: <ShieldCheck className="text-gold" size={20} />,
                },
                {
                  label: "Diverse Culture",
                  icon: <Users className="text-gold" size={20} />,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-gold/10 rounded-full p-2">{item.icon}</div>
                  <span className="text-navy font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-navy relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl md:p-12"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold md:text-3xl">
                Professional Development
              </h3>
              <p className="mt-4 leading-relaxed text-white/70">
                We invest in our people through continuous learning programs,
                workshops, and support for advanced research and higher studies.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Research Grants",
                  "Sabbatical Policy",
                  "Health Insurance",
                  "Campus Housing",
                ].map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <CheckCircle2 className="text-gold" size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gold/10 absolute -right-20 -bottom-20 h-64 w-64 rounded-full blur-3xl" />
          </motion.div>
        </section>

        {/* 2. Open Positions */}
        <section className="section-padding">
          <div className="mb-12 text-center">
            <h2 className="text-navy font-serif text-3xl font-bold md:text-5xl">
              Explore Opportunities
            </h2>
            <p className="text-muted-foreground mt-4">
              Find your next role in academia or administration.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Faculty Positions */}
            <motion.div {...fadeIn}>
              <div className="mb-8 flex items-center gap-4">
                <div className="bg-navy flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg">
                  <GraduationCap className="text-gold" size={28} />
                </div>
                <h2 className="text-navy font-serif text-3xl font-bold">
                  Faculty Roles
                </h2>
              </div>
              <div className="space-y-4">
                {facultyJobs.map((job, i) => (
                  <div
                    key={i}
                    className="bg-surface group hover:border-gold/50 border-border rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-navy group-hover:text-gold text-xl font-bold transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 font-medium">
                          {job.dept}
                        </p>
                      </div>
                      <span className="bg-gold/10 text-gold rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                        Academic
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-6 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gold" />
                        <span>Full Time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gold" />
                        <span>Exp: {job.exp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Staff Positions */}
            <motion.div {...fadeIn}>
              <div className="mb-8 flex items-center gap-4">
                <div className="bg-navy flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg">
                  <Briefcase className="text-gold" size={28} />
                </div>
                <h2 className="text-navy font-serif text-3xl font-bold">
                  Staff & Admin
                </h2>
              </div>
              <div className="space-y-4">
                {staffJobs.map((job, i) => (
                  <div
                    key={i}
                    className="bg-surface group hover:border-gold/50 border-border rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-navy group-hover:text-gold text-xl font-bold transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 font-medium">
                          {job.dept}
                        </p>
                      </div>
                      <span className="bg-navy/10 text-navy rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                        Corporate
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-6 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gold" />
                        <span>Full Time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gold" />
                        <span>Exp: {job.exp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Apply Form */}
        <section id="apply-form" className="section-padding">
          <motion.div
            {...fadeIn}
            className="border-border mx-auto max-w-4xl overflow-hidden rounded-[3rem] border bg-white shadow-2xl"
          >
            <div className="bg-navy p-8 text-center text-white md:p-12">
              <h2 className="font-serif text-4xl font-bold md:text-5xl">
                Join Our Team
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Submit your credentials and take the first step towards a
                rewarding career.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-navy text-sm font-bold tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    className="bg-surface focus:border-gold border-border focus:ring-gold/20 w-full rounded-2xl border px-5 py-4 transition-all focus:ring-2 focus:outline-none"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-sm font-bold tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="bg-surface focus:border-gold border-border focus:ring-gold/20 w-full rounded-2xl border px-5 py-4 transition-all focus:ring-2 focus:outline-none"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-sm font-bold tracking-wider uppercase">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    className="bg-surface focus:border-gold border-border focus:ring-gold/20 w-full rounded-2xl border px-5 py-4 transition-all focus:ring-2 focus:outline-none"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-navy text-sm font-bold tracking-wider uppercase">
                    Position Type
                  </label>
                  <select
                    required
                    className="bg-surface focus:border-gold text-foreground border-border focus:ring-gold/20 w-full rounded-2xl border px-5 py-4 transition-all focus:ring-2 focus:outline-none"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Role Type
                    </option>
                    <option value="faculty">Academic / Faculty</option>
                    <option value="staff">Administrative / Staff</option>
                    <option value="other">Other Positions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-navy text-sm font-bold tracking-wider uppercase">
                  Department / Specialization
                </label>
                <input
                  required
                  type="text"
                  className="bg-surface focus:border-gold border-border focus:ring-gold/20 w-full rounded-2xl border px-5 py-4 transition-all focus:ring-2 focus:outline-none"
                  placeholder="e.g. Mechanical Engineering, IT Support..."
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-navy text-sm font-bold tracking-wider uppercase">
                  Upload Resume
                </label>
                <div className="group relative">
                  <input
                    required
                    type="file"
                    id="resume"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resume: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <label
                    htmlFor="resume"
                    className="hover:border-gold/50 bg-surface border-border group-hover:bg-gold/5 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-12 transition-all"
                  >
                    <div className="bg-gold/10 text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                      <Upload size={32} />
                    </div>
                    <span className="text-navy text-lg font-bold">
                      {formData.resume
                        ? formData.resume.name
                        : "Choose File or Drag & Drop"}
                    </span>
                    <span className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
                      PDF or DOCX • Max 5MB
                    </span>
                    {formData.resume && (
                      <div className="mt-6 flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold text-green-600">
                        <FileText size={16} /> File attached successfully
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-navy shadow-gold/20 flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xl font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit Application <ArrowRight size={24} />
              </button>
            </form>
          </motion.div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
