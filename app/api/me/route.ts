import { isAuthed, unauthorized } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return isAuthed(req) ? Response.json({ ok: true }) : unauthorized();
}
