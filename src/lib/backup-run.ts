import { rm } from "fs/promises";
import { logAudit } from "@/lib/audit";
import { planBackup, writeBackupArchive } from "@/lib/backup-archive";
import {
  activeBuild,
  createJob,
  ensureBackupDirWritable,
  ensureSpace,
  finishJob,
  openArchive,
  partialPath,
  pruneJobs,
  sealArchive,
  updateProgress,
  type BackupJob,
  type BackupOrigin,
} from "@/lib/backup-jobs";

/**
 * Starting a backup build, independent of who asked for it.
 *
 * Lifted out of the route handler so the scheduler runs *exactly* the same
 * export an admin gets from the Settings page — same disk checks, same
 * retention, same audit trail. The alternative, a second copy of this
 * sequence inside the scheduler, is how the two drift until the automatic
 * backups quietly stop including something.
 */

/** Headroom over the asset total for config, collections and ZIP overhead. */
const DISK_SLACK_BYTES = 512 * 1024 * 1024;

/**
 * What the archive actually holds, for the filename.
 *
 * Several archives of the same site end up in one downloads folder, and until
 * one is opened they are indistinguishable — a database-only export and a
 * 7.5 GB full export differ only in size. Restoring the wrong one is silent:
 * merge mode writes the config and leaves every image reference dangling.
 *
 * Read from the *plan*, not from the request. `planBackup` turns asset
 * inclusion off when object storage is unconfigured, so a request that asked
 * for images can still produce an archive without them — and the name has to
 * describe the file, not the intent.
 */
function archiveScope(plan: { includeImages: boolean; includeDocs: boolean }) {
  if (plan.includeImages && plan.includeDocs) return "images-documents";
  if (plan.includeImages) return "images";
  if (plan.includeDocs) return "documents";
  return "db-only";
}

export type StartBackupResult =
  | {
      ok: true;
      job: BackupJob;
      /** Resolves when the build has finished, either way. Awaited by the
       * scheduler; ignored by the route, which returns 202 and lets the
       * browser poll. */
      done: Promise<BackupJob | null>;
    }
  | { ok: false; reason: "busy"; message: string; job: BackupJob }
  | { ok: false; reason: "dir" | "space" | "plan"; message: string };

export async function startBackupBuild(opts: {
  wantImages: boolean;
  wantDocs: boolean;
  origin: BackupOrigin;
  actor: string;
}): Promise<StartBackupResult> {
  const busy = activeBuild();
  if (busy) {
    // Two concurrent builds would compete for the same bandwidth and disk and
    // neither would finish sooner, so the caller is pointed at the live one.
    return {
      ok: false,
      reason: "busy",
      message: "A backup is already being built",
      job: busy,
    };
  }

  // Before the plan: creating the directory and fixing its mode is cheap, while
  // reading the whole asset list only to fail on the first write would waste
  // minutes and tell the operator nothing useful.
  const dirProblem = await ensureBackupDirWritable();
  if (dirProblem) return { ok: false, reason: "dir", message: dirProblem };

  let plan;
  try {
    await pruneJobs();
    plan = await planBackup({
      wantImages: opts.wantImages,
      wantDocs: opts.wantDocs,
    });
  } catch (e) {
    console.error("[backup-run] plan:", e);
    return {
      ok: false,
      reason: "plan",
      message: "Could not read the data to back up",
    };
  }

  // Filling the volume mid-build is far worse than refusing now: on a shared
  // disk it can take the app down with it. Old archives are given up first.
  const needed = plan.assetBytes + DISK_SLACK_BYTES;
  const space = await ensureSpace(needed);
  if (!space.ok) {
    // Naming the protected archive matters: without it the operator reads
    // "not enough disk" while looking at a server that plainly holds one it
    // could delete, and goes looking for a bug that isn't there.
    const protectedNote = space.withheldYoung
      ? " An existing archive was built less than 3 hours ago and is protected from automatic deletion, in case it is still being downloaded — wait for it to age out, or delete it yourself from Settings."
      : "";
    return {
      ok: false,
      reason: "space",
      message: `Not enough disk space to build this backup — it needs about ${Math.ceil(needed / 1e9)} GB and only ${Math.floor(space.free / 1e9)} GB is free, even after removing older archives.${protectedNote} Free space on the server, or point BACKUP_DIR at a larger volume.`,
    };
  }

  const exportedAt = new Date().toISOString();
  const prefix = opts.origin === "auto" ? "jct-auto-backup" : "jct-backup";
  const job = await createJob({
    filename: `${prefix}-${exportedAt.slice(0, 10)}-${archiveScope(plan)}.zip`,
    origin: opts.origin,
    expected_bytes: plan.assetBytes,
    entries_total: plan.objects.length,
    config_entries: plan.configs.length,
    asset_files: plan.objects.length,
    assets_unavailable: plan.assetsUnavailable || undefined,
  });

  await logAudit(
    "site-config",
    "exported",
    opts.actor,
    `Started ${opts.origin === "auto" ? "scheduled " : ""}backup build: ${plan.configs.length} config entries, ${plan.objects.length} asset files`,
  );

  // Deliberately not awaited here: the build runs for minutes and an HTTP
  // caller polls for its state. The promise is handed back so the scheduler —
  // which has no one to poll for it — can wait and record the outcome.
  const done = (async (): Promise<BackupJob | null> => {
    const out = openArchive(job.id);
    try {
      const report = await writeBackupArchive(
        plan,
        out,
        { exportedAt, exportedBy: opts.actor },
        (p) =>
          updateProgress(job.id, {
            bytes: p.bytes,
            entries_done: p.entriesDone,
            entries_total: p.entriesTotal,
          }),
      );
      const size = await sealArchive(job.id);
      await finishJob(job.id, { state: "ready", size, report });
      console.log(`[backup] ${job.id} ready — ${size} bytes`);
      // Retire the archive this one replaces, now that a replacement actually
      // exists. Pruning before the build (above) cannot do this: at that point
      // the old archive is still the newest one and rightly survives its own
      // prune. Doing it here also means a build that fails leaves the previous
      // backup intact rather than trading a good archive for nothing.
      await pruneJobs().catch((e) =>
        console.error("[backup-run] prune after seal:", e),
      );
      return { ...job, state: "ready", size };
    } catch (err) {
      console.error(`[backup] ${job.id} failed:`, err);
      out.destroy();
      // The partial file must not survive: only the sealed name is servable,
      // but a stray .part would still occupy the disk indefinitely.
      await rm(partialPath(job.id), { force: true }).catch(() => {});
      const message =
        err instanceof Error ? err.message : "Backup build failed";
      await finishJob(job.id, { state: "failed", error: message });
      return { ...job, state: "failed", error: message };
    }
  })().catch((err) => {
    // Nothing above is expected to reject — the catch handles the build and
    // the bookkeeping it calls swallows its own errors. This exists so that
    // if one ever does, an HTTP caller (which never awaits this promise) gets
    // a logged error rather than an unhandled rejection taking the process
    // down under Node's default policy.
    console.error(`[backup] ${job.id} bookkeeping failed:`, err);
    return null;
  });

  return { ok: true, job, done };
}
