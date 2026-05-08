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
              className="text-[10px] font-black uppercase text-wig-text-muted hover:text-wig-gold transition-colors flex items-center gap-2"
            >
              <ExternalLink size={12} />
              Open Live Site
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

      <WigHudFrame preset="screen" className="aspect-video w-full group relative" showHoneycomb={false}>
        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-wig-black">
             <div className="w-12 h-12 border-2 border-wig-gold/20 border-t-wig-gold rounded-full animate-spin mb-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-wig-gold animate-pulse">Initializing_Stream...</span>
          </div>
        )}

        {/* Fallback State */}
        {hasError ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-wig-surface-alt/50">
            <AlertTriangle size={48} className="text-wig-orange mb-6 opacity-50" />
            <h4 className="text-2xl font-black text-white uppercase italic mb-4">Connection Restricted</h4>
            <p className="text-sm text-wig-text-secondary max-w-md mx-auto mb-10 leading-relaxed">
              {fallbackDescription}
            </p>
            <div className="flex gap-4">
              {externalUrl && (
                <WigButton variant="primary" onClick={() => window.open(externalUrl, "_blank")}>
                  Visite o Projeto
                </WigButton>
              )}
              <WigButton variant="secondary" onClick={() => setHasError(false)}>
                Tentar Recarregar
              </WigButton>
            </div>
          </div>
        ) : (
          <iframe 
            src={embedUrl}
            className="w-full h-full border-none opacity-0 transition-opacity duration-1000"
            onLoad={() => {
              setIsLoading(false);
              // We can't really detect X-Frame-Options errors via onload, 
              // but we can set a timeout or use social signal. 
              // For now, if it loads, we reveal it.
              const iframe = document.querySelector('iframe');
              if (iframe) iframe.classList.add('opacity-100');
            }}
            onError={() => {
               setHasError(true);
               setIsLoading(false);
            }}
            title={productName}
          />
        )}

        {/* HUD Info Overlays */}
        <div className="absolute top-6 left-6 pointer-events-none">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1 h-1 bg-wig-gold animate-pulse" />
             <div className="text-[9px] font-black text-wig-gold/60 tracking-[0.4em]">DATA_SOURCE: EMULATOR_01</div>
           </div>
           <div className="text-[9px] font-black text-white/20 tracking-[0.4em] ml-3">SYNC_STATUS: OPTIMAL_LINK</div>
        </div>

        <div className="absolute top-6 right-6 pointer-events-none text-right">
           <div className="text-[9px] font-black text-white/20 tracking-[0.4em] mb-1">LATENCY: 24ms</div>
           <div className="text-[9px] font-black text-wig-gold/40 tracking-[0.4em]">BUFFER: 100%</div>
        </div>

        <div className="absolute bottom-10 left-10 pointer-events-none hidden md:block">
           <div className="w-16 h-[2px] bg-white/10 mb-2" />
           <div className="text-[9px] font-black text-white/20 tracking-[0.5em] uppercase">Structural_Scan_Complete</div>
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-none flex items-end gap-10">
           <div className="hidden md:block">
              <div className="text-[9px] font-black text-wig-text-muted tracking-[0.3em] mb-1">PROD_REF_ID</div>
              <div className="text-xs font-black text-white/40 italic">#WIG-2026-ALPHA-01</div>
           </div>
           <div className="p-2 border border-wig-gold/10">
              <Target size={20} className="text-wig-gold/30" />
           </div>
        </div>
      </WigHudFrame>
    </div>
  );
};
