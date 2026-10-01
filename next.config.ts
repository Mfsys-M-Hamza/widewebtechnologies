import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root (a package-lock.json exists in a parent folder).
  turbopack: { root: process.cwd() },
};

export default nextConfig;
