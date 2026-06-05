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

    // Content-Security-Policy. script-src/style-src keep 'unsafe-inline'
    // because Tailwind + framer-motion emit inline styles and Next injects
    // inline bootstrap scripts without a nonce. Even so, 'self' on script-src
    // blocks *external* script injection, and object-src/base-uri/form-action/
    // frame-ancestors close the high-value XSS escalation paths (plugin
    // injection, <base> hijack, form exfiltration, framing). Follow-up:
    // move script-src to per-request nonces (requires proxy.ts wiring) and
    // drop 'unsafe-inline'. Dev adds 'unsafe-eval' + ws: for Turbopack/HMR.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' https:${isProd ? "" : " ws: wss:"}`,
      "media-src 'self' https: data:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'self'",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; ");

    // Baseline hardening headers applied to every response. HSTS is
    // production-only so it never pins `localhost` during local dev.
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
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
