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

export async function uploadFiles(files: FileList | File[]): Promise<Uploaded[]> {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append("files", f));
  const { files: out } = await api<{ files: Uploaded[] }>("/api/upload", { method: "POST", body: fd });
  return out;
}
