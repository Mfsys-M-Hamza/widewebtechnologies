"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Scroll-driven gallery adapted from 21st.dev's "Panoramic Spread Hero":
 * a stack of cards unfolds into a 3D arch as the section scrolls past, with the
 * overlay content (children) rising into view. Reduced-motion users get the
 * spread layout without scroll pinning.
 */

export type SpreadItem = { src: string; alt: string; kind: "desktop" | "mobile" };

type Pose = { x: number; y: number; rotateZ: number; rotateY: number; scale: number };
type Layout = { stacked: Pose; spread: Pose };

// Card sizes (CSS lengths) for 16:10 desktop and 390:844 phone screenshots. Small screens get
// larger vw-based cards so they stay readable; the overlap is part of the stacked arch look.
const SIZES = {
  wide: {
    desktop: { w: "min(46vh, 40vw)", h: "min(28.75vh, 25vw)" },
    mobile: { w: "min(15.5vh, 15vw)", h: "min(33.5vh, 32.4vw)" },
  },
  narrow: {
    desktop: { w: "min(36vh, 58vw)", h: "min(22.5vh, 36.25vw)" },
    mobile: { w: "min(13vh, 22vw)", h: "min(28vh, 47.6vw)" },
  },
};

function layoutFor(offset: number, mobile: boolean): Layout {
  const abs = Math.abs(offset);
  return mobile
    ? {
        stacked: { x: offset * 1.5, y: offset * -1.5, rotateZ: offset * 3, rotateY: 0, scale: 1 },
        spread: { x: offset * 15, y: abs * 4, rotateZ: offset * 2, rotateY: offset * -15, scale: 1 - abs * 0.04 },
      }
    : {
        stacked: { x: offset * 2, y: offset * -2, rotateZ: offset * 2.5, rotateY: 0, scale: 1 },
        spread: { x: offset * 13, y: abs * 3, rotateZ: offset * 1.5, rotateY: offset * -12, scale: 1 - abs * 0.05 },
      };
}

// Higher damping, no bounce: keeps scroll-linked motion smooth instead of jittery.
const PROGRESS_SPRING = { stiffness: 80, damping: 25, mass: 0.5, restDelta: 0.001 };
const TILT_SPRING = { stiffness: 50, damping: 25, mass: 0.5 };

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const mobileQuery = "(max-width: 767px)";
function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia(mobileQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useIsMobile() {
  return useSyncExternalStore(subscribeMobile, () => window.matchMedia(mobileQuery).matches, () => false);
}

/** Gentle whole-gallery tilt that follows the mouse once the cards are spread. */
function usePointerTilt(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, TILT_SPRING);
  const tiltY = useSpring(rawY, TILT_SPRING);

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set((e.clientY / window.innerHeight - 0.5) * -8);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 8);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { tiltX, tiltY };
}

function SpreadCard({
  item,
  index,
  total,
  progress,
  isMobile,
}: {
  item: SpreadItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  const offset = index - (total - 1) / 2;
  const { stacked, spread } = layoutFor(offset, isMobile);
  const size = SIZES[isMobile ? "narrow" : "wide"][item.kind];

  const eased = useTransform(progress, easeInOut);
  const x = useTransform(eased, [0, 1], [stacked.x, spread.x], { clamp: true });
  const y = useTransform(eased, [0, 1], [stacked.y, spread.y], { clamp: true });
  const xv = useTransform(x, (v) => `${v}vw`);
  const yv = useTransform(y, (v) => `${v}vh`);
  const rotateZ = useTransform(eased, [0, 1], [stacked.rotateZ, spread.rotateZ]);
  const rotateY = useTransform(eased, [0, 1], [stacked.rotateY, spread.rotateY]);
  const scale = useTransform(eased, [0, 1], [0.75, spread.scale]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ zIndex: Math.round(10 - Math.abs(offset)) }}>
      <motion.div
        className="will-change-transform"
        style={{
          width: size.w,
          height: size.h,
          marginLeft: `calc(${size.w} / -2)`,
          marginTop: `calc(${size.h} / -2)`,
          x: xv,
          y: yv,
          rotateZ,
          rotateY,
          scale,
          transformOrigin: "center center -50px",
        }}
      >
        {item.kind === "desktop" ? (
          <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-950 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.9)] ring-1 ring-electric/15">
            <div className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-[#111833] px-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b6b]/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5c451]/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]/80" />
            </div>
            <div className="relative flex-1">
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 40vw, 45vw" className="object-cover object-top" draggable={false} />
            </div>
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden rounded-[1rem] border-[3px] border-[#1d2750] bg-ink-950 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.9)]">
            <div className="relative h-full w-full">
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 768px) 16vw, 20vw" className="object-cover object-top" draggable={false} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function PanoramicSpread({ items, children }: { items: SpreadItem[]; children?: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, PROGRESS_SPRING);
  const scrolled = useTransform(smooth, [0.1, 0.8], [0, 1], { clamp: true });
  const fixed = useMotionValue(1);
  const progress = reduce ? fixed : scrolled;

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(scrolled, "change", (p) => setSpread(p > 0.95));
  const { tiltX, tiltY } = usePointerTilt(spread && !reduce);

  // Overlay content rises and fades in as the cards unfold.
  const textY = useTransform(progress, [0.2, 1], ["8vh", "-24vh"]);
  const textScale = useTransform(progress, [0.2, 1], [0.9, 1]);
  const textOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  return (
    <div ref={wrapRef} className={`relative w-full ${reduce ? "" : "h-[300vh]"}`}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden [perspective:1200px]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/15 blur-[100px]" aria-hidden="true" />

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center [transform-style:preserve-3d]"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          {items.map((item, i) => (
            <SpreadCard key={item.src} item={item} index={i} total={items.length} progress={progress} isMobile={isMobile} />
          ))}
        </motion.div>

        {children ? (
          <motion.div
            className="absolute z-[5] flex flex-col items-center px-5 text-center"
            style={{ y: textY, scale: textScale, opacity: textOpacity }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
