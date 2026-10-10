// Server-only storage and auth. Content lives in DATA_DIR/db.json, uploads in DATA_DIR/uploads.
// In Docker, mount a volume at DATA_DIR so both survive redeploys.
import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { FeedItem } from "./api";
import { withAboutDefaults, type AboutContent } from "./about";
import type { Audit } from "./audits";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
// Bundled starter content (the Jaipur Kurti audit and its images), used until you change it.
export const SEED_DIR = path.join(process.cwd(), "seed");
const DB_FILE = path.join(DATA_DIR, "db.json");

type Db = { audits: Audit[]; feed: FeedItem[]; about?: Partial<AboutContent> };

export function readDb(): Db {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const seed = path.join(SEED_DIR, "db.json");
    if (fs.existsSync(seed)) fs.copyFileSync(seed, DB_FILE);
    else fs.writeFileSync(DB_FILE, JSON.stringify({ audits: [], feed: [] }));
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  return { audits: db.audits ?? [], feed: db.feed ?? [], about: db.about };
}

export function writeDb(db: Db) {
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export const getAudits = async () => readDb().audits;
export const getAudit = async (slug: string) => readDb().audits.find((a) => a.slug === slug);
export const getAbout = async () => withAboutDefaults(readDb().about);
export const getFeed = async () => readDb().feed.filter((f) => f.published !== false);

// ---- Auth: one hardcoded admin from env, stateless signed token "<expiry>.<hmac>" ----
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Reeveri@2026";
const SECRET = process.env.TOKEN_SECRET || "reeveri-dev-secret-change-me";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const sign = (exp: string | number) => crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex");
const hash = (v: unknown) => crypto.createHash("sha256").update(String(v)).digest();

export const checkLogin = (user: unknown, pass: unknown) =>
  crypto.timingSafeEqual(hash(user), hash(ADMIN_USER)) && crypto.timingSafeEqual(hash(pass), hash(ADMIN_PASS));

export function makeToken() {
  const exp = Date.now() + TOKEN_TTL_MS;
  return `${exp}.${sign(exp)}`;
}

export function isAuthed(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const unauthorized = () => Response.json({ error: "Unauthorized" }, { status: 401 });

export const slugify = (s: unknown) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
