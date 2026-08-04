import { z } from "zod";

/**
 * Boot-time validation of server environment configuration.
 *
 * The motivating failure: `trustHost` was never configured, so every
 * production build returned 500 from `/api/auth/*` and nobody could log into
 * the admin panel — a misconfiguration that only surfaced as a runtime error,
 * on the one request path nobody exercises until they need it. Config problems
 * should be a startup error with a clear message, not a 500 later.
 *
 * Validation is skipped during `next build`, which only collects page data and
 * would otherwise fail on a machine with an incomplete local `.env`. The
 * running server (`next start` / `next dev`) still refuses to boot.
 */

/**
 * Values that must never be accepted as a real secret.
 *
 * A single constant drifted out of sync with `.env.example` once already: the
 * guard checked a string the repo never shipped, and the shipped placeholder
 * was caught only by accident (it is 31 characters, one short of the `.min(32)`
 * check). A set survives edits to either file — add to it, never replace it.
 */
const SECRET_PLACEHOLDERS = new Set([
  "your-random-32-char-secret-here",
  "replace-with-32-byte-random-string",
  "changeme",
  "secret",
]);

const EnvSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .refine(
      (v) => v.startsWith("mongodb://") || v.startsWith("mongodb+srv://"),
      "MONGODB_URI must be a mongodb:// or mongodb+srv:// connection string",
    ),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters")
    .refine(
      (v) => !SECRET_PLACEHOLDERS.has(v.trim()),
      "NEXTAUTH_SECRET is still the placeholder value — generate one with: openssl rand -base64 32",
    ),
  NEXTAUTH_URL: z.url("NEXTAUTH_URL must be an absolute URL").optional(),
  MONGODB_MAX_POOL_SIZE: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) > 0,
      "MONGODB_MAX_POOL_SIZE must be a positive integer",
    )
    .optional(),
});

/**
 * R2 is optional as a whole — images fall back to local serving. But a
 * *partial* set is always a mistake: uploads fail at request time with an SDK
 * error rather than falling back cleanly.
 */
const R2_KEYS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
] as const;

function checkR2(): string | null {
  const present = R2_KEYS.filter((k) => (process.env[k] ?? "").trim() !== "");
  if (present.length === 0 || present.length === R2_KEYS.length) return null;
  const missing = R2_KEYS.filter((k) => !present.includes(k));
  return `R2 storage is partially configured — missing: ${missing.join(", ")}. Set all four or none.`;
}

export function validateServerEnv(): void {
  const problems: string[] = [];

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      problems.push(`${issue.path.join(".") || "(env)"}: ${issue.message}`);
    }
  }

  const r2 = checkR2();
  if (r2) problems.push(r2);

  if (problems.length === 0) return;

  const msg =
    "Invalid server environment configuration:\n" +
    problems.map((p) => `  - ${p}`).join("\n") +
    "\nSee .env.example.";

  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.warn(`[env] WARNING (build): ${msg}`);
    return;
  }
  throw new Error(msg);
}
