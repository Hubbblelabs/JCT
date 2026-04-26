"use client";

import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";

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
    // Simulate form submission
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

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Careers at JCT"
        subtitle="Join Our Mission to Shape the Future"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Careers" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Open Positions Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Why Join JCT?
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                At JCT Institutions, we believe that our faculty and staff are
                our greatest assets. We are always looking for passionate,
                dedicated, and innovative individuals to join our team.
              </p>
              <p className="mt-2">
                We offer a dynamic work environment, opportunities for
                professional growth, competitive compensation, and the chance to
                make a real difference in the lives of students.
              </p>
            </div>
          </section>

          {/* 2. Faculty Jobs & 3. Staff Jobs */}
          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  👨‍🏫
                </span>
                Faculty Positions
              </h2>
              <div className="space-y-4">
                {[
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
                ].map((job, i) => (
                  <div
                    key={i}
                    className="hover:border-gold/30 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors"
                  >
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="text-gold mt-1 text-sm">{job.dept}</div>
                    <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                      <span>🕒 Full Time</span>
                      <span>📅 Exp: {job.exp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  👨‍💼
                </span>
                Staff & Admin Positions
              </h2>
              <div className="space-y-4">
                {[
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
                ].map((job, i) => (
                  <div
                    key={i}
                    className="hover:border-gold/30 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors"
                  >
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="text-gold mt-1 text-sm">{job.dept}</div>
                    <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
                      <span>🕒 Full Time</span>
                      <span>📅 Exp: {job.exp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Apply Form */}
          <section
            id="apply-form"
            className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8"
          >
            <div className="mb-8 text-center">
              <h2 className="text-foreground font-serif text-3xl font-bold">
                Apply Now
              </h2>
              <p className="text-muted-foreground mt-2">
                Submit your application and resume to be considered for current
                or future openings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    required
                    type="text"
                    className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    required
                    type="email"
                    className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Applying For</label>
                  <select
                    required
                    className="bg-surface focus:border-gold text-foreground w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Position Type
                    </option>
                    <option value="faculty">Faculty / Teaching</option>
                    <option value="staff">Staff / Administration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Department / Specialization
                </label>
                <input
                  required
                  type="text"
                  className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                  placeholder="e.g. Computer Science, Admissions..."
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Upload Resume (PDF/DOCX)
                </label>
                <div className="hover:border-gold/50 rounded-xl border-2 border-dashed border-white/20 p-8 text-center transition-colors">
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
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <span className="mb-2 text-3xl">📄</span>
                    <span className="text-gold font-medium">
                      Click to upload
                    </span>
                    <span className="text-muted-foreground mt-1 text-xs">
                      Maximum file size: 5MB
                    </span>
                    {formData.resume && (
                      <span className="mt-4 text-sm text-green-400">
                        Selected: {formData.resume.name}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-gold text-navy w-full rounded-xl py-4 text-lg font-bold transition-colors hover:bg-[#e8b84a]"
              >
                Submit Application
              </button>
            </form>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
