import mongoose, { Schema, Document } from "mongoose";

/**
 * The automatic-backup schedule. Exactly one document, pinned by a unique
 * `key`, so an upsert can never race two rows into existence.
 *
 * It is a collection of its own rather than a `SiteConfig` key on purpose:
 * `POST /api/admin/site-config/reset` deletes *every* SiteConfig document, and
 * a reset is precisely the moment you least want the thing that makes backups
 * to quietly switch itself off. It is also excluded from `BACKUP_COLLECTIONS`,
 * so restoring last month's archive doesn't reinstate last month's schedule
 * over the one running now.
 */

export type BackupFrequency = "daily" | "weekly" | "monthly";
export type BackupRunOutcome = "ready" | "failed";

export interface IBackupSchedule extends Document {
  key: string;
  enabled: boolean;
  frequency: BackupFrequency;
  /** IANA zone the wall-clock fields below are read in. */
  timezone: string;
  hour: number;
  minute: number;
  /** Weekly only. 0 = Sunday, in `timezone`. */
  weekday: number;
  /** Monthly only. Capped at 28 so every month has the day. */
  day_of_month: number;
  include_images: boolean;
  include_docs: boolean;
  /** How many automatic archives to keep on disk. */
  keep: number;
  next_run_at?: Date;
  last_run_at?: Date;
  last_status?: BackupRunOutcome;
  last_job_id?: string;
  last_error?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

const BackupScheduleSchema = new Schema<IBackupSchedule>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    enabled: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    timezone: { type: String, default: "Asia/Kolkata" },
    hour: { type: Number, default: 2 },
    minute: { type: Number, default: 0 },
    weekday: { type: Number, default: 0 },
    day_of_month: { type: Number, default: 1 },
    include_images: { type: Boolean, default: true },
    include_docs: { type: Boolean, default: true },
    keep: { type: Number, default: 2 },
    next_run_at: Date,
    last_run_at: Date,
    last_status: { type: String, enum: ["ready", "failed"] },
    last_job_id: String,
    last_error: String,
    updated_by: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const BackupSchedule =
  mongoose.models.BackupSchedule ??
  mongoose.model<IBackupSchedule>("BackupSchedule", BackupScheduleSchema);
