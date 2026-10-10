// Reeveri backend: Express + multer. Stores JSON in server/data/db.json and uploads in server/uploads.
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4000);
// Hardcoded admin login for now. Override with env vars when deploying.
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Reeveri@2026";
const SECRET = process.env.TOKEN_SECRET || "reeveri-dev-secret-change-me";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

// In Docker, mount one volume and point these at it so data survives redeploys.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
// First run on an empty volume: start from the bundled seed content.
const SEED_DB = path.join(__dirname, "data", "db.json");
const SEED_UPLOADS = path.join(__dirname, "uploads", "seed");
if (!fs.existsSync(DB_FILE)) {
  if (fs.existsSync(SEED_DB) && SEED_DB !== DB_FILE) fs.copyFileSync(SEED_DB, DB_FILE);
  else fs.writeFileSync(DB_FILE, JSON.stringify({ audits: [], feed: [] }, null, 2));
}
if (fs.existsSync(SEED_UPLOADS) && SEED_UPLOADS !== path.join(UPLOAD_DIR, "seed") && !fs.existsSync(path.join(UPLOAD_DIR, "seed"))) {
  fs.cpSync(SEED_UPLOADS, path.join(UPLOAD_DIR, "seed"), { recursive: true });
}

const readDb = () => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  db.audits ||= [];
  db.feed ||= [];
  return db;
};
const writeDb = (db) => {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
};

// Stateless signed token: "<expiry>.<hmac>"
const sign = (exp) => crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex");
const makeToken = () => {
  const exp = Date.now() + TOKEN_TTL_MS;
  return `${exp}.${sign(exp)}`;
};
const validToken = (t) => {
  if (typeof t !== "string") return false;
  const [exp, sig] = t.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const safeEq = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};
const requireAuth = (req, res, next) => {
  const t = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!validToken(t)) return res.status(401).json({ error: "Unauthorized" });
  next();
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "");
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image|video)\//.test(file.mimetype);
    cb(ok ? null : new Error("Only image and video files are allowed"), ok);
  },
});

const app = express();
// CORS_ORIGIN: comma-separated site origins, e.g. https://reeveri.com. Unset allows any origin.
const origins = (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors(origins.length ? { origin: origins } : undefined));
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!safeEq(username, ADMIN_USER) || !safeEq(password, ADMIN_PASS)) {
    return res.status(401).json({ error: "Wrong username or password" });
  }
  res.json({ token: makeToken() });
});
app.get("/api/me", requireAuth, (_req, res) => res.json({ ok: true }));

app.post("/api/upload", requireAuth, upload.array("files", 20), (req, res) => {
  const files = (req.files || []).map((f) => ({
    src: `/uploads/${f.filename}`,
    kind: f.mimetype.startsWith("video/") ? "video" : "image",
    name: f.originalname,
  }));
  res.json({ files });
});

// ---- Audits ----
app.get("/api/audits", (_req, res) => res.json(readDb().audits));
app.get("/api/audits/:slug", (req, res) => {
  const a = readDb().audits.find((x) => x.slug === req.params.slug);
  a ? res.json(a) : res.status(404).json({ error: "Not found" });
});
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
app.post("/api/audits", requireAuth, (req, res) => {
  const db = readDb();
  const audit = req.body || {};
  audit.slug = slugify(audit.slug || audit.brand);
  if (!audit.slug) return res.status(400).json({ error: "Brand or slug is required" });
  if (db.audits.some((a) => a.slug === audit.slug)) return res.status(409).json({ error: "Slug already exists" });
  db.audits.push(audit);
  writeDb(db);
  res.status(201).json(audit);
});
app.put("/api/audits/:slug", requireAuth, (req, res) => {
  const db = readDb();
  const i = db.audits.findIndex((a) => a.slug === req.params.slug);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  const audit = { ...req.body, slug: slugify(req.body.slug) || req.params.slug };
  if (audit.slug !== req.params.slug && db.audits.some((a) => a.slug === audit.slug)) {
    return res.status(409).json({ error: "Slug already exists" });
  }
  db.audits[i] = audit;
  writeDb(db);
  res.json(audit);
});
app.delete("/api/audits/:slug", requireAuth, (req, res) => {
  const db = readDb();
  db.audits = db.audits.filter((a) => a.slug !== req.params.slug);
  writeDb(db);
  res.json({ ok: true });
});

// ---- Feed (ad creatives: posters, reels, carousels) ----
// item: { id, type: poster|reel|carousel, title, caption, client, size: sm|tall|wide|big, media: [{src, kind}], poster, published, createdAt }
app.get("/api/feed", (req, res) => {
  const all = req.query.all === "1" && validToken((req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
  const feed = readDb().feed;
  res.json(all ? feed : feed.filter((f) => f.published !== false));
});
app.post("/api/feed", requireAuth, (req, res) => {
  const db = readDb();
  const item = { ...req.body, id: crypto.randomBytes(6).toString("hex"), createdAt: new Date().toISOString() };
  db.feed.unshift(item);
  writeDb(db);
  res.status(201).json(item);
});
app.put("/api/feed/reorder", requireAuth, (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const db = readDb();
  const byId = new Map(db.feed.map((f) => [f.id, f]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  const rest = db.feed.filter((f) => !ids.includes(f.id));
  db.feed = [...ordered, ...rest];
  writeDb(db);
  res.json(db.feed);
});
app.put("/api/feed/:id", requireAuth, (req, res) => {
  const db = readDb();
  const i = db.feed.findIndex((f) => f.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  db.feed[i] = { ...db.feed[i], ...req.body, id: db.feed[i].id };
  writeDb(db);
  res.json(db.feed[i]);
});
app.delete("/api/feed/:id", requireAuth, (req, res) => {
  const db = readDb();
  db.feed = db.feed.filter((f) => f.id !== req.params.id);
  writeDb(db);
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.name === "MulterError" || /allowed/.test(err.message) ? 400 : 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Reeveri API on http://localhost:${PORT}`);
  if (!process.env.ADMIN_PASS) console.log(`Admin login: ${ADMIN_USER} / ${ADMIN_PASS}`);
});
