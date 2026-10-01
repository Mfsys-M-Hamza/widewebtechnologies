/**
 * Prefixes a /public file path with the site's base path (e.g. "/widewebtechnologies"
 * on GitHub Pages). Needed for <video>, <img> and next/image `src` values, which
 * Next.js does not prefix automatically.
 */
export function asset(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  return `${base}${path}`;
}
