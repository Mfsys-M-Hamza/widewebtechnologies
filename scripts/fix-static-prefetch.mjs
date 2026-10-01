/**
 * Static-export fix for GitHub Pages.
 *
 * Next.js writes page prefetch data to folders such as  out/about/__next.about/__PAGE__.txt,
 * but the browser requests the flattened name             out/about/__next.about.__PAGE__.txt.
 * A Next.js server maps one to the other; a static host can't, so we copy each file to
 * the flattened name too. Without this, links still work but fall back to full page loads.
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "out");
let copied = 0;

function flatten(segmentDir, prefix, targetDir) {
  for (const entry of fs.readdirSync(segmentDir, { withFileTypes: true })) {
    const full = path.join(segmentDir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(full, name, targetDir);
    else {
      fs.copyFileSync(full, path.join(targetDir, name));
      copied++;
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(full, entry.name, dir);
    else walk(full);
  }
}

walk(outDir);
console.log(`fix-static-prefetch: wrote ${copied} flattened prefetch file(s)`);
