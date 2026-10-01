import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

const iconSrc = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/icon-dark.png"))).toString("base64")}`;

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 10%, #0f2a4a 0%, #0a0f1f 45%, #05070f 100%)",
          color: "#eef1fa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} width={84} height={84} alt="" style={{ borderRadius: 20 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>
              WIDE&nbsp;<span style={{ color: "#2EE6D6" }}>WEB</span>
            </div>
            <div style={{ fontSize: 18, letterSpacing: 6, color: "#8C98AE" }}>TECHNOLOGIES</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, maxWidth: 900 }}>
            We Build Websites That Bring Your Business to Life.
          </div>
          <div style={{ fontSize: 28, color: "#a6b0cc" }}>{siteConfig.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#a6b0cc" }}>
          <div style={{ display: "flex", padding: "10px 20px", borderRadius: 999, border: "1px solid #2a3566" }}>Business websites</div>
          <div style={{ display: "flex", padding: "10px 20px", borderRadius: 999, border: "1px solid #2a3566" }}>Responsive web design</div>
          <div style={{ display: "flex", padding: "10px 20px", borderRadius: 999, border: "1px solid #2a3566" }}>IT services</div>
        </div>
      </div>
    ),
    size,
  );
}
