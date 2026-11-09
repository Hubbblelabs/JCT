/**
 * Restore and reset each rewrite the whole site. Neither may overlap the
 * other, a second copy of itself, or a backup build: a backup taken halfway
 * through a restore archives a half-restored site, and because automatic
 * archives are kept by count it can push a good one out of retention.
 *
 * In-process, with the same single-instance assumption as `backup-jobs.ts`,
 * `rate-limit.ts` and `public-cache.ts`.
 */

export type MaintenanceOperation = "restore" | "reset";

let running: MaintenanceOperation | null = null;

export function runningMaintenance(): MaintenanceOperation | null {
  return running;
}

/** Claim the lock. False when another restore or reset already holds it. */
export function tryBeginMaintenance(op: MaintenanceOperation): boolean {
  if (running) return false;
  running = op;
  return true;
}

export function endMaintenance(op: MaintenanceOperation): void {
  if (running === op) running = null;
}
