import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import {
  requireRole,
  json,
  badRequest,
  notFound,
  serverError,
  tooManyRequests,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  clientIpFromHeaders,
  consumeLoginAttempt,
  consumeLoginAttemptByEmail,
} from "@/lib/rate-limit";
import { PasswordChangeSchema } from "@/lib/validation";

/**
 * The signed-in user changes their own password. Open to every role — editors
 * cannot reach /admin/users, so without this the only way to change a password
 * was to ask an admin to set one.
 *
 * Checking the current password is a password guess against the account, so
 * it spends from the same two buckets as the login form. Separate buckets
 * would hand anyone holding an open session a second, independent allowance
 * of guesses.
 *
 * Setting `password_changed_at` ends every other session on its next
 * revalidation (src/auth.ts). The caller's own session ends with them, which is
 * why the client signs straight back in with the new password.
 */
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, PasswordChangeSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const uid = session!.user?.id;
  const email = (session!.user?.email ?? "").toLowerCase();
  if (!uid || !email) return badRequest("Your session has no account id");

  const ip = clientIpFromHeaders(req.headers);
  const limit = consumeLoginAttempt(`${ip}|${email}`);
  const emailLimit = consumeLoginAttemptByEmail(email);
  if (!limit.allowed || !emailLimit.allowed) {
    return tooManyRequests(
      Math.max(limit.retryAfterSec, emailLimit.retryAfterSec),
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ _id: uid, is_active: true })
      .select("+password_hash email")
      .lean<{ password_hash: string; email: string } | null>();
    if (!user) return notFound("Account not found");

    const valid = await bcrypt.compare(
      body.current_password,
      user.password_hash,
    );
    if (!valid) return badRequest("Your current password is not correct");

    await User.updateOne(
      { _id: uid },
      {
        $set: {
          password_hash: await bcrypt.hash(body.new_password, 12),
          password_changed_at: new Date(),
        },
      },
    );

    await logAudit("user", "updated", email, `Changed own password`);
    return json({ changed: true });
  } catch (e) {
    console.error("[admin/account/password]", e);
    return serverError();
  }
}
