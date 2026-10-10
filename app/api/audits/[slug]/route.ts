import { isAuthed, readDb, slugify, unauthorized, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const audit = readDb().audits.find((a) => a.slug === slug);
  return audit ? Response.json(audit) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!isAuthed(req)) return unauthorized();
  const { slug } = await ctx.params;
  const db = readDb();
  const i = db.audits.findIndex((a) => a.slug === slug);
  if (i < 0) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const audit = { ...body, slug: slugify(body.slug) || slug };
  if (audit.slug !== slug && db.audits.some((a) => a.slug === audit.slug)) {
    return Response.json({ error: "Slug already exists" }, { status: 409 });
  }
  db.audits[i] = audit;
  writeDb(db);
  return Response.json(audit);
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAuthed(req)) return unauthorized();
  const { slug } = await ctx.params;
  const db = readDb();
  db.audits = db.audits.filter((a) => a.slug !== slug);
  writeDb(db);
  return Response.json({ ok: true });
}
