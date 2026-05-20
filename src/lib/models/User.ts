import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  role: "viewer" | "editor" | "admin" | "super_admin";
  institution: string;
  programs: string[];
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    role: {
      type: String,
      enum: ["viewer", "editor", "admin", "super_admin"],
      default: "editor",
    },
    institution: { type: String, default: "all" },
    programs: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    last_login: Date,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const User =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
