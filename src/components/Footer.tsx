import { Instagram, Music, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-white/[0.04] py-20 overflow-hidden mt-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/[0.03] to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center gap-10">
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/lc.elegia/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.08] hover:border-primary/30 transition-all"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://open.spotify.com/intl-pt/artist/2li90ydgYRoA5saOmkw0wR"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.08] hover:border-primary/30 transition-all"
              aria-label="Spotify"
            >
              <Music size={20} />
            </a>
            <a
              href="https://www.youtube.com/@bandaelegia"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.08] hover:border-primary/30 transition-all"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          </div>

          <div className="text-center space-y-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Elegia L.C. • Metalcore • Brasil
            </p>
            <p className="text-xs text-foreground/30 tracking-wide">
              © {new Date().getFullYear()} Elegia L.C. - Todos os direitos reservados.
            </p>
            <p className="text-[10px] text-foreground/20 tracking-wide">
              Desenvolvido por Jair Neto - bandaelegia@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
