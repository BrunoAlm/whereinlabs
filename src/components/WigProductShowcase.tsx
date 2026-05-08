import { useState } from "react";
import { ExternalLink, Target, AlertTriangle } from "lucide-react";
import { WigButton, WigHudFrame, WigStatusChip } from "./WigUI";

interface WigProductShowcaseProps {
  title: string;
  subtitle: string;
  productName: string;
  embedUrl: string;
  externalUrl?: string;
  fallbackDescription: string;
  statusLabel?: string;
}

export const WigProductShowcase = ({
  title,
  subtitle,
  productName,
  embedUrl,
  externalUrl,
  fallbackDescription,
  statusLabel = "ACTIVE_PROD",
}: WigProductShowcaseProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <WigStatusChip label={statusLabel} active />
          {externalUrl && (
            <a 
              href={externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase text-wig-gold hover:text-white transition-all flex items-center gap-2 bg-wig-gold/10 px-3 py-1.5 border border-wig-gold/30 rounded-sm hud-glow-gold"
            >
              <ExternalLink size={12} />
              Abrir Site Oficial
            </a>
          )}
        </div>
        <h3 className="text-3xl lg:text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
          {productName}
        </h3>
        <p className="text-sm text-wig-text-secondary uppercase tracking-[0.2em] font-bold">
          {subtitle}
        </p>
      </div>

      <WigHudFrame preset="screen" className="aspect-[4/3] md:aspect-video w-full group relative overflow-hidden" showHoneycomb={false}>
        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-wig-black">
             <div className="w-12 h-12 border-2 border-wig-gold/20 border-t-wig-gold rounded-full animate-spin mb-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wig-gold animate-pulse">Initializing_Stream...</span>
          </div>
        )}

        {/* Fallback State */}
        {hasError ? (
          <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-wig-surface-alt/50">
            <AlertTriangle size={32} className="text-wig-orange mb-4 opacity-50" />
            <h4 className="text-xl font-black text-white uppercase italic mb-4">Connection Restricted</h4>
            <p className="text-xs md:text-sm text-wig-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
              {fallbackDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {externalUrl && (
                <WigButton variant="primary" size="sm" onClick={() => window.open(externalUrl, "_blank")}>
                  Acessar Direto
                </WigButton>
              )}
              <WigButton variant="secondary" size="sm" onClick={() => setHasError(false)}>
                Recarregar
              </WigButton>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden">
            <iframe 
              src={embedUrl}
              className="absolute top-0 left-0 w-[100%] h-[100%] md:w-full md:h-full border-none opacity-0 transition-opacity duration-1000"
              style={{
                // On mobile we might want to scale the content if it's too large
                // but usually Flutter web responds to the container size.
                // However, if we want to "zoom out" slightly on mobile:
                // transform: window.innerWidth < 768 ? 'scale(0.8)' : 'none',
                // transformOrigin: 'top left'
              }}
              onLoad={() => {
                setIsLoading(false);
                const iframe = document.querySelector('iframe');
                if (iframe) iframe.classList.add('opacity-100');
              }}
              onError={() => {
                 setHasError(true);
                 setIsLoading(false);
              }}
              title={productName}
            />
          </div>
        )}

        {/* HUD Info Overlays */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-none">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-1 bg-wig-gold animate-pulse" />
             <div className="text-[8px] md:text-[9px] font-black text-wig-gold/60 tracking-[0.4em]">DATA_SOURCE: EMULATOR_01</div>
           </div>
           <div className="text-[8px] md:text-[9px] font-black text-white/20 tracking-[0.4em] ml-3">SYNC_STATUS: OPTIMAL_LINK</div>
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 pointer-events-none text-right">
           <div className="text-[8px] md:text-[9px] font-black text-white/20 tracking-[0.4em] mb-1">LATENCY: 24ms</div>
           <div className="text-[8px] md:text-[9px] font-black text-wig-gold/40 tracking-[0.4em]">BUFFER: 100%</div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none hidden lg:block">
           <div className="w-16 h-[2px] bg-white/10 mb-2" />
           <div className="text-[9px] font-black text-white/20 tracking-[0.5em] uppercase">Structural_Scan_Complete</div>
        </div>

        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-none flex items-end gap-10">
           <div className="hidden md:block">
              <div className="text-[9px] font-black text-wig-text-muted tracking-[0.3em] mb-1">PROD_REF_ID</div>
              <div className="text-xs font-black text-white/40 italic">#WIG-2026-ALPHA-01</div>
           </div>
           <div className="p-1.5 md:p-2 border border-wig-gold/10">
              <Target size={16} className="text-wig-gold/30 md:size-20" />
           </div>
        </div>
      </WigHudFrame>
    </div>
  );
};
