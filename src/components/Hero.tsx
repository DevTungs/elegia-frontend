import elegiaLogo from "@/assets/elegia-logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { handleAnchorClick } from "@/lib/scroll";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_72%_51%_/_0.08)_0%,_transparent_60%)]" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 72% 51% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 72% 51% / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="glow-orb top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 opacity-40 animate-pulse" />
      <div className="glow-orb bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 opacity-30" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(0_0%_3%_/_0.5)_100%)]" />

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
        <div className="mb-10 md:mb-12 fade-up">
          <img
            src={elegiaLogo}
            alt="Elegia L.C."
            className="w-full max-w-md md:max-w-lg mx-auto drop-shadow-[0_0_60px_rgba(220,38,38,0.2)] hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        <p className="text-lg md:text-2xl font-light tracking-[0.2em] mb-10 md:mb-12 fade-up-delay text-foreground/80 uppercase headline-glow">
          Metalcore <span className="text-primary/70 mx-2">•</span> Intensidade{" "}
          <span className="text-primary/70 mx-2">•</span> Melodia
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-delay-2 w-full max-w-md mx-auto">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground font-bold uppercase tracking-[0.15em] hover:bg-primary/90 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:scale-105 transition-all rounded-md"
          >
            <Link to="/merch">Ver Merch</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/[0.08] bg-white/[0.02] text-foreground/80 font-bold uppercase tracking-[0.15em] hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-105 transition-all rounded-md"
          >
            <a href="#lancamento" onClick={(e) => handleAnchorClick(e, 80)}>
              Último Lançamento
            </a>
          </Button>
        </div>
      </div>

      <a
        href="#lancamento"
        onClick={(e) => handleAnchorClick(e, 80)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        aria-label="Rolar para conteúdo"
      >
        <ChevronDown className="h-6 w-6 text-foreground/30 hover:text-primary transition-colors" />
      </a>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
