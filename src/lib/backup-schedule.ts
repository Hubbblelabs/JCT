import { connectDB } from "@/lib/mongodb";
import { BackupSchedule } from "@/lib/models";
import type {
  BackupFrequency,
  BackupRunOutcome,
} from "@/lib/models/BackupSchedule";
import type { BackupScheduleInput } from "@/lib/validation/backupSchedule";

/**
 * Reading and writing the automatic-backup schedule, and working out when it
 * next fires.
 *
 * Deliberately free of any import from `backup-jobs` or `backup-run`:
 * `backup-jobs` reads the retention count from here while pruning, and a cycle
 * between the two would make the module graph order-dependent. Everything that
 * actually *runs* a backup lives in `backup-scheduler.ts`.
 */

export interface BackupScheduleState extends BackupScheduleInput {
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: BackupRunOutcome | null;
  last_job_id: string | null;
  last_error: string | null;
  updated_by: string | null;
}

/**
 * Off, but pre-filled with a sane run. The panel opens on a schedule an admin
 * can enable with one click rather than a blank form: 02:00 IST is well clear
 * of the working day, and assets are included because a database-only archive
 * cannot restore the site on its own (see the export card's warning).
 */
export const DEFAULT_SCHEDULE: BackupScheduleInput = {
  enabled: false,
  frequency: "daily",
  timezone: "Asia/Kolkata",
  hour: 2,
  minute: 0,
  weekday: 0,
  day_of_month: 1,
  include_images: true,
  include_docs: true,
  keep: 2,
};

/** Retention count used when the schedule can't be read (DB down mid-prune). */
const FALLBACK_KEEP = DEFAULT_SCHEDULE.keep;

/* ────────────────────────── time-zone arithmetic ────────────────────────── */

/**
 * `tz`'s offset from UTC at a given instant, in milliseconds.
 *
 * Derived by formatting the instant *in* that zone and reading the civil
 * fields back as if they were UTC — the difference between that and the real
 * instant is the offset. This is the only way to get a zone offset out of the
 * platform without pulling in a date library.
 */
function zoneOffsetMs(instant: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const at = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  // `hour` can format as 24 for midnight under hour12:false on some ICU
  // versions; %24 folds it back to the 0 the Date.UTC below expects.
  const asIfUtc = Date.UTC(
    at("year"),
    at("month") - 1,
    at("day"),
    at("hour") % 24,
    at("minute"),
    at("second"),
  );
  return asIfUtc - instant.getTime();
}

/** The instant at which `tz` reads the given wall-clock date and time. */
function zonedToUtc(
  y: number,
  m: number,
  d: number,
  hour: number,
  minute: number,
  tz: string,
): Date {
  const wall = Date.UTC(y, m - 1, d, hour, minute, 0, 0);
  // First pass uses the offset at the wrong instant (off by the offset
  // itself); the second corrects it. One refinement is enough everywhere
  // except inside a DST transition, and India — the default — has none.
  let ts = wall - zoneOffsetMs(new Date(wall), tz);
  ts = wall - zoneOffsetMs(new Date(ts), tz);
  return new Date(ts);
}

/** Civil date and weekday `tz` is showing at `instant`. */
function zonedParts(instant: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const at = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: Number(at("year")),
    month: Number(at("month")),
    day: Number(at("day")),
    weekday: Math.max(0, days.indexOf(at("weekday"))),
  };
}

/** Civil date `n` days after the given one, month/year rollover included. */
function addDays(y: number, m: number, d: number, n: number) {
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() + n);
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
  };
}

/**
 * The first firing strictly after `from`.
 *
 * "Strictly after" is what stops a run from re-triggering itself: the
 * scheduler writes this back after every run, and an inclusive comparison
 * would hand it the instant that just fired.
 *
 * Falls back to UTC if the stored zone is unknown — the schema rejects those
 * on the way in, but a zone can disappear from the platform's database between
 * writing and reading, and a schedule that runs an hour off is better than one
 * that throws on every tick and never runs at all.
 */
export function computeNextRun(
  schedule: Pick<
    BackupScheduleInput,
    "frequency" | "timezone" | "hour" | "minute" | "weekday" | "day_of_month"
  >,
  from: Date = new Date(),
): Date {
  let tz = schedule.timezone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
  } catch {
    console.error(`[backup-schedule] Unknown time zone ${tz}; using UTC`);
    tz = "UTC";
  }

  const now = zonedParts(from, tz);
  const at = (y: number, m: number, d: number) =>
    zonedToUtc(y, m, d, schedule.hour, schedule.minute, tz);

  if (schedule.frequency === "daily") {
    const today = at(now.year, now.month, now.day);
    if (today > from) return today;
    const next = addDays(now.year, now.month, now.day, 1);
    return at(next.year, next.month, next.day);
  }

  if (schedule.frequency === "weekly") {
    // Eight candidates, not seven: today may already be the target weekday
    // with its time gone, in which case the answer is the same weekday next
    // week — the eighth day out.
    for (let i = 0; i <= 7; i++) {
      const c = addDays(now.year, now.month, now.day, i);
      const when = at(c.year, c.month, c.day);
      if (when <= from) continue;
      if (zonedParts(when, tz).weekday === schedule.weekday) return when;
    }
    // Unreachable for a weekday in 0..6, which the schema guarantees.
    const fallback = addDays(now.year, now.month, now.day, 7);
    return at(fallback.year, fallback.month, fallback.day);
  }

  const thisMonth = at(now.year, now.month, schedule.day_of_month);
  if (thisMonth > from) return thisMonth;
  const y = now.month === 12 ? now.year + 1 : now.year;
  const m = now.month === 12 ? 1 : now.month + 1;
  return at(y, m, schedule.day_of_month);
}

/* ─────────────────────────────── persistence ────────────────────────────── */

type ScheduleDoc = Record<string, unknown> | null;

function toState(doc: ScheduleDoc): BackupScheduleState {
  const pick = <K extends keyof BackupScheduleInput>(
    key: K,
  ): BackupScheduleInput[K] => {
    const value = doc?.[key as string];
    return (
      value === undefined || value === null ? DEFAULT_SCHEDULE[key] : value
    ) as BackupScheduleInput[K];
  };
  const iso = (key: string) => {
    const value = doc?.[key];
    return value instanceof Date ? value.toISOString() : null;
  };
  const str = (key: string) => {
    const value = doc?.[key];
    return typeof value === "string" && value ? value : null;
  };

  return {
    enabled: pick("enabled"),
    frequency: pick("frequency"),
    timezone: pick("timezone"),
    hour: pick("hour"),
    minute: pick("minute"),
    weekday: pick("weekday"),
    day_of_month: pick("day_of_month"),
    include_images: pick("include_images"),
    include_docs: pick("include_docs"),
    keep: pick("keep"),
    next_run_at: iso("next_run_at"),
    last_run_at: iso("last_run_at"),
    last_status: str("last_status") as BackupRunOutcome | null,
    last_job_id: str("last_job_id"),
    last_error: str("last_error"),
    updated_by: str("updated_by"),
  };
}

/**
 * The stored schedule, or the defaults when none has been saved.
 *
 * Reading never creates the document. Nothing runs while `enabled` is false,
 * so an untouched deployment has no reason to hold a row — and the scheduler
 * polls this every minute, which would otherwise be an upsert per minute
 * forever.
 */
export async function getSchedule(): Promise<BackupScheduleState> {
  await connectDB();
  const doc = (await BackupSchedule.findOne({
    key: "default",
  }).lean()) as ScheduleDoc;
  return toState(doc);
}

/** Save the admin's settings and re-derive the next firing from them. */
export async function saveSchedule(
  input: BackupScheduleInput,
  actor: string,
): Promise<BackupScheduleState> {
  await connectDB();
  // Recomputed rather than carried over: every field it depends on may have
  // just changed, and a stale `next_run_at` is a run at the old time.
  const next = input.enabled ? computeNextRun(input) : null;
  const doc = (await BackupSchedule.findOneAndUpdate(
    { key: "default" },
    { $set: { ...input, next_run_at: next, updated_by: actor } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean()) as ScheduleDoc;
  return toState(doc);
}

/** Record the outcome of a run and arm the next one. */
export async function recordRun(
  outcome: { status: BackupRunOutcome; jobId?: string; error?: string },
  at: Date = new Date(),
): Promise<void> {
  await connectDB();
  const current = await getSchedule();
  await BackupSchedule.updateOne(
    { key: "default" },
    {
      $set: {
        last_run_at: at,
        last_status: outcome.status,
        last_job_id: outcome.jobId ?? "",
        last_error: outcome.error ?? "",
        // From `at`, not from the previous `next_run_at`: a build can run for
        // an hour, and scheduling the next one off the start time can leave it
        // already overdue the moment it is written.
        next_run_at: current.enabled ? computeNextRun(current, at) : null,
      },
    },
  );
}

/**
 * How many automatic archives retention should keep.
 *
 * Called from `pruneJobs`, which must not fail because Mongo blinked — a
 * throw there would abort the prune and leave disk unreclaimed, so an
 * unreadable schedule falls back to the default instead.
 */
export async function autoKeepCount(): Promise<number> {
  try {
    return (await getSchedule()).keep;
  } catch (err) {
    console.error("[backup-schedule] Could not read the retention count:", err);
    return FALLBACK_KEEP;
  }
}

export type { BackupFrequency, BackupRunOutcome };
