export function CourseMuralBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes spin-cw   { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes spin-ccw  { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes sway      { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }
        @keyframes flow-dash { from{stroke-dashoffset:0} to{stroke-dashoffset:-44} }
        @keyframes blink     { 0%,100%{opacity:.3} 50%{opacity:.9} }

        .gcw1  { transform-box:fill-box; transform-origin:center; animation:spin-cw   10s linear infinite; }
        .gccw1 { transform-box:fill-box; transform-origin:center; animation:spin-ccw   7s linear infinite; }
        .gcw2  { transform-box:fill-box; transform-origin:center; animation:spin-cw   18s linear infinite; }
        .gcw3  { transform-box:fill-box; transform-origin:center; animation:spin-cw   26s linear infinite; }
        .gccw2 { transform-box:fill-box; transform-origin:center; animation:spin-ccw  13s linear infinite; }
        .sw    { transform-box:fill-box; transform-origin:50% 100%; animation:sway 3.4s ease-in-out infinite; }
        .fd    { animation:flow-dash 2.2s linear infinite; }
        .bl    { animation:blink 2.8s ease-in-out infinite; }
      `}</style>

      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="sg" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0L0 0 0 28" stroke="white" strokeWidth="0.3" opacity="0.18" fill="none"/>
          </pattern>
          <pattern id="lg" width="140" height="140" patternUnits="userSpaceOnUse">
            <path d="M140 0L0 0 0 140" stroke="white" strokeWidth="0.7" opacity="0.12" fill="none"/>
          </pattern>

          {/* Fade mask — strong in center to protect text */}
          <radialGradient id="rg" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="black" stopOpacity="1"/>
            <stop offset="30%"  stopColor="black" stopOpacity="0.9"/>
            <stop offset="55%"  stopColor="black" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="black" stopOpacity="0"/>
          </radialGradient>
          <mask id="mm">
            <rect width="1440" height="900" fill="white"/>
            <rect width="1440" height="900" fill="url(#rg)"/>
          </mask>
        </defs>

        <rect width="1440" height="900" fill="url(#sg)"/>
        <rect width="1440" height="900" fill="url(#lg)"/>

        <g mask="url(#mm)" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">

          {/* ═══════════════════════════════════════════
              TOP-LEFT · MECHANICAL ENGINEERING
              Entire zone: x=0→340, y=0→520
              All elements start from y=250 downward
              so they appear in lower-top-left, not behind navbar
          ═══════════════════════════════════════════ */}

          {/* Big gear centre at (150, 390) */}
          <g transform="translate(150,390)">
            <g className="gcw1">
              <circle cx="0" cy="0" r="70"  strokeWidth="1.5"/>
              <circle cx="0" cy="0" r="61"  strokeWidth="0.6"/>
              <circle cx="0" cy="0" r="20"  strokeWidth="1.3"/>
              <circle cx="0" cy="0" r="9"   strokeWidth="0.6"/>
              {Array.from({length:16},(_,i)=>{
                const a=i*22.5, ar=a*Math.PI/180, a2=(a+16)*Math.PI/180;
                return <path key={i} strokeWidth="1.4"
                  d={`M${(Math.cos(ar)*70).toFixed(1)} ${(Math.sin(ar)*70).toFixed(1)} L${(Math.cos(ar)*84).toFixed(1)} ${(Math.sin(ar)*84).toFixed(1)} L${(Math.cos(a2)*84).toFixed(1)} ${(Math.sin(a2)*84).toFixed(1)} L${(Math.cos(a2)*70).toFixed(1)} ${(Math.sin(a2)*70).toFixed(1)}`}/>;
              })}
              {[0,30,60,90,120,150].map((a,i)=>{
                const ar=a*Math.PI/180;
                return <line key={i} x1={(Math.cos(ar)*61).toFixed(1)} y1={(Math.sin(ar)*61).toFixed(1)} x2={(Math.cos(ar+Math.PI)*61).toFixed(1)} y2={(Math.sin(ar+Math.PI)*61).toFixed(1)} strokeWidth="0.5" opacity="0.4"/>;
              })}
              {[0,60,120,180,240,300].map((a,i)=>{
                const ar=a*Math.PI/180;
                return <circle key={`b${i}`} cx={(36*Math.cos(ar)).toFixed(1)} cy={(36*Math.sin(ar)).toFixed(1)} r="3" strokeWidth="0.8"/>;
              })}
            </g>
          </g>

          {/* Medium gear centre at (278, 305) — top = 305-44-12 = 249 ✓ */}
          <g transform="translate(278,305)">
            <g className="gccw1">
              <circle cx="0" cy="0" r="44"  strokeWidth="1.3"/>
              <circle cx="0" cy="0" r="37"  strokeWidth="0.5"/>
              <circle cx="0" cy="0" r="13"  strokeWidth="1.2"/>
              <circle cx="0" cy="0" r="6"   strokeWidth="0.5"/>
              {Array.from({length:12},(_,i)=>{
                const a=i*30, ar=a*Math.PI/180, a2=(a+23)*Math.PI/180;
                return <path key={i} strokeWidth="1.2"
                  d={`M${(Math.cos(ar)*44).toFixed(1)} ${(Math.sin(ar)*44).toFixed(1)} L${(Math.cos(ar)*55).toFixed(1)} ${(Math.sin(ar)*55).toFixed(1)} L${(Math.cos(a2)*55).toFixed(1)} ${(Math.sin(a2)*55).toFixed(1)} L${(Math.cos(a2)*44).toFixed(1)} ${(Math.sin(a2)*44).toFixed(1)}`}/>;
              })}
              {[0,60,120].map((a,i)=>{
                const ar=a*Math.PI/180;
                return <line key={i} x1={(Math.cos(ar)*37).toFixed(1)} y1={(Math.sin(ar)*37).toFixed(1)} x2={(Math.cos(ar+Math.PI)*37).toFixed(1)} y2={(Math.sin(ar+Math.PI)*37).toFixed(1)} strokeWidth="0.5" opacity="0.4"/>;
              })}
            </g>
          </g>

          {/* Small gear centre at (262, 250) — top = 250-26-9 = 215 ✓ */}
          <g transform="translate(262,252)">
            <g className="gcw2">
              <circle cx="0" cy="0" r="26"  strokeWidth="1.1"/>
              <circle cx="0" cy="0" r="21"  strokeWidth="0.5"/>
              <circle cx="0" cy="0" r="8"   strokeWidth="1"/>
              {Array.from({length:9},(_,i)=>{
                const a=i*40, ar=a*Math.PI/180, a2=(a+29)*Math.PI/180;
                return <path key={i} strokeWidth="1"
                  d={`M${(Math.cos(ar)*26).toFixed(1)} ${(Math.sin(ar)*26).toFixed(1)} L${(Math.cos(ar)*34).toFixed(1)} ${(Math.sin(ar)*34).toFixed(1)} L${(Math.cos(a2)*34).toFixed(1)} ${(Math.sin(a2)*34).toFixed(1)} L${(Math.cos(a2)*26).toFixed(1)} ${(Math.sin(a2)*26).toFixed(1)}`}/>;
              })}
            </g>
          </g>

          {/* Wrench at y=490 */}
          <g transform="translate(28,490) rotate(-28)">
            <rect x="0" y="-6" width="108" height="12" rx="6" strokeWidth="1.4"/>
            <circle cx="0" cy="0" r="16" strokeWidth="1.4"/>
            <circle cx="0" cy="0" r="8"  strokeWidth="0.6"/>
            <path d="M0-16 L-11-16 L-11-8 M0 16 L-11 16 L-11 8" strokeWidth="1.1"/>
            <path d="M108-7 L122 0 L108 7" strokeWidth="1.4"/>
          </g>

          {/* Piston at y=540 */}
          <g transform="translate(22,540)">
            <rect x="0" y="-16" width="58" height="32" rx="3" strokeWidth="1.4"/>
            <rect x="6" y="-10" width="46" height="20" rx="2" strokeWidth="0.6"/>
            <line x1="17" y1="-16" x2="17" y2="16" strokeWidth="0.5" opacity="0.4"/>
            <line x1="29" y1="-16" x2="29" y2="16" strokeWidth="0.5" opacity="0.4"/>
            <line x1="41" y1="-16" x2="41" y2="16" strokeWidth="0.5" opacity="0.4"/>
            <line x1="58"  y1="-7" x2="114" y2="-7" strokeWidth="1.4"/>
            <line x1="58"  y1=" 7" x2="114" y2=" 7" strokeWidth="1.4"/>
            <line x1="114" y1="-7" x2="114" y2=" 7" strokeWidth="1.4"/>
            <circle cx="114" cy="0" r="18" strokeWidth="1.4"/>
            <circle cx="114" cy="0" r="9"  strokeWidth="0.6"/>
          </g>

          {/* Keyway shaft at y=588 */}
          <g transform="translate(50,588)">
            <rect x="0" y="-7" width="80" height="14" rx="3" strokeWidth="1.1"/>
            <rect x="27" y="-11" width="26" height="4" rx="1" strokeWidth="0.8"/>
            <rect x="27" y=" 7" width="26" height="4" rx="1" strokeWidth="0.8"/>
          </g>

          {/* ═══════════════════════════════════════════
              TOP-RIGHT · COMPUTER TECHNOLOGY
              Zone: x=1050→1440, y=0→480
              Monitor top edge at y=260 (safely below navbar)
          ═══════════════════════════════════════════ */}
          <g transform="translate(1090,260)">
            {/* Monitor */}
            <rect x="0" y="0"   width="210" height="138" rx="7" strokeWidth="1.7"/>
            <rect x="9" y="9"   width="192" height="120" rx="3" strokeWidth="0.7"/>
            {/* Code lines */}
            <line x1="16" y1="28"  x2="88"  y2="28"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="26" y1="42"  x2="138" y2="42"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="16" y1="56"  x2="110" y2="56"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="26" y1="70"  x2="160" y2="70"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="16" y1="84"  x2="94"  y2="84"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="26" y1="98"  x2="146" y2="98"  strokeWidth="1.3" opacity="0.7"/>
            <line x1="16" y1="112" x2="82"  y2="112" strokeWidth="1.3" opacity="0.7"/>
            <line x1="82" y1="112" x2="90"  y2="112" strokeWidth="2"   opacity="0.85"/>
            {/* Status bar */}
            <line x1="9"  y1="120" x2="201" y2="120" strokeWidth="0.6" opacity="0.28"/>
            <rect x="13" y="123"  width="20" height="4" rx="1" strokeWidth="0.5" opacity="0.35"/>
            {/* Stand */}
            <path d="M84 138 L84 165 L64 180 L146 180 L126 165 L126 138" strokeWidth="1.6"/>
            <ellipse cx="105" cy="181" rx="42" ry="6" strokeWidth="1.1"/>
            {/* Keyboard */}
            <rect x="16" y="190" width="178" height="42" rx="4" strokeWidth="1.6"/>
            {Array.from({length:12},(_,i)=>(
              <rect key={i} x={22+i*14} y="196" width="11" height="8" rx="1.2" strokeWidth="0.9"/>
            ))}
            {Array.from({length:11},(_,i)=>(
              <rect key={i} x={29+i*14} y="208" width="11" height="8" rx="1.2" strokeWidth="0.9"/>
            ))}
            {Array.from({length:10},(_,i)=>(
              <rect key={i} x={36+i*14} y="220" width="11" height="8" rx="1.2" strokeWidth="0.9"/>
            ))}
            <rect x="76" y="220" width="56" height="8" rx="2" strokeWidth="0.9"/>
            {/* Mouse */}
            <rect x="206" y="196" width="28" height="40" rx="13" strokeWidth="1.3"/>
            <line x1="220" y1="196" x2="220" y2="214" strokeWidth="0.6"/>
            <circle cx="220" cy="213" r="3.5" strokeWidth="0.7"/>
          </g>

          {/* Circuit board at (1320, 430) — top = 430-164 = 266 ✓ */}
          <g transform="translate(1318,430)">
            <path d="M0 0 H52 V-52 H84"     strokeWidth="1.3" className="fd" strokeDasharray="8 7"/>
            <path d="M52-52 V-116 H24 V-156" strokeWidth="1.3" className="fd" strokeDasharray="8 7" style={{animationDelay:'1.1s'}}/>
            <path d="M0 0 V58 H44"           strokeWidth="1.3" className="fd" strokeDasharray="8 7" style={{animationDelay:'2s'}}/>
            {/* IC */}
            <rect x="26" y="-112" width="34" height="24" rx="2" strokeWidth="1.6"/>
            {[30,38,46].map(x=>(
              <g key={x}>
                <line x1={x} y1="-112" x2={x} y2="-117" strokeWidth="1.1"/>
                <line x1={x} y1="-88"  x2={x} y2="-83"  strokeWidth="1.1"/>
              </g>
            ))}
            {/* Resistor */}
            <rect x="58" y="-32" width="16" height="10" rx="1.5" strokeWidth="1.3"/>
            <line x1="58" y1="-27" x2="46" y2="-27" strokeWidth="1.1"/>
            <line x1="74" y1="-27" x2="84" y2="-27" strokeWidth="1.1"/>
            {/* Capacitor */}
            <line x1="6"  y1="-52" x2="6"  y2="-44" strokeWidth="2"/>
            <line x1="12" y1="-52" x2="12" y2="-44" strokeWidth="2"/>
            <line x1="9"  y1="-44" x2="9"  y2="-36" strokeWidth="1.1"/>
            <line x1="9"  y1="-60" x2="9"  y2="-52" strokeWidth="1.1"/>
            {/* Nodes */}
            {[[0,0],[52,0],[84,-52],[24,-156],[44,58]].map(([cx,cy],i)=>(
              <circle key={i} cx={cx} cy={cy} r="4" strokeWidth="1.3" className="bl" style={{animationDelay:`${i*0.55}s`}}/>
            ))}
          </g>

          {/* Binary — far right edge, y=270 */}
          <g transform="translate(1432,270)" opacity="0.18" fontFamily="monospace" fontSize="13">
            {['1','0','1','1','0','0','1','0','1','0','1'].map((b,i)=>(
              <text key={i} x="0" y={i*30} stroke="white" fill="none" strokeWidth="0.5">{b}</text>
            ))}
          </g>

          {/* ═══════════════════════════════════════════
              BOTTOM-LEFT · AGRICULTURAL
              Wheat y=668, Tractor anchored at y=900
          ═══════════════════════════════════════════ */}
          <g transform="translate(5,668)">
            {Array.from({length:15},(_,i)=>{
              const x=i*21, f=i%2===0;
              return (
                <g key={i} className="sw" style={{animationDelay:`${i*0.2}s`}}>
                  <line x1={x} y1="88" x2={x+(f?-4:4)} y2="8" strokeWidth="1"/>
                  <ellipse cx={x+(f?-8:8)} cy="0" rx="4" ry="15"
                    transform={`rotate(${f?-20:20},${x+(f?-8:8)},0)`} strokeWidth="0.9"/>
                  <line x1={x+(f?-4:4)} y1="-7"  x2={x+(f?-12:12)} y2="-13" strokeWidth="0.6"/>
                  <line x1={x+(f?-3:3)} y1=" 4"  x2={x+(f?-12:12)} y2="  5" strokeWidth="0.6"/>
                  <line x1={x+(f?-3:3)} y1="35"  x2={x+(f?-17:17)} y2="25"  strokeWidth="0.8"/>
                  <line x1={x+(f?-3:3)} y1="57"  x2={x+(f?-15:15)} y2="48"  strokeWidth="0.8"/>
                </g>
              );
            })}
          </g>

          <g transform="translate(14,896)">
            <path d="M0 0 L150 0 L150-38 L114-38 L95-60 L54-60 L32-38 L0-38 Z" strokeWidth="1.7"/>
            {[-48,-40,-33,-26].map((y,i)=>(
              <line key={i} x1="95" y1={y} x2="150" y2={y} strokeWidth="0.5" opacity="0.4"/>
            ))}
            <path d="M55-60 L55-104 L94-104 L94-60"  strokeWidth="1.6"/>
            <path d="M55-104 L74-126 L94-104"          strokeWidth="1.6"/>
            <rect x="60"  y="-100" width="14" height="17" rx="1.5" strokeWidth="1.1"/>
            <rect x="78"  y="-100" width="10" height="17" rx="1.5" strokeWidth="1.1"/>
            <line x1="63" y1="-86"  x2="73"  y2="-100" strokeWidth="0.6"/>
            <line x1="63" y1="-126" x2="63"  y2="-152" strokeWidth="2"/>
            <path d="M58-152 Q63-165 68-152" strokeWidth="1.4"/>
            <circle cx="63" cy="-162" r="5"  strokeWidth="1" opacity="0.45"/>
            <circle cx="59" cy="-174" r="7"  strokeWidth="0.8" opacity="0.3"/>
            <g transform="translate(32,0)">
              <g className="gccw2">
                <circle cx="0" cy="0" r="40"  strokeWidth="1.8"/>
                <circle cx="0" cy="0" r="33"  strokeWidth="0.7"/>
                <circle cx="0" cy="0" r="11"  strokeWidth="1.5"/>
                {Array.from({length:8},(_,i)=>{
                  const ar=i*45*Math.PI/180;
                  return <line key={i} x1={(33*Math.cos(ar)).toFixed(1)} y1={(33*Math.sin(ar)).toFixed(1)} x2={(11*Math.cos(ar)).toFixed(1)} y2={(11*Math.sin(ar)).toFixed(1)} strokeWidth="1.1"/>;
                })}
                {Array.from({length:10},(_,i)=>{
                  const a=i*36, ar=a*Math.PI/180, a2=(a+18)*Math.PI/180;
                  return <path key={`t${i}`} strokeWidth="1.4"
                    d={`M${(Math.cos(ar)*40).toFixed(1)} ${(Math.sin(ar)*40).toFixed(1)} L${(Math.cos(ar)*50).toFixed(1)} ${(Math.sin(ar)*50).toFixed(1)} L${(Math.cos(a2)*50).toFixed(1)} ${(Math.sin(a2)*50).toFixed(1)} L${(Math.cos(a2)*40).toFixed(1)} ${(Math.sin(a2)*40).toFixed(1)}`}/>;
                })}
              </g>
            </g>
            <g transform="translate(118,0)">
              <g className="gcw3">
                <circle cx="0" cy="0" r="25"  strokeWidth="1.6"/>
                <circle cx="0" cy="0" r="19"  strokeWidth="0.6"/>
                <circle cx="0" cy="0" r="7"   strokeWidth="1.3"/>
                {Array.from({length:6},(_,i)=>{
                  const ar=i*60*Math.PI/180;
                  return <line key={i} x1={(19*Math.cos(ar)).toFixed(1)} y1={(19*Math.sin(ar)).toFixed(1)} x2={(7*Math.cos(ar)).toFixed(1)} y2={(7*Math.sin(ar)).toFixed(1)} strokeWidth="1"/>;
                })}
              </g>
            </g>
            <path d="M-3-5 L-52-5 L-70 20 L-40 20"  strokeWidth="1.7"/>
            <path d="M-52-5 L-72-28 L-46 20"          strokeWidth="1.4"/>
            <line x1="-3" y1="-5"  x2="-3"  y2="-36" strokeWidth="1.4"/>
          </g>

          {/* ═══════════════════════════════════════════
              BOTTOM-CENTER · CIVIL ENGINEERING
          ═══════════════════════════════════════════ */}
          <g transform="translate(618,900)">
            <path d="M-232-12 Q-116-220 0-272 Q116-220 232-12" strokeWidth="1.9"/>
            <path d="M-232-12 Q-116-200 0-250 Q116-200 232-12" strokeWidth="0.8"/>
            <line x1="-250" y1="-12" x2="250" y2="-12" strokeWidth="2.2"/>
            <line x1="-250" y1=" -4" x2="250" y2=" -4" strokeWidth="1.1"/>
            {[-200,-158,-116,-74,-32,10,52,94,136,178].map((x,i)=>(
              <line key={i} x1={x} y1="-8" x2={x+20} y2="-8" strokeWidth="1.1" opacity="0.38"/>
            ))}
            {/* Left tower */}
            <path d="M-14-12 L-14-305 L14-305 L14-12" strokeWidth="2"/>
            <rect x="-36" y="-232" width="72" height="14" rx="2" strokeWidth="1.4"/>
            <rect x="-30" y="-286" width="60" height="14" rx="2" strokeWidth="1.4"/>
            <line x1="-7"  y1="-305" x2="-7"  y2="-328" strokeWidth="1.4"/>
            <line x1=" 7"  y1="-305" x2=" 7"  y2="-328" strokeWidth="1.4"/>
            {/* Right tower */}
            <path d="M188-12 L188-305 L216-305 L216-12" strokeWidth="2"/>
            <rect x="166"  y="-232" width="72" height="14" rx="2" strokeWidth="1.4"/>
            <rect x="172"  y="-286" width="60" height="14" rx="2" strokeWidth="1.4"/>
            {/* Hangers */}
            {[-202,-166,-130,-94,-58,-22].map((x,i)=>{
              const y=-12-(1-Math.pow(x/232,2))*260;
              return <line key={i} x1={x} y1={y.toFixed(1)} x2={x} y2="-12" strokeWidth="1" opacity="0.55"/>;
            })}
            {[22,58,94,130,166,202,216].map((x,i)=>{
              const cx=x-100, y=-12-(1-Math.pow(cx/232,2))*260;
              return <line key={i} x1={x} y1={y.toFixed(1)} x2={x} y2="-12" strokeWidth="1" opacity="0.55"/>;
            })}
            <path d="M-268 18 Q-218 8-168 20 Q-118 30-68 15 Q-18 0 32 15 Q82 28 132 13 Q182-2 232 13" strokeWidth="1.1" opacity="0.38"/>
            {/* Left city */}
            <rect x="-355" y="-140" width="44" height="140" strokeWidth="1.4"/>
            <rect x="-305" y="-196" width="50" height="196" strokeWidth="1.4"/>
            <rect x="-248" y="-158" width="38" height="158" strokeWidth="1.4"/>
            {[[-351,-128,-106,-84,-62,-40],[-301,-184,-160,-136,-112,-88,-64],[-244,-146,-122,-98,-76]].map((ys,bi)=>{
              const bx=[-351,-301,-244][bi];
              return ys.slice(1).map((y,j)=>
                Array.from({length:3},(_,c)=>(
                  <rect key={`w${bi}${j}${c}`} x={bx+5+c*13} y={y+3} width="7" height="10" strokeWidth="0.7" opacity="0.42"/>
                ))
              );
            })}
            {/* Right city */}
            <rect x="282"  y="-150" width="44" height="150" strokeWidth="1.4"/>
            <rect x="332"  y="-206" width="50" height="206" strokeWidth="1.4"/>
            <rect x="388"  y="-122" width="38" height="122" strokeWidth="1.4"/>
          </g>

          {/* ═══════════════════════════════════════════
              BOTTOM-RIGHT · PETROCHEMICAL
          ═══════════════════════════════════════════ */}
          <g transform="translate(924,900)">
            <rect x="0" y="-448" width="48" height="448" rx="4" strokeWidth="1.8"/>
            <path d="M0-448 Q24-472 48-448" strokeWidth="1.5"/>
            <ellipse cx="24" cy="-448" rx="24" ry="9" strokeWidth="0.9" opacity="0.4"/>
            {[-400,-340,-280,-220,-160,-100,-52].map((y,i)=>(
              <line key={i} x1="5" y1={y} x2="43" y2={y} strokeWidth="1" opacity="0.48"/>
            ))}
            {[-426,-366,-306,-246,-186,-126,-66].map((y,i)=>(
              <rect key={i} x="-5" y={y-4} width="58" height="8" rx="2" strokeWidth="1.1"/>
            ))}
            <path d="M48-308 H100 V-26" strokeWidth="1.5" className="fd" strokeDasharray="10 8"/>
            <path d="M48-175 H124 V-26" strokeWidth="1.5" className="fd" strokeDasharray="10 8" style={{animationDelay:'0.7s'}}/>
            <path d="M48-80  H80  V-26" strokeWidth="1.4"/>
            <path d="M80-268 L92-256 L104-268 L92-280 Z" strokeWidth="1.5"/>
            <path d="M108-160 L120-148 L132-160 L120-172 Z" strokeWidth="1.5"/>
            <rect x="134" y="-150" width="76" height="150" rx="5" strokeWidth="1.7"/>
            <path d="M134-150 Q172-174 210-150" strokeWidth="1.4"/>
            <ellipse cx="172" cy="-150" rx="38" ry="11" strokeWidth="0.8" opacity="0.38"/>
            <line x1="134" y1="-112" x2="210" y2="-112" strokeWidth="1" opacity="0.38"/>
            <line x1="134" y1="-76"  x2="210" y2="-76"  strokeWidth="1" opacity="0.38"/>
            <rect x="220" y="-114" width="58" height="114" rx="4" strokeWidth="1.6"/>
            <path d="M220-114 Q249-134 278-114" strokeWidth="1.3"/>
            <line x1="220" y1="-80" x2="278" y2="-80" strokeWidth="0.9" opacity="0.35"/>
            <line x1="-56" y1="-28" x2="-40" y2="-450" strokeWidth="1.6"/>
            <line x1="-47" y1="-28" x2="-31" y2="-450" strokeWidth="0.8"/>
            <path d="M-47-450 Q-55-474-39-496 Q-23-474-31-450 Z" strokeWidth="1.5"/>
            <path d="M-53-456 Q-65-476-53-494" strokeWidth="1" opacity="0.5"/>
            <path d="M-41-459 Q-28-480-38-498" strokeWidth="1" opacity="0.5"/>
            <line x1="-65" y1="-16" x2="290" y2="-16" strokeWidth="2"/>
            <line x1=" 60" y1="-16" x2=" 60" y2="0"   strokeWidth="1.6"/>
            <line x1="134" y1="-16" x2="134" y2="0"   strokeWidth="1.6"/>
            <line x1="220" y1="-16" x2="220" y2="0"   strokeWidth="1.6"/>
            <rect x="60" y="-40" width="26" height="22" rx="2.5" strokeWidth="1.2"/>
            <circle cx="73" cy="-29" r="6" strokeWidth="1"/>
          </g>

          {/* ═══════════════════════════════════════════
              RIGHT · ELECTRICAL
              Pylon strictly in right strip x=1260→1440
              Narrower pylon — legs spread only ±55px
              Top of legs = 892 - 460 = 432 ✓
              Power lines go LEFT but stay above y=450
              so they don't cut through center
          ═══════════════════════════════════════════ */}
          <g transform="translate(1360,892)">
            {/* Pylon legs — narrower spread */}
            <line x1="-16" y1="-25" x2="-55" y2="-460" strokeWidth="1.8"/>
            <line x1=" 16" y1="-25" x2=" 55" y2="-460" strokeWidth="1.8"/>
            {/* Bracing panels */}
            {[
              [-52,-422,-16,-354],[16,-422,52,-354],
              [-46,-344,-14,-282],[14,-344,46,-282],
              [-40,-272,-12,-214],[12,-272,40,-214],
              [-32,-204,-8, -155],[8, -204,32,-155],
              [-22,-145,-5, -110],[5, -145,22,-110]
            ].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.2"/>
            ))}
            {/* X diagonals — 2 top panels only */}
            {[[-16,-422,-52,-354],[16,-422,-46,-354]].map(([x1,y1,x2,y2],i)=>(
              <line key={`x${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.7" opacity="0.3"/>
            ))}
            {/* Horizontal struts */}
            {[[-54,-422,54],[-48,-354,48],[-42,-282,42],[-34,-214,34],[-24,-155,24],[-16,-110,16]].map(([x1,y,x2],i)=>(
              <line key={`h${i}`} x1={x1} y1={y} x2={x2} y2={y} strokeWidth="1.4"/>
            ))}
            {/* Top crossarms */}
            <line x1="-90" y1="-444" x2="90" y2="-444" strokeWidth="2"/>
            <line x1="-75" y1="-380" x2="75" y2="-380" strokeWidth="1.7"/>
            {/* Insulators */}
            {[-72,-34,4,42].map((x,i)=>(
              <g key={i}>
                <circle cx={x}   cy="-444" r="5" strokeWidth="1.4"/>
                <circle cx={x}   cy="-452" r="3" strokeWidth="1.1"/>
                <line   x1={x} y1="-438" x2={x} y2="-432" strokeWidth="1.1"/>
              </g>
            ))}
            {/* Power lines — short, going only to right edge */}
            <path d="M 90-444 Q 130-430 180-450" strokeWidth="1.4" className="fd" strokeDasharray="10 7"/>
            <path d="M 75-380 Q 110-366 160-385" strokeWidth="1.2" className="fd" strokeDasharray="8 6" style={{animationDelay:'0.6s'}} opacity="0.7"/>
            {/* Lightning bolt */}
            <path d="M22-264 L7-226 L20-226 L4-188" strokeWidth="2.4"/>
            {/* Transformer */}
            <rect x="-26" y="-182" width="52" height="44" rx="3" strokeWidth="1.7"/>
            <circle cx="0"   cy="-160" r="12" strokeWidth="1.4"/>
            <line x1="-26" y1="-165" x2="26" y2="-165" strokeWidth="0.8" opacity="0.4"/>
            <line x1="-26" y1="-155" x2="26" y2="-155" strokeWidth="0.8" opacity="0.4"/>
            <line x1="0"   y1="-138" x2="0"  y2="-114" strokeWidth="1.5"/>
            {/* Meter box */}
            <rect x="-20" y="-110" width="40" height="32" rx="3" strokeWidth="1.5"/>
            <circle cx="0" cy="-94" r="8" strokeWidth="1.3"/>
            {/* Ground stakes */}
            <line x1="0"   y1="-78" x2="0"  y2="-55"  strokeWidth="1.4"/>
            <line x1="-11" y1="-55" x2="11" y2="-55"  strokeWidth="1.3"/>
            <line x1="-7"  y1="-49" x2="7"  y2="-49"  strokeWidth="1.1"/>
            <line x1="-3"  y1="-43" x2="3"  y2="-43"  strokeWidth="0.9"/>
          </g>

          {/* Birds in safe empty zones */}
          <g strokeWidth="1.6" opacity="0.32">
            <path d="M442 290 Q455 278 468 290 Q481 278 494 290"/>
            <path d="M710 240 Q723 228 736 240 Q749 228 762 240"/>
            <path d="M855 540 Q867 530 879 540 Q891 530 903 540"/>
          </g>

        </g>
      </svg>
    </div>
  );
}