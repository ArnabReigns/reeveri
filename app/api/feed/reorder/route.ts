import { isAuthed, readDb, unauthorized, writeDb } from "@/lib/db";

export async function PUT(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const { ids } = (await req.json()) as { ids?: string[] };
  const order = Array.isArray(ids) ? ids : [];
  const db = readDb();
  const byId = new Map(db.feed.map((f) => [f.id, f]));
  const ordered = order.map((id) => byId.get(id)).filter((f) => f !== undefined);
  db.feed = [...ordered, ...db.feed.filter((f) => !order.includes(f.id))];
  writeDb(db);
  return Response.json(db.feed);
}
