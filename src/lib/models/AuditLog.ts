import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  entity_type: string;
  action: string;
  user_email: string;
  summary: string;
  created_at: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    entity_type: { type: String, required: true },
    action: { type: String, required: true },
    user_email: { type: String, required: true },
    summary: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

AuditLogSchema.index({ entity_type: 1 });
AuditLogSchema.index({ created_at: -1 });

export const AuditLog =
  mongoose.models.AuditLog ??
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
