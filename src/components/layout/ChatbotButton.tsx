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
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

type CollegeId = "engineering" | "arts" | "polytechnic" | "all";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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

  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    // Handle bullet points
    const bulletMatch = line.match(/^• (.+)$/);
    if (bulletMatch) {
      line = bulletMatch[1];
    }

    // Process formatting markers
    line = line.replace(/\*\*\*(.+?)\*\*\*/g, "\x01BOLDITALIC\x02$1\x03");
    line = line.replace(/\*\*(.+?)\*\*/g, "\x01BOLD\x02$1\x03");
    line = line.replace(/\*(.+?)\*/g, "\x01ITALIC\x02$1\x03");
    const jagannathMatch = line.match(/^\s*Jagannath\s*:/i);
    if (jagannathMatch) {
      line = line.replace(/^\s*Jagannath\s*:/i, "\x01JAGANNATH\x02\x03");
    }

    const tokens = line.split(/(\x01[A-Z]+\x02.*?\x03)/);

    tokens.forEach((token, idx) => {
      if (token.startsWith("\x01JAGANNATH\x02")) {
        result.push(<strong key={`${lineIdx}-${idx}`}>Jagannath:</strong>);
      } else if (token.startsWith("\x01BOLDITALIC\x02")) {
        const content = token.slice(13, -1);
        result.push(
          <strong key={`${lineIdx}-${idx}`}>
            <em>{content}</em>
          </strong>,
        );
      } else if (token.startsWith("\x01BOLD\x02")) {
        const content = token.slice(8, -1);
        result.push(<strong key={`${lineIdx}-${idx}`}>{content}</strong>);
      } else if (token.startsWith("\x01ITALIC\x02")) {
        const content = token.slice(8, -1);
        result.push(<em key={`${lineIdx}-${idx}`}>{content}</em>);
      } else if (token.trim() !== "") {
        result.push(token);
      }
    });

    if (lineIdx < lines.length - 1) {
      result.push(<br key={`br-${lineIdx}`} />);
    }
  });

  return <>{result}</>;
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

const COLLEGE_META: Record<CollegeId, { title: string; welcome: string }> = {
  all: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello. I can help with Engineering, Arts and Science, and Polytechnic programs.",
  },
  engineering: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello. I can help with engineering programs, admissions, and facilities.",
  },
  arts: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello. I can help with arts and science courses, eligibility, and admissions.",
  },
  polytechnic: {
    title: "Jagannath",
    welcome:
      "Jagannath: Hello. I can help with diploma programs, admissions, and practical training.",
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
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: meta.welcome,
      },
    ]);
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

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: trimmed,
    };
    const assistantMsg: Message = {
      id: String(Date.now() + 1),
      role: "assistant",
      content: "",
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
      <button
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="bg-navy hover:bg-navy-mid fixed bottom-5 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 md:bottom-6 md:left-6"
      >
        <MessageCircle size={20} className="text-white" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${meta.title} chat`}
          className="fixed bottom-20 left-4 z-50 flex h-128 w-88 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl md:bottom-20 md:left-6 md:w-[24rem]"
        >
          <div className="bg-navy flex items-center justify-between px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{meta.title}</p>
              <p className="text-xs text-white/80">JCT Admissions Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#0D3B66] px-3 py-2 text-sm whitespace-pre-wrap text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm whitespace-pre-wrap text-slate-700 shadow"
                  }
                >
                  {msg.role === "assistant"
                    ? (() => {
                        const Icon = getAssistantIcon(msg.content);
                        return (
                          <span className="flex items-start gap-2">
                            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF0FF] text-[#0D3B66]">
                              <Icon size={12} />
                            </span>
                            <span>
                              <FormattedMessage content={msg.content} />
                            </span>
                          </span>
                        );
                      })()
                    : msg.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length <= 2 && !isLoading && (
            <div className="flex flex-wrap gap-2 border-t bg-white px-3 py-2">
              {frequentQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about admissions, courses, or facilities"
              disabled={isLoading}
              className="flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0D3B66]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-[#0D3B66] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
