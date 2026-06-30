import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
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

const SECRET_PLACEHOLDER = "replace-with-32-byte-random-string";
const authSecret = process.env.NEXTAUTH_SECRET;
const secretInvalid =
  !authSecret || authSecret === SECRET_PLACEHOLDER || authSecret.length < 32;

if (secretInvalid) {
  const msg =
    "NEXTAUTH_SECRET is missing, set to the placeholder, or shorter than 32 chars. " +
    "Generate one with: openssl rand -base64 32";
  // Skip throwing during the build itself — the build only collects page
  // data and would otherwise fail on misconfigured local .env files. The
  // running server still refuses to start (next start / next dev set
  // NEXT_PHASE to phase-production-server / phase-development-server).
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.warn(`[auth] WARNING (build): ${msg}`);
  } else {
    throw new Error(msg);
  }
}

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
    jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.role = user.role;
        token.institution = user.institution;
        token.programs = user.programs;
      }
      return token;
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
  const fwd = get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return get("x-real-ip") ?? get("cf-connecting-ip") ?? "unknown";
}
