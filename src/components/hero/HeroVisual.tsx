"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroFallback } from "@/components/hero/HeroFallback";

// The 3D scene (three.js) is split into its own chunk and only downloaded when it will be shown.
const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    // Skip software-only WebGL (no GPU): it would make the page sluggish, so the illustration is shown instead.
    const opts = { failIfMajorPerformanceCaveat: true };
    const gl = (canvas.getContext("webgl2", opts) || canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const reduced = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [use3D, setUse3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);

  // Load the 3D scene only when it approaches the viewport, on large screens
  // with a hardware-accelerated GPU and no Save-Data preference.
  // The same observer pauses rendering whenever the scene is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    let eligible: boolean | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) return;
        if (eligible === null) {
          eligible =
            window.matchMedia("(min-width: 1024px)").matches && !nav.connection?.saveData && supportsWebGL();
        }
        if (eligible) setUse3D(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Restrained scroll parallax (disabled for reduced motion).
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

  // Pointer-responsive perspective for the illustrated fallback (the 3D scene has its own rig).
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      ry.set(((e.clientX / window.innerWidth) * 2 - 1) * 6);
      rx.set(-((e.clientY / window.innerHeight) * 2 - 1) * 4);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, rx, ry]);

  return (
    <motion.div ref={wrapRef} style={{ y: parallaxY }} className="relative aspect-[8/7] w-full [perspective:1200px]">
      <motion.div
        style={{ rotateX: srx, rotateY: sry }}
        className={`absolute inset-0 transition-opacity duration-700 ${use3D && ready ? "opacity-0" : "opacity-100"}`}
        aria-hidden={use3D && ready ? true : undefined}
      >
        <HeroFallback />
      </motion.div>
      {use3D ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          role="img"
          aria-label="Interactive 3D workspace with a monitor showing a business website, a laptop with code, a keyboard, a mouse, a smartphone and headphones."
        >
          <HeroCanvas active={inView} reducedMotion={reduced} onReady={() => setReady(true)} />
        </div>
      ) : null}
    </motion.div>
  );
}
