import { z } from "zod";

/**
 * The automatic-backup schedule, as the admin panel sends it.
 *
 * Every field is required: this is a whole-form PUT, not a patch, so an
 * omitted key can only mean the client is out of date — and silently filling
 * it with a default is how a schedule ends up running at a time nobody chose.
 * (It also keeps the schema free of `.default()`, which Zod 4 would otherwise
 * inject on a `.partial()` later.)
 */

export const BACKUP_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

/** Ceiling on retained automatic archives. A full export is several GB, so
 * this is a disk-space guard, not a UI nicety. */
export const MAX_BACKUP_KEEP = 10;

/** Rejects anything `Intl` won't accept, so the scheduler can't be handed a
 * zone that makes every next-run calculation throw. */
const zTimezone = z
  .string()
  .min(1)
  .max(64)
  .refine((tz) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, "Unknown time zone");

export const BackupScheduleSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(BACKUP_FREQUENCIES),
  timezone: zTimezone,
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  /** 0 = Sunday. Only read when `frequency` is "weekly". */
  weekday: z.number().int().min(0).max(6),
  /**
   * Only read when `frequency` is "monthly". Capped at 28 rather than 31 so
   * the run cannot silently skip February — a "31st" schedule would fire
   * seven times a year and look broken the rest of the time.
   */
  day_of_month: z.number().int().min(1).max(28),
  include_images: z.boolean(),
  include_docs: z.boolean(),
  keep: z.number().int().min(1).max(MAX_BACKUP_KEEP),
});

export type BackupScheduleInput = z.infer<typeof BackupScheduleSchema>;
