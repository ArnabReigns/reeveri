import axios from "axios";

// The API is part of this app (app/api), so the browser calls the same origin.
export const http = axios.create();

// Uploaded files are served by this app at /uploads/... .
export const mediaUrl = (src: string) => src;

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
