import { isAuthed, unauthorized } from "@/lib/db";
import { deleteLead } from "@/lib/leads";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, ctx: Ctx) {
  if (!isAuthed(req)) return unauthorized();
  const { id } = await ctx.params;
  await deleteLead(id);
  console.log(`[leads] deleted ${id} from admin`);
  return Response.json({ ok: true });
}
