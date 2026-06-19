"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useSiteConfig } from "@/lib/use-site-config";

export function MerittoScript() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const { data: floatingData } = useSiteConfig<{
    meritto?: { enabled?: boolean };
  }>("floatingElements");
  const mtEnabled = floatingData?.meritto?.enabled !== false;

  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isAdmin || !mtEnabled) return;

    const trigger = () => setShouldLoad(true);
    const opts: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener("mousemove", trigger, opts);
    window.addEventListener("touchstart", trigger, opts);
    window.addEventListener("keydown", trigger, opts);
    window.addEventListener("scroll", trigger, opts);

    // Fallback: load after 2 s even with no user interaction so the launcher
    // is present when the ChatbotNotification bubble appears at 3 s.
    const fallback = setTimeout(trigger, 2000);

    return () => {
      window.removeEventListener("mousemove", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("keydown", trigger);
      window.removeEventListener("scroll", trigger);
      clearTimeout(fallback);
    };
  }, [isAdmin, mtEnabled]);

  if (isAdmin || !mtEnabled || !shouldLoad) return null;

  return (
    <>
      <div
        className="npf_chatbots"
        data-w="77d56c9f31934de79df36d3ca503d338"
        style={{ display: "none" }}
      />
      <Script
        src="https://chatbot.in6.nopaperforms.com/en-gb/backend/bots/niaachtbtscpt.js/b4363a08fed64030ae3ab79c8be5848c/77d56c9f31934de79df36d3ca503d338"
        strategy="afterInteractive"
      />
    </>
  );
}
