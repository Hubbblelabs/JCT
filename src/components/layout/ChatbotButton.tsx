"use client";

import { MessageCircle } from "lucide-react";

export function ChatbotButton() {
  return (
    <button
      aria-label="Open chatbot"
      className="bg-navy hover:bg-navy-mid fixed right-4 bottom-36 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 md:right-6 md:bottom-40 md:h-14 md:w-14"
    >
      <MessageCircle size={22} className="text-white" />
    </button>
  );
}
