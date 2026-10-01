import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Social sharing image (public/brand/og-image.png). Relative URLs resolve against metadataBase. */
export const ogImage = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
};

/**
 * Full Open Graph block for a page. Next.js replaces (rather than merges) a parent's
 * `openGraph` when a page sets its own, so every page needs the shared fields too.
 */
export function openGraphFor(title: string, path: string): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title,
    description: siteConfig.description,
    url: path,
    images: [ogImage],
  };
}
