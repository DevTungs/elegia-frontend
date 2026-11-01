import elegiaLogo from "@/assets/elegia-logo.png";
import bandPhoto from "@/assets/galpao-hero.webp";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { handleAnchorClick } from "@/lib/scroll";

const Hero = () => (
  <section className="band-hero relative isolate overflow-hidden">
    <img src={bandPhoto} alt="" fetchPriority="high" className="band-hero-photo absolute inset-0 h-full w-full object-cover" />
    <div className="band-hero-shade absolute inset-0" />

    <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32 pb-28">
      <div className="max-w-2xl">
        <h1 className="hero-logo-reveal mb-6">
          <span className="sr-only">Elegia L.C.</span>
          <img src={elegiaLogo} alt="" className="w-full max-w-[440px]" />
        </h1>
        <p className="fade-up-delay text-sm uppercase tracking-[0.24em] text-white/80 mb-5">
          Metalcore · Brasil
        </p>
        <p className="hero-statement fade-up-delay">Intensidade.<br /><span>Melodia.</span></p>
        <div className="fade-up-delay-2 mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="hero-primary gap-3 rounded-none h-14 px-7 uppercase tracking-widest text-xs font-bold">
            <a href="#lancamento" onClick={(e) => handleAnchorClick(e, 80)}><Play className="h-4 w-4" />Ouça agora</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-none h-14 px-7 border-white/30 bg-black/20 hover:bg-white/10 text-white uppercase tracking-widest text-xs font-bold gap-4">
            <Link to="/merch">Ver merch<ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 inset-x-0 z-10 container mx-auto px-6 lg:px-12">
      <div className="flex items-center justify-between gap-6 border-t border-white/20 py-6">
        <a href="#lancamento" onClick={(e) => handleAnchorClick(e, 80)} className="group flex items-center gap-4 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors">
          Explore o som <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
        </a>
        <Link to="/eventos" className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors">Ao vivo <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </div>
  </section>
);

export default Hero;
