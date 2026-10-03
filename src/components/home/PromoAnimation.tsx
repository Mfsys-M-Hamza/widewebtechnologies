"use client";

import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { services, siteConfig } from "@/config/site";
import { createPromoScene, PROMO_DURATION, PROMO_H, PROMO_W, type PromoContent } from "./promoScene";

/** Frame shown before the first play (the finished end card). */
const POSTER_TIME = 23;

const { contact } = siteConfig;
const content: PromoContent = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  services: services.map((s) => s.shortTitle),
  contactLine: [
    contact.whatsappDisplay.verified ? `WhatsApp  ${contact.whatsappDisplay.value}` : "",
    contact.location.verified ? contact.location.value : "",
  ]
    .filter(Boolean)
    .join("   ·   "),
  cta: "Book a Free Consultation  →",
};

/**
 * 24-second canvas promo: from a WhatsApp chat to a live website on every device.
 * Runs only while on screen and the tab is visible. Reduced-motion users see the
 * still end card and can start it themselves.
 */
export function PromoAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  // null = follow the reduced-motion preference until the visitor presses Play/Pause.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? Boolean(reduced);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const render = createPromoScene(ctx, content, {
      brand: css.getPropertyValue("--font-poppins").trim() || "Poppins",
      body: css.getPropertyValue("--font-inter").trim() || "Inter",
      mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    });

    let scale = 1;
    let t = 0;
    let started = false;
    let dirty = true;
    let onScreen = false;
    let frame = 0;
    let last = 0;

    // Keep the drawing buffer close to the displayed size (capped at the 1920px stage).
    const resize = () => {
      const w = Math.min(PROMO_W, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2)));
      if (w > 0 && w !== canvas.width) {
        canvas.width = w;
        canvas.height = Math.round((w * PROMO_H) / PROMO_W);
      }
      // Always derive the scale from the real buffer width (it may already be sized from an earlier mount).
      scale = canvas.width / PROMO_W;
      dirty = true;
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!pausedRef.current) {
        t = (t + dt) % PROMO_DURATION;
        started = true;
        dirty = true;
      }
      if (dirty) {
        render(started ? t : POSTER_TIME, scale);
        dirty = false;
      }
      schedule();
    };
    const schedule = () => {
      if (!frame && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) schedule();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : schedule());
    document.addEventListener("visibilitychange", onVisibility);
    // Redraw once web fonts are ready so a paused frame isn't left in fallback fonts.
    document.fonts?.ready.then(() => {
      dirty = true;
    });
    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="edge relative overflow-hidden rounded-[2rem] bg-ink-950 shadow-glow">
      <canvas
        ref={canvasRef}
        width={PROMO_W}
        height={PROMO_H}
        role="img"
        aria-label={`${siteConfig.name} promo animation: a client asks for a website on WhatsApp, we sketch a wireframe, write the code and launch the site on a laptop and a phone, then list our services and invite you to book a free consultation.`}
        className="block aspect-video w-full"
      />
      <button
        type="button"
        onClick={() => setUserPaused(!paused)}
        className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-ink-900/70 px-3.5 text-xs font-medium text-muted backdrop-blur transition hover:text-fg sm:bottom-4 sm:right-4"
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        {paused ? "Play animation" : "Pause animation"}
      </button>
    </div>
  );
}
