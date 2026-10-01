import type { NextConfig } from "next";

/**
 * GitHub Pages build (STATIC_EXPORT=true, set by .github/workflows/deploy-pages.yml):
 * plain static HTML served from a sub-path such as /widewebtechnologies.
 * Locally (`npm run dev` / `npm start`) the site runs as a normal Next.js app.
 */
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Pin the project root (a package-lock.json exists in a parent folder).
  turbopack: { root: process.cwd() },
  ...(staticExport
    ? {
        output: "export",
        trailingSlash: true,
        basePath: basePath || undefined,
        // Static hosting has no image server; screenshots are already compressed JPEGs.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
