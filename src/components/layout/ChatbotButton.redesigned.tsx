"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  FlaskConical,
  GraduationCap,
  Library,
  MessageCircle,
  Phone,
  ShieldAlert,
  Send,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type CollegeId = "engineering" | "arts" | "polytechnic" | "all";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Safe formatter that converts markdown-style text to React elements (no dangerouslySetInnerHTML)
 */
function FormattedMessage({ content }: { content: string }): React.ReactNode {
  let text = escapeHtml(content);
  text = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, "");

  // Split by newlines and process each line
  const lines = text.split("\n");

  return (
    <>
      {lines
        .map((line, lineIdx) => {
          // Handle bullet points
          const bulletMatch = line.match(/^• (.+)$/);
          if (bulletMatch) {
            line = bulletMatch[1];
          }

          // Process ***bold-italic*** -> <strong><em>
          line = line.replace(/\*\*\*(.+?)\*\*\*/g, (_match, group) => {
            return `\x01BOLDITALIC\x02${group}\x03`;
          });
          line = line.replace(/\*\*(.+?)\*\*/g, (_match, group) => {
            return `\x01BOLD\x02${group}\x03`;
          });

          // Process *italic* -> <em>
          line = line.replace(/\*(.+?)\*/g, (_match, group) => {
            return `\x01ITALIC\x02${group}\x03`;
          });

          // Handle Jagannath label
          const jagannathMatch = line.match(/^\s*Jagannath\s*:/i);
          if (jagannathMatch) {
            line = line.replace(/^\s*Jagannath\s*:/i, `\x01JAGANNATH\x02\x03`);
          }

          // Parse the formatted line
          const tokens = line.split(/(\x01[A-Z]+\x02.*?\x03)/);

          return tokens.map((token, idx) => {
            if (token.startsWith("\x01JAGANNATH\x02")) {
              return <strong key={`${lineIdx}-${idx}`}>Jagannath:</strong>;
            } else if (token.startsWith("\x01BOLDITALIC\x02")) {
              const content = token.slice(13, -1);
              return (
                <strong key={`${lineIdx}-${idx}`}>
                  <em>{content}</em>
                </strong>
              );
            } else if (token.startsWith("\x01BOLD\x02")) {
              const content = token.slice(8, -1);
              return <strong key={`${lineIdx}-${idx}`}>{content}</strong>;
            } else if (token.startsWith("\x01ITALIC\x02")) {
              const content = token.slice(8, -1);
              return <em key={`${lineIdx}-${idx}`}>{content}</em>;
            } else if (token.trim() === "") {
              return null;
            }
            return token;
          });
        })
        .flat()
        .filter(Boolean)}
      {lines.length > 1 &&
        lines.slice(0, -1).map((_, idx) => <br key={`br-${idx}`} />)}
    </>
  );
}

function getAssistantIcon(content: string) {
  const text = content.toLowerCase();
  if (text.includes("support scope") || text.includes("limited mode"))
    return ShieldAlert;
  if (
    text.includes("placement") ||
    text.includes("recruiter") ||
    text.includes("intern")
  )
    return Briefcase;
  if (
    text.includes("course") ||
    text.includes("program") ||
    text.includes("degree") ||
    text.includes("diplom")
  )
    return GraduationCap;
  if (
    text.includes("admission") ||
    text.includes("eligibility") ||
    text.includes("apply") ||
    text.includes("process")
  )
    return BookOpen;
  if (text.includes("library")) return Library;
  if (text.includes("lab") || text.includes("workshop")) return FlaskConical;
  if (
    text.includes("hostel") ||
    text.includes("facility") ||
    text.includes("campus")
  )
    return Building2;
  if (text.includes("transport") || text.includes("bus")) return Bus;
  if (
    text.includes("contact") ||
    text.includes("phone") ||
    text.includes("email") ||
    text.includes("website")
  )
    return Phone;
  return Bot;
}

const COLLEGE_META: Record<
  CollegeId,
  { title: string; welcome: string; color: string }
> = {
  all: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello! I can help with Engineering, Arts and Science, and Polytechnic programs. What would you like to know?",
    color: "from-blue-600 to-blue-700",
  },
  engineering: {
    title: "Jagannath",
    welcome:
      "Jagannath: Welcome! I can help with engineering programs, admissions, placements, and campus facilities. How can I assist?",
    color: "from-indigo-600 to-indigo-700",
  },
  arts: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello! I'm here to help with arts and science courses, eligibility requirements, and admissions. What's your question?",
    color: "from-amber-600 to-amber-700",
  },
  polytechnic: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hi there! I can guide you through diploma programs, admissions, and training opportunities. What would you like to know?",
    color: "from-slate-700 to-slate-800",
  },
};

const FREQUENT_QUESTIONS: Record<CollegeId, string[]> = {
  all: [
    "What are Engineering courses available?",
    "What are Arts and Science courses available?",
    "What diploma courses are available?",
  ],
  engineering: [
    "What are all available engineering courses?",
    "What is the admission process?",
    "Do you have hostel facilities?",
    "Tell me about placements",
  ],
  arts: [
    "What courses are offered in Arts and Science?",
    "How can I apply for admission?",
    "Do you have hostel facilities?",
    "Tell me about placements",
  ],
  polytechnic: [
    "What diploma courses are available?",
    "What is the admission process?",
    "Do you have hostel facilities?",
    "Can I join engineering after diploma?",
  ],
};

function getCollegeIdFromPath(pathname: string): CollegeId {
  if (pathname.includes("/institutions/arts-science")) return "arts";
  if (pathname.includes("/institutions/polytechnic")) return "polytechnic";
  if (pathname.includes("/institutions/engineering")) return "engineering";
  return "all";
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

export function ChatbotButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const collegeId = useMemo(
    () => getCollegeIdFromPath(pathname || ""),
    [pathname],
  );
  const meta = COLLEGE_META[collegeId];
  const frequentQuestions = FREQUENT_QUESTIONS[collegeId];

  useEffect(() => {
    let active = true;
    if (active) {
      setMessages((prev) => {
        if (prev.length === 0 || prev[0].id !== "welcome") {
          return [
            {
              id: "welcome",
              role: "assistant",
              content: meta.welcome,
              timestamp: new Date(),
            },
            ...prev,
          ];
        }
        return prev;
      });
    }
    return () => {
      active = false;
    };
  }, [meta.welcome]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const now = Date.now();
    const userMsg: Message = {
      id: String(now),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    const assistantMsg: Message = {
      id: String(now + 1),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId,
          messages: nextMessages
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        let backendError = "Failed to get chatbot response";
        try {
          const err = (await response.json()) as { error?: string };
          if (err.error) {
            backendError = err.error;
          }
        } catch {
          // Ignore malformed backend error payload.
        }
        throw new Error(backendError);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload) as { text?: string };
            if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id
                    ? { ...m, content: m.content + parsed.text }
                    : m,
                ),
              );
            }
          } catch {
            // Ignore malformed chunks.
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Sorry, I could not process that request. Please try again.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content: `Jagannath: ${message}`,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        onClick={() => setIsOpen((open) => !open)}
        className={`fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all md:bottom-8 md:left-6 md:h-16 md:w-16 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : `bg-linear-to-br ${meta.color} hover:shadow-2xl`
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={24} className="text-white md:scale-110" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${meta.title} chat`}
            className="fixed bottom-24 left-4 z-50 flex h-128 w-88 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:bottom-32 md:left-6 md:w-[24rem]"
          >
            {/* Header */}
            <div
              className={`bg-linear-to-r ${meta.color} px-4 py-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{meta.title}</p>
                    <p className="text-xs text-white/80">
                      JCT Admissions Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Close chatbot"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto bg-linear-to-b from-slate-50 to-white p-4"
            >
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={
                      msg.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <div className="flex max-w-[80%] gap-2">
                        <div className="shrink-0">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br ${meta.color}`}
                          >
                            {(() => {
                              const Icon = getAssistantIcon(msg.content);
                              return <Icon size={14} className="text-white" />;
                            })()}
                          </div>
                        </div>
                        <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
                          {msg.content ? (
                            <FormattedMessage content={msg.content} />
                          ) : (
                            <TypingIndicator />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] rounded-2xl rounded-br-sm bg-linear-to-br ${meta.color} px-4 py-2.5 text-sm text-white shadow-md`}
                      >
                        {msg.content}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Suggested Questions */}
            <AnimatePresence>
              {messages.length <= 2 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t bg-slate-50 px-3 py-3"
                >
                  <p className="mb-2 px-1 text-xs font-semibold text-slate-600">
                    Quick Questions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {frequentQuestions.map((question) => (
                      <motion.button
                        key={question}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className={`rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md`}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form
              onSubmit={onSubmit}
              className="flex gap-2 border-t bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 rounded-full border-2 border-slate-200 px-4 py-2 text-sm transition-colors outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`rounded-full p-2 transition-all ${
                  input.trim() && !isLoading
                    ? `bg-linear-to-r ${meta.color} text-white hover:shadow-lg`
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
