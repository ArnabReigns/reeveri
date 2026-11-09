import fs from "fs";
import path from "path";
import { SEED_DIR, UPLOAD_DIR } from "@/lib/db";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
};

// Serves uploaded files (with Range support so videos can seek), falling back to the bundled seed files.
export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const rel = path.normalize(parts.join("/"));
  if (rel.startsWith("..") || path.isAbsolute(rel)) return new Response("Not found", { status: 404 });

  const file = [path.join(UPLOAD_DIR, rel), path.join(SEED_DIR, "uploads", rel)].find(
    (f) => fs.existsSync(f) && fs.statSync(f).isFile(),
  );
  if (!file) return new Response("Not found", { status: 404 });

  const size = fs.statSync(file).size;
  const headers: Record<string, string> = {
    "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  let start = 0;
  let end = size - 1;
  let status = 200;
  if (range && (range[1] || range[2])) {
    start = range[1] ? Number(range[1]) : size - Number(range[2]);
    end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }
  headers["Content-Length"] = String(end - start + 1);
  return new Response(fileStream(file, start, end, req.signal), { status, headers });
}

// Streams a byte range of a file. Browsers cancel video requests all the time (seeking, scrolling past),
// so a cancel just stops reading instead of writing into a closed stream and throwing.
function fileStream(file: string, start: number, end: number, signal: AbortSignal) {
  const stream = fs.createReadStream(file, { start, end });
  let done = false;
  const stop = () => {
    done = true;
    stream.destroy();
  };
  signal.addEventListener("abort", stop, { once: true });
  return new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("data", (chunk) => {
        if (done) return;
        try {
          controller.enqueue(new Uint8Array(chunk as Buffer));
          if ((controller.desiredSize ?? 1) <= 0) stream.pause();
        } catch {
          stop();
        }
      });
      stream.on("end", () => {
        if (done) return;
        done = true;
        try {
          controller.close();
        } catch {}
      });
      stream.on("error", (e) => {
        if (done) return;
        done = true;
        try {
          controller.error(e);
        } catch {}
      });
    },
    pull() {
      stream.resume();
    },
    cancel() {
      stop();
    },
  });
}
