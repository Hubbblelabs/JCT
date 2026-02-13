"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-28 right-3 sm:right-4 lg:bottom-8 lg:right-8 z-50 flex flex-col gap-3 sm:gap-4 items-end">
            {/* AI Agent Chat Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    aria-label={isOpen ? "Close chat" : "Open AI chat assistant"}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-2 border-white/20"
                >
                    {isOpen ? <X size={24} /> : <Bot size={28} />}
                </Button>
            </motion.div>

            {/* WhatsApp Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <a
                    href="https://wa.me/919361488801"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-[#25D366] hover:bg-[#20bd5a] text-white border-2 border-white/20 transition-colors"
                >
                    {/* Simple WhatsApp-like SVG icon using simple shapes or MessageCircle as fallback */}
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </a>
            </motion.div>

            {/* Chat Interface (Simple Placeholder) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
                    >
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <Bot size={24} />
                                <div>
                                    <h3 className="font-bold">JCT AI Assistant</h3>
                                    <p className="text-xs text-blue-100">Ask us anything!</p>
                                </div>
                            </div>
                            <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="text-white hover:bg-blue-700 rounded-full h-8 w-8">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="h-80 p-4 bg-stone-50 overflow-y-auto flex flex-col gap-3">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 self-start max-w-[85%] shadow-sm text-sm">
                                <p className="text-stone-800">Hello! 👋 I'm your JCT virtual assistant. How can I help you regarding admissions, courses, or campus life today?</p>
                            </div>
                        </div>
                        <div className="p-3 bg-white border-t border-stone-100">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Type your question..." 
                                    className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none"
                                />
                                <Button size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-xl">
                                    <MessageCircle size={16} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
