import crypto from "crypto";
import fs from "fs";
import path from "path";
import { UPLOAD_DIR, isAuthed, unauthorized } from "@/lib/db";

const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => typeof f !== "string");
  if (files.length === 0) return Response.json({ error: "No files" }, { status: 400 });

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const out = [];
  for (const file of files) {
    if (!/^(image|video)\//.test(file.type)) {
      return Response.json({ error: "Only image and video files are allowed" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 200MB" }, { status: 400 });
    const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "");
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    out.push({ src: `/uploads/${name}`, kind: file.type.startsWith("video/") ? "video" : "image", name: file.name });
  }
  return Response.json({ files: out });
}
