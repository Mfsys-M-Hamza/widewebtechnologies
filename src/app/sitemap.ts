import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Generated once at build time (required for the static GitHub Pages export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.value.replace(/\/$/, "");
  const pages = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
  ];
  // The static (GitHub Pages) build serves every page from a folder, e.g. /about/.
  const slash = process.env.STATIC_EXPORT === "true" ? "/" : "";
  return pages.map((p) => ({
    url: p.path ? `${base}${p.path}${slash}` : `${base}/`,
    changeFrequency: "monthly",
    priority: p.priority,
  }));
}
