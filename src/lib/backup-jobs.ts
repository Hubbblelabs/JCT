import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import {
  chmod,
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
import { autoKeepCount } from "@/lib/backup-schedule";

/**
 * Backups are built to disk first, then downloaded as an ordinary file.
 *
 * The previous design archived straight into the HTTP response, which coupled
 * two things that have no business being coupled: how fast storage can be read, and
 * how fast the operator's browser drains a socket. Every object was fetched,
 * zipped and pushed one at a time, gated by the slower of the two — so a 7.5 GB
 * export ran for hours on a link that could have carried it in minutes, could
 * not report real progress (the size is unknown until the last byte), and could
 * not be resumed if the tab was closed at 90%.
 *
 * Splitting it in two fixes all of that. The build phase has no client attached,
 * so it reads storage with real concurrency at full server bandwidth. The serve phase
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

/**
 * Who asked for the archive. Retention treats the two differently — see
 * `pruneJobs` — because a manual export is downloaded within the hour and an
 * automatic one exists precisely so it is still there weeks later.
 */
export type BackupOrigin = "manual" | "auto";

export interface BackupJobReport {
  assets_expected: number;
  assets_archived: number;
  unreadable: string[];
}

export interface BackupJob {
  id: string;
  state: BackupJobState;
  origin: BackupOrigin;
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
  // Archives written before automatic backups existed carry no `origin`. They
  // were all admin-triggered, so reading a missing one as "manual" keeps them
  // under the retention rules they were created under.
  const hydrated: BackupJob = { ...job, origin: job.origin ?? "manual" };
  if (hydrated.state !== "building" || live.has(hydrated.id)) return hydrated;
  return {
    ...hydrated,
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
  // A sweep armed for this archive has nothing left to do — and would run a
  // full prune for no reason. `sweeps` is declared below; this only reads it
  // at call time, long after module evaluation.
  const pending = sweeps.get(id);
  if (pending) {
    clearTimeout(pending);
    sweeps.delete(id);
  }
  await Promise.all([
    rm(archivePath(id), { force: true }),
    rm(partialPath(id), { force: true }),
  ]).catch((err) => console.error(`[backup-jobs] Cleanup of ${id}:`, err));
  await writeIndex((await readIndex()).filter((j) => j.id !== id));
}

/**
 * Retention. Three rules, in the order they matter:
 *
 *   1. Only the newest archive is kept. A backup is an explicit admin action,
 *      and the one they just built is the one they want.
 *   2. A superseded archive is not removed until it is at least MIN_AGE old.
 *      Downloading 7.5 GB over a campus link takes a while, and the operator
 *      may well kick off a second export while the first is still coming down
 *      — deleting it out from under them would fail the transfer with no
 *      explanation. This grace window is the whole reason a second archive can
 *      exist at all.
 *   3. Nothing survives MAX_AGE, superseded or not. Without this backstop a
 *      single archive would sit on the volume forever, because rule 1 only
 *      fires when a *replacement* exists.
 *
 * Automatic archives are the exception to rules 1 and 3, and for the same
 * reason: nobody is watching when they are built. Keeping one would mean a
 * scheduled backup that silently overwrites the only copy of last night's
 * good data with tonight's copy of a database somebody just broke, and
 * expiring them at 24 hours would leave a weekly schedule with nothing to
 * restore for six days out of seven. So they are bounded by *count* only —
 * the admin-set `keep` — and never by age. A failed one still ages out at
 * MAX_AGE: it holds no archive, only the record of why it failed.
 */
const KEEP_ARCHIVES = 1;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const MIN_AGE_MS = 3 * 60 * 60 * 1000;

/**
 * Pending re-sweeps for archives that rule 2 spared, keyed by job id.
 *
 * Without these an archive superseded at 20 minutes old would linger until
 * something else happened to call `pruneJobs` — and since backups are
 * admin-triggered, "something else" might be next month. The timer closes that
 * gap without introducing a cron.
 *
 * `unref()` so a pending sweep can never hold the process open, and one timer
 * per id so repeated prunes don't stack. A restart drops them, which is why
 * the route also prunes on the job-list GET.
 */
const sweeps = new Map<string, NodeJS.Timeout>();

function scheduleSweep(id: string, delay: number): void {
  if (sweeps.has(id)) return;
  const timer = setTimeout(
    () => {
      sweeps.delete(id);
      void pruneJobs().catch((err) =>
        console.error("[backup-jobs] Scheduled prune failed:", err),
      );
    },
    Math.max(delay, 1_000),
  );
  timer.unref?.();
  sweeps.set(id, timer);
}

export async function pruneJobs(): Promise<void> {
  const jobs = await listJobs();
  const now = Date.now();
  const keepAuto = await autoKeepCount();
  // Counted separately: an admin export must not push a scheduled archive out
  // of its retention window, nor be pushed out by one.
  const kept: Record<BackupOrigin, number> = { manual: 0, auto: 0 };
  for (const job of jobs) {
    if (job.state === "building" && live.has(job.id)) continue;
    const age = now - new Date(job.created_at).getTime();
    const auto = job.origin === "auto";
    const stale = age > MAX_AGE_MS && !(auto && job.state === "ready");
    // Only *ready* jobs count against the keep limit. A failed one holds no
    // archive worth space, and its index entry is the only record of why the
    // export failed — so it survives until it ages out rather than being swept
    // away the moment the operator retries.
    //
    // The age test comes last so the counter still advances for every ready
    // job: an archive spared by the grace window has still been counted, and
    // the one after it is correctly seen as surplus too.
    let superseded = false;
    if (job.state === "ready") {
      const seen = ++kept[job.origin];
      superseded = seen > (auto ? keepAuto : KEEP_ARCHIVES);
    }
    const surplus = superseded && age >= MIN_AGE_MS;

    if (stale || surplus) {
      await removeJob(job.id);
    } else if (superseded) {
      scheduleSweep(job.id, MIN_AGE_MS - age);
    }
  }
}

export const deleteJob = removeJob;

/**
 * Prove `BACKUP_DIR` is writable by creating and removing a file in it.
 *
 * `access(dir, W_OK)` is the obvious check and the wrong one: it answers from
 * the permission bits, which is not the same question as "will a write
 * succeed" on a read-only mount, a full filesystem, or an overlay with an
 * upper layer that refuses. The archive is written with `createWriteStream`,
 * so the probe writes too.
 */
async function probeWritable(dir: string): Promise<void> {
  const probe = path.join(dir, ".write-probe");
  await writeFile(probe, "");
  await rm(probe, { force: true });
}

/**
 * Make `BACKUP_DIR` usable, repairing what this process has the authority to
 * repair. Returns null on success, or a message for the operator.
 *
 * Called at the start of an export because nothing downstream degrades
 * gracefully: `mkdir -p` on an existing path succeeds whatever its mode, so an
 * unwritable directory is not noticed until the first write — the index save
 * logs `EACCES` and is swallowed as non-fatal, then the build dies partway
 * through on the archive file itself, minutes in, with a raw errno the admin UI
 * cannot explain.
 *
 * Three repairs, in order of how much authority they need:
 *
 *   1. Create the directory. Enough on any host where only the leaf is missing.
 *   2. `chmod 0700`. Fixes a directory this user *owns* but cannot write —
 *      a too-strict umask, or a mode tightened by hand.
 *   3. Nothing. If the directory belongs to another user, `chmod` needs to be
 *      that user (or root) and returns EPERM. In Docker that is the common
 *      case: the container runs as `node` (uid 1000) and the bind mount carries
 *      the *host's* ownership, so a directory created by root on the host stays
 *      root's — and no amount of trying from inside the container changes it.
 *
 * There is deliberately no fallback to a writable directory elsewhere. An
 * archive is several gigabytes; putting it on the container's own filesystem
 * would fill the overlay and be discarded on the next rebuild, which looks like
 * success and is worse than refusing.
 */
export async function ensureBackupDirWritable(): Promise<string | null> {
  const dir = backupDir();

  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code ?? "unknown error";
    return `The backup directory ${dir} could not be created (${code}). Create it on the host and make it writable by the app, or point BACKUP_DIR somewhere the app can write.`;
  }

  try {
    await probeWritable(dir);
    return null;
  } catch {
    // Fall through to the repair attempt — the reason is only worth reporting
    // if the repair also fails, and by then it is the *second* error that says
    // what the operator has to do.
  }

  try {
    // 0700, not 0777: the archive contains every credential-adjacent value in
    // the site config, so widening it to other local users to dodge a
    // permissions error would trade a visible failure for a quiet leak.
    await chmod(dir, 0o700);
    await probeWritable(dir);
    console.warn(`[backup-jobs] Repaired permissions on ${dir}`);
    return null;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code ?? "unknown error";
    const owner =
      typeof process.getuid === "function"
        ? ` The app runs as uid ${process.getuid()}.`
        : "";
    return `The backup directory ${dir} is not writable by the app and its permissions could not be repaired automatically (${code}) — it belongs to another user, so only that user or root can change it.${owner} In Docker this directory is a bind mount and keeps the host's ownership: run \`chown -R 1000:1000 /srv/jct/backups\` on the host (adjust the path if BACKUP_DIR was remapped), then try again.`;
  }
}

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
 * lie — `pruneJobs` deliberately keeps the newest one so a failed download can
 * be retried, so that space is not free unless something actually gives it up.
 *
 * The MIN_AGE grace outranks disk pressure. An archive younger than that may
 * still be downloading, and silently deleting it to make room for the next
 * export trades a transfer the operator is watching for one they have not
 * started yet — a strictly worse outcome, and the exact failure the grace
 * window exists to prevent. `withheldYoung` reports that this happened so the
 * caller can say *why* the export was refused; "not enough disk space" alone
 * is baffling on a server that visibly holds an archive it could delete.
 *
 * A volume whose free space can't be read (`statfs` unsupported) is allowed
 * through: refusing every export on a platform that simply won't answer the
 * question would be worse than letting the build fail on ENOSPC.
 */
export async function ensureSpace(
  needed: number,
): Promise<{ ok: boolean; free: number; withheldYoung: boolean }> {
  let free = await freeBytes();
  if (free === null) return { ok: true, free: 0, withheldYoung: false };
  if (free >= needed) return { ok: true, free, withheldYoung: false };

  const now = Date.now();
  const ready = (await listJobs())
    .filter((j) => j.state === "ready")
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));

  // The newest archive is never reclaimed, even under disk pressure. Freeing
  // it would leave the server with no restorable copy at all, in exchange for
  // starting an export that has not finished yet and may itself fail — trading
  // a backup that exists for one that might.
  const newest = ready[ready.length - 1];
  const candidates = ready.filter((j) => j.id !== newest?.id);
  const reclaimable = candidates.filter(
    (j) => now - new Date(j.created_at).getTime() >= MIN_AGE_MS,
  );
  // Compared against `candidates`, not `ready`: the newest archive is held
  // back by the rule above, not by the grace window, and reporting it as
  // "too young" would send the operator off to wait three hours for nothing.
  const withheldYoung = reclaimable.length < candidates.length;

  for (const job of reclaimable) {
    await removeJob(job.id);
    free = (await freeBytes()) ?? free;
    if (free >= needed) return { ok: true, free, withheldYoung };
  }
  return { ok: false, free, withheldYoung };
}

export const openArchive = (id: string) => createWriteStream(partialPath(id));

/** Promote a completed build to its final, servable name. */
export async function sealArchive(id: string): Promise<number> {
  await rename(partialPath(id), archivePath(id));
  return (await stat(archivePath(id))).size;
}
