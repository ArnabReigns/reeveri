import crypto from "crypto";
import { isAuthed, readDb, unauthorized, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// ?all=1 (admin only) includes hidden items.
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1" && isAuthed(req);
  const feed = readDb().feed;
  return Response.json(all ? feed : feed.filter((f) => f.published !== false));
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const db = readDb();
  const item = { ...(await req.json()), id: crypto.randomBytes(6).toString("hex"), createdAt: new Date().toISOString() };
  db.feed.unshift(item);
  writeDb(db);
  return Response.json(item, { status: 201 });
}
