import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server output for the Docker image.
  output: "standalone",
};

export default nextConfig;
