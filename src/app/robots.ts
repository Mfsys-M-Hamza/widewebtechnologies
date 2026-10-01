import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Generated once at build time (required for the static GitHub Pages export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl.value.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
