#!/usr/bin/env node
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

function usage() {
  console.log(
    "Usage: node scripts/seed-admin.js --email EMAIL --password PASSWORD [--name 'Full Name']",
  );
  process.exit(1);
}

function parseArgs() {
  const args = {};
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (a === "--email" || a === "-e") args.email = raw[++i];
    else if (a === "--password" || a === "-p") args.password = raw[++i];
    else if (a === "--name" || a === "-n") args.name = raw[++i];
  }
  return args;
}

const { email, password, name } = parseArgs();
const fullName = name || "Admin User";
const uri = process.env.MONGODB_URI;

if (!email || !password) usage();
if (String(password).length < 8) {
  // Match the API's zPasswordMin8 policy so seeded accounts aren't weaker
  // than ones created through the admin UI.
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}
if (!uri) {
  console.error("Environment variable MONGODB_URI is required.");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(uri, { dbName: undefined });
    const users = mongoose.connection.db.collection("users");

    const emailLower = String(email).toLowerCase();
    const password_hash = await bcrypt.hash(String(password), 12);
    const now = new Date();

    const update = {
      $set: {
        password_hash,
        full_name: fullName,
        role: "admin",
        institution: "all",
        is_active: true,
        updated_at: now,
      },
      $setOnInsert: {
        email: emailLower,
        programs: [],
        last_login: null,
        created_at: now,
      },
    };

    const result = await users.updateOne({ email: emailLower }, update, {
      upsert: true,
    });
    if (result.upsertedCount && result.upsertedCount > 0) {
      console.log(`Created admin user ${emailLower}`);
    } else {
      console.log(`Updated existing user ${emailLower}`);
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 2;
  } finally {
    await mongoose.disconnect();
  }
}

main();
