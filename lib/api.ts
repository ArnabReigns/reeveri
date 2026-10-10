import axios from "axios";

// Backend URL from the env, else the local API on port 4000.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const http = axios.create({ baseURL: API_URL });

// Backend-hosted files are stored as "/uploads/..." and need the API origin; anything else (e.g. /demos/...) is served by Next.
export const mediaUrl = (src: string) => (src.startsWith("/uploads/") ? `${API_URL}${src}` : src);

export type FeedMedia = { src: string; kind: "image" | "video" };
export type FeedItem = {
  id: string;
  type: "poster" | "reel" | "carousel";
  title: string;
  caption: string;
  client: string;
  size: "sm" | "tall" | "wide" | "big";
  media: FeedMedia[];
  poster?: string;
  published?: boolean;
  createdAt?: string;
};

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    return (await http.get<T>(path)).data;
  } catch (e) {
    console.error(`[api] GET ${API_URL}${path} failed: ${e instanceof Error ? e.message : e}`);
    return fallback;
  }
}

export const getFeed = () => apiGet<FeedItem[]>("/api/feed", []);
