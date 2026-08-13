import { NextRequest } from "next/server";
import {
  requireRole,
  json,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { planBackup } from "@/lib/backup-archive";
import { startBackupBuild } from "@/lib/backup-run";
import {
  activeBuild,
  deleteJob,
  getJob,
  listJobs,
  pruneJobs,
} from "@/lib/backup-jobs";

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
 * archive as an ordinary ranged file download. The build itself lives in
 * `src/lib/backup-run.ts` because the automatic-backup scheduler starts the
 * identical export with no request behind it. See `src/lib/backup-jobs.ts`
 * for why the build and the download are separated at all, and for the
 * retention rules — one manual archive, `keep` automatic ones, a superseded
 * archive is not removed until it is 3 hours old, and no *manual* one outlives
 * 24 hours. `pruneJobs` is called from three places: before a build and after
 * one seals (both in `backup-run`), and on the job list here (recover the
 * sweep after a restart).
 */

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

  const url = new URL(req.url);
  const started = await startBackupBuild({
    wantImages: url.searchParams.get("includeImages") === "1",
    wantDocs: url.searchParams.get("includeDocs") === "1",
    origin: "manual",
    actor: session!.user?.email ?? "",
  });

  if (!started.ok) {
    // The caller is pointed at the live build rather than told to try again:
    // it is very often their own, started in another tab.
    if (started.reason === "busy") {
      return json({ error: started.message, job: started.job }, 409);
    }
    if (started.reason === "plan") return serverError(started.message);
    return badRequest(started.message);
  }

  // `started.done` is intentionally left unawaited — the build runs for
  // minutes and the browser polls `?jobId=` for its state. Its rejection path
  // is already handled inside `startBackupBuild`, which records the failure on
  // the job.
  return json(started.job, 202);
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
