/**
 * Boot hook. Next calls `register` once per server instance, before the first
 * request is served.
 *
 * The only thing here is the automatic-backup timer. Note what this file does
 * *not* do: `validateServerEnv()` still runs at module scope in `src/auth.ts`,
 * where it has always run — moving it here would change when a bad environment
 * is reported, and the build-phase carve-out there depends on that timing.
 */
export async function register() {
  // `register` runs in both runtimes. The scheduler reaches Mongo and the
  // filesystem, neither of which exists on the edge runtime.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // `next build` starts a server to prerender pages. Arming a timer there
  // would have a build machine trying to write a multi-gigabyte archive.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { startBackupScheduler } = await import("@/lib/backup-scheduler");
  startBackupScheduler();
}
