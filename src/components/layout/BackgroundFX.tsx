"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide interactive background, drawn on a single 2D canvas behind all content.
 *
 * - Particles at different depths drift and lean towards the pointer (near ones move more).
 * - Wireframe 3D shapes rotate slowly and parallax with scrolling.
 * - Clicking / tapping an empty background area adds a soft ripple and a small particle burst.
 *
 * The canvas has `pointer-events: none`; input is observed on `window` without ever calling
 * preventDefault, so buttons, links, forms, scrolling and WhatsApp links are unaffected.
 * Reduced-motion users get a single static frame (no animation, no ripples).
 */

const COLORS = ["46,230,214", "59,130,246", "79,140,255", "155,107,255"]; // brand teal, blue, electric, violet

// Tap / click targets that count as "empty background".
const BACKGROUND_TAGS = new Set(["HTML", "BODY", "MAIN", "SECTION", "DIV", "HEADER", "FOOTER", "ARTICLE", "ASIDE", "UL", "OL", "NAV"]);
const INTERACTIVE =
  'a, button, input, select, textarea, label, summary, video, img, svg, canvas, dialog, [role="button"], [role="dialog"], [role="img"], [contenteditable], [data-no-ripple]';

type Particle = { x: number; y: number; vx: number; vy: number; z: number; r: number; c: string };
type Shape = { kind: number; x: number; y: number; size: number; z: number; rx: number; ry: number; sx: number; sy: number; c: string; phase: number };
type Ripple = { x: number; y: number; t: number; c: string };
type Spark = { x: number; y: number; vx: number; vy: number; t: number; life: number; r: number; c: string };

// Unit-size polyhedra: [vertices, edges]
const PHI = (1 + Math.sqrt(5)) / 2;
const SOLIDS: [number[][], number[][]][] = (() => {
  const cubeV = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
  const octaV = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const tetraV = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
  const icoV = [
    [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
    [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
  ];
  // Connect vertex pairs at the solid's shortest edge length.
  const edges = (v: number[][]) => {
    const d = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    let min = Infinity;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) min = Math.min(min, d(v[i], v[j]));
    const e: number[][] = [];
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (d(v[i], v[j]) < min * 1.01) e.push([i, j]);
    return e;
  };
  const norm = (v: number[][]) => {
    const m = Math.max(...v.map((p) => Math.hypot(p[0], p[1], p[2])));
    return v.map((p) => p.map((n) => n / m));
  };
  return [cubeV, octaV, icoV, tetraV].map((v) => [norm(v), edges(v)] as [number[][], number[][]]);
})();

function isEmptyBackground(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (document.querySelector("dialog[open]")) return false;
  if (target.closest(INTERACTIVE)) return false;
  return BACKGROUND_TAGS.has(target.tagName);
}

export function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let reduced = reduceMQ.matches;
    let w = 0, h = 0, dpr = 1;
    let particles: Particle[] = [];
    let shapes: Shape[] = [];
    const ripples: Ripple[] = [];
    const sparks: Spark[] = [];
    // Pointer target (normalised -1..1) and smoothed value; starts centred.
    const pointer = { tx: 0, ty: 0, x: 0, y: 0, px: -9999, py: -9999, active: false };
    let raf = 0;
    let last = performance.now();
    let time = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    // Wrap a y position into [-margin, h + margin) so things leave one edge and re-enter at the other.
    const wrap = (y: number, margin: number) => {
      const span = h + margin * 2;
      return ((((y + margin) % span) + span) % span) - margin;
    };

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(90, Math.max(28, (w * h) / (coarse ? 26000 : 17000))));
      particles = Array.from({ length: count }, () => {
        const z = rand(0.2, 1);
        return { x: rand(0, w), y: rand(0, h), vx: rand(-0.06, 0.06), vy: rand(-0.06, 0.06), z, r: 0.6 + z * 1.6, c: pick(COLORS) };
      });

      const base = Math.min(w, h);
      const spots = w < 700
        ? [[0.85, 0.18], [0.12, 0.62], [0.88, 0.86]]
        : [[0.08, 0.22], [0.92, 0.3], [0.18, 0.82], [0.8, 0.78], [0.55, 0.08]];
      shapes = spots.map(([sx, sy], i) => ({
        kind: i % SOLIDS.length,
        x: sx * w,
        y: sy * h,
        size: base * rand(0.06, 0.1) * (w < 700 ? 1.2 : 1),
        z: rand(0.35, 0.9),
        rx: rand(0, Math.PI),
        ry: rand(0, Math.PI),
        sx: rand(0.05, 0.12) * (Math.random() < 0.5 ? -1 : 1),
        sy: rand(0.07, 0.15) * (Math.random() < 0.5 ? -1 : 1),
        c: COLORS[i % COLORS.length],
        phase: rand(0, Math.PI * 2),
      }));
    }

    function drawShape(s: Shape, ox: number, oy: number) {
      const [verts, edges] = SOLIDS[s.kind];
      const cx = Math.cos(s.rx), sxn = Math.sin(s.rx), cy = Math.cos(s.ry), syn = Math.sin(s.ry);
      const bob = reduced ? 0 : Math.sin(time * 0.4 + s.phase) * 10;
      const pts = verts.map(([x, y, z]) => {
        // rotate around Y then X, then simple perspective
        const x1 = x * cy + z * syn;
        const z1 = -x * syn + z * cy;
        const y2 = y * cx - z1 * sxn;
        const z2 = y * sxn + z1 * cx;
        const p = 3 / (3 + z2);
        return [s.x + ox + x1 * s.size * p, s.y + oy + bob + y2 * s.size * p, z2];
      });
      ctx!.lineWidth = 1;
      for (const [a, b] of edges) {
        const depth = (pts[a][2] + pts[b][2]) / 2; // -1 (front) .. 1 (back)
        ctx!.strokeStyle = `rgba(${s.c},${(0.16 - depth * 0.07) * (0.6 + s.z * 0.5)})`;
        ctx!.beginPath();
        ctx!.moveTo(pts[a][0], pts[a][1]);
        ctx!.lineTo(pts[b][0], pts[b][1]);
        ctx!.stroke();
      }
      for (const p of pts) {
        ctx!.fillStyle = `rgba(${s.c},${0.22 - p[2] * 0.08})`;
        ctx!.beginPath();
        ctx!.arc(p[0], p[1], 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      const c = ctx!;
      c.clearRect(0, 0, w, h);

      // Smoothly follow the pointer.
      const ease = 1 - Math.exp(-dt * 3);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      const scroll = window.scrollY;

      // Cursor glow (desktop only).
      if (pointer.active && !coarse) {
        const g = c.createRadialGradient(pointer.px, pointer.py, 0, pointer.px, pointer.py, 260);
        g.addColorStop(0, "rgba(46,230,214,0.07)");
        g.addColorStop(1, "rgba(46,230,214,0)");
        c.fillStyle = g;
        c.fillRect(pointer.px - 260, pointer.py - 260, 520, 520);
      }

      // Floating 3D shapes, parallaxed by pointer and scroll.
      for (const s of shapes) {
        if (!reduced) {
          s.rx += s.sx * dt;
          s.ry += s.sy * dt;
        }
        // Scroll moves shapes up slowly; they wrap from the top edge back to the bottom.
        const margin = s.size * 1.6;
        const wrapped = wrap(s.y - scroll * 0.06 * s.z, margin);
        drawShape(s, pointer.x * 26 * s.z, pointer.y * 20 * s.z + (wrapped - s.y));
      }

      // Particles with depth parallax towards the pointer.
      const pos: number[][] = [];
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx * dt * 60;
          p.y += p.vy * dt * 60;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
        const x = p.x + pointer.x * 36 * p.z;
        const yy = wrap(p.y + pointer.y * 28 * p.z - scroll * 0.04 * p.z, 20);
        pos.push([x, yy, p.z]);
        c.fillStyle = `rgba(${p.c},${0.18 + p.z * 0.4})`;
        c.beginPath();
        c.arc(x, yy, p.r, 0, Math.PI * 2);
        c.fill();
      }

      // Faint constellation lines between nearby particles (skipped on touch devices).
      if (!coarse) {
        const maxD = 120;
        for (let i = 0; i < pos.length; i++) {
          for (let j = i + 1; j < pos.length; j++) {
            const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
            const d2 = dx * dx + dy * dy;
            if (d2 > maxD * maxD) continue;
            const a = (1 - Math.sqrt(d2) / maxD) * 0.09 * Math.min(pos[i][2], pos[j][2]);
            c.strokeStyle = `rgba(122,168,255,${a})`;
            c.lineWidth = 0.7;
            c.beginPath();
            c.moveTo(pos[i][0], pos[i][1]);
            c.lineTo(pos[j][0], pos[j][1]);
            c.stroke();
          }
        }
      }

      // Click / tap ripples.
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += dt;
        const k = r.t / 0.9;
        if (k >= 1) { ripples.splice(i, 1); continue; }
        const radius = 12 + (1 - (1 - k) ** 3) * 110;
        const alpha = (1 - k) ** 1.6;
        const glow = c.createRadialGradient(r.x, r.y, 0, r.x, r.y, radius);
        glow.addColorStop(0, `rgba(${r.c},${0.12 * alpha})`);
        glow.addColorStop(1, `rgba(${r.c},0)`);
        c.fillStyle = glow;
        c.beginPath();
        c.arc(r.x, r.y, radius, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = `rgba(${r.c},${0.45 * alpha})`;
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(r.x, r.y, radius, 0, Math.PI * 2);
        c.stroke();
      }

      // Burst particles.
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.t += dt;
        if (s.t >= s.life) { sparks.splice(i, 1); continue; }
        const drag = Math.exp(-dt * 3.2);
        s.vx *= drag;
        s.vy *= drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = 1 - s.t / s.life;
        c.fillStyle = `rgba(${s.c},${0.75 * a})`;
        c.beginPath();
        c.arc(s.x, s.y, s.r * (0.6 + a * 0.4), 0, Math.PI * 2);
        c.fill();
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    // --- input (observed only; never blocks default behaviour) ---
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / w) * 2 - 1;
      pointer.ty = (e.clientY / h) * 2 - 1;
      pointer.px = e.clientX;
      pointer.py = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.tx = 0;
      pointer.ty = 0;
    };

    // A "tap" = pointerdown + pointerup within 10px and 500ms (so scroll gestures never ripple).
    let down: { x: number; y: number; t: number; target: EventTarget | null } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, t: performance.now(), target: e.target };
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || reduced) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || performance.now() - d.t > 500) return;
      if (!isEmptyBackground(d.target)) return;
      if (window.getSelection()?.toString()) return;
      const col = pick(COLORS);
      ripples.push({ x: e.clientX, y: e.clientY, t: 0, c: col });
      canvas.dataset.ripples = String(Number(canvas.dataset.ripples ?? 0) + 1); // for automated checks
      if (ripples.length > 6) ripples.shift();
      const n = coarse ? 10 : 14;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + rand(-0.2, 0.2);
        const sp = rand(90, 220);
        sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, t: 0, life: rand(0.5, 0.85), r: rand(1.2, 2.4), c: pick(COLORS) });
      }
      if (sparks.length > 80) sparks.splice(0, sparks.length - 80);
    };

    const onResize = () => {
      build();
      if (reduced) frame(performance.now());
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) start();
    };
    const onReduceChange = () => {
      reduced = reduceMQ.matches;
      ripples.length = 0;
      sparks.length = 0;
      if (reduced) {
        cancelAnimationFrame(raf);
        frame(performance.now());
      } else start();
    };

    build();
    if (reduced) frame(performance.now());
    else start();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduceChange);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="background-fx"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
