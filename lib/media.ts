// Server-only: makes every upload fast to view.
// Videos -> H.264 MP4, longest side <= 1280px, ~2.5 Mbps, index at the start (+faststart), plus a JPEG cover frame.
// Images -> upright (EXIF), longest side <= 2560px, WebP. SVG and GIF are left as they are.
// If processing fails (e.g. ffmpeg missing in local dev), the original file is kept, so uploads never fail because of it.
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const VIDEO_MAX_SIDE = 1280;
const IMAGE_MAX_SIDE = 2560;

function run(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.trim() || `ffmpeg exited ${code}`))));
  });
}

const base = (file: string) => file.slice(0, -path.extname(file).length);

/** Re-encodes a video in place (always ends up .mp4) and writes a cover image. Returns the final file names. */
export async function processVideo(file: string): Promise<{ file: string; poster?: string }> {
  const out = `${base(file)}.mp4`;
  const tmp = `${base(file)}.tmp.mp4`;
  const scale = `scale='if(gte(iw,ih),min(${VIDEO_MAX_SIDE},iw),-2)':'if(gte(iw,ih),-2,min(${VIDEO_MAX_SIDE},ih))'`;
  try {
    await run([
      "-i", file,
      "-map", "0:v:0", "-map", "0:a:0?",
      "-vf", `${scale},format=yuv420p`,
      "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-maxrate", "2500k", "-bufsize", "5000k", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "128k", "-ac", "2",
      "-movflags", "+faststart",
      tmp,
    ]);
    if (file !== out) fs.rmSync(file, { force: true });
    fs.renameSync(tmp, out);
  } catch (e) {
    fs.rmSync(tmp, { force: true });
    console.error("[media] video kept as uploaded:", e instanceof Error ? e.message : e);
    return { file };
  }

  const poster = `${base(out)}-cover.jpg`;
  try {
    await run(["-ss", "0.5", "-i", out, "-frames:v", "1", "-vf", "scale='min(1200,iw)':-2", "-q:v", "4", poster]);
    return { file: out, poster };
  } catch {
    return { file: out };
  }
}

/** Optimises an image in place. Returns the final file name (may change extension to .webp). */
export async function processImage(file: string): Promise<string> {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".svg" || ext === ".gif") return file;
  const out = `${base(file)}.webp`;
  const tmp = `${base(file)}.tmp.webp`;
  try {
    const sharp = (await import("sharp")).default;
    await sharp(file, { failOn: "none" })
      .rotate()
      .resize({ width: IMAGE_MAX_SIDE, height: IMAGE_MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(tmp);
    if (file !== out) fs.rmSync(file, { force: true });
    fs.renameSync(tmp, out);
    return out;
  } catch (e) {
    fs.rmSync(tmp, { force: true });
    console.error("[media] image kept as uploaded:", e instanceof Error ? e.message : e);
    return file;
  }
}
