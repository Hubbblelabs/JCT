import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="bg-navy noise-overlay relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/5 absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-navy-light/50 absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg">
        <p className="gradient-text font-serif text-7xl font-bold md:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-white md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 font-sans text-base text-white/70">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-gold text-navy inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-sans text-sm font-bold transition-all hover:scale-105 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:scale-95"
          >
            <Home size={16} /> Back to home
          </Link>
          <Link
            href="/institutions/engineering"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-sans text-sm font-bold text-white transition-all hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <ArrowLeft size={16} /> Explore programs
          </Link>
        </div>
      </div>
    </main>
  );
}
