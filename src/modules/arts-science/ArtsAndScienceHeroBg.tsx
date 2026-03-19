import React from "react";

export function ArtsAndScienceHeroBg() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#faf8fc] pointer-events-none">
      {/* Light radial glow for maximum text readability on the center-left */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] rounded-full bg-white opacity-100 blur-[100px]" />
      <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#fdfcff] opacity-90 blur-[80px]" />
      
      {/* Deep, rich soft glow behind the image card area on the right */}
      <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[60%] rounded-full bg-orange-500/15 blur-[130px]" />
      <div className="absolute top-[30%] right-[5%] w-[40%] h-[40%] rounded-full bg-orange-400/15 blur-[120px]" />

      {/* Left side contrast texture: Dot grid representing "Science & Structure" */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(#f97316 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 10% 60%, black 0%, transparent 45%)",
          WebkitMaskImage: "radial-gradient(ellipse at 10% 60%, black 0%, transparent 45%)"
        }}
      />

      {/* Primary Abstract Contour Waves gathering at the bottom right */}
      <svg
        className="absolute top-0 left-0 w-full h-full object-cover min-w-[100vw] min-h-[100vh] opacity-95"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contour1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="contour2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="contour3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="contour4" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="contour5" x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="1" />
          </linearGradient>

          <filter id="shadowDepth" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="-4" dy="-4" stdDeviation="16" floodColor="#111827" floodOpacity="0.08" />
          </filter>
        </defs>

        <g filter="url(#shadowDepth)">
          <path d="M -100,800 C 200,600 400,750 800,450 C 1100,200 1300,100 1500,-50 L 1500,900 L -100,900 Z" fill="url(#contour1)" />
          <path d="M 100,900 C 300,700 550,850 850,550 C 1050,350 1250,250 1500,100 L 1500,900 Z" fill="url(#contour2)" />
          <path d="M 300,950 C 500,800 700,900 950,650 C 1150,450 1300,400 1500,300 L 1500,950 Z" fill="url(#contour3)" />
          <path d="M 600,950 C 750,850 900,1000 1050,800 C 1200,600 1350,550 1500,450 L 1500,950 Z" fill="url(#contour4)" />
          <path d="M 900,950 C 1050,900 1150,1050 1250,900 C 1350,750 1450,700 1550,600 L 1550,950 Z" fill="url(#contour5)" />
        </g>
      </svg>

      {/* Left side mirrored waves (faded) for perfect visual framing */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-[0.65]"
        style={{
          maskImage: "linear-gradient(to right, black 0%, transparent 45%)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 45%)"
        }}
      >
        <svg
          className="absolute top-0 left-0 w-full h-full min-w-[100vw] min-h-[100vh] object-cover -scale-x-100"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#shadowDepth)">
            <path d="M -100,800 C 200,600 400,750 800,450 C 1100,200 1300,100 1500,-50 L 1500,900 L -100,900 Z" fill="url(#contour1)" />
            <path d="M 100,900 C 300,700 550,850 850,550 C 1050,350 1250,250 1500,100 L 1500,900 Z" fill="url(#contour2)" />
            <path d="M 300,950 C 500,800 700,900 950,650 C 1150,450 1300,400 1500,300 L 1500,950 Z" fill="url(#contour3)" />
            <path d="M 600,950 C 750,850 900,1000 1050,800 C 1200,600 1350,550 1500,450 L 1550,950 Z" fill="url(#contour4)" />
            <path d="M 900,950 C 1050,900 1150,1050 1250,900 C 1350,750 1450,700 1550,600 L 1550,950 Z" fill="url(#contour5)" />
          </g>
        </svg>
      </div>

      {/* Ultra-fine minimalist noise overlay to give the vector a tactile aesthetic */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-[0.25]"
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E')" 
        }}
      />
    </div>
  );
}