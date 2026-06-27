import elegiaLogo from "@/assets/elegia-logo.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_72%_51%_/_0.08)_0%,_transparent_60%)]" />

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] opacity-40 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(0_0%_3%_/_0.5)_100%)]" />

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
        <div className="mb-12 fade-up">
          <img
            src={elegiaLogo}
            alt="Elegia L.C."
            className="w-full max-w-lg mx-auto drop-shadow-[0_0_60px_rgba(220,38,38,0.2)] hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        <p className="text-xl md:text-3xl font-light tracking-[0.2em] mb-12 fade-up-delay text-foreground/80 uppercase headline-glow">Metalcore <span className="text-primary/70 mx-2">•</span> Intensidade <span className="text-primary/70 mx-2">•</span> Melodia</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-delay-2 w-full max-w-lg mx-auto">
          <Link
            to="/merch"
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-sm overflow-hidden rounded-md transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] w-full sm:w-auto"
          >
            <span className="relative z-10">Ver Merch</span>
          </Link>
          <a
            href="#lancamento"
            className="px-8 py-4 bg-white/[0.03] text-foreground/80 font-bold uppercase tracking-[0.2em] text-sm border border-white/[0.08] rounded-md hover:bg-white/[0.06] hover:border-white/[0.15] transition-all w-full sm:w-auto"
          >
            Último Lançamento
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
