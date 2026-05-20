// Client-side helpers shared by admin forms. Mirror of the server response
// shape so frontend code can type-check the error payloads without importing
// server-only modules.

export type ValidationDetail = {
  path: (string | number)[];
  message: string;
  code: string;
};

export type ApiErrorPayload = {
  error: string;
  message?: string;
  details?: ValidationDetail[];
};

/**
 * Attempt to parse a fetch Response as an API error. Returns `null` for
 * success-shaped bodies; otherwise returns the structured error.
 */
export async function parseApiError(
  res: Response,
): Promise<ApiErrorPayload | null> {
  if (res.ok) return null;
  try {
    const body = await res.clone().json();
    if (body && typeof body === "object" && "error" in body) {
      return body as ApiErrorPayload;
    }
    return { error: `Request failed (${res.status})` };
  } catch {
    return { error: `Request failed (${res.status})` };
  }
}
