"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export function Contact() {
    return (
        <section id="contact" className="py-32 bg-stone-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-6">Get in Touch</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-primary mb-6">
                        We're Here to <span className="italic text-stone-400 font-light">Help</span>
                    </h3>
                    <p className="text-stone-600 text-lg font-light">
                        Have questions? Our team is ready to assist you with admissions, campus visits, or general inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <ContactCard
                            icon={Phone}
                            title="Call Us"
                            content="+91 98765 43210"
                            subContent="Mon-Fri, 9am - 5pm"
                        />
                        <ContactCard
                            icon={Mail}
                            title="Email Us"
                            content="admissions@jct.edu"
                            subContent="We usually reply within 24h"
                        />
                        <ContactCard
                            icon={MapPin}
                            title="Visit Us"
                            content="Knowledge Park, Coimbatore"
                            subContent="Tamil Nadu - 641105"
                        />
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100"
                        >
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none" placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Email</label>
                                        <input type="email" className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none" placeholder="your@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Subject</label>
                                    <select className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none text-stone-600">
                                        <option>General Inquiry</option>
                                        <option>Admissions</option>
                                        <option>Placements</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Message</label>
                                    <textarea rows={4} className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all outline-none resize-none" placeholder="How can we help you?"></textarea>
                                </div>

                                <div className="pt-4">
                                    <Button className="w-full md:w-auto px-12 py-6 font-bold text-base rounded-2xl bg-accent text-primary hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95">
                                        Send Message <Send className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactCard({ icon: Icon, title, content, subContent }: { icon: any, title: string, content: string, subContent: string }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-stone-100 flex items-start gap-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-primary shrink-0 group-hover:bg-accent group-hover:text-primary transition-colors">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div>
                <h4 className="font-serif font-bold text-primary mb-1 text-lg">{title}</h4>
                <p className="text-stone-600 text-sm mb-1">{content}</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">{subContent}</p>
            </div>
        </div>
    )
}
