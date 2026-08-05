import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import {
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  statfs,
  writeFile,
} from "fs/promises";
import os from "os";
import path from "path";

/**
 * Backups are built to disk first, then downloaded as an ordinary file.
 *
 * The previous design archived straight into the HTTP response, which coupled
 * two things that have no business being coupled: how fast R2 can be read, and
 * how fast the operator's browser drains a socket. Every object was fetched,
 * zipped and pushed one at a time, gated by the slower of the two — so a 7.5 GB
 * export ran for hours on a link that could have carried it in minutes, could
 * not report real progress (the size is unknown until the last byte), and could
 * not be resumed if the tab was closed at 90%.
 *
 * Splitting it in two fixes all of that. The build phase has no client attached,
 * so it reads R2 with real concurrency at full server bandwidth. The serve phase
 * is a static file with a known `Content-Length` and byte-range support, so the
 * browser shows true progress, a dropped connection resumes instead of
 * restarting, and nginx can serve it with `sendfile()` and skip Node entirely.
 *
 * The cost is disk: an archive occupies real space until it expires.
 */

/** Where archives are written. Override in Docker with a bind-mounted volume. */
export function backupDir(): string {
  return process.env.BACKUP_DIR || path.join(os.tmpdir(), "jct-backups");
}

/**
 * When set, the download route hands nginx an `X-Accel-Redirect` under this
 * prefix instead of piping the file through Node. Optional: without it the
 * route serves the bytes itself, which still supports ranges and resume.
 */
export function accelPrefix(): string | null {
  const raw = process.env.BACKUP_ACCEL_PREFIX?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
}

export type BackupJobState = "building" | "ready" | "failed";

export interface BackupJobReport {
  assets_expected: number;
  assets_archived: number;
  unreadable: string[];
}

export interface BackupJob {
  id: string;
  state: BackupJobState;
  /** Name the browser saves it as. */
  filename: string;
  created_at: string;
  finished_at?: string;
  /** Archive bytes written so far — the live progress numerator. */
  bytes: number;
  /** Final archive size once ready. */
  size?: number;
  entries_done: number;
  entries_total: number;
  /**
   * Sum of the source bytes the plan expects to archive. Assets are stored
   * uncompressed, so this is a close estimate of the finished size and serves
   * as the progress denominator.
   */
  expected_bytes: number;
  config_entries: number;
  asset_files: number;
  assets_unavailable?: boolean;
  error?: string;
  report?: BackupJobReport;
}

/** Job ids are used as filenames, so nothing but a UUID may become one. */
const JOB_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const isJobId = (id: unknown): id is string =>
  typeof id === "string" && JOB_ID.test(id);

export const newJobId = () => randomUUID();

export const archivePath = (id: string) => path.join(backupDir(), `${id}.zip`);
/** Written to while building, renamed on success — a partial file is never
 * reachable by the download route, which only ever opens the final name. */
export const partialPath = (id: string) => path.join(backupDir(), `${id}.part`);

/**
 * One index file for every job, rather than a sidecar per job that has to be
 * discovered by listing the directory. Scanning would mean `readdir` on a
 * path only known at runtime, which defeats Next's output-file tracing and
 * pulls the whole project into the standalone bundle.
 */
const indexPath = () => path.join(backupDir(), "index.json");

/**
 * Live jobs, keyed by id. Progress ticks stay in memory rather than hitting
 * disk on every chunk; the index is written at the transitions that matter.
 * Single-instance assumption, same as the public API cache and rate limiter.
 */
const live = new Map<string, BackupJob>();

async function readIndex(): Promise<BackupJob[]> {
  try {
    const raw = JSON.parse(await readFile(indexPath(), "utf8")) as unknown;
    return Array.isArray(raw) ? (raw as BackupJob[]) : [];
  } catch {
    // Absent on a fresh volume, and unparseable only if a write was cut in
    // half — in both cases an empty history is the safe reading.
    return [];
  }
}

/** Write via a temp file and rename, so a crash mid-write cannot leave the
 * index truncated and lose track of archives still occupying the disk. */
async function writeIndex(jobs: BackupJob[]): Promise<void> {
  try {
    await mkdir(backupDir(), { recursive: true });
    const tmp = `${indexPath()}.tmp`;
    await writeFile(tmp, JSON.stringify(jobs, null, 2), "utf8");
    await rename(tmp, indexPath());
  } catch (err) {
    console.error("[backup-jobs] Could not persist the job index:", err);
  }
}

async function upsertIndex(job: BackupJob): Promise<void> {
  const jobs = await readIndex();
  const at = jobs.findIndex((j) => j.id === job.id);
  if (at === -1) jobs.unshift(job);
  else jobs[at] = job;
  await writeIndex(jobs);
}

/** Only one build at a time — two concurrent exports would fight for both
 * bandwidth and disk, and neither would finish sooner. */
export function activeBuild(): BackupJob | null {
  for (const job of live.values()) {
    if (job.state === "building") return job;
  }
  return null;
}

export async function createJob(
  init: Omit<
    BackupJob,
    "id" | "state" | "created_at" | "bytes" | "entries_done"
  >,
): Promise<BackupJob> {
  await mkdir(backupDir(), { recursive: true });
  const job: BackupJob = {
    ...init,
    id: newJobId(),
    state: "building",
    created_at: new Date().toISOString(),
    bytes: 0,
    entries_done: 0,
  };
  live.set(job.id, job);
  await upsertIndex(job);
  return job;
}

/** In-memory only: called on every archiver progress tick. */
export function updateProgress(
  id: string,
  patch: Partial<Pick<BackupJob, "bytes" | "entries_done" | "entries_total">>,
): void {
  const job = live.get(id);
  if (job) Object.assign(job, patch);
}

export async function finishJob(
  id: string,
  outcome:
    | { state: "ready"; size: number; report: BackupJobReport }
    | { state: "failed"; error: string },
): Promise<void> {
  const job = live.get(id);
  if (!job) return;
  job.state = outcome.state;
  job.finished_at = new Date().toISOString();
  if (outcome.state === "ready") {
    job.size = outcome.size;
    job.bytes = outcome.size;
    job.report = outcome.report;
  } else {
    job.error = outcome.error;
  }
  await upsertIndex(job);
}

/**
 * A record that still says "building" with nothing in memory can only mean the
 * process restarted mid-build — the archive will never be completed by anyone,
 * so it is reported as failed rather than left polling forever.
 */
function reconcile(job: BackupJob): BackupJob {
  if (job.state !== "building" || live.has(job.id)) return job;
  return {
    ...job,
    state: "failed",
    error: "The server restarted while this backup was being built.",
  };
}

/** A job's current state: from memory when it is live, from the index else. */
export async function getJob(id: string): Promise<BackupJob | null> {
  if (!isJobId(id)) return null;
  const inMemory = live.get(id);
  if (inMemory) return inMemory;
  const stored = (await readIndex()).find((j) => j.id === id);
  return stored ? reconcile(stored) : null;
}

export async function listJobs(): Promise<BackupJob[]> {
  // The in-memory copy wins: it carries live progress the index never sees.
  const jobs = (await readIndex()).map((j) => live.get(j.id) ?? reconcile(j));
  return jobs.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

async function removeJob(id: string): Promise<void> {
  live.delete(id);
  await Promise.all([
    rm(archivePath(id), { force: true }),
    rm(partialPath(id), { force: true }),
  ]).catch((err) => console.error(`[backup-jobs] Cleanup of ${id}:`, err));
  await writeIndex((await readIndex()).filter((j) => j.id !== id));
}

/** Keep the newest few archives so a failed download can be retried, but never
 * let old ones silently fill the disk. */
const KEEP_ARCHIVES = 2;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export async function pruneJobs(): Promise<void> {
  const jobs = await listJobs();
  const now = Date.now();
  let kept = 0;
  for (const job of jobs) {
    if (job.state === "building" && live.has(job.id)) continue;
    const age = now - new Date(job.created_at).getTime();
    const stale = age > MAX_AGE_MS;
    // Only *ready* jobs count against the keep limit. A failed one holds no
    // archive worth space, and its index entry is the only record of why the
    // export failed — so it survives until it ages out rather than being swept
    // away the moment the operator retries.
    const surplus = job.state === "ready" && ++kept > KEEP_ARCHIVES;
    if (stale || surplus) await removeJob(job.id);
  }
}

export const deleteJob = removeJob;

/**
 * Free bytes on the backup volume, or null where the platform can't report it.
 * Checked before a build starts: running out of disk halfway is a much worse
 * failure than refusing up front, because it can also take the app down with
 * it if the volume is shared with anything else.
 */
export async function freeBytes(): Promise<number | null> {
  try {
    await mkdir(backupDir(), { recursive: true });
    const fs = await statfs(backupDir());
    return Number(fs.bsize) * Number(fs.bavail);
  } catch {
    return null;
  }
}

/**
 * Make room for a build of roughly `needed` bytes, reclaiming retained
 * archives oldest-first if there isn't any.
 *
 * Counting retained archives as "available" without deleting them would be a
 * lie — `pruneJobs` deliberately keeps the newest few so a failed download can
 * be retried, so that space is not free unless something actually gives it up.
 * Here the newest archive is the one worth keeping, so older ones are dropped
 * only as far as the new build actually requires.
 *
 * A volume whose free space can't be read (`statfs` unsupported) is allowed
 * through: refusing every export on a platform that simply won't answer the
 * question would be worse than letting the build fail on ENOSPC.
 */
export async function ensureSpace(
  needed: number,
): Promise<{ ok: boolean; free: number }> {
  let free = await freeBytes();
  if (free === null) return { ok: true, free: 0 };
  if (free >= needed) return { ok: true, free };

  const reclaimable = (await listJobs())
    .filter((j) => j.state === "ready")
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));

  for (const job of reclaimable) {
    await removeJob(job.id);
    free = (await freeBytes()) ?? free;
    if (free >= needed) return { ok: true, free };
  }
  return { ok: false, free };
}

export const openArchive = (id: string) => createWriteStream(partialPath(id));

/** Promote a completed build to its final, servable name. */
export async function sealArchive(id: string): Promise<number> {
  await rename(partialPath(id), archivePath(id));
  return (await stat(archivePath(id))).size;
}
