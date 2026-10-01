import { useId } from "react";

/**
 * Wide Web Technologies symbol — the network "W" from the official logo pack
 * (public/brand). Geometry is copied from wide-web-icon-dark.svg.
 */
export function LogoMark({ className = "h-9 w-11" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="-2 -14 124 106" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`wg-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2EE6D6" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <filter id={`wglow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feFlood floodColor="#2EE6D6" floodOpacity=".45" />
          <feComposite in2="b" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" filter={`url(#wglow-${id})`}>
        <path d="M8 22 Q60 -10 112 22" stroke={`url(#wg-${id})`} strokeWidth="2.6" />
        <path d="M10 24 L60 46 M110 24 L60 46 M35 84 L85 84" stroke="rgba(160,200,255,.5)" strokeWidth="1.2" />
        <path d="M10 24 L35 84 L60 46 L85 84 L110 24" stroke={`url(#wg-${id})`} strokeWidth="8" />
        {[
          [10, 24, 6],
          [35, 84, 6],
          [60, 46, 7],
          [85, 84, 6],
          [110, 24, 6],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#070B16" stroke="#F4F7FB" strokeWidth="2.8" />
        ))}
        <circle cx="60" cy="46" r="2.8" fill="#2EE6D6" stroke="none" />
      </g>
    </svg>
  );
}

/** Horizontal lockup for the navigation and menus: symbol + "WIDE WEB / TECHNOLOGIES". */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-9 w-11 shrink-0" />
      {/* On very narrow phones (under 360px) the compact nav shows the symbol only. */}
      <span className={`flex-col leading-none ${compact ? "hidden min-[360px]:flex" : "flex"}`}>
        <span className="whitespace-nowrap font-brand text-[1.05rem] font-bold tracking-[0.06em] text-[#F4F7FB]">
          WIDE <span className="bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent">WEB</span>
        </span>
        <span
          className={`mt-1 font-brand text-[0.56rem] font-light uppercase tracking-[0.42em] text-[#8C98AE] ${
            compact ? "hidden sm:block" : ""
          }`}
        >
          Technologies
        </span>
      </span>
    </span>
  );
}
