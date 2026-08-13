import { NextRequest } from "next/server";
import {
  requireRole,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { getSchedule, saveSchedule } from "@/lib/backup-schedule";
import { BackupScheduleSchema } from "@/lib/validation";

/**
 * The automatic-backup schedule.
 *
 * - `GET` — the current settings plus when it next fires and how the last run
 *   went.
 * - `PUT` — replace the settings. The whole form is sent, not a patch, so the
 *   next firing can be re-derived from scratch rather than merged.
 *
 * Admin-only, like everything else on the Settings page: the schedule decides
 * how much disk the server gives up and how far back a restore can reach.
 */

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    return json(await getSchedule());
  } catch (e) {
    console.error("[backup/schedule] GET:", e);
    return serverError("Could not read the backup schedule");
  }
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const parsed = await validateBody(req, BackupScheduleSchema);
  if (!parsed.ok) return parsed.response;

  const actor = session!.user?.email ?? "";
  try {
    const saved = await saveSchedule(parsed.data, actor);
    await logAudit(
      "site-config",
      "updated",
      actor,
      saved.enabled
        ? `Automatic backups ${saved.frequency} at ${String(saved.hour).padStart(2, "0")}:${String(saved.minute).padStart(2, "0")} ${saved.timezone}, keeping ${saved.keep}`
        : "Automatic backups disabled",
    );
    return json(saved);
  } catch (e) {
    console.error("[backup/schedule] PUT:", e);
    return serverError("Could not save the backup schedule");
  }
}
