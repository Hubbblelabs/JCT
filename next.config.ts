import type { NextConfig } from "next";

function r2Hostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const r2Host = r2Hostname();

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "companieslogo.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 90],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    // Baseline hardening headers applied to every response. A full
    // Content-Security-Policy is intentionally omitted here — Tailwind/
    // framer-motion rely on inline styles, so a CSP needs per-request
    // nonces to avoid breaking the UI; track that as a follow-up. HSTS is
    // production-only so it never pins `localhost` during local dev.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
    ];

    const securityRule = { source: "/(.*)", headers: securityHeaders };

    if (isProd) {
      const immutable = [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ];
      return [
        securityRule,
        { source: "/_next/static/(.*)", headers: immutable },
        { source: "/fonts/(.*)", headers: immutable },
      ];
    }

    // In development, explicitly disable caching to prevent stale chunks.
    return [
      securityRule,
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
