"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: form submission logic
    alert("Thank you for your enquiry! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", program: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-border focus:border-gold/50 focus:ring-gold/20 h-11 w-full rounded-lg border bg-white px-4 text-sm focus:ring-2 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border-border focus:border-gold/50 focus:ring-gold/20 h-11 w-full rounded-lg border bg-white px-4 text-sm focus:ring-2 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border-border focus:border-gold/50 focus:ring-gold/20 h-11 w-full rounded-lg border bg-white px-4 text-sm focus:ring-2 focus:outline-none"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div>
          <label
            htmlFor="program"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Program Interested In
          </label>
          <select
            id="program"
            value={formData.program}
            onChange={(e) =>
              setFormData({ ...formData, program: e.target.value })
            }
            className="border-border focus:border-gold/50 focus:ring-gold/20 h-11 w-full rounded-lg border bg-white px-4 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">Select a program</option>
            <option value="engineering">Engineering (B.E./B.Tech)</option>
            <option value="arts-science">Arts & Science (UG)</option>
            <option value="polytechnic">Polytechnic (Diploma)</option>
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="message"
          className="text-foreground mb-1 block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="border-border focus:border-gold/50 focus:ring-gold/20 w-full rounded-lg border bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none"
          placeholder="Your message or query..."
        />
      </div>
      <button
        type="submit"
        className="bg-gold text-navy hover:bg-gold-light inline-flex h-11 items-center gap-2 rounded-lg px-8 font-sans text-sm font-bold transition-colors"
      >
        Send Enquiry <Send size={14} />
      </button>
    </form>
  );
}
