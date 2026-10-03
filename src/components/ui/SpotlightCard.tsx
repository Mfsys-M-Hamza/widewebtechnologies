"use client";

import { useRef } from "react";

/**
 * Card with a soft glow that follows the mouse pointer.
 * Pointer position is written to CSS variables (no React re-renders); touch and keyboard users see the plain card.
 */
export function SpotlightCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`group relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(22rem circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(79 140 255 / 0.16), rgb(155 107 255 / 0.06) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
