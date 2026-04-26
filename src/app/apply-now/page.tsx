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
    document: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      alert("Application submitted successfully! We will contact you soon regarding the next steps.");
      setStep(1);
      setFormData({
        institution: "", program: "", name: "", email: "", phone: "", dob: "", gender: "", address: "", document: null
      });
    }
  };

  const programsByInstitution: Record<string, string[]> = {
    engineering: ["B.E. Computer Science", "B.E. Mechanical", "B.Tech AI & Data Science", "B.E. Electronics"],
    arts: ["B.Sc. Computer Science", "B.Com", "B.B.A", "B.A. English"],
    polytechnic: ["Diploma in Mechanical", "Diploma in Civil", "Diploma in Automobile"]
  };

  const currentPrograms = formData.institution ? programsByInstitution[formData.institution] : [];

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Apply Now" subtitle="Start Your Academic Journey with JCT" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
        <Breadcrumb items={[{ label: "Apply Now" }]} />

        <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">

          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

            {["Institution", "Program", "Details", "Upload"].map((label, i) => (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step > i + 1 ? 'bg-gold text-navy' : step === i + 1 ? 'bg-gold text-navy ring-4 ring-gold/30' : 'bg-surface border-2 border-white/20 text-muted-foreground'}`}>
                  {step > i + 1 ? <Check size={20} /> : i + 1}
                </div>
                <div className={`text-xs mt-2 font-medium hidden sm:block ${step >= i + 1 ? 'text-gold' : 'text-muted-foreground'}`}>{label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Choose Institution */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-serif font-bold text-center mb-8">Choose Institution</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { id: "engineering", title: "Engineering College", icon: "⚙️" },
                    { id: "arts", title: "Arts & Science", icon: "🎨" },
                    { id: "polytechnic", title: "Polytechnic", icon: "📐" }
                  ].map(inst => (
                    <div
                      key={inst.id}
                      onClick={() => setFormData({...formData, institution: inst.id, program: ""})}
                      className={`cursor-pointer p-6 rounded-2xl border text-center transition-all ${formData.institution === inst.id ? 'border-gold bg-gold/10' : 'border-white/10 bg-surface hover:border-gold/50'}`}
                    >
                      <div className="text-4xl mb-4">{inst.icon}</div>
                      <h3 className="font-bold">{inst.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Program */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-serif font-bold text-center mb-8">Choose Program</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentPrograms.map(prog => (
                    <div
                      key={prog}
                      onClick={() => setFormData({...formData, program: prog})}
                      className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${formData.program === prog ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-surface hover:border-gold/50'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${formData.program === prog ? 'border-gold bg-gold' : 'border-muted-foreground'}`}>
                        {formData.program === prog && <Check size={12} className="text-navy" />}
                      </div>
                      <span className="font-medium">{prog}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Applicant Form */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-serif font-bold text-center mb-8">Applicant Details</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name (As per records)</label>
                    <input required type="text" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input required type="email" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mobile Number</label>
                    <input required type="tel" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <input required type="date" className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold text-foreground" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <div className="flex gap-6">
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={e => setFormData({...formData, gender: e.target.value})} className="accent-gold" required />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Permanent Address</label>
                  <textarea required rows={3} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>
              </div>
            )}

            {/* Step 4: Upload Documents & Submit */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-serif font-bold text-center mb-8">Upload Documents</h2>

                <div className="bg-surface p-6 rounded-2xl border border-white/10 mb-8">
                  <h3 className="font-bold mb-4 text-gold">Application Summary</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Institution:</div>
                    <div className="font-medium capitalize">{formData.institution}</div>
                    <div className="text-muted-foreground">Program:</div>
                    <div className="font-medium">{formData.program}</div>
                    <div className="text-muted-foreground">Name:</div>
                    <div className="font-medium">{formData.name}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block text-center">Upload Latest Mark Sheet or ID Proof (PDF/JPG)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center hover:border-gold/50 transition-colors bg-surface">
                    <input required type="file" id="document" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFormData({...formData, document: e.target.files?.[0] || null})} />
                    <label htmlFor="document" className="cursor-pointer flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gold">
                        <Upload size={28} />
                      </div>
                      <span className="font-bold text-lg">Click to browse or drag and drop</span>
                      <span className="text-sm text-muted-foreground mt-2">Maximum file size: 5MB</span>
                      {formData.document && <span className="mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-2"><Check size={16}/> {formData.document.name}</span>}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12 pt-6 border-t border-white/10">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-medium">
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={(step === 1 && !formData.institution) || (step === 2 && !formData.program)}
                className="flex-1 bg-gold text-navy font-bold text-lg py-3 rounded-xl hover:bg-[#e8b84a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
