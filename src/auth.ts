import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { validateServerEnv } from "@/lib/env";
import { User } from "@/lib/models";
import {
  consumeLoginAttempt,
  consumeLoginAttemptByEmail,
} from "@/lib/rate-limit";

// A fixed bcrypt hash of a random string. Compared against the supplied
// password when no user is found so the response takes the same ~bcrypt time
// as the found-user path — closes the timing oracle that would otherwise let
// an attacker enumerate valid emails.
const DUMMY_BCRYPT_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEeO3iJqM4xK1pV0bq1qVxZ8pQ0e7qkq3Hy";

// Fail fast on bad configuration. This module is loaded by src/proxy.ts, so
// the check runs at boot rather than surfacing as a 500 on the first login.
// It no-ops during `next build` (see validateServerEnv).
validateServerEnv();

const authSecret = process.env.NEXTAUTH_SECRET;

// How often a live JWT is checked back against its User document. Short enough
// that an offboarding takes effect within a minute, long enough that a busy
// admin session costs roughly one indexed lookup per minute.
const SESSION_REVALIDATE_MS = 60 * 1000;

declare module "next-auth" {
  interface User {
    role?: string;
    institution?: string;
    programs?: string[];
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
      institution?: string;
      programs?: string[];
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // NextAuth v5 defaults `trustHost` to false outside development, which makes
  // every /api/auth/* call throw UntrustedHost in a production build — login
  // becomes impossible. Set here rather than relying on AUTH_TRUST_HOST so an
  // incomplete .env on a new host can't silently take the admin panel down.
  // Safe because the app sits behind our own reverse proxy; if it were ever
  // directly internet-facing, pin the expected host instead.
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[auth] Missing email or password");
          return null;
        }

        try {
          await connectDB();
          const email = (credentials.email as string).toLowerCase();

          const ip = getClientIp(request);
          // Per-(ip|email) AND per-email caps. The email-only bucket is the
          // real guard: the IP component is attacker-controlled via a spoofed
          // X-Forwarded-For, so an IP-keyed limit alone is bypassable.
          const limit = consumeLoginAttempt(`${ip}|${email}`);
          const emailLimit = consumeLoginAttemptByEmail(email);
          if (!limit.allowed || !emailLimit.allowed) {
            const retry = Math.max(
              limit.retryAfterSec,
              emailLimit.retryAfterSec,
            );
            console.warn(
              `[auth] Rate limit exceeded for ${email} from ${ip}; retry in ${retry}s`,
            );
            return null;
          }

          const user = await User.findOne({
            email,
            is_active: true,
          })
            .select("+password_hash")
            .lean();

          if (!user) {
            // Spend the same time as a real bcrypt compare so response timing
            // doesn't reveal whether the email exists.
            await bcrypt.compare(
              credentials.password as string,
              DUMMY_BCRYPT_HASH,
            );
            console.error(`[auth] User not found with email: ${email}`);
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash,
          );

          if (!valid) {
            console.error(`[auth] Invalid password for user: ${email}`);
            return null;
          }

          await User.updateOne({ _id: user._id }, { last_login: new Date() });

          // Ensure all values are JSON-serializable primitives
          return {
            id: String(user._id),
            email: String(user.email),
            name: String(user.full_name),
            role: String(user.role || ""),
            institution: String(user.institution || ""),
            programs: Array.isArray(user.programs)
              ? user.programs.map(String)
              : [],
          };
        } catch (error) {
          console.error("[auth] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * Re-hydrate the token from the database instead of trusting the claims
     * frozen at sign-in.
     *
     * With `strategy: "jwt"` there is no server-side session store, so without
     * this a deactivated, deleted or demoted user keeps whatever `role` and
     * `institution` they held for the full 24h `maxAge` — defeating the
     * is_active flag, the DELETE handler and every guard in
     * `src/app/api/admin/users/[id]/route.ts`. Returning `null` invalidates
     * the session outright.
     *
     * The lookup is throttled to one per SESSION_REVALIDATE_MS per token, so
     * this costs at most one indexed findById per minute per active admin.
     */
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.role = user.role;
        token.institution = user.institution;
        token.programs = user.programs;
        token.checkedAt = Date.now();
        return token;
      }

      const uid = typeof token.uid === "string" ? token.uid : null;
      if (!uid || !Types.ObjectId.isValid(uid)) return null;

      const checkedAt =
        typeof token.checkedAt === "number" ? token.checkedAt : 0;
      if (Date.now() - checkedAt < SESSION_REVALIDATE_MS) return token;

      try {
        await connectDB();
        const fresh = await User.findById(uid)
          .select("role institution programs is_active")
          .lean();
        if (!fresh || fresh.is_active === false) return null;
        token.role = String(fresh.role || "");
        token.institution = String(fresh.institution || "");
        token.programs = Array.isArray(fresh.programs)
          ? fresh.programs.map(String)
          : [];
        token.checkedAt = Date.now();
        return token;
      } catch (error) {
        // A transient database outage must not sign every admin out. Keep the
        // existing claims but leave `checkedAt` untouched so the very next
        // request retries rather than waiting out the throttle window.
        console.error("[auth] session revalidation failed:", error);
        return token;
      }
    },
    session({ session, token }) {
      if (session.user) {
        const uid = token.uid;
        if (typeof uid === "string") session.user.id = uid;
        session.user.role = token.role as string;
        session.user.institution = token.institution as string;
        session.user.programs = token.programs as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: authSecret,
});

function getClientIp(request: unknown): string {
  if (!request || typeof request !== "object") return "unknown";
  const r = request as { headers?: Headers | Record<string, string> };
  const h = r.headers;
  if (!h) return "unknown";
  const get = (k: string): string | null => {
    if (h instanceof Headers) return h.get(k);
    const v =
      (h as Record<string, string>)[k] ??
      (h as Record<string, string>)[k.toLowerCase()];
    return typeof v === "string" ? v : null;
  };
  // X-Real-IP first: our reverse proxy sets it from $remote_addr, while
  // X-Forwarded-For is built with $proxy_add_x_forwarded_for and therefore
  // starts with whatever the client sent. See clientIpFromHeaders.
  const real = get("x-real-ip");
  if (real) return real.trim();
  const cf = get("cf-connecting-ip");
  if (cf) return cf.trim();
  const fwd = get("x-forwarded-for");
  if (fwd) {
    const parts = fwd
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]!;
  }
  return "unknown";
}
