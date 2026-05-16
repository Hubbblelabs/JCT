#!/usr/bin/env node
/**
 * Create the first super admin user.
 * Usage: node scripts/create-admin.mjs <email> <password> "<full name>"
 * Example: node scripts/create-admin.mjs admin@jct.ac.in secret123 "JCT Admin"
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [, , email, password, fullName] = process.argv;

if (!email || !password || !fullName) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> \"<full name>\"");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

await mongoose.connect(uri);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  role: { type: String, default: "super_admin" },
  institution: { type: String, default: "all" },
  departments: { type: [String], default: [] },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

const existing = await User.findOne({ email: email.toLowerCase() });
if (existing) {
  console.log(`User ${email} already exists.`);
  await mongoose.disconnect();
  process.exit(0);
}

const password_hash = await bcrypt.hash(password, 12);
await User.create({
  email: email.toLowerCase(),
  password_hash,
  full_name: fullName,
  role: "super_admin",
  institution: "all",
  departments: [],
});

console.log(`✓ Super admin created: ${email}`);
await mongoose.disconnect();
