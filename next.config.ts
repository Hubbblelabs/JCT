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
      { protocol: "https" as const, hostname: "*.r2.dev" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 90],
  },

  /**
   * Pages that were folded into a host route (see the `host` entries in
   * `src/lib/content-pages.ts`). The old URLs are printed in prospectuses and
   * linked from CMS navbars, so they permanently redirect to the panel that
   * absorbed them instead of 404ing.
   */
  async redirects() {
    const ENG = "/institutions/engineering";
    const moved: [string, string][] = [
      // NAAC moved out from under /accreditations to its own top-level route,
      // reached from the navbar's "More" dropdown.
      [`${ENG}/accreditations/naac`, `${ENG}/naac`],
      [`${ENG}/accreditations/naac/aqar-report`, `${ENG}/naac#aqar-report`],
      [
        `${ENG}/accreditations/naac/best-practices`,
        `${ENG}/naac#best-practices`,
      ],
      [
        `${ENG}/accreditations/naac/institutional-distinctiveness`,
        `${ENG}/naac#institutional-distinctiveness`,
      ],
      [`${ENG}/nirf`, `${ENG}/documents#nirf`],
      [`${ENG}/financial-statements`, `${ENG}/documents#financial-statements`],
      [`${ENG}/ict-content`, `${ENG}/documents#ict-content`],
      [`${ENG}/placements/gallery`, `${ENG}/placements#gallery`],
      [`${ENG}/timeline`, `${ENG}/about#timeline`],
    ];
    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },

  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline' https://*.nopaperforms.com${isProd ? "" : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src 'self' https:${isProd ? "" : " ws: wss:"}`,
      "media-src 'self' https: data:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'self' https://*.nopaperforms.com https://www.google.com https://www.gstatic.com https://www.youtube.com",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
    ];

    const securityRule = {
      source: "/(.*)",
      headers: securityHeaders,
    };

    if (isProd) {
      const immutable = [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ];

      return [
        securityRule,
        {
          source: "/_next/static/(.*)",
          headers: immutable,
        },
        {
          source: "/fonts/(.*)",
          headers: immutable,
        },
      ];
    }

    return [
      securityRule,
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
