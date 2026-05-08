import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// --- WIG HUD PRESETS ---
export type WigHudPreset = "screen" | "card" | "panel" | "button" | "subtle";

interface WigHudFrameProps {
  children: ReactNode;
  preset?: WigHudPreset;
  className?: string;
  showHoneycomb?: boolean;
}

export const WigHexPattern = ({ opacity = 0.08 }: { opacity?: number }) => (
  <div 
    className="absolute inset-0 pointer-events-none" 
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0 L45 0 M60 26 L45 52 M15 52 L0 26' fill='none' stroke='%23FFD700' stroke-opacity='${opacity}' stroke-width='0.5'/%3E%3Cpath d='M45 0 L60 26 M45 52 L15 52 M0 26 L15 0' fill='none' stroke='%23FFD700' stroke-opacity='${opacity * 0.5}' stroke-width='0.2'/%3E%3C/svg%3E")`,
      maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
      WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
    }} 
  />
);

const ScreenHudDecoration = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    {/* Top Plate */}
    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[60px]" viewBox="0 0 300 60">
      <path 
        d="M0 0 L100 0 L120 18 L180 18 L200 0 L300 0" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        className="text-wig-gold/30"
      />
      <path 
        d="M125 36 L175 36" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="text-wig-gold shadow-lg"
      />
      {/* Tickers */}
      <g className="text-wig-gold/50">
        {[...Array(6)].map((_, i) => (
          <line key={i} x1={130 + i * 8} y1="42" x2={135 + i * 8} y2="48" stroke="currentColor" strokeWidth="2" />
        ))}
      </g>
    </svg>
    
    {/* Bottom Plate */}
    <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] h-[40px]" viewBox="0 0 240 40">
      <path 
        d="M0 40 L80 40 L100 22 L140 22 L160 40 L240 40" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2"
        className="text-wig-gold/20"
      />
    </svg>

    {/* Side Accents */}
    <div className="absolute top-1/4 left-4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-wig-gold/20 to-transparent" />
    <div className="absolute top-1/4 right-4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-wig-gold/20 to-transparent" />
    
    {/* Dots */}
    <div className="absolute bottom-20 left-6 flex flex-col gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`w-1 h-1 rounded-full bg-wig-gold ${i === 2 ? 'opacity-100' : 'opacity-30'}`} />
      ))}
    </div>
  </div>
);

export const WigHudFrame = ({ 
  children, 
  preset = "card", 
  className = "", 
  showHoneycomb = true 
}: WigHudFrameProps) => {
  const configs = {
    screen: {
      outer: "clip-octogon-lg border border-white/10 bg-wig-black",
      inner: "clip-octogon-lg border border-white/5 m-[4px]",
      honeycomb: 0.08,
    },
    card: {
      outer: "clip-octogon-md border border-wig-gold/30 bg-wig-surface-base",
      inner: "clip-octogon-md border border-white/10 m-[3px]",
      honeycomb: 0.05,
    },
    panel: {
      outer: "clip-octogon-md border border-white/10 bg-wig-surface-alt",
      inner: "clip-octogon-md border border-white/5 m-[2px]",
      honeycomb: 0.03,
    },
    button: {
      outer: "clip-octogon-sm border border-wig-gold/50 bg-wig-gold",
      inner: "clip-octogon-sm border border-white/20 m-[2px]",
      honeycomb: 0.1,
    },
    subtle: {
      outer: "clip-octogon-sm border border-white/5 bg-white/2",
      inner: "",
      honeycomb: 0,
    }
  };

  const config = configs[preset];

  return (
    <div className={`relative ${config.outer} ${className}`}>
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Hex Pattern */}
      {showHoneycomb && config.honeycomb > 0 && <WigHexPattern opacity={config.honeycomb} />}
      
      {/* Inner Border Layer */}
      {config.inner && (
        <div className={`absolute inset-0 pointer-events-none ${config.inner}`} />
      )}

      {/* Screen Specific Decor */}
      {preset === "screen" && <ScreenHudDecoration />}

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// --- WIG UI COMPONENTS ---

interface WigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: LucideIcon;
}

export const WigButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
}: WigButtonProps) => {
  const sizes = {
    sm: "px-4 py-1.5 text-[10px]",
    md: "px-8 py-3 text-[11px]",
    lg: "px-12 py-5 text-xs",
  };

  if (variant === "ghost") {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center gap-3 font-black uppercase tracking-[0.3em] text-wig-text-muted hover:text-white transition-all ${className}`}
      >
        {Icon && <Icon size={16} />}
        {children}
      </button>
    );
  }

  const preset = variant === "primary" ? "button" : "subtle";
  const textColor = variant === "primary" ? "text-wig-black" : "text-white";

  return (
    <button onClick={onClick} className={`group active:scale-95 transition-transform ${className}`}>
      <WigHudFrame 
        preset={preset} 
        className={`${sizes[size]} font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 ${textColor} transition-shadow hover:hud-glow-gold pointer-events-none`}
      >
        {Icon && <Icon size={size === "sm" ? 14 : 18} />}
        {children}
      </WigHudFrame>
    </button>
  );
};

interface WigCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  highlight?: boolean;
}

export const WigCard = ({ children, title, subtitle, icon: Icon, className = "", highlight = false }: WigCardProps) => {
  return (
    <WigHudFrame 
      preset="card" 
      className={`p-8 group h-full ${className} ${highlight ? "border-wig-gold/50" : ""}`}
    >
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex flex-col">
            {subtitle && <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wig-gold mb-1">{subtitle}</span>}
            {title && <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h3>}
          </div>
          {Icon && <Icon size={24} className="text-wig-gold/20 group-hover:text-wig-gold transition-colors duration-500" />}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </WigHudFrame>
  );
};

export const WigStatusChip = ({ label, active = false }: { label: string; active?: boolean }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] uppercase font-black tracking-[0.2em] ${active ? "bg-wig-gold/10 border-wig-gold text-wig-gold" : "bg-white/5 border-white/10 text-wig-text-muted"}`}>
    {active && <span className="w-1.5 h-1.5 bg-wig-gold animate-pulse"></span>}
    {label}
  </span>
);

export const WigSectionHeader = ({ title, subtitle, center = false }: { title: string; subtitle?: string, center?: boolean }) => (
  <div className={`mb-16 ${center ? "text-center" : ""}`}>
    {subtitle && (
      <p className="mb-4 text-wig-gold uppercase tracking-[0.4em] text-[11px] font-black opacity-80">
        // {subtitle}
      </p>
    )}
    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
      {title}
    </h2>
  </div>
);
