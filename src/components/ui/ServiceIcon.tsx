import {
  BugPlay,
  Building2,
  LayoutTemplate,
  MonitorCheck,
  MonitorSmartphone,
  SearchCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/config/site";

const icons: Record<Service["icon"], LucideIcon> = {
  business: Building2,
  "qa-web": MonitorCheck,
  "qa-mobile": BugPlay,
  landing: LayoutTemplate,
  responsive: MonitorSmartphone,
  seo: SearchCheck,
  maintenance: Wrench,
};

const palettes: Record<Service["icon"], [string, string]> = {
  business: ["#4f8cff", "#7a5cff"],
  "qa-web": ["#2ee6d6", "#3b82f6"],
  "qa-mobile": ["#9b6bff", "#d06bff"],
  landing: ["#38d5f5", "#4f8cff"],
  responsive: ["#4f8cff", "#38d5f5"],
  seo: ["#7a5cff", "#4f8cff"],
  maintenance: ["#5b7bff", "#9b6bff"],
};

/**
 * A layered, extruded icon tile built with CSS 3D transforms.
 * Stacked translateZ layers give real depth; parent `group` hover tilts it.
 */
export function ServiceIcon({
  icon,
  size = "md",
  floating = false,
}: {
  icon: Service["icon"];
  size?: "md" | "lg";
  floating?: boolean;
}) {
  const Icon = icons[icon];
  const [a, b] = palettes[icon];
  const box = size === "lg" ? "h-24 w-24 rounded-[1.6rem]" : "h-14 w-14 rounded-2xl";
  const glyph = size === "lg" ? "h-10 w-10" : "h-6 w-6";

  return (
    <div className={`[perspective:600px] ${floating ? "motion-float-b" : ""}`} aria-hidden="true">
      <div
        className={`relative ${box} transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(14deg)_rotateY(-18deg)] group-hover:[transform:rotateX(4deg)_rotateY(-4deg)_translateZ(6px)]`}
      >
        {/* extrusion layers */}
        {[18, 12, 6].map((z) => (
          <span
            key={z}
            className={`absolute inset-0 ${box}`}
            style={{
              transform: `translateZ(-${z}px)`,
              background: `linear-gradient(140deg, ${a}, ${b})`,
              filter: `brightness(${0.35 + (18 - z) / 60})`,
            }}
          />
        ))}
        {/* face */}
        <span
          className={`absolute inset-0 flex items-center justify-center ${box} shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_18px_40px_-12px_rgb(79_140_255/0.6)]`}
          style={{ background: `linear-gradient(140deg, ${a}, ${b})` }}
        >
          <span className={`absolute inset-x-2 top-1 h-1/2 ${size === "lg" ? "rounded-t-[1.3rem]" : "rounded-t-xl"} bg-gradient-to-b from-white/30 to-transparent`} />
          <Icon className={`${glyph} relative text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.35)]`} strokeWidth={1.9} />
        </span>
      </div>
    </div>
  );
}
