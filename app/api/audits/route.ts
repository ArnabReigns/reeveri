import { isAuthed, readDb, slugify, unauthorized, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(readDb().audits);
}

export async function POST(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const db = readDb();
  const audit = await req.json();
  audit.slug = slugify(audit.slug || audit.brand);
  if (!audit.slug) return Response.json({ error: "Brand or slug is required" }, { status: 400 });
  if (db.audits.some((a) => a.slug === audit.slug)) {
    return Response.json({ error: "Slug already exists" }, { status: 409 });
  }
  db.audits.push(audit);
  writeDb(db);
  return Response.json(audit, { status: 201 });
}
