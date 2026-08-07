import type { NextConfig } from "next";

/**
 * The host uploaded assets are served from. Canonical name first, legacy R2
 * name as a fallback — the same resolution order src/lib/storage-public.ts
 * uses, duplicated here because this file runs in plain Node (no `@/*` alias,
 * no bundler) before the app exists.
 *
 * Note the `protocol: "https"` on the pattern below: the asset origin must be
 * TLS. A self-hosted S3 server reached over plain HTTP will not be allowlisted
 * and every image through /_next/image fails with '"url" parameter is not
 * allowed'.
 */
function assetHostname(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const assetHost = assetHostname();

const nextConfig: NextConfig = {
  // Vercel does its own function bundling/tracing; "standalone" output is
  // for the Docker deploy path (see .github/workflows/build-deploy.yml) and
  // breaks Vercel's build (missing .next/next-server.js.nft.json) if left on.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  compress: true,
  poweredByHeader: false,

  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },

  images: {
    // Every host here can be fetched and re-encoded by /_next/image on our
    // server, so the list is the image-proxy surface. `*.r2.dev` used to be
    // allowlisted: that is Cloudflare's *shared* public-bucket domain, so it
    // trusted every public R2 bucket in existence rather than ours. The bucket
    // this app actually writes to comes from the asset origin resolved above.
    remotePatterns: [
      { protocol: "https", hostname: "companieslogo.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Placeholder-avatar service — development seeds only, never production.
      ...(process.env.NODE_ENV !== "production"
        ? [{ protocol: "https" as const, hostname: "i.pravatar.cc" }]
        : []),
      ...(assetHost
        ? [{ protocol: "https" as const, hostname: assetHost }]
        : []),
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
      // chatcdn.npfs.co is not optional: the Meritto bot script's first act is
      // `if (typeof jQuery == 'undefined')` → inject jQuery from that host and
      // build the whole widget in its onload. Blocked there, the script still
      // parses and defines its globals but never creates the launcher, the
      // indicator or the chat iframe — which is exactly how the chatbot came to
      // be silently absent on every public page.
      // googletagmanager.com serves gtag.js (Google Analytics 4) — see the
      // <Script> pair in src/app/layout.tsx.
      `script-src 'self' 'unsafe-inline' https://*.nopaperforms.com https://*.npfs.co https://www.googletagmanager.com${isProd ? "" : " 'unsafe-eval'"}`,
      // The widget also pulls a per-account icon stylesheet over <link>.
      "style-src 'self' 'unsafe-inline' https://*.nopaperforms.com https://*.npfs.co",
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
