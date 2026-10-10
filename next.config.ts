import type { NextConfig } from "next";

const week = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  // Self-contained server output for the Docker image.
  output: "standalone",
  // Static assets from /public are cached by browsers and CDNs instead of being revalidated on every visit.
  async headers() {
    return [
      { source: "/demos/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/audits/:path*.(jpg|jpeg|png|webp|svg)", headers: [{ key: "Cache-Control", value: week }] },
    ];
  },
};

export default nextConfig;
