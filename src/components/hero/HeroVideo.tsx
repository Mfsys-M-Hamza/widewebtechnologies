"use client";

import { RotateCcw, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Brand logo animation (public/brand/logo-animation.mp4, 1080x1920).
 * The frame is cropped to the logo area and its edges fade into the page.
 * Plays once and holds on the final logo; reduced-motion users see the still
 * final frame and can start it themselves.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "ended">("idle");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {
      /* autoplay blocked — the poster (final logo) stays visible and the play button is shown */
    });
  }, []);

  function replay() {
    const video = ref.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-brand-teal/15 blur-3xl" aria-hidden="true" />
      <div role="img" aria-label="Wide Web Technologies logo animation" className="relative aspect-[27/25] w-full [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_74%,transparent_100%)]">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/brand/logo-poster.jpg"
          onPlay={() => setState("playing")}
          onEnded={() => setState("ended")}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/brand/logo-animation.mp4" type="video/mp4" />
        </video>
      </div>
      {state !== "playing" ? (
        <button
          type="button"
          onClick={replay}
          className="absolute right-[4%] top-[4%] inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-ink-900/70 px-3.5 text-xs font-medium text-muted backdrop-blur transition hover:text-fg"
        >
          {state === "ended" ? <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
          {state === "ended" ? "Replay animation" : "Play animation"}
        </button>
      ) : null}
    </div>
  );
}
