/**
 * Canvas drawing for the home-page promo animation (a 24-second loop on a 1920x1080 stage).
 * Story: WhatsApp chat → wireframe → code → finished site on laptop and phone → services → end card.
 * `createPromoScene` returns `render(t, scale)`; `t` is seconds into the loop, `scale` maps the stage to the canvas size.
 */

export const PROMO_W = 1920;
export const PROMO_H = 1080;
export const PROMO_DURATION = 24;

export type PromoContent = {
  name: string;
  tagline: string;
  services: string[];
  /** e.g. "WhatsApp +92 … · Islamabad, Pakistan" — omitted when empty. */
  contactLine: string;
  cta: string;
};

/** CSS font-family stacks (from next/font variables) used for canvas text. */
export type PromoFonts = { brand: string; body: string; mono: string };

type Pt = { x: number; y: number };
type Fam = "brand" | "body" | "mono";

const W = PROMO_W;
const H = PROMO_H;

const C = {
  bg: "#05070f",
  mute: "#94a3c4",
  cyan: "#38bdf8",
  violet: "#8b5cf6",
  pink: "#f472b6",
  green: "#34d399",
};
const PILL_COLORS = [C.cyan, C.violet, C.pink, C.green, "#facc15", "#fb923c", "#60a5fa"];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const backOut = (t: number) => {
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const rand = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const CODE: [string, string][][] = [
  [["<", "#94a3b8"], ["header", "#f472b6"], [" class=", "#38bdf8"], ['"nav"', "#34d399"], [">", "#94a3b8"]],
  [["  <", "#94a3b8"], ["h1", "#f472b6"], [">", "#94a3b8"], ["Grow your business", "#ffffff"], ["</h1>", "#94a3b8"]],
  [["  <", "#94a3b8"], ["a", "#f472b6"], [" class=", "#38bdf8"], ['"btn"', "#34d399"], [">Get Started</a>", "#94a3b8"]],
  [["</header>", "#94a3b8"]],
  [["", "#fff"]],
  [[".hero", "#facc15"], [" { ", "#fff"], ["display", "#38bdf8"], [": grid; }", "#fff"]],
  [["@media", "#c084fc"], [" (max-width: ", "#fff"], ["768px", "#fb923c"], [") {", "#fff"]],
  [["  .cards", "#facc15"], [" { ", "#fff"], ["flex-direction", "#38bdf8"], [": column; }", "#fff"]],
  [["}", "#fff"]],
  [["", "#fff"]],
  [["const", "#c084fc"], [" site = ", "#fff"], ["launch", "#38bdf8"], ["(", "#fff"], ["'every-device'", "#34d399"], [");", "#fff"]],
];
const CODE_CHARS = CODE.reduce((s, l) => s + l.reduce((a, seg) => a + seg[0].length, 0) + 1, 0);

export function createPromoScene(ctx: CanvasRenderingContext2D, content: PromoContent, fonts: PromoFonts) {
  /* ---------- helpers ---------- */
  function rr(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
  function font(size: number, weight = 600, fam: Fam = "brand") {
    ctx.font = `${weight} ${size}px ${fonts[fam]}, sans-serif`;
  }
  function grad(x0: number, y0: number, x1: number, y1: number, stops: string[]) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    return g;
  }

  /* ---------- background ---------- */
  function background(t: number) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    const glow = (x: number, y: number, r: number, col: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };
    glow(1500 + Math.sin(t * 0.4) * 80, 300, 700, "rgba(56,189,248,0.10)");
    glow(400 + Math.cos(t * 0.3) * 60, 850, 650, "rgba(139,92,246,0.12)");
    ctx.fillStyle = "rgba(148,163,196,0.07)";
    for (let x = 30; x < W; x += 48)
      for (let y = 30; y < H; y += 48) {
        ctx.beginPath();
        ctx.arc(x, y + ((t * 6) % 48), 1.6, 0, 7);
        ctx.fill();
      }
  }

  /* ---------- screen contents ---------- */
  function siteBlocks(x: number, y: number, w: number, h: number, mode: "desktop" | "mobile", p: number, t: number) {
    ctx.save();
    rr(x, y, w, h, 6);
    ctx.clip();
    ctx.fillStyle = "#0a0f20";
    ctx.fillRect(x, y, w, h);
    const m = mode === "mobile";
    const pad = m ? 14 : 26;
    const el = (a: number, b: number) => easeOut(prog(p, a, b));
    // nav
    let a = el(0, 0.15);
    ctx.globalAlpha = a;
    const navH = m ? 44 : 52;
    ctx.fillStyle = "#0f1630";
    ctx.fillRect(x, y, w, navH);
    ctx.fillStyle = grad(x + pad, 0, x + pad + 24, 0, [C.cyan, C.violet]);
    rr(x + pad, y + navH / 2 - 10, 20, 20, 6);
    ctx.fill();
    font(m ? 13 : 16, 700);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText("YourBrand", x + pad + 28, y + navH / 2 + 1);
    if (m) {
      ctx.fillStyle = "#cbd5e1";
      [-6, 0, 6].forEach((d) => ctx.fillRect(x + w - pad - 20, y + navH / 2 + d - 1.5, 20, 3));
    } else {
      font(13, 500, "body");
      ctx.fillStyle = "#9fb0d0";
      ["Home", "Services", "Work", "Contact"].forEach((s, i) => ctx.fillText(s, x + w - 330 + i * 72, y + navH / 2 + 1));
    }
    // hero text
    a = el(0.15, 0.35);
    ctx.globalAlpha = a;
    const off = (1 - a) * 20;
    const hx = x + pad;
    const hy = y + navH + (m ? 22 : 40) + off;
    font(m ? 22 : 36, 700);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    if (m) {
      ctx.fillText("Grow your", hx, hy + 22);
      ctx.fillText("business online", hx, hy + 50);
    } else {
      ctx.fillText("Grow your business", hx, hy + 36);
      ctx.fillText("online.", hx, hy + 80);
    }
    font(m ? 11 : 14, 400, "body");
    ctx.fillStyle = "#9fb0d0";
    ctx.fillText(m ? "Fast, modern & mobile-ready." : "Fast, modern websites that work on every device.", hx, hy + (m ? 74 : 112));
    // button
    a = el(0.3, 0.45);
    ctx.globalAlpha = a;
    const bs = backOut(prog(p, 0.3, 0.45));
    ctx.save();
    ctx.translate(hx, hy + (m ? 88 : 132));
    ctx.scale(bs, bs);
    ctx.fillStyle = grad(0, 0, 140, 0, [C.cyan, C.violet]);
    rr(0, 0, m ? 110 : 150, m ? 32 : 40, 20);
    ctx.fill();
    font(m ? 11 : 14, 600);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText("Get Started →", m ? 14 : 22, m ? 16 : 20);
    ctx.restore();
    ctx.textBaseline = "alphabetic";
    // hero image
    a = el(0.4, 0.6);
    ctx.globalAlpha = a;
    let ix: number, iy: number, iw: number, ih: number;
    if (m) {
      ix = x + pad;
      iy = hy + 134;
      iw = w - pad * 2;
      ih = 110;
    } else {
      ix = x + w * 0.56;
      iy = y + navH + 30;
      iw = w * 0.38;
      ih = h * 0.42;
    }
    ctx.fillStyle = grad(ix, iy, ix + iw, iy + ih, ["#1e3a8a", "#6d28d9", "#db2777"]);
    rr(ix, iy + (1 - a) * 20, iw, ih, 12);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.arc(ix + iw * 0.7, iy + ih * 0.4, ih * 0.22 + Math.sin(t * 2) * 3, 0, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    rr(ix + iw * 0.12, iy + ih * 0.62, iw * 0.5, ih * 0.12, 6);
    ctx.fill();
    // cards
    const cards = m ? 2 : 3;
    for (let i = 0; i < cards; i++) {
      const ca = el(0.58 + i * 0.1, 0.75 + i * 0.1);
      ctx.globalAlpha = ca;
      let cx: number, cy: number, cw: number, ch: number;
      if (m) {
        cw = w - pad * 2;
        ch = 64;
        cx = x + pad;
        cy = hy + 258 + i * 76;
      } else {
        cw = (w - pad * 2 - 40) / 3;
        ch = h * 0.26;
        cx = x + pad + i * (cw + 20);
        cy = y + h - ch - 26;
      }
      cy += (1 - ca) * 24;
      ctx.fillStyle = "#121a36";
      rr(cx, cy, cw, ch, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(148,163,196,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = [C.cyan, C.violet, C.pink][i];
      rr(cx + 14, cy + 14, m ? 30 : 34, m ? 30 : 34, 9);
      ctx.fill();
      ctx.fillStyle = "#e2e8f0";
      rr(cx + (m ? 56 : 14), cy + (m ? 16 : 62), m ? cw * 0.45 : cw * 0.6, 9, 4);
      ctx.fill();
      ctx.fillStyle = "#475569";
      rr(cx + (m ? 56 : 14), cy + (m ? 34 : 80), m ? cw * 0.6 : cw * 0.8, 7, 4);
      ctx.fill();
      if (!m) {
        rr(cx + 14, cy + 94, cw * 0.5, 7, 4);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function wireframe(x: number, y: number, w: number, h: number, p: number) {
    ctx.save();
    rr(x, y, w, h, 6);
    ctx.clip();
    ctx.fillStyle = "#0d1226";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    const boxes = [
      [0.03, 0.04, 0.94, 0.1],
      [0.03, 0.2, 0.48, 0.12],
      [0.03, 0.35, 0.3, 0.07],
      [0.56, 0.18, 0.41, 0.42],
      [0.03, 0.66, 0.29, 0.28],
      [0.355, 0.66, 0.29, 0.28],
      [0.68, 0.66, 0.29, 0.28],
    ];
    boxes.forEach((b, i) => {
      const k = easeOut(prog(p, i * 0.1, i * 0.1 + 0.3));
      if (k <= 0) return;
      ctx.globalAlpha = k;
      ctx.strokeRect(x + b[0] * w, y + b[1] * h, b[2] * w * k, b[3] * h);
    });
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    // cursor
    const cx = x + w * (0.2 + 0.6 * Math.sin(p * 3));
    const cy = y + h * (0.3 + 0.4 * p);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 14, cy + 22);
    ctx.lineTo(cx + 5, cy + 20);
    ctx.lineTo(cx, cy + 28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function codeEditor(x: number, y: number, w: number, h: number, p: number, t: number) {
    ctx.save();
    rr(x, y, w, h, 6);
    ctx.clip();
    ctx.fillStyle = "#0b0f1c";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#131a2e";
    ctx.fillRect(x, y, w, 34);
    ["#ef4444", "#f59e0b", "#22c55e"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x + 20 + i * 20, y + 17, 6, 0, 7);
      ctx.fill();
    });
    font(13, 500, "body");
    ctx.fillStyle = "#94a3b8";
    ctx.textBaseline = "middle";
    ctx.fillText("index.html — Wide Web", x + 90, y + 17);
    let left = Math.floor(p * CODE_CHARS);
    font(19, 500, "mono");
    let lastX = x + 60;
    let lastY = y + 66;
    CODE.forEach((line, li) => {
      const ly = y + 66 + li * 34;
      if (left <= 0) return;
      ctx.fillStyle = "#3b4560";
      ctx.fillText(String(li + 1).padStart(2, " "), x + 16, ly);
      let lx = x + 60;
      for (const [txt, col] of line) {
        if (left <= 0) break;
        const s = txt.slice(0, left);
        left -= s.length;
        ctx.fillStyle = col;
        ctx.fillText(s, lx, ly);
        lx += ctx.measureText(s).width;
      }
      left -= 1;
      lastX = lx;
      lastY = ly;
    });
    if (Math.floor(t * 3) % 2 === 0 || p < 1) {
      ctx.fillStyle = C.cyan;
      ctx.fillRect(lastX + 2, lastY - 12, 3, 24);
    }
    ctx.restore();
  }

  function chatScreen(x: number, y: number, w: number, h: number, t: number) {
    ctx.save();
    rr(x, y, w, h, 6);
    ctx.clip();
    ctx.fillStyle = "#0a0f20";
    ctx.fillRect(x, y, w, h);
    const msgs: ["left" | "right", string, number][] = [
      ["left", "Hi! I need a website for my business.", 4.6],
      ["right", "Great — let's plan it together.", 5.1],
      ["left", "It should look great on phones too!", 5.6],
    ];
    font(24, 500, "body");
    ctx.textBaseline = "middle";
    msgs.forEach(([side, txt, at], i) => {
      const k = backOut(prog(t, at, at + 0.4));
      if (k <= 0) return;
      const tw = ctx.measureText(txt).width + 48;
      const bh = 62;
      const bx = side === "left" ? x + 40 : x + w - 40 - tw;
      const by = y + 60 + i * 100;
      ctx.save();
      ctx.globalAlpha = clamp(k);
      ctx.translate(bx + (side === "left" ? 0 : tw), by + bh / 2);
      ctx.scale(k, k);
      ctx.translate(-(side === "left" ? 0 : tw), -bh / 2);
      ctx.fillStyle = side === "left" ? "#1a2342" : grad(0, 0, tw, 0, [C.cyan, C.violet]);
      rr(0, 0, tw, bh, 22);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(txt, 24, bh / 2 + 1);
      ctx.restore();
    });
    ctx.restore();
  }

  type ScreenFn = (x: number, y: number, w: number, h: number) => void;

  /* ---------- devices ---------- */
  function laptop(x: number, y: number, s: number, screenFn: ScreenFn) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    const sw = 800;
    const sh = 500;
    ctx.shadowColor = "rgba(56,189,248,0.25)";
    ctx.shadowBlur = 60;
    ctx.fillStyle = "#1b1f2e";
    rr(-sw / 2, -sh, sw, sh, 22);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#2c3248";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#39405a";
    ctx.beginPath();
    ctx.arc(0, -sh + 12, 3.5, 0, 7);
    ctx.fill();
    // base
    ctx.fillStyle = grad(0, 0, 0, 34, ["#c7cdd9", "#7d8598"]);
    ctx.beginPath();
    ctx.moveTo(-sw / 2 - 60, 6);
    ctx.lineTo(sw / 2 + 60, 6);
    ctx.lineTo(sw / 2 + 40, 30);
    ctx.lineTo(-sw / 2 - 40, 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#9aa2b4";
    rr(-sw / 2 - 60, 0, sw + 120, 8, 4);
    ctx.fill();
    ctx.fillStyle = "#6b7286";
    rr(-60, 0, 120, 6, 3);
    ctx.fill();
    ctx.translate(-sw / 2 + 18, -sh + 24);
    screenFn(0, 0, sw - 36, sh - 42);
    ctx.restore();
  }

  function phone(x: number, y: number, s: number, screenFn: ScreenFn) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    const pw = 230;
    const ph = 470;
    ctx.shadowColor = "rgba(139,92,246,0.35)";
    ctx.shadowBlur = 50;
    ctx.fillStyle = "#10131d";
    rr(-pw / 2, -ph / 2, pw, ph, 36);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#3a4058";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.save();
    ctx.translate(-pw / 2 + 10, -ph / 2 + 10);
    ctx.save();
    rr(0, 0, pw - 20, ph - 20, 28);
    ctx.clip();
    screenFn(0, 0, pw - 20, ph - 20);
    ctx.restore();
    ctx.restore();
    ctx.fillStyle = "#10131d";
    rr(-36, -ph / 2 + 16, 72, 20, 10);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- overlays ---------- */
  function caption(text: string, t: number, a: number, b: number, y = 120, size = 44) {
    const k = prog(t, a, a + 0.5) * (1 - prog(t, b - 0.4, b));
    if (k <= 0) return;
    const e = easeOut(k);
    ctx.save();
    ctx.globalAlpha = e;
    font(size, 700);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, W / 2, y + (1 - e) * 20);
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = grad(W / 2 - tw / 2, 0, W / 2 + tw / 2, 0, [C.cyan, C.violet]);
    rr(W / 2 - (tw * e) / 2, y + size * 0.7, tw * e, 5, 3);
    ctx.fill();
    ctx.restore();
  }

  function processChips(t: number, alpha: number) {
    if (alpha <= 0) return;
    const steps = ["Discuss", "Design", "Develop", "Launch"];
    const times = [4.5, 6.2, 8.0, 13.5];
    ctx.save();
    ctx.globalAlpha = alpha;
    font(22, 600);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const cw = 190;
    const gap = 50;
    const total = steps.length * cw + (steps.length - 1) * gap;
    const x0 = W / 2 - total / 2;
    const y = 1010;
    steps.forEach((s, i) => {
      const on = t >= times[i];
      const k = easeOut(prog(t, times[i], times[i] + 0.4));
      const x = x0 + i * (cw + gap);
      if (i > 0) {
        ctx.fillStyle = on ? C.cyan : "#26304a";
        ctx.fillRect(x - gap + 8, y - 1.5, gap - 16, 3);
      }
      ctx.fillStyle = on
        ? grad(x, 0, x + cw, 0, [`rgba(56,189,248,${0.25 + 0.6 * k})`, `rgba(139,92,246,${0.25 + 0.6 * k})`])
        : "rgba(30,38,62,0.8)";
      rr(x, y - 26, cw, 52, 26);
      ctx.fill();
      ctx.strokeStyle = on ? "rgba(255,255,255,0.35)" : "rgba(148,163,196,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = on ? "#fff" : "#64708f";
      ctx.fillText(`${i + 1}  ${s}`, x + cw / 2, y + 1);
    });
    ctx.restore();
  }

  function sparkles(from: Pt, to: Pt, t: number, k: number) {
    if (k <= 0) return;
    for (let i = 0; i < 26; i++) {
      const ph = (t * 0.9 + rand(i)) % 1;
      const cx = lerp(from.x, to.x, ph);
      const cy = lerp(from.y, to.y, ph) - Math.sin(ph * Math.PI) * (80 + rand(i + 9) * 80);
      ctx.globalAlpha = k * Math.sin(ph * Math.PI);
      ctx.fillStyle = [C.cyan, C.violet, C.pink, "#fff"][i % 4];
      ctx.beginPath();
      ctx.arc(cx + (rand(i + 5) - 0.5) * 30, cy, 2 + rand(i + 3) * 4, 0, 7);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function liveBadge(x: number, y: number, k: number) {
    if (k <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    const s = backOut(k);
    ctx.scale(s, s);
    ctx.fillStyle = C.green;
    rr(-80, -24, 160, 48, 24);
    ctx.fill();
    font(22, 700);
    ctx.fillStyle = "#04261a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✓  LIVE", 0, 1);
    ctx.restore();
  }

  function servicePills(t: number, a: number, b: number) {
    const out = 1 - prog(t, b - 0.5, b);
    if (t < a || out <= 0) return;
    ctx.save();
    font(26, 600);
    ctx.textBaseline = "middle";
    const split = Math.ceil(content.services.length / 2);
    const rows = [content.services.slice(0, split), content.services.slice(split)];
    let n = 0;
    rows.forEach((row, ri) => {
      const widths = row.map((s) => ctx.measureText(s).width + 80);
      const total = widths.reduce((sum, w) => sum + w, 0) + 24 * (row.length - 1);
      let x = W / 2 - total / 2;
      const y = 205 + ri * 76;
      row.forEach((s, i) => {
        const col = PILL_COLORS[n % PILL_COLORS.length];
        const k = backOut(prog(t, a + 0.25 + n * 0.18, a + 0.7 + n * 0.18));
        n++;
        if (k > 0) {
          ctx.save();
          ctx.globalAlpha = clamp(k) * out;
          ctx.translate(x + widths[i] / 2, y);
          ctx.scale(k, k);
          ctx.fillStyle = "rgba(16,22,44,0.95)";
          rr(-widths[i] / 2, -28, widths[i], 56, 28);
          ctx.fill();
          ctx.strokeStyle = col;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(-widths[i] / 2 + 32, 0, 8, 0, 7);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.fillText(s, -widths[i] / 2 + 52, 1);
          ctx.restore();
        }
        x += widths[i] + 24;
      });
    });
    ctx.restore();
  }

  /* ---------- main render ---------- */
  return function render(t: number, scale: number) {
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
    background(t);

    // ===== INTRO 0–4s =====
    const introOut = prog(t, 3.2, 4.0);
    if (t < 4.0) {
      const k = easeOut(prog(t, 0.2, 1.2));
      ctx.save();
      ctx.globalAlpha = 1 - introOut;
      ctx.translate(0, -introOut * 60);
      // orbit logo
      ctx.save();
      ctx.translate(W / 2, 400);
      ctx.strokeStyle = "rgba(56,189,248,0.6)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(t * 0.6 + (i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(0.01, 90 * k), Math.max(0.01, 34 * k), 0, 0, 7);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = grad(-40, -40, 40, 40, [C.cyan, C.violet]);
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0, 32 * backOut(prog(t, 0.1, 0.8))), 0, 7);
      ctx.fill();
      ctx.restore();
      font(92, 700);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const kt = easeOut(prog(t, 0.6, 1.6));
      ctx.globalAlpha *= kt;
      ctx.fillStyle = "#fff";
      ctx.fillText(content.name, W / 2, 590 + (1 - kt) * 30);
      font(36, 400, "body");
      ctx.fillStyle = C.mute;
      ctx.globalAlpha = (1 - introOut) * easeOut(prog(t, 1.2, 2.2));
      ctx.fillText(content.tagline, W / 2, 670);
      ctx.restore();
    }

    // ===== MAIN 3.6–20.5s =====
    const mainIn = easeOut(prog(t, 3.6, 4.8));
    const endK = easeInOut(prog(t, 19.5, 20.7));
    const phoneIn = easeOut(prog(t, 12.3, 13.3));
    const lapX = lerp(960, 820, phoneIn);
    const lapY = lerp(1200, 780, mainIn);
    const lapS = lerp(1, 0.86, phoneIn);
    const phX = lerp(2150, 1440, phoneIn);
    const phY = 580;

    if (t > 3.6 && endK < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - endK;
      ctx.globalAlpha *= 1 - 0.35 * prog(t, 15.5, 16) * (1 - prog(t, 19, 19.5));
      laptop(lapX, lapY + endK * 200, lapS, (x, y, w, h) => {
        if (t < 6.2) chatScreen(x, y, w, h, t);
        else if (t < 8.0) wireframe(x, y, w, h, prog(t, 6.2, 7.8));
        else if (t < 10.4) codeEditor(x, y, w, h, prog(t, 8.0, 10.2), t);
        else {
          siteBlocks(x, y, w, h, "desktop", prog(t, 10.4, 12.3), t);
          const cf = 1 - prog(t, 10.4, 10.8);
          if (cf > 0) {
            ctx.save();
            ctx.globalAlpha *= cf;
            codeEditor(x, y, w, h, 1, t);
            ctx.restore();
          }
        }
      });
      if (phoneIn > 0) {
        phone(phX, phY + endK * 200, 1, (x, y, w, h) => siteBlocks(x, y, w, h, "mobile", prog(t, 12.8, 14.6), t));
        // responsive link arrow
        const ak = prog(t, 13.0, 13.6) * (1 - prog(t, 15.2, 15.6));
        if (ak > 0) {
          ctx.save();
          ctx.globalAlpha *= ak;
          ctx.strokeStyle = C.cyan;
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 8]);
          ctx.lineDashOffset = -t * 40;
          ctx.beginPath();
          ctx.moveTo(1150, 330);
          ctx.quadraticCurveTo(1260, 250, 1360, 330);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      }
      liveBadge(lapX + 300 * lapS, lapY - 480 * lapS, prog(t, 13.6, 14.1) * (1 - prog(t, 15.3, 15.6)));
      ctx.restore();
    }

    // sparkles flowing laptop → phone
    const spark = prog(t, 12.6, 13.0) * (1 - prog(t, 14.6, 15.0));
    sparkles({ x: lapX + 200 * lapS, y: lapY - 300 * lapS }, { x: phX, y: phY - 40 }, t, spark);

    caption("Every project starts with your vision", t, 4.6, 8.0);
    caption("Clean code. Thoughtful design.", t, 8.0, 12.3);
    caption("One website. Every device.", t, 12.3, 15.6);
    caption("What we do", t, 15.6, 19.5, 110, 46);
    servicePills(t, 15.6, 19.5);
    processChips(t, mainIn * (1 - prog(t, 15.4, 15.9)));

    // ===== END CARD =====
    if (endK > 0) {
      ctx.save();
      ctx.globalAlpha = endK;
      const x = W / 2;
      ctx.textAlign = "center";
      font(30, 600);
      ctx.fillStyle = C.cyan;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(content.name.toUpperCase(), x, 300);
      const k1 = easeOut(prog(t, 20.0, 20.8));
      ctx.globalAlpha = endK * k1;
      font(70, 700);
      ctx.fillStyle = "#fff";
      ctx.fillText("We Build Websites That", x, 400 + (1 - k1) * 20);
      ctx.fillStyle = grad(x - 460, 0, x + 460, 0, [C.cyan, C.violet, C.pink]);
      ctx.fillText("Bring Your Business to Life", x, 485 + (1 - k1) * 20);
      ctx.globalAlpha = endK * easeOut(prog(t, 20.6, 21.4));
      font(32, 400, "body");
      ctx.fillStyle = C.mute;
      ctx.fillText(content.tagline, x, 560);
      const k3 = backOut(prog(t, 21.2, 21.9));
      if (k3 > 0) {
        ctx.save();
        ctx.globalAlpha = endK * clamp(k3);
        ctx.translate(x, 650);
        ctx.scale(k3, k3);
        font(32, 700);
        const pw = ctx.measureText(content.cta).width + 100;
        ctx.fillStyle = grad(-pw / 2, 0, pw / 2, 0, [C.cyan, C.violet]);
        rr(-pw / 2, -40, pw, 80, 40);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "middle";
        ctx.fillText(content.cta, 0, 2);
        ctx.restore();
      }
      if (content.contactLine) {
        ctx.globalAlpha = endK * easeOut(prog(t, 21.8, 22.5));
        font(28, 500, "body");
        ctx.fillStyle = "#cbd5e1";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(content.contactLine, x, 770);
      }
      ctx.restore();
    }

    // fade out over the last 0.6s so the loop restarts cleanly
    const fo = prog(t, PROMO_DURATION - 0.6, PROMO_DURATION);
    if (fo > 0) {
      ctx.fillStyle = `rgba(5,7,15,${fo})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  };
}
