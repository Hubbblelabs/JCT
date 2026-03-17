"use client";

import { MessageCircle } from "lucide-react";

export function ChatbotButton() {
  return (
    <button
      aria-label="Open chatbot"
      className="bg-navy hover:bg-navy-mid fixed right-16 bottom-4 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 md:right-[5.5rem] md:bottom-6 md:h-12 md:w-12"
    >
      <MessageCircle size={20} className="text-white" />
    </button>
  );
}
