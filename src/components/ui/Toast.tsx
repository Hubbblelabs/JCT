"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastApi = {
  show: (message: string, variant?: ToastVariant, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

let _toastId = 0;

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof Info; ring: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    ring: "border-green-200",
    iconColor: "text-green-600",
  },
  error: {
    icon: AlertCircle,
    ring: "border-red-200",
    iconColor: "text-red-600",
  },
  info: { icon: Info, ring: "border-gray-200", iconColor: "text-[#0a1628]" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info", durationMs = 4000) => {
      const id = ++_toastId;
      setToasts((prev) => [...prev, { id, message, variant }]);
      const timer = setTimeout(() => dismiss(id), durationMs);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (m, d) => show(m, "success", d),
      error: (m, d) => show(m, "error", d ?? 6000),
      info: (m, d) => show(m, "info", d),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-[200] flex w-[min(92vw,380px)] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const { icon: Icon, ring, iconColor } = VARIANT_STYLES[t.variant];
          return (
            <div
              key={t.id}
              role={t.variant === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${ring} bg-white px-4 py-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
              <p className="flex-1 text-sm font-medium text-gray-800">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:outline-none"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
