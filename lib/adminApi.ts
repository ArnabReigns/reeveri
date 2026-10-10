"use client";

import { API_URL } from "./api";

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

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data as T;
}

export type Uploaded = { src: string; kind: "image" | "video"; name: string };

export async function uploadFiles(files: FileList | File[]): Promise<Uploaded[]> {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append("files", f));
  const { files: out } = await api<{ files: Uploaded[] }>("/api/upload", { method: "POST", body: fd });
  return out;
}
