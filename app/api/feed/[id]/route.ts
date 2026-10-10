import { isAuthed, readDb, unauthorized, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!isAuthed(req)) return unauthorized();
  const { id } = await ctx.params;
  const db = readDb();
  const i = db.feed.findIndex((f) => f.id === id);
  if (i < 0) return Response.json({ error: "Not found" }, { status: 404 });
  db.feed[i] = { ...db.feed[i], ...(await req.json()), id };
  writeDb(db);
  return Response.json(db.feed[i]);
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAuthed(req)) return unauthorized();
  const { id } = await ctx.params;
  const db = readDb();
  db.feed = db.feed.filter((f) => f.id !== id);
  writeDb(db);
  return Response.json({ ok: true });
}
