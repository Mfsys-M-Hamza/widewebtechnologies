/**
 * Original vector illustration of the workspace scene. Used on mobile, when
 * WebGL is unavailable, for Save-Data users, and while the 3D scene loads.
 * Floating motion is CSS-only and disabled for reduced-motion users.
 */
export function HeroFallback() {
  return (
    <svg
      viewBox="0 0 640 560"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a modern workspace: a monitor showing a business website, a laptop with code, a keyboard, a mouse, a smartphone and headphones."
    >
      <defs>
        <linearGradient id="hf-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1230" />
          <stop offset="1" stopColor="#1d1758" />
        </linearGradient>
        <linearGradient id="hf-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8cff" />
          <stop offset="1" stopColor="#9b6bff" />
        </linearGradient>
        <linearGradient id="hf-orb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38d5f5" />
          <stop offset="1" stopColor="#9b6bff" />
        </linearGradient>
        <linearGradient id="hf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26305e" />
          <stop offset="1" stopColor="#141b3c" />
        </linearGradient>
        <linearGradient id="hf-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8cff" stopOpacity=".18" />
          <stop offset="1" stopColor="#4f8cff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hf-glow-a" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#9b6bff" stopOpacity=".45" />
          <stop offset="1" stopColor="#9b6bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hf-glow-b" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#4f8cff" stopOpacity=".4" />
          <stop offset="1" stopColor="#4f8cff" stopOpacity="0" />
        </radialGradient>
        <filter id="hf-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* ambient light pools */}
      <circle cx="470" cy="150" r="190" fill="url(#hf-glow-a)" />
      <circle cx="150" cy="330" r="200" fill="url(#hf-glow-b)" />
      <ellipse cx="320" cy="470" rx="310" ry="60" fill="url(#hf-desk)" />

      {/* MONITOR */}
      <g>
        <ellipse cx="330" cy="398" rx="90" ry="10" fill="#000" opacity=".45" filter="url(#hf-blur)" />
        <rect x="322" y="300" width="18" height="86" fill="url(#hf-body)" />
        <rect x="283" y="382" width="96" height="12" rx="6" fill="url(#hf-body)" />
        <rect x="140" y="70" width="380" height="234" rx="16" fill="#0f1530" stroke="#2f3a72" strokeWidth="1.5" />
        <rect x="151" y="81" width="358" height="206" rx="9" fill="url(#hf-screen)" />
        {/* website mock on screen */}
        <rect x="165" y="94" width="14" height="14" rx="4" fill="url(#hf-brand)" />
        <rect x="185" y="98" width="52" height="6" rx="3" fill="#eef1fa" opacity=".85" />
        <rect x="340" y="98" width="24" height="5" rx="2.5" fill="#eef1fa" opacity=".7" />
        <rect x="372" y="98" width="30" height="5" rx="2.5" fill="#a6b0cc" opacity=".6" />
        <rect x="410" y="98" width="24" height="5" rx="2.5" fill="#a6b0cc" opacity=".6" />
        <rect x="462" y="93" width="34" height="15" rx="7.5" fill="#2ee6d6" />
        <rect x="165" y="128" width="168" height="15" rx="4" fill="#ffffff" />
        <rect x="165" y="150" width="138" height="15" rx="4" fill="url(#hf-brand)" />
        <rect x="165" y="175" width="150" height="5" rx="2.5" fill="#a6b0cc" opacity=".55" />
        <rect x="165" y="185" width="126" height="5" rx="2.5" fill="#a6b0cc" opacity=".55" />
        <rect x="165" y="201" width="66" height="18" rx="9" fill="url(#hf-brand)" />
        <rect x="238" y="201" width="54" height="18" rx="9" fill="none" stroke="#eef1fa" strokeOpacity=".4" />
        <rect x="362" y="118" width="132" height="110" rx="12" fill="#ffffff" opacity=".06" />
        <circle cx="428" cy="168" r="36" fill="url(#hf-orb)" />
        <rect x="372" y="200" width="66" height="20" rx="6" fill="#0a0f1f" opacity=".85" />
        <rect x="378" y="206" width="8" height="8" rx="2" fill="#4ade80" />
        <rect x="391" y="207" width="38" height="4" rx="2" fill="#eef1fa" opacity=".7" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={165 + i * 112} y="238" width="102" height="38" rx="8" fill="#ffffff" opacity=".05" />
            <rect x={173 + i * 112} y="246" width="14" height="14" rx="4" fill={["#4f8cff", "#9b6bff", "#38d5f5"][i]} />
            <rect x={193 + i * 112} y="248" width="56" height="5" rx="2.5" fill="#eef1fa" opacity=".65" />
            <rect x={193 + i * 112} y="257" width="40" height="4" rx="2" fill="#a6b0cc" opacity=".45" />
          </g>
        ))}
        <rect x="270" y="306" width="120" height="2" rx="1" fill="#7aa8ff" opacity=".8" />
      </g>

      {/* LAPTOP */}
      <g>
        <ellipse cx="150" cy="430" rx="150" ry="12" fill="#000" opacity=".5" filter="url(#hf-blur)" />
        <rect x="40" y="262" width="222" height="146" rx="10" fill="url(#hf-body)" stroke="#33407a" strokeWidth="1.2" />
        <rect x="50" y="272" width="202" height="126" rx="5" fill="#0b1022" />
        <rect x="50" y="272" width="202" height="14" rx="5" fill="#121a36" />
        <circle cx="60" cy="279" r="2.6" fill="#ff6b6b" />
        <circle cx="69" cy="279" r="2.6" fill="#f5c451" />
        <circle cx="78" cy="279" r="2.6" fill="#4ade80" />
        {[
          [["#6b7699", 70]],
          [["#c39bff", 22], ["#e6e9f5", 26], ["#7aa8ff", 50]],
          [["#e6e9f5", 30], ["#5ee0c0", 64]],
          [["#e6e9f5", 46], ["#c39bff", 24]],
          [["#e6e9f5", 30], ["#5ee0c0", 34], ["#5ee0c0", 44]],
          [["#e6e9f5", 18]],
          [["#e6e9f5", 22], ["#7aa8ff", 46], ["#5ee0c0", 34]],
          [["#c39bff", 28], ["#e6e9f5", 20], ["#7aa8ff", 36]],
        ].map((tokens, row) => {
          let x = 72;
          return (
            <g key={row}>
              <rect x="58" y={295 + row * 12} width="6" height="4" rx="1" fill="#3a4466" />
              {(tokens as [string, number][]).map(([color, w], i) => {
                const el = <rect key={i} x={x} y={295 + row * 12} width={w} height="4.5" rx="2" fill={color} opacity=".9" />;
                x += w + 5;
                return el;
              })}
            </g>
          );
        })}
        <path d="M24 408 H278 L300 428 H2 Z" fill="#232c58" stroke="#3a4888" strokeWidth="1" />
        <rect x="118" y="412" width="66" height="8" rx="4" fill="#141b3c" />
      </g>

      {/* KEYBOARD */}
      <g>
        <ellipse cx="398" cy="470" rx="160" ry="10" fill="#000" opacity=".5" filter="url(#hf-blur)" />
        <path d="M262 428 H530 L552 466 H240 Z" fill="#131b3a" stroke="#2f3a72" strokeWidth="1.2" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({ length: 13 }).map((_, c) => (
              <rect key={c} x={272 - r * 6 + c * 20.5 + r * 0.5} y={434 + r * 10} width="16" height="6.5" rx="1.6" fill="#28326a" />
            ))}
          </g>
        ))}
        <rect x="340" y="465" width="100" height="1.6" rx=".8" fill="#9b6bff" opacity=".9" />
      </g>

      {/* MOUSE */}
      <g>
        <ellipse cx="592" cy="472" rx="26" ry="6" fill="#000" opacity=".5" filter="url(#hf-blur)" />
        <ellipse cx="592" cy="448" rx="20" ry="26" fill="url(#hf-body)" stroke="#3a4888" />
        <rect x="590.5" y="430" width="3" height="9" rx="1.5" fill="#4f8cff" />
      </g>

      {/* PHONE (floating) */}
      <g transform="translate(540 150) rotate(9)">
        <g className="motion-float-a">
          <rect x="0" y="0" width="82" height="164" rx="15" fill="#0f1530" stroke="#3a4888" strokeWidth="1.5" />
          <rect x="5" y="5" width="72" height="154" rx="11" fill="url(#hf-screen)" />
          <rect x="31" y="9" width="20" height="5" rx="2.5" fill="#05070f" />
          <rect x="12" y="24" width="58" height="46" rx="8" fill="url(#hf-brand)" />
          <rect x="18" y="36" width="30" height="5" rx="2.5" fill="#fff" />
          <rect x="18" y="45" width="22" height="5" rx="2.5" fill="#fff" />
          <rect x="18" y="56" width="24" height="8" rx="4" fill="#fff" opacity=".9" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="12" y={78 + i * 22} width="58" height="18" rx="5" fill="#fff" opacity=".07" />
              <rect x="16" y={82 + i * 22} width="10" height="10" rx="3" fill={["#38d5f5", "#9b6bff", "#4f8cff"][i]} />
              <rect x="30" y={85 + i * 22} width="32" height="4" rx="2" fill="#eef1fa" opacity=".6" />
            </g>
          ))}
          <rect x="12" y="144" width="58" height="10" rx="5" fill="#2ee6d6" />
        </g>
      </g>

      {/* HEADPHONES (floating) */}
      <g transform="translate(58 70) rotate(-10)">
        <g className="motion-float-b">
          <path d="M8 70 A52 52 0 0 1 112 70" fill="none" stroke="url(#hf-body)" strokeWidth="9" strokeLinecap="round" />
          <path d="M8 70 A52 52 0 0 1 112 70" fill="none" stroke="#3a4888" strokeWidth="1" />
          <rect x="-6" y="58" width="26" height="46" rx="11" fill="url(#hf-body)" stroke="#3a4888" />
          <rect x="100" y="58" width="26" height="46" rx="11" fill="url(#hf-body)" stroke="#3a4888" />
          <rect x="16" y="66" width="3" height="30" rx="1.5" fill="#4f8cff" />
          <rect x="101" y="66" width="3" height="30" rx="1.5" fill="#9b6bff" />
        </g>
      </g>

      {/* STYLE PANEL (floating) */}
      <g transform="translate(18 168) rotate(-4)">
        <g className="motion-float-c">
          <rect width="104" height="76" rx="12" fill="#131b3a" fillOpacity=".9" stroke="#4f8cff" strokeOpacity=".5" />
          <text x="12" y="34" fill="#eef1fa" fontSize="26" fontWeight="700" fontFamily="system-ui, sans-serif">
            Aa
          </text>
          <rect x="58" y="18" width="34" height="5" rx="2.5" fill="#a6b0cc" opacity=".7" />
          <rect x="58" y="28" width="24" height="4" rx="2" fill="#a6b0cc" opacity=".45" />
          {["#4f8cff", "#9b6bff", "#38d5f5", "#eef1fa"].map((c, i) => (
            <circle key={c} cx={20 + i * 22} cy="56" r="7.5" fill={c} />
          ))}
        </g>
      </g>

      {/* floating gems */}
      <g className="motion-float-b">
        <path d="M300 22 l10 14 -10 14 -10 -14 z" fill="#4f8cff" opacity=".9" />
      </g>
      <g className="motion-float-a">
        <path d="M600 72 l8 10 -8 10 -8 -10 z" fill="#9b6bff" opacity=".9" />
      </g>
      <g className="motion-float-c">
        <rect x="604" y="320" width="14" height="14" rx="3" transform="rotate(20 611 327)" fill="#38d5f5" opacity=".85" />
      </g>
    </svg>
  );
}
