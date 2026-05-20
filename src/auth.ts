import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";

declare module "next-auth" {
  interface User {
    role?: string;
    institution?: string;
    programs?: string[];
  }
  interface Session {
    user: {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[auth] Missing email or password");
          return null;
        }

        try {
          await connectDB();
          const email = (credentials.email as string).toLowerCase();

          const user = await User.findOne({
            email,
            is_active: true,
          }).lean();

          if (!user) {
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

          console.log(`[auth] User authenticated successfully: ${email}`);

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
        token.role = user.role;
        token.institution = user.institution;
        token.programs = user.programs;
        console.log("[auth] JWT token updated with user data");
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.institution = token.institution as string;
        session.user.programs = token.programs as string[];
        console.log("[auth] Session updated from token");
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
});
