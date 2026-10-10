import { checkLogin, makeToken } from "@/lib/db";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!checkLogin(username, password)) {
    return Response.json({ error: "Wrong username or password" }, { status: 401 });
  }
  return Response.json({ token: makeToken() });
}
