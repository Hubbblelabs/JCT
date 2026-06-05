import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  role: "admin" | "editor";
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
    // select:false — never returned by queries unless explicitly requested
    // with .select("+password_hash") (see auth.ts). Stops a future
    // User.find() from leaking the hash by omission.
    password_hash: { type: String, required: true, select: false },
    full_name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor"],
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
