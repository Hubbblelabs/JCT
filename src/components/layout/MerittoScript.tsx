"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useSiteConfig } from "@/lib/use-site-config";

export function MerittoScript() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Get meritto config from floating elements
  const { data: floatingData } = useSiteConfig<{
    meritto?: { enabled?: boolean };
  }>("floatingElements");
  const mtEnabled = floatingData?.meritto?.enabled !== false;

  // Don't render Meritto on admin pages or if disabled
  if (isAdmin || !mtEnabled) {
    return null;
  }

  return (
    <>
      {/* Meritto Chatbot */}
      <div
        className="npf_chatbots"
        data-w="77d56c9f31934de79df36d3ca503d338"
        style={{ display: "none" }}
      />
      <Script
        src="https://chatbot.in6.nopaperforms.com/en-gb/backend/bots/niaachtbtscpt.js/b4363a08fed64030ae3ab79c8be5848c/77d56c9f31934de79df36d3ca503d338"
        strategy="lazyOnload"
      />
    </>
  );
}
