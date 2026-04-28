"use client";

import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { Check, Upload } from "lucide-react";

export default function ApplyNowPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institution: "",
    program: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    document: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      alert(
        "Application submitted successfully! We will contact you soon regarding the next steps.",
      );
      setStep(1);
      setFormData({
        institution: "",
        program: "",
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        document: null,
      });
    }
  };

  const programsByInstitution: Record<string, string[]> = {
    engineering: [
      "B.E. Computer Science",
      "B.E. Mechanical",
      "B.Tech AI & Data Science",
      "B.E. Electronics",
    ],
    arts: ["B.Sc. Computer Science", "B.Com", "B.B.A", "B.A. English"],
    polytechnic: [
      "Diploma in Mechanical",
      "Diploma in Civil",
      "Diploma in Automobile",
    ],
  };

  const currentPrograms = formData.institution
    ? programsByInstitution[formData.institution]
    : [];

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Apply Now"
        subtitle="Start Your Academic Journey with JCT"
      />

      <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Apply Now" }]} />

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          {/* Progress Bar */}
          <div className="relative mb-12 flex items-center justify-between">
            <div className="absolute top-1/2 right-0 left-0 z-0 h-1 -translate-y-1/2 bg-white/10"></div>
            <div
              className="bg-gold absolute top-1/2 left-0 z-0 h-1 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {["Institution", "Program", "Details", "Upload"].map((label, i) => (
              <div
                key={label}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${step > i + 1 ? "bg-gold text-navy" : step === i + 1 ? "bg-gold text-navy ring-gold/30 ring-4" : "bg-surface text-muted-foreground border-2 border-white/20"}`}
                >
                  {step > i + 1 ? <Check size={20} /> : i + 1}
                </div>
                <div
                  className={`mt-2 hidden text-xs font-medium sm:block ${step >= i + 1 ? "text-gold" : "text-muted-foreground"}`}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Choose Institution */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <h2 className="mb-8 text-center font-serif text-2xl font-bold">
                  Choose Institution
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    {
                      id: "engineering",
                      title: "Engineering College",
                      icon: "⚙️",
                    },
                    { id: "arts", title: "Arts & Science", icon: "🎨" },
                    { id: "polytechnic", title: "Polytechnic", icon: "📐" },
                  ].map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          institution: inst.id,
                          program: "",
                        })
                      }
                      className={`cursor-pointer rounded-2xl border p-6 text-center transition-all ${formData.institution === inst.id ? "border-gold bg-gold/10" : "bg-surface hover:border-gold/50 border-white/10"}`}
                    >
                      <div className="mb-4 text-4xl">{inst.icon}</div>
                      <h3 className="font-bold">{inst.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Program */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <h2 className="mb-8 text-center font-serif text-2xl font-bold">
                  Choose Program
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {currentPrograms.map((prog) => (
                    <div
                      key={prog}
                      onClick={() =>
                        setFormData({ ...formData, program: prog })
                      }
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${formData.program === prog ? "border-gold bg-gold/10 text-gold" : "bg-surface hover:border-gold/50 border-white/10"}`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${formData.program === prog ? "border-gold bg-gold" : "border-muted-foreground"}`}
                      >
                        {formData.program === prog && (
                          <Check size={12} className="text-navy" />
                        )}
                      </div>
                      <span className="font-medium">{prog}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Applicant Form */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
                <h2 className="mb-8 text-center font-serif text-2xl font-bold">
                  Applicant Details
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Full Name (As per records)
                    </label>
                    <input
                      required
                      type="text"
                      className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <input
                      required
                      type="tel"
                      className="bg-surface focus:border-gold w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <input
                      required
                      type="date"
                      className="bg-surface focus:border-gold text-foreground w-full rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <div className="flex gap-6">
                    {["Male", "Female", "Other"].map((g) => (
                      <label
                        key={g}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="accent-gold"
                          required
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Permanent Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="bg-surface focus:border-gold w-full resize-none rounded-lg border border-white/10 px-4 py-3 focus:outline-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 4: Upload Documents & Submit */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
                <h2 className="mb-8 text-center font-serif text-2xl font-bold">
                  Upload Documents
                </h2>

                <div className="bg-surface mb-8 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-gold mb-4 font-bold">
                    Application Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Institution:</div>
                    <div className="font-medium capitalize">
                      {formData.institution}
                    </div>
                    <div className="text-muted-foreground">Program:</div>
                    <div className="font-medium">{formData.program}</div>
                    <div className="text-muted-foreground">Name:</div>
                    <div className="font-medium">{formData.name}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-sm font-medium">
                    Upload Latest Mark Sheet or ID Proof (PDF/JPG)
                  </label>
                  <div className="hover:border-gold/50 bg-surface rounded-2xl border-2 border-dashed border-white/20 p-10 text-center transition-colors">
                    <input
                      required
                      type="file"
                      id="document"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          document: e.target.files?.[0] || null,
                        })
                      }
                    />
                    <label
                      htmlFor="document"
                      className="flex cursor-pointer flex-col items-center"
                    >
                      <div className="text-gold mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                        <Upload size={28} />
                      </div>
                      <span className="text-lg font-bold">
                        Click to browse or drag and drop
                      </span>
                      <span className="text-muted-foreground mt-2 text-sm">
                        Maximum file size: 5MB
                      </span>
                      {formData.document && (
                        <span className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400">
                          <Check size={16} /> {formData.document.name}
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex gap-4 border-t border-white/10 pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border border-white/20 px-8 py-3 font-medium transition-colors hover:bg-white/5"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={
                  (step === 1 && !formData.institution) ||
                  (step === 2 && !formData.program)
                }
                className="bg-gold text-navy flex-1 rounded-xl py-3 text-lg font-bold transition-colors hover:bg-[#e8b84a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === 4 ? "Submit Application" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
