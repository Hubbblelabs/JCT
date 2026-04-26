"use client";

import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for contacting us. We will get back to you shortly.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Contact Us" subtitle="We're Here to Help and Answer Any Question You Might Have" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Contact Us" }]} />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground">Whether you have questions about admissions, programs, or just want to know more about JCT Institutions, our team is ready to answer all your questions.</p>
            </section>

            <div className="space-y-6">
              {/* 1. Address */}
              <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Address</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    JCT Institutions<br />
                    Pichanur, Navakkarai (PO)<br />
                    Coimbatore, Tamil Nadu 641105<br />
                    India
                  </p>
                </div>
              </div>

              {/* 3. Phone Numbers */}
              <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone Numbers</h3>
                  <div className="text-muted-foreground mt-1 space-y-1">
                    <p>Admissions: +91 93614 88812</p>
                    <p>General Enquiry: +91 422 2636900</p>
                    <p>Placement Cell: +91 93614 88813</p>
                  </div>
                </div>
              </div>

              {/* 4. Email */}
              <div className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Address</h3>
                  <div className="text-muted-foreground mt-1 space-y-1">
                    <p>info@jct.ac.in</p>
                    <p>admissions@jct.ac.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Enquiry Form */}
          <section className="bg-surface border border-border p-8 rounded-3xl h-fit">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <select required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold text-foreground" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                  <option value="" disabled>Select a Subject</option>
                  <option value="admissions">Admissions Enquiry</option>
                  <option value="placements">Placements</option>
                  <option value="careers">Careers / Job Opportunity</option>
                  <option value="other">Other / General</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold resize-none" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <button type="submit" className="w-full bg-gold text-navy font-bold text-lg py-4 rounded-xl hover:bg-[#e8b84a] transition-colors mt-2">
                Send Message
              </button>
            </form>
          </section>
        </div>

        {/* 2. Google Map */}
        <section className="mt-20">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Find us on the Map</h2>
          <div className="w-full h-[400px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative">
            {/* We use a placeholder div or an iframe embed if we had the actual Google Maps embed URL */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.43343161099!2d76.85244587570415!3d10.853835659180724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85cd49aaaaaab%3A0x633d7b8eb5dc0dc2!2sJCT%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            ></iframe>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
