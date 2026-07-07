#!/usr/bin/env node
/**
 * Fetch real company logos for recruiters that don't yet have one and upload
 * them to R2, then link the resulting storage key onto every matching
 * top_recruiters[] entry in the placements collection.
 *
 * Source: Google's favicon service (https://www.google.com/s2/favicons) returns
 * each company's real favicon / brand mark by domain. Clearbit's free logo API
 * was shut down, and logo.dev requires a paid token, so favicons are the most
 * reliable no-account source available. Quality varies with what each site
 * publishes; Google's generic globe fallback is detected and rejected so we
 * never store a placeholder as if it were a real logo.
 *
 * Only recruiters with an EMPTY logo are touched — the curated webp logos
 * already in the media library are left alone. Recruiters with no resolvable
 * domain keep their monogram tile on the public page (intentional, not broken).
 *
 * Logos are stored as ImageAssets with category "recruiter" and alt_text set to
 * the company name, so seed-placements.mjs can re-link them by name on a re-run
 * (see buildAssetResolvers there).
 *
 * Usage:
 *   node scripts/seed-recruiter-logos.mjs [--dry-run]
 * Requires MONGODB_URI + R2_* env (read from env, falling back to repo .env).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry-run") || process.argv.includes("-n");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  const out = { ...process.env };
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return out;
}

// Keyword (found in the recruiter name, lowercased) → the company's website
// domain. First match wins, so keep more specific keywords before generic ones.
// Only confidently-identifiable companies are listed; anything not here has no
// domain we can vouch for and is left as a monogram rather than guessed at.
const NAME_DOMAINS = [
  ["reliance", "ril.com"],
  ["24[7]", "247.ai"],
  ["aquasub", "texmopumps.com"],
  ["texmo", "texmopumps.com"],
  ["titan", "titan.co.in"],
  ["q spiders", "qspiders.com"],
  ["q-spider", "qspiders.com"],
  ["qspider", "qspiders.com"],
  ["tap academy", "thetapacademy.com"],
  ["arjuna natural", "arjunanatural.com"],
  ["episource", "episource.com"],
  ["quest global", "quest-global.com"],
  ["airtel", "airtel.in"],
  ["vvdn", "vvdntech.com"],
  ["teachnook", "teachnook.com"],
  ["siemens", "siemens.com"],
  ["pricol", "pricol.com"],
  ["manappuram", "manappuram.com"],
  ["kone", "kone.com"],
  ["kgisl", "kgisl.com"],
  ["tactive", "tactive.net"],
  ["wipro", "wipro.com"],
  ["hcl", "hcltech.com"],
  ["hdfc", "hdfcbank.com"],
  ["icici", "icicibank.com"],
  ["sutherland", "sutherlandglobal.com"],
  ["hinduja global", "teleperformance.com"],
  ["wns", "wns.com"],
  ["muthoot", "muthootfinance.com"],
  ["federal bank", "federalbank.co.in"],
  ["sundaram finance", "sundaramfinance.in"],
  ["sundaram auto", "sundaram-clayton.com"],
  ["just dial", "justdial.com"],
  ["justdial", "justdial.com"],
  ["byju", "byjus.com"],
  ["photon", "photon.com"],
  ["deloitte", "deloitte.com"],
  ["ford", "ford.com"],
  ["aspire systems", "aspiresystems.com"],
  ["bahwan", "bahwancybertek.com"],
  ["value labs", "valuelabs.com"],
  ["valuelabs", "valuelabs.com"],
  ["kaar", "kaartech.com"],
  ["payoda", "payoda.com"],
  ["movate", "movate.com"],
  ["startek", "startek.com"],
  ["athenahealth", "athenahealth.com"],
  ["vuram", "vuram.com"],
  ["iopex", "iopex.com"],
  ["congruent", "congruentsolutions.com"],
  ["apollo pharmacy", "apollopharmacy.in"],
  ["apollo tyres", "apollotyres.com"],
  ["amazon", "amazon.com"],
  ["nestle", "nestle.in"],
  ["bisleri", "bisleri.com"],
  ["ramco", "ramco.com"],
  ["vodafone", "vodafone.in"],
  ["nippon", "nipponpaint.co.in"],
  ["hatsun", "hatsun.com"],
  ["brakes india", "brakesindia.com"],
  ["larsen", "larsentoubro.com"],
  ["l&t", "larsentoubro.com"],
  ["chennai petroleum", "cpcl.co.in"],
  ["wheels india", "wheelsindia.com"],
  ["dow chemical", "dow.com"],
  ["valeo", "valeo.com"],
  ["manali petro", "manalipetro.com"],
  ["lulu group", "luluhypermarket.com"],
  ["6d technolog", "6dtech.co.in"],
  ["kod nest", "kodnest.com"],
  ["kodnest", "kodnest.com"],
  ["fraazo", "fraazo.com"],
  ["avasoft", "avasoft.com"],
  ["karvy", "karvy.com"],
  ["tvs credit", "tvscredit.com"],
  ["l.g.balakrishnan", "lgb.co.in"],
  ["peps industries", "pepsindia.com"],
  ["avalon", "avalontec.com"],
  ["tanfac", "tanfac.com"],
  ["sobha", "sobha.com"],
  ["shobha", "sobha.com"],
  ["barani hydraulics", "baranihydraulics.com"],
];

// Additional exact name → domain pairs discovered via web research, loaded from
// scripts/recruiter-domains.json ({ "<exact company name>": "<domain>" }). These
// take priority over the keyword map because they are matched to the exact name.
function loadResearchedDomains() {
  const p = path.join(__dirname, "recruiter-domains.json");
  if (!fs.existsSync(p)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v) out[String(k).toLowerCase().trim()] = String(v).trim();
    }
    return out;
  } catch {
    return {};
  }
}
const RESEARCHED = loadResearchedDomains();

function resolveDomain(name) {
  const n = String(name ?? "")
    .toLowerCase()
    .trim();
  if (RESEARCHED[n]) return RESEARCHED[n];
  for (const [kw, domain] of NAME_DOMAINS) if (n.includes(kw)) return domain;
  return null;
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// PNG IHDR: 8-byte signature + 4-byte length + "IHDR" + width(4) + height(4).
function pngSize(buf) {
  if (buf.length < 24 || buf[0] !== 0x89 || buf[1] !== 0x50) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

async function fetchBytes(url) {
  const res = await fetch(url, { redirect: "follow" });
  const buf = Buffer.from(await res.arrayBuffer());
  return { ok: res.ok, status: res.status, buf };
}

async function main() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("[seed-logos] MONGODB_URI is required (env or .env).");
    process.exit(1);
  }
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  } = env;
  if (
    !DRY &&
    (!R2_ACCOUNT_ID ||
      !R2_ACCESS_KEY_ID ||
      !R2_SECRET_ACCESS_KEY ||
      !R2_BUCKET_NAME)
  ) {
    console.error("[seed-logos] R2_* env vars are required to upload.");
    process.exit(1);
  }

  const s3 = DRY
    ? null
    : new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      });

  // Fingerprint Google's generic-globe fallback so we can reject it.
  let globeHash = "";
  try {
    const g = await fetchBytes(faviconUrl("no-such-domain-zzq7x9.invalid"));
    globeHash = crypto.createHash("md5").update(g.buf).digest("hex");
  } catch {
    /* if the probe fails we simply skip globe filtering */
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const placements = db.collection("placements");
  const imageassets = db.collection("imageassets");

  const docs = await placements.find({}).toArray();

  // Reuse recruiter logos already uploaded in a previous run (keyed by the
  // exact company name in alt_text) so re-runs never re-upload or duplicate.
  const existingByName = new Map();
  for (const a of await imageassets
    .find(
      { category: "recruiter" },
      { projection: { storage_key: 1, alt_text: 1 } },
    )
    .toArray()) {
    if (a.alt_text)
      existingByName.set(
        String(a.alt_text).toLowerCase().trim(),
        a.storage_key,
      );
  }

  // Distinct recruiter names that currently have no logo.
  const missing = new Map(); // name -> null
  for (const d of docs)
    for (const r of d.top_recruiters ?? [])
      if (r.name && !r.logo) missing.set(r.name, null);

  console.log(
    `[seed-logos] ${DRY ? "DRY-RUN — " : ""}${missing.size} distinct recruiter(s) without a logo.`,
  );

  const resolved = new Map(); // name -> storage_key
  const domainCache = new Map(); // domain -> storage_key (upload each logo once)
  const now = new Date();
  let uploaded = 0;
  const skippedNoDomain = [];
  const skippedFetch = [];

  let reusedExisting = 0;
  for (const name of missing.keys()) {
    // Reuse a logo already uploaded for this exact name in a prior run.
    const prior = existingByName.get(name.toLowerCase().trim());
    if (prior) {
      resolved.set(name, prior);
      reusedExisting++;
      continue;
    }
    const domain = resolveDomain(name);
    if (!domain) {
      skippedNoDomain.push(name);
      continue;
    }
    // Reuse a logo already fetched for this domain in this run.
    if (domainCache.has(domain)) {
      resolved.set(name, domainCache.get(domain));
      continue;
    }
    try {
      const { ok, status, buf } = await fetchBytes(faviconUrl(domain));
      const hash = crypto.createHash("md5").update(buf).digest("hex");
      const size = pngSize(buf);
      const isGlobe = globeHash && hash === globeHash;
      if (!ok || !size || isGlobe) {
        skippedFetch.push(
          `${name} (${domain}: status ${status}${isGlobe ? ", globe" : !size ? ", not-png" : ""})`,
        );
        continue;
      }
      const key = `images/${now.getTime()}-${crypto.randomBytes(3).toString("hex")}-${slugify(name)}.png`;
      console.log(
        `  ${DRY ? "[would upload]" : "[upload]"} ${name} → ${domain} (${size.width}x${size.height}, ${buf.length}b)`,
      );
      if (!DRY) {
        await s3.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buf,
            ContentType: "image/png",
          }),
        );
        await imageassets.insertOne({
          filename: key.split("/").pop(),
          storage_key: key,
          url: key,
          alt_text: name,
          category: "recruiter",
          institution: "all",
          file_size: buf.length,
          mime_type: "image/png",
          width: size.width,
          height: size.height,
          uploaded_by: "seed-logos-script",
          created_at: now,
        });
      }
      resolved.set(name, key);
      domainCache.set(domain, key);
      uploaded++;
    } catch (err) {
      skippedFetch.push(`${name} (${domain}: ${err.message})`);
    }
  }

  // Link resolved logos onto every matching empty-logo recruiter entry.
  let updatedDocs = 0;
  if (!DRY) {
    for (const d of docs) {
      let changed = false;
      const next = (d.top_recruiters ?? []).map((r) => {
        if (r.name && !r.logo && resolved.has(r.name)) {
          changed = true;
          return { ...r, logo: resolved.get(r.name) };
        }
        return r;
      });
      if (changed) {
        await placements.updateOne(
          { _id: d._id },
          { $set: { top_recruiters: next, updated_at: now } },
        );
        updatedDocs++;
      }
    }
  }

  console.log(
    `\n[seed-logos] Done. ${DRY ? 0 : uploaded} logo(s) uploaded, ${reusedExisting} reused from prior runs, ${updatedDocs} placement doc(s) updated.`,
  );
  console.log(
    `[seed-logos] ${skippedNoDomain.length} recruiter(s) had no known domain (kept as monogram).`,
  );
  if (skippedFetch.length)
    console.log(
      `[seed-logos] ${skippedFetch.length} fetch/quality skip(s):\n  - ${skippedFetch.join("\n  - ")}`,
    );
  if (skippedNoDomain.length)
    console.log(
      `[seed-logos] no-domain (monogram) list:\n  - ${skippedNoDomain.join("\n  - ")}`,
    );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-logos] FAILED:", err);
  process.exit(2);
});
