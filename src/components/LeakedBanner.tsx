import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight, Pause, Play } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const LeakedBanner = () => {
  const [paused, setPaused] = useState(false);

  return (
    <section className="leaked-alert relative overflow-hidden" aria-label="Arquivo interno vazado" data-paused={paused}>
      <div className="leaked-ticker" aria-hidden="true">
        <div className="leaked-ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="leaked-ticker-copy">
              {[0, 1, 2].map((item) => <span key={item}><AlertTriangle size={16} /> Material vazado <span className="text-white/60">/</span> Não divulgue</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="leaked-sweep" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_72%_51%_/_0.06)_0%,_transparent_60%)]" />

      <div className="scanlines absolute inset-0 pointer-events-none opacity-30" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <AnimatedSection animation="fade-in" className="max-w-2xl mx-auto text-center">
          <div className="leaked-warning inline-flex items-center gap-3 border border-red-400/40 bg-red-950/60 px-4 py-2 mb-6">
            <AlertTriangle className="leaked-warning-icon h-5 w-5 text-red-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-200">
              Material Não Autorizado
            </span>
          </div>

          <h2
            className="text-4xl md:text-6xl uppercase text-zinc-100 tracking-wide mb-3"
          >
            Arquivo Interno
          </h2>

          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">
            Material Vazado · Não Divulgue
          </p>

          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg mx-auto mb-8">
            Seis faixas... Gravadas ao vivo...{" "}
            <span className="text-zinc-300">Alguém vazou...</span>{" "}
            <span className="text-red-400">Agora é TARDE DEMAIS!</span>
          </p>

          <Link
            to="/ao-vivo/sangue-podre"
            className="leaked-access group inline-flex items-center gap-3 rounded-md bg-red-600 px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-500"
          >
            Acessar Arquivo
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
      <div className="relative z-10 flex justify-center pb-5">
        <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} className="leaked-motion-control flex min-h-11 items-center gap-2 px-4 text-xs text-red-200/80 hover:text-white">
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? "Retomar animações" : "Pausar animações"}
        </button>
      </div>
    </section>
  );
};

export default LeakedBanner;
