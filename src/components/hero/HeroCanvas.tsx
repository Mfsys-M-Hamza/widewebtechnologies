"use client";

/**
 * Real-time 3D workspace scene: monitor, laptop, keyboard, mouse, phone and
 * headphones. Every model and screen image is generated in code — no external
 * models, textures or HDR files are downloaded.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function useCanvasTexture(draw: Draw, w: number, h: number) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
    // draw functions are static module-level functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h]);
}

/* ───────────────────────── screen artwork ───────────────────────── */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

const drawWebsite: Draw = (ctx, w, h) => {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0b1230");
  bg.addColorStop(1, "#1a1550");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // glow
  const glow = ctx.createRadialGradient(w * 0.78, h * 0.35, 10, w * 0.78, h * 0.35, w * 0.4);
  glow.addColorStop(0, "rgba(155,107,255,0.45)");
  glow.addColorStop(1, "rgba(155,107,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // nav
  const brand = ctx.createLinearGradient(40, 30, 80, 70);
  brand.addColorStop(0, "#4f8cff");
  brand.addColorStop(1, "#9b6bff");
  rr(ctx, 48, 34, 44, 44, 12, brand);
  ctx.fillStyle = "#eef1fa";
  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText("Your Business", 108, 65);
  ["Home", "Services", "About", "Contact"].forEach((t, i) => {
    ctx.fillStyle = i === 0 ? "#ffffff" : "rgba(238,241,250,0.6)";
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.fillText(t, w - 560 + i * 110, 63);
  });
  rr(ctx, w - 150, 32, 110, 46, 23, "#2ee6d6");

  // hero copy
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px system-ui, sans-serif";
  ctx.fillText("Grow your business", 48, 220);
  const tg = ctx.createLinearGradient(48, 0, 560, 0);
  tg.addColorStop(0, "#7aa8ff");
  tg.addColorStop(1, "#b896ff");
  ctx.fillStyle = tg;
  ctx.fillText("online, beautifully.", 48, 292);
  [520, 460, 380].forEach((lw, i) => rr(ctx, 48, 336 + i * 30, lw, 14, 7, "rgba(166,176,204,0.45)"));
  const cta = ctx.createLinearGradient(48, 0, 260, 0);
  cta.addColorStop(0, "#4f8cff");
  cta.addColorStop(1, "#9b6bff");
  rr(ctx, 48, 450, 220, 58, 29, cta);
  ctx.fillStyle = "#fff";
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText("Get started", 100, 486);
  ctx.strokeStyle = "rgba(238,241,250,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(288, 450, 180, 58, 29);
  ctx.stroke();

  // visual card on right
  rr(ctx, w * 0.6, 130, w * 0.34, 330, 28, "rgba(255,255,255,0.06)");
  const orb = ctx.createLinearGradient(w * 0.65, 160, w * 0.9, 420);
  orb.addColorStop(0, "#38d5f5");
  orb.addColorStop(1, "#9b6bff");
  ctx.fillStyle = orb;
  ctx.beginPath();
  ctx.arc(w * 0.77, 290, 105, 0, Math.PI * 2);
  ctx.fill();
  rr(ctx, w * 0.63, 380, 160, 56, 16, "rgba(10,15,31,0.75)");
  rr(ctx, w * 0.645, 396, 24, 24, 6, "#4ade80");
  rr(ctx, w * 0.645 + 36, 398, 90, 10, 5, "rgba(238,241,250,0.7)");
  rr(ctx, w * 0.645 + 36, 414, 60, 8, 4, "rgba(166,176,204,0.5)");

  // feature cards
  for (let i = 0; i < 3; i++) {
    const x = 48 + i * ((w - 96) / 3);
    const cw = (w - 96) / 3 - 24;
    rr(ctx, x, 560, cw, 120, 20, "rgba(255,255,255,0.05)");
    rr(ctx, x + 20, 582, 40, 40, 12, ["#4f8cff", "#9b6bff", "#38d5f5"][i]);
    rr(ctx, x + 76, 588, cw - 120, 12, 6, "rgba(238,241,250,0.7)");
    rr(ctx, x + 76, 610, cw - 160, 10, 5, "rgba(166,176,204,0.45)");
    rr(ctx, x + 20, 642, cw - 40, 10, 5, "rgba(166,176,204,0.3)");
  }
};

const drawCode: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#0b1022";
  ctx.fillRect(0, 0, w, h);
  rr(ctx, 0, 0, w, 48, 0, "#121a36");
  ["#ff6b6b", "#f5c451", "#4ade80"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(28 + i * 26, 24, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  rr(ctx, 120, 10, 170, 38, 8, "#0b1022");
  ctx.fillStyle = "#a6b0cc";
  ctx.font = "500 18px ui-monospace, monospace";
  ctx.fillText("website.ts", 145, 36);

  const K = "#c39bff", S = "#5ee0c0", P = "#7aa8ff", T = "#e6e9f5", C = "#6b7699";
  const lines: [string, string][][] = [
    [["// Wide Web Technologies", C]],
    [["const ", K], ["site", T], [" = ", T], ["createWebsite", P], ["({", T]],
    [["  name: ", T], ['"Your Business"', S], [",", T]],
    [["  responsive: ", T], ["true", K], [",", T]],
    [["  pages: [", T], ['"Home"', S], [", ", T], ['"Services"', S], [",", T]],
    [["          ", T], ['"About"', S], [", ", T], ['"Contact"', S], ["],", T]],
    [["});", T]],
    [["", T]],
    [["site", T], [".", T], ["addSection", P], ["(", T], ['"hero"', S], [", {", T]],
    [["  cta: ", T], ['"Book a consultation"', S], [",", T]],
    [["});", T]],
    [["", T]],
    [["await ", K], ["site", T], [".", T], ["launch", P], ["();", T]],
  ];
  ctx.font = "500 24px ui-monospace, SFMono-Regular, Menlo, monospace";
  lines.forEach((tokens, i) => {
    const y = 100 + i * 38;
    ctx.fillStyle = "#3a4466";
    ctx.fillText(String(i + 1).padStart(2, " "), 22, y);
    let x = 76;
    for (const [text, color] of tokens) {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
  });
  // cursor
  rr(ctx, 300, 100 + 12 * 38 - 22, 3, 28, 1, "#7aa8ff");
};

const drawPhone: Draw = (ctx, w, h) => {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0d1434");
  bg.addColorStop(1, "#1a1550");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  rr(ctx, w / 2 - 50, 18, 100, 22, 11, "#05070f");
  rr(ctx, 28, 70, 36, 36, 10, "#4f8cff");
  rr(ctx, w - 70, 78, 42, 6, 3, "#eef1fa");
  rr(ctx, w - 70, 90, 42, 6, 3, "#eef1fa");
  const hero = ctx.createLinearGradient(0, 130, w, 380);
  hero.addColorStop(0, "#4f8cff");
  hero.addColorStop(1, "#9b6bff");
  rr(ctx, 28, 130, w - 56, 230, 26, hero);
  ctx.fillStyle = "#fff";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("Hello,", 52, 210);
  ctx.fillText("mobile.", 52, 252);
  rr(ctx, 52, 290, 130, 40, 20, "rgba(255,255,255,0.92)");
  [0, 1, 2].forEach((i) => {
    rr(ctx, 28, 390 + i * 120, w - 56, 100, 20, "rgba(255,255,255,0.06)");
    rr(ctx, 48, 412 + i * 120, 56, 56, 14, ["#38d5f5", "#9b6bff", "#4f8cff"][i]);
    rr(ctx, 120, 420 + i * 120, w - 190, 12, 6, "rgba(238,241,250,0.7)");
    rr(ctx, 120, 444 + i * 120, w - 230, 10, 5, "rgba(166,176,204,0.45)");
  });
  rr(ctx, 28, h - 70, w - 56, 48, 24, "#2ee6d6");
};

const drawLaptopDeck: Draw = (ctx, w, h) => {
  ctx.fillStyle = "#151c3b";
  ctx.fillRect(0, 0, w, h);
  const cols = 14;
  const rows = 5;
  const pad = 40;
  const kw = (w - pad * 2) / cols;
  const kh = (h * 0.62 - pad) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rr(ctx, pad + c * kw + 3, pad + r * kh + 3, kw - 6, kh - 6, 5, "#0b1022");
    }
  }
  rr(ctx, w / 2 - 150, h * 0.7, 300, h * 0.22, 14, "#10173a");
};

const drawPalette: Draw = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  rr(ctx, 0, 0, w, h, 36, "rgba(19,27,58,0.82)");
  ctx.strokeStyle = "rgba(122,168,255,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(2, 2, w - 4, h - 4, 34);
  ctx.stroke();
  ctx.fillStyle = "#eef1fa";
  ctx.font = "700 92px system-ui, sans-serif";
  ctx.fillText("Aa", 36, 120);
  ctx.fillStyle = "rgba(166,176,204,0.9)";
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillText("Brand style", 40, 166);
  ["#4f8cff", "#9b6bff", "#38d5f5", "#eef1fa"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(64 + i * 66, 222, 24, 0, Math.PI * 2);
    ctx.fill();
  });
};

/* ───────────────────────── models ───────────────────────── */

const BODY = { color: "#3a4680", metalness: 0.6, roughness: 0.3 } as const;
const BODY_DARK = { color: "#232c58", metalness: 0.5, roughness: 0.35 } as const;

function Screen({ texture, width, height, z }: { texture: THREE.Texture; width: number; height: number; z: number }) {
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Monitor() {
  const tex = useCanvasTexture(drawWebsite, 1280, 720);
  return (
    <group position={[0.45, 0.95, -1.2]}>
      <RoundedBox args={[3.5, 2.1, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial {...BODY_DARK} />
      </RoundedBox>
      <Screen texture={tex} width={3.36} height={1.89} z={0.052} />
      {/* neck + base */}
      <mesh position={[0, -1.7, -0.18]}>
        <boxGeometry args={[0.22, 1.3, 0.08]} />
        <meshStandardMaterial {...BODY} />
      </mesh>
      <RoundedBox args={[1.25, 0.06, 0.7]} radius={0.03} position={[0, -2.37, -0.05]}>
        <meshStandardMaterial {...BODY} />
      </RoundedBox>
      {/* rim light strip */}
      <mesh position={[0, -1.06, 0.03]}>
        <boxGeometry args={[1.2, 0.015, 0.02]} />
        <meshBasicMaterial color="#7aa8ff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Laptop() {
  const screenTex = useCanvasTexture(drawCode, 1024, 640);
  const deckTex = useCanvasTexture(drawLaptopDeck, 1024, 680);
  return (
    <group position={[-2.15, -1.38, 0.45]} rotation={[0, 0.55, 0]}>
      <RoundedBox args={[2.1, 0.08, 1.4]} radius={0.035} smoothness={4}>
        <meshStandardMaterial {...BODY} />
      </RoundedBox>
      <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.32]} />
        <meshStandardMaterial map={deckTex} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* lid hinged at the back edge */}
      <group position={[0, 0.04, -0.69]} rotation={[-0.28, 0, 0]}>
        <RoundedBox args={[2.1, 1.36, 0.05]} radius={0.03} smoothness={4} position={[0, 0.68, 0]}>
          <meshStandardMaterial {...BODY} />
        </RoundedBox>
        <mesh position={[0, 0.68, 0.027]}>
          <planeGeometry args={[1.96, 1.22]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Keyboard() {
  const keys = useRef<THREE.InstancedMesh>(null);
  const cols = 15;
  const rows = 4;
  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        m.setPosition(-1.19 + c * 0.17, 0.075, -0.27 + r * 0.17);
        mesh.setMatrixAt(i++, m);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group position={[0.55, -1.4, 1.15]} rotation={[0.04, -0.06, 0]}>
      <RoundedBox args={[2.75, 0.09, 0.95]} radius={0.04} smoothness={4}>
        <meshStandardMaterial {...BODY_DARK} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, rows * cols]}>
        <boxGeometry args={[0.14, 0.05, 0.14]} />
        <meshStandardMaterial color="#3d4a8a" metalness={0.3} roughness={0.45} />
      </instancedMesh>
      {/* spacebar */}
      <mesh position={[0, 0.075, 0.41]}>
        <boxGeometry args={[1.1, 0.05, 0.13]} />
        <meshStandardMaterial color="#46549a" metalness={0.3} roughness={0.45} />
      </mesh>
      {/* underglow */}
      <mesh position={[0, -0.03, 0.49]}>
        <boxGeometry args={[2.5, 0.02, 0.01]} />
        <meshBasicMaterial color="#9b6bff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Mouse() {
  return (
    <group position={[2.45, -1.35, 1.2]} rotation={[0, -0.25, 0]}>
      <mesh scale={[0.25, 0.11, 0.38]}>
        <sphereGeometry args={[1, 40, 32]} />
        <meshStandardMaterial color="#3a4680" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.1, -0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.035, 20]} />
        <meshBasicMaterial color="#4f8cff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Phone() {
  const tex = useCanvasTexture(drawPhone, 360, 740);
  return (
    <group position={[2.8, 0.55, 0.35]} rotation={[0.08, -0.5, 0.1]}>
      <RoundedBox args={[0.74, 1.48, 0.07]} radius={0.06} smoothness={4}>
        <meshStandardMaterial {...BODY_DARK} />
      </RoundedBox>
      <Screen texture={tex} width={0.66} height={1.38} z={0.037} />
    </group>
  );
}

function Headphones() {
  return (
    <group position={[-3.05, 0.75, -0.35]} rotation={[0.2, 0.6, -0.15]} scale={0.8}>
      <mesh>
        <torusGeometry args={[0.6, 0.055, 16, 64, Math.PI]} />
        <meshStandardMaterial {...BODY} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0.6 * s, -0.08, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 40]} />
            <meshStandardMaterial color="#1b2347" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[0.085 * s, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.17, 0.018, 12, 48]} />
            <meshBasicMaterial color={s > 0 ? "#9b6bff" : "#4f8cff"} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StylePanel() {
  const tex = useCanvasTexture(drawPalette, 340, 270);
  return (
    <mesh position={[-1.55, 1.75, -0.4]} rotation={[0, 0.35, 0.04]}>
      <planeGeometry args={[1.06, 0.84]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

function Gem({ position, color, kind }: { position: [number, number, number]; color: string; kind: "octa" | "ico" | "box" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.4;
      ref.current.rotation.y += dt * 0.55;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      {kind === "octa" ? <octahedronGeometry args={[0.17]} /> : kind === "ico" ? <icosahedronGeometry args={[0.15]} /> : <boxGeometry args={[0.2, 0.2, 0.2]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} metalness={0.4} roughness={0.2} />
    </mesh>
  );
}

function DeskMat() {
  return (
    <group position={[0.1, -1.46, 0.55]}>
      <RoundedBox args={[6.0, 0.04, 2.6]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#141b3d" metalness={0.4} roughness={0.55} />
      </RoundedBox>
      {/* soft front edge light */}
      <mesh position={[0, 0.021, 1.29]}>
        <boxGeometry args={[5.7, 0.006, 0.012]} />
        <meshBasicMaterial color="#4f8cff" toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── rig + scene ───────────────────────── */

function Rig({ children, interactive }: { children: React.ReactNode; interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.lookAt(0, -0.15, 0);
  }, [camera]);

  useLayoutEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !interactive) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.12 + pointer.current.x * 0.22, 3.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.current.y * 0.07, 3.5, dt);
  });

  return (
    <group ref={group} rotation={[0, -0.12, 0]}>
      {children}
    </group>
  );
}

export default function HeroCanvas({
  active,
  reducedMotion,
  onReady,
}: {
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const animate = active && !reducedMotion;
  return (
    <Canvas
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.35, 9.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#cfdcff", "#1a1440", 1.1]} />
      <directionalLight position={[3, 6, 5]} intensity={2.8} color="#eef3ff" />
      <directionalLight position={[-4, 3, 6]} intensity={1.2} color="#9fb8ff" />
      <pointLight position={[-4, 1.5, 3]} intensity={30} color="#4f8cff" />
      <pointLight position={[4, 2.5, -1]} intensity={26} color="#9b6bff" />
      <pointLight position={[0.5, 0.6, 1.2]} intensity={6} color="#7aa8ff" distance={4} />

      <Environment resolution={256} frames={1} environmentIntensity={1.4}>
        <Lightformer form="rect" intensity={2.2} color="#7aa8ff" position={[-5, 2, 2]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#b896ff" position={[5, 3, -2]} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 6, 3]} scale={3} />
      </Environment>

      <Rig interactive={animate}>
        <group scale={0.8} position={[0.05, 0.1, 0]}>
          <Float enabled={animate} speed={1.1} rotationIntensity={0.08} floatIntensity={0.25} floatingRange={[-0.05, 0.05]}>
            <Monitor />
            <Laptop />
            <Keyboard />
            <Mouse />
          </Float>
          <Float enabled={animate} speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
            <Phone />
          </Float>
          <Float enabled={animate} speed={1.3} rotationIntensity={0.4} floatIntensity={0.8}>
            <Headphones />
          </Float>
          <Float enabled={animate} speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
            <StylePanel />
          </Float>
          {animate ? (
            <>
              <Gem position={[-0.55, 2.35, 0.3]} color="#4f8cff" kind="octa" />
              <Gem position={[2.35, 2.05, -0.8]} color="#9b6bff" kind="ico" />
              <Gem position={[-3.3, -0.3, 0.9]} color="#38d5f5" kind="box" />
            </>
          ) : null}
          <DeskMat />
          <ContactShadows position={[0, -1.435, 0.4]} scale={12} blur={2.6} far={4} opacity={0.65} color="#000000" frames={1} />
        </group>
      </Rig>
    </Canvas>
  );
}
