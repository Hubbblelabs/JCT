"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import "@/styles/admin.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // A password typed with Caps Lock on fails like a wrong one, and after a
  // few of those the rate limiter locks the account for minutes — say so
  // before the attempt is spent.
  const [capsLock, setCapsLock] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      // The limiter answers the same way as a bad password (it cannot tell
      // the client which), so the message covers both.
      setError(
        "That email and password don’t match. After several failed attempts sign-in pauses for a few minutes.",
      );
    } else {
      // Only follow same-origin relative paths. A raw callbackUrl would let
      // `/admin/login?callbackUrl=https://evil.com` (or `//evil.com`) bounce
      // a freshly-authenticated user off-site — an open redirect.
      const raw = searchParams.get("callbackUrl") ?? "/admin/dashboard";
      const callbackUrl =
        raw.startsWith("/") && !raw.startsWith("//") ? raw : "/admin/dashboard";
      router.push(callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <div>
        <label htmlFor="login-email" className="admin-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          inputMode="email"
          className="admin-input"
          placeholder="you@jct.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="login-password" className="admin-label">
          Password
        </label>
        <div className="admin-login-password">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
            onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
            aria-describedby={capsLock ? "login-caps" : undefined}
            required
          />
          <button
            type="button"
            className="admin-icon-btn admin-login-reveal"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {capsLock && (
          <p id="login-caps" className="admin-help text-[var(--admin-warning)]">
            Caps Lock is on.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="admin-banner admin-banner--danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="admin-btn admin-btn-primary admin-btn-lg admin-btn-block"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="admin-layout admin-login">
      <aside className="admin-login-brand" aria-hidden="true">
        <div className="admin-login-brand-inner">
          <span className="admin-login-crest">
            <Image
              src="/jct_logo.webp"
              alt=""
              width={40}
              height={40}
              priority
            />
          </span>
          <p className="admin-login-eyebrow">JCT Institutions</p>
          <p className="admin-login-headline">
            One place for every page of the three colleges.
          </p>
          <ul className="admin-login-colleges">
            <li>College of Engineering &amp; Technology</li>
            <li>College of Arts &amp; Science</li>
            <li>Polytechnic College</li>
          </ul>
        </div>
      </aside>

      <main className="admin-login-main">
        <div className="admin-login-card">
          <div className="admin-login-mobile-crest">
            <Image src="/jct_logo.webp" alt="" width={32} height={32} />
          </div>
          <h1 className="admin-login-title">Sign in</h1>
          <p className="admin-login-sub">
            Use the email and password an administrator set up for you.
          </p>

          <Suspense
            fallback={
              <div className="admin-skeleton mt-6" style={{ height: 220 }} />
            }
          >
            <LoginForm />
          </Suspense>

          <p className="admin-login-foot">
            Forgot your password? Ask an administrator to set a new one from{" "}
            <strong>Users</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
