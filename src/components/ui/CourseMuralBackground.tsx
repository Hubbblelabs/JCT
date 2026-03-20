export function CourseMuralBackground() {
  // ─────────────────────────────────────────────────────────
  //  All coordinates use a 100×62.5 viewBox (16:9 ratio).
  //  This means 1 unit = 1% of width on a 16:9 screen.
  //  SVG scales everything automatically — no px anywhere.
  // ─────────────────────────────────────────────────────────

  // Gear teeth helper — r1=inner, r2=outer, n=count
  const gearTeeth = (n: number, r1: number, r2: number, sw: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 360) / n;
      const ar = (a * Math.PI) / 180;
      const a2 = ((a + 360 / n) * 0.72 * Math.PI) / 180;
      const a3 = ((a + (360 / n) * 0.72) * Math.PI) / 180;
      const a4 = ((a + 360 / n) * Math.PI) / 180;
      return (
        <path
          key={i}
          strokeWidth={sw}
          d={`M${(Math.cos(ar) * r1).toFixed(2)} ${(Math.sin(ar) * r1).toFixed(2)} L${(Math.cos(ar) * r2).toFixed(2)} ${(Math.sin(ar) * r2).toFixed(2)} L${(Math.cos(a3) * r2).toFixed(2)} ${(Math.sin(a3) * r2).toFixed(2)} L${(Math.cos(a4) * r1).toFixed(2)} ${(Math.sin(a4) * r1).toFixed(2)}`}
        />
      );
    });

  const gearSpokes = (n: number, r: number, sw: number) =>
    Array.from({ length: n }, (_, i) => {
      const ar = (i * (180 / n) * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={(Math.cos(ar) * r).toFixed(2)}
          y1={(Math.sin(ar) * r).toFixed(2)}
          x2={(Math.cos(ar + Math.PI) * r).toFixed(2)}
          y2={(Math.sin(ar + Math.PI) * r).toFixed(2)}
          strokeWidth={sw}
          opacity="0.4"
        />
      );
    });

  const boltRing = (n: number, r: number, br: number, sw: number) =>
    Array.from({ length: n }, (_, i) => {
      const ar = (i * (360 / n) * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={(r * Math.cos(ar)).toFixed(2)}
          cy={(r * Math.sin(ar)).toFixed(2)}
          r={br}
          strokeWidth={sw}
        />
      );
    });

  const wheelSpokes = (n: number, ro: number, ri: number, sw: number) =>
    Array.from({ length: n }, (_, i) => {
      const ar = (i * (360 / n) * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={(ro * Math.cos(ar)).toFixed(2)}
          y1={(ro * Math.sin(ar)).toFixed(2)}
          x2={(ri * Math.cos(ar)).toFixed(2)}
          y2={(ri * Math.sin(ar)).toFixed(2)}
          strokeWidth={sw}
        />
      );
    });

  const treadLugs = (n: number, r1: number, r2: number, sw: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 360) / n;
      const ar = (a * Math.PI) / 180;
      const a2 = ((a + (360 / n) * 0.5) * Math.PI) / 180;
      return (
        <path
          key={i}
          strokeWidth={sw}
          d={`M${(Math.cos(ar) * r1).toFixed(2)} ${(Math.sin(ar) * r1).toFixed(2)} L${(Math.cos(ar) * r2).toFixed(2)} ${(Math.sin(ar) * r2).toFixed(2)} L${(Math.cos(a2) * r2).toFixed(2)} ${(Math.sin(a2) * r2).toFixed(2)} L${(Math.cos(a2) * r1).toFixed(2)} ${(Math.sin(a2) * r1).toFixed(2)}`}
        />
      );
    });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes spin-cw   { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes spin-ccw  { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes sway      { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }
        @keyframes flow-dash { from{stroke-dashoffset:0} to{stroke-dashoffset:-3} }
        @keyframes blink     { 0%,100%{opacity:.25} 50%{opacity:.9} }
        .gcw1  { transform-box:fill-box; transform-origin:center; animation:spin-cw   10s linear infinite; }
        .gccw1 { transform-box:fill-box; transform-origin:center; animation:spin-ccw   7s linear infinite; }
        .gcw2  { transform-box:fill-box; transform-origin:center; animation:spin-cw   18s linear infinite; }
        .gcw3  { transform-box:fill-box; transform-origin:center; animation:spin-cw   26s linear infinite; }
        .gccw2 { transform-box:fill-box; transform-origin:center; animation:spin-ccw  13s linear infinite; }
        .sw    { transform-box:fill-box; transform-origin:50% 100%; animation:sway 3.4s ease-in-out infinite; }
        .fd    { animation:flow-dash 2.2s linear infinite; }
        .bl    { animation:blink 2.8s ease-in-out infinite; }
      `}</style>

      {/*
        viewBox="0 0 100 62.5"  →  1 unit = 1vw on 16:9
        All coordinates are now % of viewport width.
        On mobile (narrow), SVG shrinks and all elements scale together.
      */}
      <svg
        className="h-full w-full"
        viewBox="0 0 100 62.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Blueprint grids — scaled to viewBox units */}
          <pattern
            id="sg"
            width="1.94"
            height="1.94"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M1.94 0L0 0 0 1.94"
              stroke="white"
              strokeWidth="0.02"
              opacity="0.18"
              fill="none"
            />
          </pattern>
          <pattern
            id="lg"
            width="9.7"
            height="9.7"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M9.7 0L0 0 0 9.7"
              stroke="white"
              strokeWidth="0.05"
              opacity="0.12"
              fill="none"
            />
          </pattern>

          {/* Radial fade — protects center text */}
          <radialGradient id="rg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="30%" stopColor="black" stopOpacity="0.9" />
            <stop offset="55%" stopColor="black" stopOpacity="0.3" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id="mm">
            <rect width="100" height="62.5" fill="white" />
            <rect width="100" height="62.5" fill="url(#rg)" />
          </mask>
        </defs>

        <rect width="100" height="62.5" fill="url(#sg)" />
        <rect width="100" height="62.5" fill="url(#lg)" />

        <g
          mask="url(#mm)"
          stroke="white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* ═══════════════════════════════════════════════════
               TOP-LEFT · MECHANICAL ENGINEERING
               Big gear at (10.4, 27)  — ~27% down the screen
               All coords are % of 100×62.5 viewBox
          ═══════════════════════════════════════════════════ */}

          {/* PRIMARY gear — r=4.86 (~7% of width) */}
          <g transform="translate(10.4,27)">
            <g className="gcw1">
              <circle cx="0" cy="0" r="4.86" strokeWidth="0.1" />
              <circle cx="0" cy="0" r="4.24" strokeWidth="0.04" />
              <circle cx="0" cy="0" r="1.39" strokeWidth="0.09" />
              <circle cx="0" cy="0" r="0.63" strokeWidth="0.04" />
              {gearTeeth(16, 4.86, 5.83, 0.1)}
              {gearSpokes(6, 4.24, 0.04)}
              {boltRing(6, 2.5, 0.2, 0.06)}
            </g>
          </g>

          {/* SECONDARY gear — r=3.05 */}
          <g transform="translate(19.3,21.2)">
            <g className="gccw1">
              <circle cx="0" cy="0" r="3.05" strokeWidth="0.09" />
              <circle cx="0" cy="0" r="2.57" strokeWidth="0.04" />
              <circle cx="0" cy="0" r="0.9" strokeWidth="0.08" />
              <circle cx="0" cy="0" r="0.42" strokeWidth="0.04" />
              {gearTeeth(12, 3.05, 3.82, 0.08)}
              {gearSpokes(3, 2.57, 0.04)}
            </g>
          </g>

          {/* SMALL gear — r=1.8 */}
          <g transform="translate(18.2,17.5)">
            <g className="gcw2">
              <circle cx="0" cy="0" r="1.8" strokeWidth="0.08" />
              <circle cx="0" cy="0" r="1.46" strokeWidth="0.03" />
              <circle cx="0" cy="0" r="0.56" strokeWidth="0.07" />
              {gearTeeth(9, 1.8, 2.36, 0.07)}
            </g>
          </g>

          {/* Wrench */}
          <g transform="translate(1.9,34) rotate(-28)">
            <rect
              x="0"
              y="-0.42"
              width="7.5"
              height="0.83"
              rx="0.42"
              strokeWidth="0.1"
            />
            <circle cx="0" cy="0" r="1.11" strokeWidth="0.1" />
            <circle cx="0" cy="0" r="0.56" strokeWidth="0.04" />
            <path
              d="M0-1.11 L-0.76-1.11 L-0.76-0.56 M0 1.11 L-0.76 1.11 L-0.76 0.56"
              strokeWidth="0.08"
            />
            <path d="M7.5-0.49 L8.47 0 L7.5 0.49" strokeWidth="0.1" />
          </g>

          {/* Piston */}
          <g transform="translate(1.5,37.5)">
            <rect
              x="0"
              y="-1.11"
              width="4.03"
              height="2.22"
              rx="0.21"
              strokeWidth="0.1"
            />
            <rect
              x="0.42"
              y="-0.69"
              width="3.19"
              height="1.39"
              rx="0.14"
              strokeWidth="0.04"
            />
            <line
              x1="1.18"
              y1="-1.11"
              x2="1.18"
              y2="1.11"
              strokeWidth="0.04"
              opacity="0.4"
            />
            <line
              x1="2.01"
              y1="-1.11"
              x2="2.01"
              y2="1.11"
              strokeWidth="0.04"
              opacity="0.4"
            />
            <line
              x1="2.85"
              y1="-1.11"
              x2="2.85"
              y2="1.11"
              strokeWidth="0.04"
              opacity="0.4"
            />
            <line x1="4.03" y1="-0.49" x2="7.92" y2="-0.49" strokeWidth="0.1" />
            <line x1="4.03" y1=" 0.49" x2="7.92" y2=" 0.49" strokeWidth="0.1" />
            <line x1="7.92" y1="-0.49" x2="7.92" y2=" 0.49" strokeWidth="0.1" />
            <circle cx="7.92" cy="0" r="1.25" strokeWidth="0.1" />
            <circle cx="7.92" cy="0" r="0.63" strokeWidth="0.04" />
          </g>

          {/* Keyway shaft */}
          <g transform="translate(3.5,40.8)">
            <rect
              x="0"
              y="-0.49"
              width="5.56"
              height="0.97"
              rx="0.21"
              strokeWidth="0.08"
            />
            <rect
              x="1.88"
              y="-0.76"
              width="1.81"
              height="0.28"
              rx="0.07"
              strokeWidth="0.06"
            />
            <rect
              x="1.88"
              y=" 0.49"
              width="1.81"
              height="0.28"
              rx="0.07"
              strokeWidth="0.06"
            />
          </g>

          {/* ═══════════════════════════════════════════════════
               BOTTOM-LEFT · AGRICULTURAL
               Wheat top at y≈46.3, Tractor anchored at y=62.5
          ═══════════════════════════════════════════════════ */}

          {/* Wheat stalks */}
          <g transform="translate(0.35,46.3)">
            {Array.from({ length: 15 }, (_, i) => {
              const x = i * 1.46;
              const f = i % 2 === 0;
              return (
                <g
                  key={i}
                  className="sw"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <line
                    x1={x}
                    y1="6.1"
                    x2={x + (f ? -0.28 : 0.28)}
                    y2="0.56"
                    strokeWidth="0.07"
                  />
                  <ellipse
                    cx={x + (f ? -0.56 : 0.56)}
                    cy="0"
                    rx="0.28"
                    ry="1.04"
                    transform={`rotate(${f ? -20 : 20},${x + (f ? -0.56 : 0.56)},0)`}
                    strokeWidth="0.06"
                  />
                  <line
                    x1={x + (f ? -0.28 : 0.28)}
                    y1="-0.49"
                    x2={x + (f ? -0.83 : 0.83)}
                    y2="-0.9"
                    strokeWidth="0.04"
                  />
                  <line
                    x1={x + (f ? -0.21 : 0.21)}
                    y1=" 0.28"
                    x2={x + (f ? -0.97 : 0.97)}
                    y2="0.35"
                    strokeWidth="0.04"
                  />
                  <line
                    x1={x + (f ? -0.21 : 0.21)}
                    y1=" 2.43"
                    x2={x + (f ? -1.18 : 1.18)}
                    y2="1.74"
                    strokeWidth="0.06"
                  />
                  <line
                    x1={x + (f ? -0.21 : 0.21)}
                    y1=" 3.96"
                    x2={x + (f ? -1.04 : 1.04)}
                    y2="3.33"
                    strokeWidth="0.06"
                  />
                </g>
              );
            })}
          </g>

          {/* Tractor — all coords scaled to viewBox */}
          <g transform="translate(0.97,62)">
            {/* Body */}
            <path
              d="M0 0 L10.42 0 L10.42-2.64 L7.92-2.64 L6.6-4.17 L3.75-4.17 L2.22-2.64 L0-2.64 Z"
              strokeWidth="0.12"
            />
            {([-3.33, -2.78, -2.29, -1.81] as number[]).map((y, i) => (
              <line
                key={i}
                x1="6.6"
                y1={y}
                x2="10.42"
                y2={y}
                strokeWidth="0.035"
                opacity="0.4"
              />
            ))}
            {/* Cab */}
            <path
              d="M3.82-4.17 L3.82-7.22 L6.53-7.22 L6.53-4.17"
              strokeWidth="0.11"
            />
            <path d="M3.82-7.22 L5.14-8.75 L6.53-7.22" strokeWidth="0.11" />
            <rect
              x="4.17"
              y="-6.94"
              width="0.97"
              height="1.18"
              rx="0.1"
              strokeWidth="0.08"
            />
            <rect
              x="5.42"
              y="-6.94"
              width="0.69"
              height="1.18"
              rx="0.1"
              strokeWidth="0.08"
            />
            <line
              x1="4.38"
              y1="-5.97"
              x2="5.14"
              y2="-6.94"
              strokeWidth="0.04"
            />
            {/* Exhaust */}
            <line
              x1="4.38"
              y1="-8.75"
              x2="4.38"
              y2="-10.56"
              strokeWidth="0.15"
            />
            <path d="M4.03-10.56 Q4.38-11.46 4.72-10.56" strokeWidth="0.1" />
            <circle
              cx="4.38"
              cy="-11.18"
              r="0.35"
              strokeWidth="0.07"
              opacity="0.45"
            />
            <circle
              cx="4.1"
              cy="-12.08"
              r="0.49"
              strokeWidth="0.06"
              opacity="0.3"
            />
            {/* Rear wheel */}
            <g transform="translate(2.22,0)">
              <g className="gccw2">
                <circle cx="0" cy="0" r="2.78" strokeWidth="0.12" />
                <circle cx="0" cy="0" r="2.29" strokeWidth="0.05" />
                <circle cx="0" cy="0" r="0.76" strokeWidth="0.1" />
                {wheelSpokes(8, 2.29, 0.76, 0.08)}
                {treadLugs(10, 2.78, 3.47, 0.1)}
              </g>
            </g>
            {/* Front wheel */}
            <g transform="translate(8.19,0)">
              <g className="gcw3">
                <circle cx="0" cy="0" r="1.74" strokeWidth="0.11" />
                <circle cx="0" cy="0" r="1.32" strokeWidth="0.04" />
                <circle cx="0" cy="0" r="0.49" strokeWidth="0.09" />
                {wheelSpokes(6, 1.32, 0.49, 0.07)}
              </g>
            </g>
            {/* Plough */}
            <path
              d="M-0.21-0.35 L-3.61-0.35 L-4.86 1.39 L-2.78 1.39"
              strokeWidth="0.12"
            />
            <path d="M-3.61-0.35 L-5-1.94 L-3.19 1.39" strokeWidth="0.1" />
            <line
              x1="-0.21"
              y1="-0.35"
              x2="-0.21"
              y2="-2.5"
              strokeWidth="0.1"
            />
          </g>

          {/* ═══════════════════════════════════════════════════
               TOP-RIGHT · COMPUTER TECHNOLOGY
               Monitor top-left at (75, 18) — ~29% down
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(75,18)">
            {/* Monitor bezel */}
            <rect
              x="0"
              y="0"
              width="11.81"
              height="7.5"
              rx="0.42"
              strokeWidth="0.11"
            />
            <rect
              x="0.56"
              y="0.56"
              width="10.69"
              height="6.39"
              rx="0.21"
              strokeWidth="0.05"
            />
            {/* Code lines on screen */}
            {(
              [
                [0.97, 1.67, 4.03],
                [1.53, 2.5, 7.64],
                [0.97, 3.33, 4.86],
                [1.53, 4.17, 9.03],
                [0.97, 5.0, 4.31],
                [1.53, 5.83, 6.39],
              ] as [number, number, number][]
            ).map(([x, y, w], i) => (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={w}
                y2={y}
                strokeWidth="0.08"
                opacity="0.7"
              />
            ))}
            {/* Cursor */}
            <line
              x1="4.31"
              y1="5.83"
              x2="4.86"
              y2="5.83"
              strokeWidth="0.14"
              opacity="0.85"
            />
            {/* Stand */}
            <path
              d="M4.72 7.5 L4.72 9.03 L3.61 9.86 L8.19 9.86 L7.08 9.03 L7.08 7.5"
              strokeWidth="0.1"
            />
            <ellipse
              cx="5.9"
              cy="9.93"
              rx="2.36"
              ry="0.35"
              strokeWidth="0.07"
            />
            {/* Keyboard */}
            <rect
              x="-0.97"
              y="10.42"
              width="13.75"
              height="2.92"
              rx="0.28"
              strokeWidth="0.1"
            />
            {Array.from({ length: 13 }, (_, i) => (
              <rect
                key={i}
                x={-0.56 + i * 0.97}
                y="10.83"
                width="0.76"
                height="0.56"
                rx="0.08"
                strokeWidth="0.06"
              />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <rect
                key={i}
                x={-0.07 + i * 0.97}
                y="11.6"
                width="0.76"
                height="0.56"
                rx="0.08"
                strokeWidth="0.06"
              />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <rect
                key={i}
                x={0.42 + i * 0.97}
                y="12.36"
                width="0.76"
                height="0.56"
                rx="0.08"
                strokeWidth="0.06"
              />
            ))}
            <rect
              x="3.75"
              y="12.36"
              width="4.31"
              height="0.56"
              rx="0.14"
              strokeWidth="0.06"
            />
            {/* Mouse */}
            <rect
              x="13.47"
              y="10.83"
              width="2.22"
              height="2.92"
              rx="1.04"
              strokeWidth="0.09"
            />
            <line
              x1="14.58"
              y1="10.83"
              x2="14.58"
              y2="12.22"
              strokeWidth="0.05"
            />
            <circle cx="14.58" cy="12.08" r="0.28" strokeWidth="0.06" />
          </g>

          {/* PCB circuit board */}
          <g transform="translate(80,40)">
            {/* Board outline */}
            <rect
              x="0"
              y="0"
              width="11.53"
              height="7.5"
              rx="0.28"
              strokeWidth="0.09"
            />
            {/* Traces */}
            <path
              d="M1.25 1.25 H3.75 V3.13 H6.25 V1.25 H8.75"
              strokeWidth="0.07"
              className="fd"
              strokeDasharray="0.4 0.35"
            />
            <path
              d="M3.75 3.13 V5.63 H1.88 V4.38"
              strokeWidth="0.07"
              className="fd"
              strokeDasharray="0.4 0.35"
              style={{ animationDelay: "0.9s" }}
            />
            <path
              d="M6.25 3.13 V5.0 H9.69 V6.25"
              strokeWidth="0.07"
              className="fd"
              strokeDasharray="0.4 0.35"
              style={{ animationDelay: "1.8s" }}
            />
            {/* IC chip */}
            <rect
              x="5"
              y="1.5"
              width="2.5"
              height="1.74"
              rx="0.17"
              strokeWidth="0.1"
            />
            {([5.28, 5.9, 6.53, 7.08] as number[]).map((x) => (
              <g key={x}>
                <line x1={x} y1="1.5" x2={x} y2="1.18" strokeWidth="0.07" />
                <line x1={x} y1="3.24" x2={x} y2="3.54" strokeWidth="0.07" />
              </g>
            ))}
            <line
              x1="5"
              y1="2.22"
              x2="7.5"
              y2="2.22"
              strokeWidth="0.04"
              opacity="0.4"
            />
            {/* Resistors */}
            <rect
              x="1.5"
              y="3.54"
              width="1.11"
              height="0.63"
              rx="0.1"
              strokeWidth="0.08"
            />
            <line x1="1.5" y1="3.85" x2="0.88" y2="3.85" strokeWidth="0.07" />
            <line x1="2.6" y1="3.85" x2="3.4" y2="3.85" strokeWidth="0.07" />
            <rect
              x="8.75"
              y="4.38"
              width="1.11"
              height="0.63"
              rx="0.1"
              strokeWidth="0.08"
            />
            <line x1="8.75" y1="4.69" x2="8.13" y2="4.69" strokeWidth="0.07" />
            <line x1="9.86" y1="4.69" x2="10.63" y2="4.69" strokeWidth="0.07" />
            {/* Capacitor */}
            <line x1="1.53" y1="5.63" x2="1.53" y2="5.1" strokeWidth="0.14" />
            <line x1="2.08" y1="5.63" x2="2.08" y2="5.1" strokeWidth="0.14" />
            <line x1="1.81" y1="6.04" x2="1.81" y2="5.63" strokeWidth="0.07" />
            <line x1="1.81" y1="4.86" x2="1.81" y2="4.44" strokeWidth="0.07" />
            {/* LED */}
            <circle cx="10.21" cy="1.25" r="0.35" strokeWidth="0.09" />
            <line x1="10.21" y1="0.9" x2="10.21" y2="0.56" strokeWidth="0.07" />
            {/* Solder nodes */}
            {(
              [
                [1.25, 1.25],
                [3.75, 1.25],
                [8.75, 1.25],
                [3.75, 5.63],
                [9.69, 6.25],
              ] as [number, number][]
            ).map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="0.22"
                strokeWidth="0.08"
                className="bl"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </g>

          {/* Binary stream — far-right edge */}
          <g
            transform="translate(99,18.5)"
            opacity="0.18"
            fontFamily="monospace"
            fontSize="0.9"
          >
            {(
              [
                "1",
                "0",
                "1",
                "1",
                "0",
                "0",
                "1",
                "0",
                "1",
                "0",
                "1",
                "1",
              ] as string[]
            ).map((b, i) => (
              <text
                key={i}
                x="0"
                y={i * 1.88}
                stroke="white"
                fill="none"
                strokeWidth="0.03"
              >
                {b}
              </text>
            ))}
          </g>

          {/* ═══════════════════════════════════════════════════
               BOTTOM-CENTER · CIVIL ENGINEERING
               Bridge anchor at (42.9, 62.5)
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(42.9,62.5)">
            {/* Catenary cables */}
            <path
              d="M-16.11-0.97 Q-8.06-15.28 0-18.89 Q8.06-15.28 16.11-0.97"
              strokeWidth="0.13"
            />
            <path
              d="M-16.11-0.97 Q-8.06-13.89 0-17.36 Q8.06-13.89 16.11-0.97"
              strokeWidth="0.06"
            />
            {/* Deck */}
            <line
              x1="-17.36"
              y1="-0.97"
              x2="17.36"
              y2="-0.97"
              strokeWidth="0.15"
            />
            <line
              x1="-17.36"
              y1="-0.28"
              x2="17.36"
              y2="-0.28"
              strokeWidth="0.08"
            />
            {/* Lane dashes */}
            {(
              [
                -13.89, -10.83, -7.78, -4.72, -1.39, 0.69, 3.61, 6.53, 9.44,
                12.36,
              ] as number[]
            ).map((x, i) => (
              <line
                key={i}
                x1={x}
                y1="-0.63"
                x2={x + 1.39}
                y2="-0.63"
                strokeWidth="0.08"
                opacity="0.38"
              />
            ))}
            {/* Left tower */}
            <path
              d="M-0.97-0.97 L-0.97-21.18 L0.97-21.18 L0.97-0.97"
              strokeWidth="0.14"
            />
            <rect
              x="-2.5"
              y="-16.11"
              width="5"
              height="0.97"
              rx="0.14"
              strokeWidth="0.09"
            />
            <rect
              x="-2.08"
              y="-19.86"
              width="4.17"
              height="0.97"
              rx="0.14"
              strokeWidth="0.09"
            />
            <line
              x1="-0.49"
              y1="-21.18"
              x2="-0.49"
              y2="-22.78"
              strokeWidth="0.1"
            />
            <line
              x1=" 0.49"
              y1="-21.18"
              x2=" 0.49"
              y2="-22.78"
              strokeWidth="0.1"
            />
            {/* Right tower */}
            <path
              d="M13.06-0.97 L13.06-21.18 L14.97-21.18 L14.97-0.97"
              strokeWidth="0.14"
            />
            <rect
              x="11.53"
              y="-16.11"
              width="5"
              height="0.97"
              rx="0.14"
              strokeWidth="0.09"
            />
            <rect
              x="11.94"
              y="-19.86"
              width="4.17"
              height="0.97"
              rx="0.14"
              strokeWidth="0.09"
            />
            {/* Hangers */}
            {([-14.58, -11.46, -9.03, -6.53, -4.03, -1.53] as number[]).map(
              (x, i) => {
                const y = -0.97 - (1 - Math.pow(x / 16.11, 2)) * 17.92;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={y.toFixed(2)}
                    x2={x}
                    y2="-0.97"
                    strokeWidth="0.07"
                    opacity="0.55"
                  />
                );
              },
            )}
            {([1.53, 4.03, 6.53, 9.03, 11.53, 14.03, 14.97] as number[]).map(
              (x, i) => {
                const cx = x - 6.94;
                const y = -0.97 - (1 - Math.pow(cx / 16.11, 2)) * 17.92;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={y.toFixed(2)}
                    x2={x}
                    y2="-0.97"
                    strokeWidth="0.07"
                    opacity="0.55"
                  />
                );
              },
            )}
            {/* Water */}
            <path
              d="M-18.61 1.25 Q-15.28 0.56-11.94 1.53 Q-8.61 2.22-4.72 1.11 Q-1.25 0 1.74 1.11 Q5.21 2.08 9.17 0.9 Q12.5-0.14 16.11 0.9"
              strokeWidth="0.08"
              opacity="0.38"
            />
            {/* City LEFT */}
            <rect
              x="-24.65"
              y="-9.72"
              width="3.06"
              height="9.72"
              strokeWidth="0.1"
            />
            <rect
              x="-21.18"
              y="-13.61"
              width="3.47"
              height="13.61"
              strokeWidth="0.1"
            />
            <rect
              x="-17.22"
              y="-11.04"
              width="2.64"
              height="11.04"
              strokeWidth="0.1"
            />
            {(
              [
                [-24.44, [-8.89, -7.36, -5.83, -4.31, -2.78]],
                [-20.97, [-12.64, -10.97, -9.31, -7.64, -5.97, -4.31]],
                [-17.01, [-10.07, -8.47, -6.88, -5.28]],
              ] as [number, number[]][]
            ).map(([bx, ys], bi) =>
              ys.map((y, j) =>
                [0, 1, 2].map((c) => (
                  <rect
                    key={`w${bi}${j}${c}`}
                    x={bx + 0.35 + c * 0.9}
                    y={y + 0.21}
                    width="0.49"
                    height="0.69"
                    strokeWidth="0.05"
                    opacity="0.42"
                  />
                )),
              ),
            )}
            {/* City RIGHT */}
            <rect
              x="19.58"
              y="-10.42"
              width="3.06"
              height="10.42"
              strokeWidth="0.1"
            />
            <rect
              x="23.06"
              y="-14.31"
              width="3.47"
              height="14.31"
              strokeWidth="0.1"
            />
            <rect
              x="26.94"
              y="-8.47"
              width="2.64"
              height="8.47"
              strokeWidth="0.1"
            />
          </g>

          {/* ═══════════════════════════════════════════════════
               BOTTOM-RIGHT · PETROCHEMICAL
               Anchor at (64.2, 62.5)
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(64.2,62.5)">
            {/* Distillation column */}
            <rect
              x="0"
              y="-31.11"
              width="3.33"
              height="31.11"
              rx="0.28"
              strokeWidth="0.12"
            />
            <path d="M0-31.11 Q1.67-32.78 3.33-31.11" strokeWidth="0.1" />
            <ellipse
              cx="1.67"
              cy="-31.11"
              rx="1.67"
              ry="0.63"
              strokeWidth="0.06"
              opacity="0.4"
            />
            {(
              [-27.78, -23.61, -19.44, -15.28, -11.11, -6.94, -3.61] as number[]
            ).map((y, i) => (
              <line
                key={i}
                x1="0.35"
                y1={y}
                x2="2.99"
                y2={y}
                strokeWidth="0.07"
                opacity="0.48"
              />
            ))}
            {(
              [-29.58, -25.42, -21.25, -17.08, -12.92, -8.75, -4.58] as number[]
            ).map((y, i) => (
              <rect
                key={i}
                x="-0.35"
                y={y - 0.28}
                width="4.03"
                height="0.56"
                rx="0.17"
                strokeWidth="0.08"
              />
            ))}
            {/* Side pipes */}
            <path
              d="M3.33-21.39 H6.94 V-1.81"
              strokeWidth="0.1"
              className="fd"
              strokeDasharray="0.7 0.56"
            />
            <path
              d="M3.33-12.15 H8.61 V-1.81"
              strokeWidth="0.1"
              className="fd"
              strokeDasharray="0.7 0.56"
              style={{ animationDelay: "0.7s" }}
            />
            <path d="M3.33-5.56 H5.56 V-1.81" strokeWidth="0.1" />
            {/* Valves */}
            <path
              d="M5.56-18.61 L6.39-17.78 L7.22-18.61 L6.39-19.44 Z"
              strokeWidth="0.1"
            />
            <path
              d="M7.5-11.11 L8.33-10.28 L9.17-11.11 L8.33-11.94 Z"
              strokeWidth="0.1"
            />
            {/* Large storage tank */}
            <rect
              x="9.31"
              y="-10.42"
              width="5.28"
              height="10.42"
              rx="0.35"
              strokeWidth="0.12"
            />
            <path d="M9.31-10.42 Q11.94-12.08 14.58-10.42" strokeWidth="0.1" />
            <ellipse
              cx="11.94"
              cy="-10.42"
              rx="2.64"
              ry="0.76"
              strokeWidth="0.06"
              opacity="0.38"
            />
            <line
              x1="9.31"
              y1="-7.78"
              x2="14.58"
              y2="-7.78"
              strokeWidth="0.07"
              opacity="0.38"
            />
            <line
              x1="9.31"
              y1="-5.28"
              x2="14.58"
              y2="-5.28"
              strokeWidth="0.07"
              opacity="0.38"
            />
            {/* Second tank */}
            <rect
              x="15.28"
              y="-7.92"
              width="4.03"
              height="7.92"
              rx="0.28"
              strokeWidth="0.11"
            />
            <path d="M15.28-7.92 Q17.29-9.31 19.31-7.92" strokeWidth="0.09" />
            <line
              x1="15.28"
              y1="-5.56"
              x2="19.31"
              y2="-5.56"
              strokeWidth="0.06"
              opacity="0.35"
            />
            {/* Flare stack */}
            <line
              x1="-3.89"
              y1="-1.94"
              x2="-2.78"
              y2="-31.25"
              strokeWidth="0.11"
            />
            <line
              x1="-3.26"
              y1="-1.94"
              x2="-2.15"
              y2="-31.25"
              strokeWidth="0.06"
            />
            <path
              d="M-3.26-31.25 Q-3.82-32.99-2.71-34.44 Q-1.6-32.99-2.15-31.25 Z"
              strokeWidth="0.1"
            />
            {/* Ground manifold */}
            <line
              x1="-4.51"
              y1="-1.11"
              x2="20.14"
              y2="-1.11"
              strokeWidth="0.14"
            />
            <line x1=" 4.17" y1="-1.11" x2=" 4.17" y2="0" strokeWidth="0.11" />
            <line x1=" 9.31" y1="-1.11" x2=" 9.31" y2="0" strokeWidth="0.11" />
            <line x1="15.28" y1="-1.11" x2="15.28" y2="0" strokeWidth="0.11" />
            {/* Pump */}
            <rect
              x="4.17"
              y="-2.78"
              width="1.81"
              height="1.53"
              rx="0.17"
              strokeWidth="0.09"
            />
            <circle cx="5.07" cy="-2.01" r="0.42" strokeWidth="0.07" />
          </g>

          {/* ═══════════════════════════════════════════════════
               RIGHT SIDE · ELECTRICAL & ELECTRONICS
               Pylon anchor at (97.6, 62.5) — far-right edge
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(98.6,62.5)">
            {/* Pylon legs */}
            {/* <line x1="-0.97" y1="-1.53" x2="-2.78" y2="-29.17" strokeWidth="0.12" />
            <line x1=" 0.97" y1="-1.53" x2=" 2.78" y2="-29.17" strokeWidth="0.12" /> */}
            {/* Bracing */}
            {/* {([
              [-2.64,-26.74,-0.97,-22.36],[0.97,-26.74,2.64,-22.36],
              [-2.36,-21.67,-0.83,-17.64],[0.83,-21.67,2.36,-17.64],
              [-1.94,-16.94,-0.69,-13.47],[0.69,-16.94,1.94,-13.47],
              [-1.53,-12.92,-0.49,-9.86], [0.49,-12.92,1.53,-9.86],
              [-1.11,-9.31,-0.28,-7.08],  [0.28,-9.31,1.11,-7.08],
            ] as [number,number,number,number][]).map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.08" />
            ))} */}
            {/* Horizontal struts */}
            {/* {([
              [-2.78,-26.74,2.78],[-2.5,-22.36,2.5],[-2.08,-17.64,2.08],
              [-1.67,-13.47,1.67],[-1.25,-9.86,1.25],[-0.83,-7.08,0.83],
            ] as [number,number,number][]).map(([x1,y,x2], i) => (
              <line key={i} x1={x1} y1={y} x2={x2} y2={y} strokeWidth="0.09" />
            ))} */}
            {/* Top crossarms */}
            {/* <line x1="-4.31" y1="-28.19" x2="4.31" y2="-28.19" strokeWidth="0.14" />
            <line x1="-3.61" y1="-24.03" x2="3.61" y2="-24.03" strokeWidth="0.11" /> */}
            {/* Insulators */}
            {/* {([-3.47,-1.53,0.42,2.36] as number[]).map((x, i) => (
              <g key={i}>
                <circle cx={x} cy="-28.19" r="0.31" strokeWidth="0.09" />
                <circle cx={x} cy="-28.68" r="0.19" strokeWidth="0.07" />
              </g>
            ))} */}
            {/* Power lines — exit RIGHT (off canvas) */}
            {/* <path d="M4.31-28.19 Q6.25-27.64 9.03-28.68" strokeWidth="0.1" className="fd" strokeDasharray="0.6 0.45" />
            <path d="M3.61-24.03 Q5.56-23.47 8.33-24.44" strokeWidth="0.08" className="fd" strokeDasharray="0.5 0.4" style={{ animationDelay: '0.7s' }} opacity="0.7" /> */}
            {/* Lightning bolt */}
            {/* <path d="M1.25-16.53 L0.35-14.03 L1.11-14.03 L0.14-11.67" strokeWidth="0.17" /> */}
            {/* Transformer */}
            {/* <rect x="-1.53" y="-11.25" width="3.06" height="2.78" rx="0.21" strokeWidth="0.11" />
            <circle cx="0" cy="-9.86" r="0.76" strokeWidth="0.09" />
            <line x1="-1.53" y1="-10.21" x2="1.53" y2="-10.21" strokeWidth="0.05" opacity="0.4" />
            <line x1="-1.53" y1="-9.44"  x2="1.53" y2="-9.44"  strokeWidth="0.05" opacity="0.4" />
            <line x1="0" y1="-8.47" x2="0" y2="-7.08" strokeWidth="0.1" /> */}
            {/* Meter box */}
            {/* <rect x="-1.25" y="-6.67" width="2.5" height="2.08" rx="0.17" strokeWidth="0.1" />
            <circle cx="0" cy="-5.63" r="0.52" strokeWidth="0.08" /> */}
            {/* Ground stakes */}
            {/* <line x1="0"    y1="-4.58" x2="0"    y2="-3.19" strokeWidth="0.09" />
            <line x1="-0.69" y1="-3.19" x2="0.69" y2="-3.19" strokeWidth="0.09" />
            <line x1="-0.42" y1="-2.78" x2="0.42" y2="-2.78" strokeWidth="0.07" />
            <line x1="-0.21" y1="-2.36" x2="0.21" y2="-2.36" strokeWidth="0.06" /> */}
          </g>

          {/* Birds — positioned in safe empty mid zones */}
          <g strokeWidth="0.11" opacity="0.32">
            <path d="M30.7 20.2 Q31.6 19.4 32.5 20.2 Q33.4 19.4 34.3 20.2" />
            <path d="M49.3 16.7 Q50.2 15.9 51.1 16.7 Q52 15.9 52.9 16.7" />
            <path d="M59.4 37.5 Q60.2 36.8 61 37.5 Q61.8 36.8 62.6 37.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
