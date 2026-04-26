"use client";

import { useEffect, useRef, useState } from "react";
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
  Info,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type CollegeId = "engineering" | "arts" | "polytechnic" | "all";
type FlowStep = "welcome" | "email" | "phone" | "name" | "chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "video" | "image" | "options" | "suggestions";
  options?: string[];
}

interface LeadData {
  email: string;
  phone: string;
  name: string;
  program: string;
  course: string;
}

const COURSES: Record<string, string[]> = {
  "Engineering": ["Computer Science & Engineering", "AI & Data Science", "Electronics & Communication", "Electrical & Electronics", "Mechanical Engineering", "Civil Engineering", "Bio-Technology", "Food Technology", "Petrochemical Technology", "Petroleum Engineering"],
  "Arts and Science": ["BCA", "B.Sc Computer Science", "B.Sc AI & Machine Learning", "B.Com Logistics & Supply Chain", "BBA Logistics"],
  "Polytechnic": ["Diploma in EEE", "Diploma in Civil Engineering", "Diploma in Agricultural Engineering", "Diploma in Petrochemical Engineering", "Diploma in Mechanical Engineering"]
};

const QUICK_SUGGESTIONS = [
  "About JCT Institutions",
  "Colleges & Courses",
  "Admission Process",
  "Placement Records",
  "Hostel Facilities"
];

function unescapeHtml(input: string): string {
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

function FormattedMessage({ content, onSuggest }: { content: string, onSuggest?: (sug: string) => void }): React.ReactNode {
  // First unescape any HTML entities from the backend
  let text = unescapeHtml(content);
  
  // Extract dynamic suggestions
  const suggestions: string[] = [];
  const suggestRegex = /\[SUGGEST:\s*(.+?)\]/g;
  let match;
  while ((match = suggestRegex.exec(text)) !== null) {
    suggestions.push(match[1].trim());
  }
  // Remove them from text
  text = text.replace(suggestRegex, "");
  
  // Tokenize for media tags and markdown
  const parts = text.split(/(\[VIDEO:\s*.*?\]|\[IMAGE:\s*.*?\])/g);

  return (
    <>
      {parts.map((part, pIdx) => {
        // Handle Video Tag
        const videoMatch = part.match(/\[VIDEO:\s*([^\]]+)\]/);
        if (videoMatch) {
          const url = videoMatch[1].trim();
          const embedUrl = url.includes("youtube.com/watch?v=") 
            ? url.replace("watch?v=", "embed/") 
            : url.includes("youtu.be/") 
              ? url.replace("youtu.be/", "youtube.com/embed/")
              : url;
          return (
            <div key={`v-${pIdx}`} className="my-2 aspect-video w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <iframe src={embedUrl} className="h-full w-full" allowFullScreen />
            </div>
          );
        }

        // Handle Image Tag
        const imageMatch = part.match(/\[IMAGE:\s*([^\]]+)\]/);
        if (imageMatch) {
          let url = imageMatch[1].trim();
          if (url.startsWith("/data")) {
            url = `/api/chatbot${url}`;
          }
          return (
            <div key={`i-${pIdx}`} className="my-2 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <img src={url} alt="Chat media" className="h-auto w-full" />
            </div>
          );
        }

        // Handle Normal Text with Markdown
        const lines = part.split("\n");

        // Helper to render inline markdown (bold/italic/links) within a string
        const renderInline = (text: string, keyPrefix: string) => {
          const tokens = text.split(/(\[.+?\]\(.+?\)|\*\*.*?\*\*|__.*?__|(?<!\*)\*.*?\*(?!\*)|(?<!_)_.*?_(?!_))/);
          return tokens.map((token, idx) => {
            // Markdown link: [text](url)
            const linkMatch = token.match(/^\[(.+?)\]\((.+?)\)$/);
            if (linkMatch) {
              const isExternal = linkMatch[2].startsWith('http');
              return (
                <a
                  key={`${keyPrefix}-${idx}`}
                  href={linkMatch[2]}
                  target={isExternal ? "_blank" : "_self"}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-0.5 text-blue-600 underline underline-offset-2 hover:text-blue-800 font-medium"
                >
                  {linkMatch[1]}
                  {isExternal && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>}
                </a>
              );
            }
            if ((token.startsWith("**") && token.endsWith("**")) || (token.startsWith("__") && token.endsWith("__"))) {
              return <strong key={`${keyPrefix}-${idx}`}>{token.slice(2, -2)}</strong>;
            }
            if ((token.startsWith("*") && token.endsWith("*") && token.length > 2) || (token.startsWith("_") && token.endsWith("_") && token.length > 2)) {
              return <em key={`${keyPrefix}-${idx}`}>{token.slice(1, -1)}</em>;
            }
            return token;
          });
        };

        return lines.map((line, lineIdx) => {
          const trimmed = line.trim();

          // Category header: lines like "* Undergraduate (B.E/B.Tech): 11 Courses"
          // where * is followed by non-list content (contains : or is a heading)
          if (/^\*\s+.+(:|Courses|Programs|Info|Details)/i.test(trimmed)) {
            const text = trimmed.replace(/^\*\s+/, "");
            return (
              <div key={`line-${pIdx}-${lineIdx}`} className="mt-3 mb-1 font-semibold text-slate-800 text-[13px]">
                {renderInline(text, `h-${pIdx}-${lineIdx}`)}
              </div>
            );
          }

          // Bullet items: lines starting with +, -, or * followed by a space
          if (/^[+\-\*]\s+/.test(trimmed)) {
            const text = trimmed.replace(/^[+\-\*]\s+/, "");
            const isSubBullet = line.startsWith("  ") || line.startsWith("\t"); // indented = sub-bullet
            return (
              <div key={`line-${pIdx}-${lineIdx}`} className={`flex items-start gap-2 ${isSubBullet ? "ml-4 mt-0.5" : "mt-1"}`}>
                <span className={`mt-1.5 shrink-0 rounded-full ${isSubBullet ? "h-1 w-1 bg-slate-400" : "h-1.5 w-1.5 bg-blue-500"}`} />
                <span className="text-[13.5px] leading-relaxed">{renderInline(text, `b-${pIdx}-${lineIdx}`)}</span>
              </div>
            );
          }

          // Numbered list: lines like "1. text" or "1) text"
          const numberedMatch = trimmed.match(/^(\d+)[.)\s]\s*(.+)/);
          if (numberedMatch) {
            return (
              <div key={`line-${pIdx}-${lineIdx}`} className="flex items-start gap-2 mt-1">
                <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">{numberedMatch[1]}</span>
                <span className="text-[13.5px] leading-relaxed">{renderInline(numberedMatch[2], `n-${pIdx}-${lineIdx}`)}</span>
              </div>
            );
          }

          // Empty line → spacing
          if (!trimmed) {
            return <div key={`line-${pIdx}-${lineIdx}`} className="h-2" />;
          }

          // Phone / contact line — render as a styled card
          if (trimmed.includes("📞") || /^\ud83d\udcde|contact.*:\s*\+91|^\+91\s*\d/i.test(trimmed)) {
            const cleanedPhone = trimmed.replace(/^📞\s*/, "").replace(/^contact:\s*/i, "");
            return (
              <div key={`line-${pIdx}-${lineIdx}`} className="flex items-center gap-2 mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-[12.5px] font-medium text-blue-800">
                <Phone size={13} className="shrink-0 text-blue-600" />
                <span>{renderInline(cleanedPhone, `ph-${pIdx}-${lineIdx}`)}</span>
              </div>
            );
          }

          // Plain text
          return (
            <span key={`line-${pIdx}-${lineIdx}`} className="block leading-relaxed">
              {renderInline(trimmed, `t-${pIdx}-${lineIdx}`)}
            </span>
          );
        });
      })}

    </>
  );
}

function getAssistantIcon(content: string) {
  const text = content.toLowerCase();
  if (text.includes("support scope") || text.includes("limited mode")) return ShieldAlert;
  if (text.includes("placement") || text.includes("recruiter")) return Briefcase;
  if (text.includes("course") || text.includes("program")) return GraduationCap;
  if (text.includes("admission") || text.includes("apply")) return BookOpen;
  return Bot;
}

function getCollegeFromPath(pathname: string): CollegeId {
  if (pathname.includes("/institutions/engineering") || pathname.includes("/engineering")) return "engineering";
  if (pathname.includes("/institutions/arts-science") || pathname.includes("/arts")) return "arts";
  if (pathname.includes("/institutions/polytechnic") || pathname.includes("/polytechnic")) return "polytechnic";
  return "all";
}

const COLLEGE_LABELS: Record<CollegeId, string> = {
  engineering: "JCT College of Engineering and Technology",
  arts: "JCT College of Arts and Science",
  polytechnic: "JCT Polytechnic College",
  all: "JCT Institutions",
};

function getWelcomeMsgs(college: CollegeId) {
  const label = COLLEGE_LABELS[college];
  return [
    { id: "init-1", content: `Hello! I'm Juggernaut, your AI assistant for **${label}**.` },
    { id: "init-2", content: "To provide you the best assistance, I need a few details." },
    { id: "init-3", content: "Please enter your **Email Address**:" },
  ];
}

export function ChatbotButton() {
  const pathname = usePathname();
  const college = getCollegeFromPath(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<FlowStep>("welcome");
  const [lead, setLead] = useState<LeadData>({ email: "", phone: "", name: "", program: "", course: "" });
  const [videoVisible, setVideoVisible] = useState(true);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  
  const msgCounter = useRef(0);
  const getUniqueId = () => {
    msgCounter.current += 1;
    return `msg-${Date.now()}-${msgCounter.current}`;
  };
  
  const endRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      startFlow();
    }
  }, []);

  // Only auto-scroll to bottom when user is already at/near the bottom
  useEffect(() => {
    if (!isUserScrolledUp) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolledUp]);

  const handleChatScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    // Consider "at bottom" if within 60px of the bottom
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsUserScrolledUp(!atBottom);
  };

  const addAssistantMessage = (content: string, type: "text" | "options" | "suggestions" | "video" = "text", options?: string[]) => {
    setMessages(prev => [...prev, {
      id: getUniqueId(),
      role: "assistant",
      content,
      timestamp: new Date(),
      type,
      options
    }]);
  };

  const addUserMessage = (content: string) => {
    // When the user sends a message, snap back to bottom
    setIsUserScrolledUp(false);
    setMessages(prev => [...prev, {
      id: getUniqueId(),
      role: "user",
      content,
      timestamp: new Date()
    }]);
  };

  const startFlow = async () => {
    const timestamp = new Date();
    const welcomeMsgs = getWelcomeMsgs(college);
    setMessages(welcomeMsgs.map(m => ({
      ...m,
      role: "assistant" as const,
      timestamp
    })));
    setStep("email");
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone.replace(/\D/g, ""));

  const handleInput = async (val: string) => {
    const text = val.trim();
    if (!text) return;

    addUserMessage(text);
    setInput("");

    if (step === "email") {
      if (validateEmail(text)) {
        setLead(prev => ({ ...prev, email: text }));
        addAssistantMessage("Great! Now, please enter your **Phone Number** (10 digits):");
        setStep("phone");
      } else {
        addAssistantMessage("The email format seems incorrect. Please enter a valid email address (e.g., user@example.com).");
      }
    } else if (step === "phone") {
      if (validatePhone(text)) {
        setLead(prev => ({ ...prev, phone: text }));
        addAssistantMessage("And finally, what is your **Full Name**?");
        setStep("name");
      } else {
        addAssistantMessage("Please provide a valid 10-digit mobile number.");
      }
    } else if (step === "name") {
      if (text.length >= 2) {
        const finalLead = { ...lead, name: text, program: "", course: "" };
        setLead(finalLead);
        try {
          await fetch("/api/chatbot/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalLead)
          });
        } catch (e) { console.error("Lead send failed", e); }
        addAssistantMessage(`Thank you, ${text}! How can I assist you today?`);
        setStep("chat");
      } else {
        addAssistantMessage("Please enter a valid name.");
      }
    } else if (step === "chat") {
      await sendToAI(text);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    addUserMessage(suggestion);
    await sendToAI(suggestion);
  };

  const sendToAI = async (text: string) => {
    setIsLoading(true);
    const assistantMsgId = getUniqueId();
    setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: "", timestamp: new Date() }]);

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: lead.email || "default",
          college: college,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setMessages(prev => prev.map(m =>
            m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
          ));
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId
          ? { ...m, content: "Sorry, I'm having trouble connecting right now. Please ensure the assistant service is running." }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-4 md:left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-colors ${isOpen ? "bg-red-500" : "bg-blue-600 shadow-blue-400/50"}`}
      >
        {isOpen ? <X className="text-white" /> : <MessageCircle className="text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            /* FIXED: restored `fixed` positioning; removed invalid `z-1000` */
            className="fixed bottom-24 left-4 md:left-6 z-50 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            style={{
              width: "380px",
              maxWidth: "calc(100vw - 2rem)",
              /* FIXED: explicit pixel height so flex children have a real parent height to resolve against */
              height: "min(550px, 85vh)",
            }}
          >
            {/* ── Header (shrink-0: never squishes) ── */}
            <div className="shrink-0 bg-gold px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/10">
                    <Bot size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Juggernaut AI</p>
                    <p className="text-[10px] text-white/80 uppercase tracking-widest">JCT Institutions</p>
                  </div>
                </div>
              
              </div>
            </div>

            {/* ── Video banner (shrink-0: fixed height) ── */}
            {/* {videoVisible && (
              <div className="shrink-0 relative h-28 w-full bg-black overflow-hidden">
                <video
                  src="/assets/videos/promo.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover opacity-85"
                  onError={() => setVideoVisible(false)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white animate-pulse">
                    <Play size={9} fill="currentColor" />
                  </div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">Life at JCT Institutions</p>
                </div>
              </div>
            )} */}

            {/* ── Messages area
                  flex-1        → takes all remaining height after header + video + form
                  min-h-0       → allows shrinking below content height (critical for flex scroll)
                  overflow-y-auto → scroll ONLY this container
            ── */}
            <div
              ref={chatContainerRef}
              onScroll={handleChatScroll}
              className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar"
            >
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex max-w-[88%] gap-2.5">
                      {msg.role === "assistant" && (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-blue-600 shadow-sm">
                          {(() => { const Icon = getAssistantIcon(msg.content); return <Icon size={14} />; })()}
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <div className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm transition-all ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-700 rounded-bl-none border border-slate-100"}`}>
                          <FormattedMessage content={msg.content} onSuggest={handleSuggestionClick} />
                        </div>


                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start items-center gap-2 pl-1">
                    <div className="flex h-7 w-7 animate-pulse rounded-full bg-slate-200" />
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "150ms" }} />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={endRef} />
              </div>
            </div>

            {/* ── Scroll-to-bottom pill (shown when user scrolled up) ── */}
            {isUserScrolledUp && (
              <div className="shrink-0 flex justify-center py-1 bg-slate-50/80 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsUserScrolledUp(false);
                    endRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>
                  </svg>
                  Latest message
                </button>
              </div>
            )}

            {/* ── Input form (shrink-0: always visible at bottom) ── */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleInput(input); }}
              className="shrink-0 flex gap-2 border-t border-slate-100 bg-white px-4 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your query..."
                disabled={isLoading}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-[13.5px] focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:shadow-none disabled:scale-100"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
      `}</style>
    </>
  );
}
