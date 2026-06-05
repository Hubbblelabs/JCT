export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="bg-navy flex min-h-screen items-center justify-center"
    >
      <span className="sr-only">Loading…</span>
      <div className="border-gold/30 border-t-gold h-10 w-10 animate-spin rounded-full border-4" />
    </div>
  );
}
