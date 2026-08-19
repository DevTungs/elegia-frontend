import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const LeakedBanner = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_72%_51%_/_0.06)_0%,_transparent_60%)]" />

      <div className="scanlines absolute inset-0 pointer-events-none opacity-30" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <AnimatedSection animation="fade-in" className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-1 mb-6">
            <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
              Material Não Autorizado
            </span>
          </div>

          <h2
            className={`text-4xl md:text-6xl uppercase text-zinc-100 tracking-wide mb-3 ${
              glitchActive ? "glitch-active" : ""
            }`}
          >
            Arquivo Interno
          </h2>

          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-zinc-500 mb-6 typewriter-text">
            Material Vazado · Não Divulgue
          </p>

          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg mx-auto mb-8">
            Seis faixas... Gravadas ao vivo...{" "}
            <span className="text-zinc-300">Alguém vazou...</span>{" "}
            <span className="text-red-400">Agora é TARDE DEMAIS!</span>
          </p>

          <Link
            to="/ao-vivo/sangue-podre"
            className="group inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:scale-105"
          >
            Acessar Arquivo
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default LeakedBanner;
