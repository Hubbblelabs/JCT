"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import "@/styles/admin.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Invalid email or password");
    } else {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
      router.push(callbackUrl);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="admin-label">Email</label>
          <input
            type="email"
            className="admin-input"
            placeholder="admin@jct.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="admin-label">Password</label>
          <input
            type="password"
            className="admin-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary w-full justify-center"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a1628]">
              <BookOpen size={22} color="#c9a84c" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">JCT Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage content</p>
        </div>

        <Suspense fallback={<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-52 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
