import { logAudit } from "@/lib/audit";
import { activeBuild } from "@/lib/backup-jobs";
import { startBackupBuild } from "@/lib/backup-run";
import {
  computeNextRun,
  getSchedule,
  recordRun,
  type BackupScheduleState,
} from "@/lib/backup-schedule";
import { BackupSchedule } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

/**
 * The clock behind automatic backups.
 *
 * An in-process timer rather than a cron entry or an externally-triggered
 * endpoint, for the same reason the rate limiter and the public cache are
 * in-process: this app runs as exactly one Node process (`output: "standalone"`
 * in one container, see `docker-compose.prod.yaml`). A cron would mean a second
 * scheduling surface to keep in sync with the admin UI, and a webhook endpoint
 * would mean a shared secret and a route that must be reachable but not
 * abusable — both worse than a timer for a single instance. If this ever runs
 * more than one replica, this is the piece that needs a lock.
 *
 * `next_run_at` lives in Mongo, not in the timer, so a restart does not lose
 * the schedule and a build cannot be triggered twice by a redeploy.
 */

/** How often the due check runs. Fine-grained enough that a run lands within
 * a minute of its slot, cheap enough to be a single indexed read. */
const TICK_MS = 60 * 1000;

/**
 * Delay before the first check. A container that has just come up is busy
 * warming caches and answering the health probe, and a schedule that came due
 * while it was down would otherwise start a multi-gigabyte export into that.
 */
const FIRST_TICK_MS = 60 * 1000;

let timer: NodeJS.Timeout | null = null;
/** Guards against a tick landing while the previous one is still exporting —
 * a build runs for minutes, far longer than TICK_MS. */
let running = false;

/**
 * Start the scheduler. Idempotent: Next may evaluate a module more than once
 * in dev, and two timers would mean two builds racing for the same disk.
 */
export function startBackupScheduler(): void {
  if (timer) return;
  timer = setInterval(() => void tick(), TICK_MS);
  // Never hold the process open. A pending tick is not work worth delaying a
  // shutdown for — the schedule is in Mongo and survives the restart.
  timer.unref?.();

  const first = setTimeout(() => void tick(), FIRST_TICK_MS);
  first.unref?.();

  console.log("[backup-scheduler] started");
}

/** For tests and for the "run the check now" path; safe to call at any time. */
export async function tick(): Promise<void> {
  if (running) return;
  running = true;
  try {
    await runDue();
  } catch (err) {
    // A throw here would kill nothing (setInterval swallows it) but would also
    // never be seen. The next tick retries.
    console.error("[backup-scheduler] tick failed:", err);
  } finally {
    running = false;
  }
}

async function runDue(): Promise<void> {
  let schedule: BackupScheduleState;
  try {
    schedule = await getSchedule();
  } catch (err) {
    console.error("[backup-scheduler] could not read the schedule:", err);
    return;
  }
  if (!schedule.enabled) return;

  // A schedule enabled through some path that did not set `next_run_at`
  // (a hand-edited document, a restored one) would otherwise never fire.
  if (!schedule.next_run_at) {
    await armNextRun(schedule);
    return;
  }

  const due = new Date(schedule.next_run_at);
  if (Number.isNaN(due.getTime())) {
    await armNextRun(schedule);
    return;
  }
  if (due.getTime() > Date.now()) return;

  // An admin export in flight wins: it has someone waiting on it, and the
  // scheduled run is retried on the next tick a minute later. `next_run_at` is
  // deliberately left in the past so the run is not skipped, only deferred.
  if (activeBuild()) {
    console.log("[backup-scheduler] deferring — a backup is already building");
    return;
  }

  console.log(`[backup-scheduler] running the ${schedule.frequency} backup`);
  const actor = "system:auto-backup";
  const started = await startBackupBuild({
    wantImages: schedule.include_images,
    wantDocs: schedule.include_docs,
    origin: "auto",
    actor,
  });

  if (!started.ok) {
    // "busy" lost a race with a manual export between the check above and the
    // call; retry on the next tick rather than burning this slot.
    if (started.reason === "busy") return;
    console.error("[backup-scheduler] could not start:", started.message);
    await recordRun({ status: "failed", error: started.message });
    await logAudit(
      "site-config",
      "export-failed",
      actor,
      `Scheduled backup did not start: ${started.message}`,
    );
    return;
  }

  const finished = await started.done;
  const failed = !finished || finished.state !== "ready";
  await recordRun({
    status: failed ? "failed" : "ready",
    jobId: started.job.id,
    error: failed ? (finished?.error ?? "Backup build failed") : undefined,
  });
  await logAudit(
    "site-config",
    failed ? "export-failed" : "exported",
    actor,
    failed
      ? `Scheduled backup failed: ${finished?.error ?? "unknown error"}`
      : `Scheduled backup completed: ${started.job.filename}`,
  );
}

/** Write a `next_run_at` for a schedule that has none, without running now. */
async function armNextRun(schedule: BackupScheduleState): Promise<void> {
  const next = computeNextRun(schedule);
  await connectDB();
  await BackupSchedule.updateOne(
    { key: "default" },
    { $set: { next_run_at: next } },
  );
  console.log(`[backup-scheduler] armed for ${next.toISOString()}`);
}
