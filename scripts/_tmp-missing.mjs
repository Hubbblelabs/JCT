import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uri = fs
  .readFileSync(path.join(__dirname, "..", ".env"), "utf8")
  .match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");
await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
const docs = await mongoose.connection.db
  .collection("placements")
  .find({})
  .toArray();
const missing = new Set();
for (const d of docs)
  for (const r of d.top_recruiters ?? [])
    if (r.name && !r.logo) missing.add(r.name);
const list = [...missing].sort();
console.log("MISSING COUNT:", list.length);
fs.writeFileSync(
  path.join(__dirname, "_tmp-missing.json"),
  JSON.stringify(list, null, 2),
);
console.log(list.join("\n"));
await mongoose.disconnect();
