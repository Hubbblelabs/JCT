"use client";

import { AlertCircle } from "lucide-react";
import type { ValidationDetail } from "@/lib/validation-helpers";

/**
 * Shared display for server-side 422 responses. Pass either a plain string
 * (legacy 400 errors) or the structured `details[]` array returned by
 * `validationError()` in api-helpers.
 */
export function ValidationErrors({
  error,
  details,
}: {
  error?: string | null;
  details?: ValidationDetail[] | null;
}) {
  if (!error && (!details || details.length === 0)) return null;

  return (
    <div className="mb-4 rounded-lg border border-[var(--admin-danger-border)] bg-[var(--admin-danger-bg)] p-3">
      <div className="flex items-start gap-2">
        <AlertCircle
          size={16}
          className="mt-0.5 shrink-0 text-[var(--admin-danger)]"
        />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-[var(--admin-danger)]">
            {error || "Validation failed"}
          </p>
          {details && details.length > 0 && (
            <ul className="mt-1 ml-4 list-disc space-y-0.5 text-[var(--admin-danger)]">
              {details.map((d, i) => (
                <li key={i}>
                  {d.path.length > 0 && (
                    <span className="font-mono text-xs text-[var(--admin-danger)]">
                      {d.path.join(".")}:{" "}
                    </span>
                  )}
                  {d.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
