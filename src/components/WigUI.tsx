import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface WigButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

export const WigButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  icon: Icon,
}: WigButtonProps) => {
  const variants = {
    primary: "bg-wig-gold text-wig-black hover:bg-wig-gold/90 shadow-[0_4px_20px_rgba(255,215,0,0.15)]",
    secondary: "bg-transparent text-wig-text-primary border border-white/10 hover:border-wig-gold/40 hover:bg-white/5",
    ghost: "bg-transparent text-wig-text-secondary hover:text-white transition-colors",
    danger: "bg-red-900/10 text-red-400 border border-red-900/30",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-[10px] font-bold tracking-[0.2em]",
    md: "px-8 py-3 text-[11px] font-black tracking-[0.2em]",
    lg: "px-12 py-5 text-xs font-black tracking-[0.3em]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-3 uppercase transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      style={{
        clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
      }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </motion.button>
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
    <div className={`relative p-8 bg-wig-surface-base border border-white/5 group transition-all duration-500 hover:border-wig-gold/20 ${className}`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
      }}>
      {highlight && <div className="absolute top-0 right-0 w-24 h-1 bg-wig-gold" />}
      
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex flex-col">
            {subtitle && <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-wig-gold mb-1">{subtitle}</span>}
            {title && <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>}
          </div>
          {Icon && <Icon size={20} className="text-wig-text-muted group-hover:text-wig-gold transition-colors duration-500" />}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
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
