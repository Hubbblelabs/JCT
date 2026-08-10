import { NextRequest } from "next/server";
import {
  requireRole,
  json,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { planBackup, writeBackupArchive } from "@/lib/backup-archive";
import {
  activeBuild,
  createJob,
  deleteJob,
  ensureSpace,
  finishJob,
  getJob,
  listJobs,
  openArchive,
  partialPath,
  pruneJobs,
  sealArchive,
  updateProgress,
} from "@/lib/backup-jobs";
import { rm } from "fs/promises";

/**
 * Backup export, staged: build to disk, then download the file.
 *
 * - `GET  ?probe=1`      — what an export would contain, without building it.
 * - `POST`               — start a build; returns a job id immediately.
 * - `GET  ?jobId=<id>`   — that job's state and progress.
 * - `GET`                — every job the server still holds.
 * - `DELETE ?jobId=<id>` — drop an archive and free its disk.
 *
 * The bytes themselves come from `backup/file`, which serves the finished
 * archive as an ordinary ranged file download. See `src/lib/backup-jobs.ts`
 * for why the build and the download are separated at all, and for the
 * retention rules — only the newest archive is kept, a superseded one is not
 * removed until it is 3 hours old, and nothing outlives 24 hours. `pruneJobs`
 * is called from three places here: before a build (clear what has aged out
 * before checking disk), after one seals (retire what it replaces), and on the
 * job list (recover the sweep after a restart).
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
 * Read from the *plan*, not from the query string. `planBackup` turns asset
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

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  if (jobId) {
    const job = await getJob(jobId);
    return job ? json(job) : notFound("No such backup job");
  }

  if (url.searchParams.get("probe") === "1") {
    try {
      const plan = await planBackup({
        wantImages: url.searchParams.get("includeImages") === "1",
        wantDocs: url.searchParams.get("includeDocs") === "1",
      });
      return json({
        config_entries: plan.configs.length,
        asset_files: plan.objects.length,
        asset_bytes: plan.assetBytes,
        assets_unavailable: plan.assetsUnavailable || undefined,
      });
    } catch (e) {
      console.error("[site-config/backup] probe:", e);
      return serverError();
    }
  }

  // Retention normally advances when a new backup is built or when a timer
  // armed by `pruneJobs` fires. A restart drops those timers, so the job list
  // — which the Settings page reaches — doubles as a recovery trigger. Not on
  // the `?jobId=` branch above: that one is polled every 1.5s during a build.
  await pruneJobs().catch((e) =>
    console.error("[site-config/backup] prune on list:", e),
  );
  return json({ jobs: await listJobs() });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const busy = activeBuild();
  if (busy) {
    // Two concurrent builds would compete for the same bandwidth and disk and
    // neither would finish sooner, so the caller is pointed at the live one.
    return json({ error: "A backup is already being built", job: busy }, 409);
  }

  const url = new URL(req.url);
  const wantImages = url.searchParams.get("includeImages") === "1";
  const wantDocs = url.searchParams.get("includeDocs") === "1";

  // Everything that can fail with a real status code happens before the job
  // exists — once it does, failures can only be reported through its state.
  let plan;
  try {
    await pruneJobs();
    plan = await planBackup({ wantImages, wantDocs });
  } catch (e) {
    console.error("[site-config/backup] plan:", e);
    return serverError("Could not read the data to back up");
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
    return badRequest(
      `Not enough disk space to build this backup — it needs about ${Math.ceil(needed / 1e9)} GB and only ${Math.floor(space.free / 1e9)} GB is free, even after removing older archives.${protectedNote} Free space on the server, or point BACKUP_DIR at a larger volume.`,
    );
  }

  const exportedAt = new Date().toISOString();
  const exportedBy = session!.user?.email ?? "";
  const job = await createJob({
    filename: `jct-backup-${exportedAt.slice(0, 10)}-${archiveScope(plan)}.zip`,
    expected_bytes: plan.assetBytes,
    entries_total: plan.objects.length,
    config_entries: plan.configs.length,
    asset_files: plan.objects.length,
    assets_unavailable: plan.assetsUnavailable || undefined,
  });

  await logAudit(
    "site-config",
    "exported",
    exportedBy,
    `Started backup build: ${plan.configs.length} config entries, ${plan.objects.length} asset files`,
  );

  // Deliberately not awaited: the build runs for minutes and the caller polls
  // for its state. Nothing downstream depends on the response, so a rejection
  // here is recorded on the job rather than thrown into the request.
  void (async () => {
    const out = openArchive(job.id);
    try {
      const report = await writeBackupArchive(
        plan,
        out,
        { exportedAt, exportedBy },
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
        console.error("[site-config/backup] prune after seal:", e),
      );
    } catch (err) {
      console.error(`[backup] ${job.id} failed:`, err);
      out.destroy();
      // The partial file must not survive: only the sealed name is servable,
      // but a stray .part would still occupy the disk indefinitely.
      await rm(partialPath(job.id), { force: true }).catch(() => {});
      await finishJob(job.id, {
        state: "failed",
        error: err instanceof Error ? err.message : "Backup build failed",
      });
    }
  })();

  return json(job, 202);
}

export async function DELETE(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const jobId = new URL(req.url).searchParams.get("jobId");
  if (!jobId) return badRequest("jobId is required");
  const job = await getJob(jobId);
  if (!job) return notFound("No such backup job");
  if (job.state === "building" && activeBuild()?.id === jobId) {
    return badRequest("That backup is still being built");
  }

  await deleteJob(jobId);
  await logAudit(
    "site-config",
    "deleted",
    session!.user?.email ?? "",
    `Deleted backup archive ${jobId}`,
  );
  return json({ deleted: true });
}
