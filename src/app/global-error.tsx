"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for exceptions thrown in the **root layout**, which
 * `app/error.tsx` cannot catch — without this file those fall through to
 * Next's built-in error screen, which is unstyled and off-brand for a public
 * college site.
 *
 * It replaces the whole document, so it must render its own <html>/<body> and
 * cannot rely on the root layout's fonts, providers or global CSS. Everything
 * here is therefore inline and dependency-free on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          textAlign: "center",
          background: "#0a1733",
          color: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <main role="alert" style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.7)" }}>
            The site hit an unexpected error. Please try again in a moment.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "0.5rem",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                height: "3rem",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.875rem",
                background: "#c9a227",
                color: "#0a1733",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                height: "3rem",
                padding: "0 1.5rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
