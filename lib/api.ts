// Client for the Express backend (server/index.js). Uploaded files live on the backend and are served from /uploads.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

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
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const getFeed = () => apiGet<FeedItem[]>("/api/feed", []);
