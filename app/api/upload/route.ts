import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { UPLOAD_DIR, isAuthed, unauthorized } from "@/lib/db";

const MAX_BYTES = 300 * 1024 * 1024;

// One file per request. The raw body is streamed straight to disk, so large videos are never held in memory.
// Headers: Content-Type (the file's mime type) and X-Filename (the original name, URL-encoded).
export async function POST(req: Request) {
  if (!isAuthed(req)) return unauthorized();
  const type = req.headers.get("content-type") || "";
  if (!/^(image|video)\//.test(type)) {
    return Response.json({ error: "Only image and video files are allowed" }, { status: 400 });
  }
  if (!req.body) return Response.json({ error: "No file" }, { status: 400 });

  const original = decodeURIComponent(req.headers.get("x-filename") || "file");
  const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const dest = path.join(UPLOAD_DIR, name);

  let bytes = 0;
  const limit = async function* (source: AsyncIterable<Buffer>) {
    for await (const chunk of source) {
      bytes += chunk.length;
      if (bytes > MAX_BYTES) throw new Error("File is larger than 300MB");
      yield chunk;
    }
  };
  try {
    await pipeline(Readable.fromWeb(req.body as never), limit, fs.createWriteStream(dest));
  } catch (e) {
    fs.rmSync(dest, { force: true });
    return Response.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }
  return Response.json({
    files: [{ src: `/uploads/${name}`, kind: type.startsWith("video/") ? "video" : "image", name: original }],
  });
}
