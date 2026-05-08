import { useMemo } from "react";

export const WigBackground = () => {
  // Generate some "procedural" highlights
  const highlights = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      opacity: 0.05 + Math.random() * 0.15,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-wig-black institutional-bg">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
        <defs>
          {/* Base Hexagon Grid Pattern */}
          <pattern 
            id="hexGrid" 
            width="120" 
            height="104" 
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            {/* The "Connected" look: drawing lines that meet at vertices */}
            <path 
              d="M30 0 L90 0 M120 52 L90 104 M30 104 L0 52" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              className="text-wig-gold/15" 
            />
            <path 
              d="M90 0 L120 52" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-wig-gold/20" 
            />
            <path 
              d="M90 104 L30 104 M0 52 L30 0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.4" 
              className="text-wig-gold/5" 
            />
            {/* Points at vertices for tech feel */}
            <circle cx="30" cy="0" r="1" className="fill-wig-gold/20" />
            <circle cx="90" cy="0" r="1" className="fill-wig-gold/20" />
          </pattern>

          <filter id="wigGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Regular Grid */}
        <rect width="100%" height="100%" fill="url(#hexGrid)" />

        {/* Procedural "Construction" Highlights */}
        {highlights.map((h, i) => (
          <g 
            key={i} 
            transform={`translate(${h.x} ${h.y}) scale(${h.scale}) rotate(${h.rotation})`}
            style={{ opacity: h.opacity }}
            className="text-wig-gold"
          >
            <path 
              d="M30 0 L90 0 L120 52 L90 104 L30 104 L0 52 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              filter="url(#wigGlow)"
              strokeDasharray="200"
              strokeDashoffset={i % 2 === 0 ? "50" : "150"} /* Broken edge look */
            />
            {/* Vertex glow */}
            <circle cx="90" cy="0" r="2" fill="currentColor" className="animate-pulse" />
          </g>
        ))}

        {/* Large Institutional Vignette */}
        <rect width="100%" height="100%" fill="url(#bg-vignette-radial)" />
        <defs>
           <radialGradient id="bg-vignette-radial" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(5, 7, 10, 0.95)" />
           </radialGradient>
        </defs>
      </svg>
      
      {/* Additional Noise/Texture Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-wig-black to-transparent" />
      
      {/* Scanline Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 3px 100%"
        }}
      />
    </div>
  );
};
