"use client";

import axios from "axios";
import { http } from "./api";

const KEY = "reeveri-admin-token";

export const getToken = () => {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
};
export const setToken = (t: string) => {
  try {
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  } catch {}
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: { method?: string; json?: unknown; body?: FormData } = {}): Promise<T> {
  const token = getToken();
  try {
    const res = await http.request<T>({
      url: path,
      method: init.method || "GET",
      data: init.json ?? init.body,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw new ApiError(e.response?.data?.error || e.message, e.response?.status ?? 0);
    }
    throw e;
  }
}

export type Uploaded = { src: string; kind: "image" | "video"; name: string };

const MAX_SIDE = 3000;

// Shrinks big photos in the browser before upload (max 3000px, WebP at 92%), kept only if smaller than the original.
async function shrinkImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 600 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.92));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

// Uploads files in parallel, one request each, reporting overall progress (0 to 1).
export async function uploadFiles(files: FileList | File[], onProgress?: (p: number) => void): Promise<Uploaded[]> {
  const list = await Promise.all(Array.from(files).map(shrinkImage));
  const total = list.reduce((n, f) => n + f.size, 0) || 1;
  const sent = new Array(list.length).fill(0);
  const results = await Promise.all(
    list.map(async (file, i) => {
      const { data } = await http
        .post<{ files: Uploaded[] }>("/api/upload", file, {
          headers: { "Content-Type": file.type, "X-Filename": encodeURIComponent(file.name), Authorization: `Bearer ${getToken()}` },
          onUploadProgress: (e) => {
            sent[i] = e.loaded;
            onProgress?.(Math.min(1, sent.reduce((a, b) => a + b, 0) / total));
          },
        })
        .catch((e) => {
          throw new ApiError(axios.isAxiosError(e) ? e.response?.data?.error || e.message : String(e), 0);
        });
      return data.files[0];
    }),
  );
  return results;
}

// A still frame from a video, uploaded as an image. Used as the reel cover so the grid never has to load the video.
export async function makePoster(videoFile: File): Promise<Uploaded | null> {
  const url = URL.createObjectURL(videoFile);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((res, rej) => {
      video.onloadeddata = () => res();
      video.onerror = () => rej(new Error("unreadable"));
    });
    video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    await new Promise<void>((res) => (video.onseeked = () => res()));
    const scale = Math.min(1, 1200 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    if (!blob) return null;
    const [up] = await uploadFiles([new File([blob], "poster.jpg", { type: "image/jpeg" })]);
    return up;
  } catch {
    return null; // codec the browser cannot decode: the reel just has no cover
  } finally {
    URL.revokeObjectURL(url);
  }
}
