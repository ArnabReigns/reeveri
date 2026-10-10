import { withAboutDefaults } from "@/lib/about";
import { isAuthed, readDb, unauthorized, writeDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(withAboutDefaults(readDb().about));
}

export async function PUT(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const db = readDb();
  db.about = withAboutDefaults(await req.json());
  writeDb(db);
  return Response.json(db.about);
}
