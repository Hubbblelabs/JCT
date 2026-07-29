"use client";

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";
import Link from "next/link";

// Route-level error boundary, NOT the global one — despite the name this file
// used to carry. An exception in the root layout escapes this boundary and is
// caught by app/global-error.tsx instead.
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <main
      id="main-content"
      role="alert"
      className="bg-navy relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <div className="relative z-10 max-w-lg">
        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 font-sans text-base text-white/70">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-white/40">
            Ref: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="bg-gold text-navy inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-sans text-sm font-bold transition-all hover:scale-105 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:scale-95"
          >
            <RotateCcw size={16} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-sans text-sm font-bold text-white transition-all hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <Home size={16} /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
